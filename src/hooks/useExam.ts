import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface ExamSection {
  id: string;
  title: string;
  duration: number; // in minutes
  instructions: string;
  section_order: number;
}

interface ExamAttempt {
  id: string;
  user_id: string;
  current_section: number;
  status: 'not_started' | 'aptitude_in_progress' | 'behavioral_in_progress' | 'completed';
  started_at?: string;
  section_started_at?: string;
  completed_at?: string;
  aptitude_responses: any[];
  behavioral_responses: any[];
}

interface QuestionWithOptions {
  id: string;
  sub_section_id: string;
  question_text: string;
  marks: number;
  question_type: string;
  min_age?: number;
  max_age?: number;
  options: Array<{
    id: string;
    option_text: string;
    marks: number;
  }>;
  sub_section: {
    id: string;
    name: string;
    section: {
      id: string;
      name: string;
    };
  };
}

export const useExam = () => {
  const { user } = useAuth();
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [currentSection, setCurrentSection] = useState<ExamSection | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [responses, setResponses] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [testMode, setTestMode] = useState(false);

  // Define exam sections
  const examSections: ExamSection[] = [
    {
      id: 'aptitude',
      title: 'Aptitude Section',
      duration: 30,
      section_order: 1,
      instructions: `Guidelines for Aptitude Section:
1. This section has questions to test reasoning and cognitive ability.
2. Manage time wisely — this section will auto-submit after 30 minutes.
3. A pen and paper may be used for rough work.
4. This is a self-assessment. Do not take external help.
5. Attempt all questions — there is no negative marking.
6. Use logical reasoning and avoid guesswork to maximize accuracy.
7. Read each question carefully before answering.`
    },
    {
      id: 'behavioral',
      title: 'Behavioural Section',
      duration: 20,
      section_order: 2,
      instructions: `Guidelines for Behavioural Section:
1. There are 4 sub-sections to measure personality traits and behavioural patterns:
   a. Interest & Preference – Evaluates what you like and what activities make you happy.
   b. Psychometric Assessment – Evaluates how you think, react, and process information.
   c. Socio-Emotional Intelligence – Measures your emotional intelligence and ability to manage emotions.
   d. Adversity Quotient (AQ) – Measures how you handle tough times.
2. The section has a 20-minute time limit and will auto-submit when time ends.
3. Do not spend too much time on one question — go with your instinct.
4. Answer honestly and instinctively without overanalyzing.`
    }
  ];

  const fetchExam = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Check for existing attempt in user_sessions or create a simple state
      const existingAttempt = localStorage.getItem(`exam_attempt_${user.id}`);
      
      if (existingAttempt) {
        const attempt = JSON.parse(existingAttempt);
        setCurrentAttempt(attempt);
        
        // Set current section based on attempt status
        if (attempt.status === 'aptitude_in_progress') {
          setCurrentSection(examSections[0]);
          await loadAptitudeQuestions();
          
          // Calculate remaining time
          const sectionStartTime = new Date(attempt.section_started_at).getTime();
          const elapsed = Math.floor((Date.now() - sectionStartTime) / 1000);
          const remaining = Math.max(0, (30 * 60) - elapsed);
          setTimeRemaining(remaining);
          setIsTimerActive(remaining > 0);
        } else if (attempt.status === 'behavioral_in_progress') {
          setCurrentSection(examSections[1]);
          await loadBehavioralQuestions();
          
          // Calculate remaining time
          const sectionStartTime = new Date(attempt.section_started_at).getTime();
          const elapsed = Math.floor((Date.now() - sectionStartTime) / 1000);
          const remaining = Math.max(0, (20 * 60) - elapsed);
          setTimeRemaining(remaining);
          setIsTimerActive(remaining > 0);
        }
        
        // Load existing responses
        const existingResponses = new Map();
        attempt.aptitude_responses?.forEach((resp: any) => {
          existingResponses.set(resp.question_id, resp);
        });
        attempt.behavioral_responses?.forEach((resp: any) => {
          existingResponses.set(resp.question_id, resp);
        });
        setResponses(existingResponses);
      } else {
        // Check if there's an existing attempt in the database
        if (supabase) {
          try {
            const { data: dbAttempts, error: dbError } = await supabase
              .from('exam_attempts')
              .select('*')
              .eq('user_id', user.id)
              .in('status', ['in_progress'])
              .order('created_at', { ascending: false })
              .limit(1);

            if (!dbError && dbAttempts && dbAttempts.length > 0) {
              const dbAttempt = dbAttempts[0];
              console.log('Found existing database attempt:', dbAttempt.attempt_id);
              
              // Convert database attempt to local format
              const localAttempt: ExamAttempt = {
                id: dbAttempt.attempt_id,
                user_id: dbAttempt.user_id,
                current_section: 1, // Will be updated based on responses
                status: 'aptitude_in_progress',
                started_at: dbAttempt.start_time,
                section_started_at: dbAttempt.start_time,
                aptitude_responses: [],
                behavioral_responses: []
              };
              
              // Load existing responses from database
              const { data: dbResponses } = await supabase
                .from('exam_responses')
                .select('*')
                .eq('exam_attempt_id', dbAttempt.attempt_id)
                .order('answered_at');

              if (dbResponses) {
                dbResponses.forEach(resp => {
                  const response = {
                    question_id: resp.question_id,
                    selected_option_id: resp.selected_option_id,
                    selected_option_text: resp.selected_option_text,
                    option_marks: resp.option_marks,
                    answered_at: resp.answered_at
                  };
                  
                  if (resp.section_type === 'aptitude') {
                    localAttempt.aptitude_responses.push(response);
                  } else {
                    localAttempt.behavioral_responses.push(response);
                  }
                });
              }
              
              // Determine current section based on responses
              if (localAttempt.behavioral_responses.length > 0) {
                localAttempt.status = 'behavioral_in_progress';
                localAttempt.current_section = 2;
              }
              
              localStorage.setItem(`exam_attempt_${user.id}`, JSON.stringify(localAttempt));
              setCurrentAttempt(localAttempt);
            }
          } catch (dbErr) {
            console.error('Error checking for existing database attempts:', dbErr);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAptitudeQuestions = async () => {
    if (!supabase) return;

    try {
      console.log('Loading aptitude questions...');
      
      // Get the Aptitude section ID
      const { data: sections, error: sectionError } = await supabase
        .from('sections_vo')
        .select('id, name')
        .eq('name', 'Aptitude')
        .maybeSingle();

      if (sectionError || !sections) {
        console.error('Error finding Aptitude section:', sectionError);
        throw new Error('Aptitude section not found');
      }

      const aptitudeSectionId = sections.id;
      console.log('Found Aptitude section ID:', aptitudeSectionId);

      // Get all sub-sections that belong to the Aptitude section
      const { data: aptitudeSubSections, error: subSectionError } = await supabase
        .from('sub_sections_vo')
        .select('id, name')
        .eq('section_id', aptitudeSectionId);

      if (subSectionError) {
        console.error('Error finding aptitude sub-sections:', subSectionError);
        throw subSectionError;
      }

      if (!aptitudeSubSections || aptitudeSubSections.length === 0) {
        console.error('No aptitude sub-sections found');
        throw new Error('No aptitude sub-sections found');
      }

      console.log('Found aptitude sub-sections:', aptitudeSubSections?.map(ss => ss.name));

      // Get user's age for filtering questions
      let userAge = null;
      if (user) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('dob')
          .eq('id', user.id)
          .single();
        
        if (userProfile?.dob) {
          const birthDate = new Date(userProfile.dob);
          const today = new Date();
          userAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            userAge--;
          }
        }
      }

      console.log('User age for question filtering:', userAge);

      // Get questions only from aptitude sub-sections
      const { data, error } = await supabase
        .from('questions_vo')
        .select(`
          *,
          options_vo (*),
          sub_sections_vo (
            *,
            sections_vo (*)
          )
        `)
        .in('sub_section_id', aptitudeSubSections.map(ss => ss.id))
        .order('created_at', { ascending: false }); // Get all questions, we'll filter and randomize

      if (error) throw error;

      console.log('Raw questions fetched:', data?.length);

      let questionsWithRelations = data?.map(q => ({
        ...q,
        sub_section: {
          ...q.sub_sections_vo,
          section: q.sub_sections_vo?.sections_vo || null
        },
        options: q.options_vo || []
      })).filter(q => q.sub_section) as QuestionWithOptions[];

      console.log('Questions after transformation:', questionsWithRelations?.length);

      // Filter questions based on user age if available
      if (userAge && questionsWithRelations) {
        questionsWithRelations = questionsWithRelations.filter(q => {
          const minAge = q.min_age;
          const maxAge = q.max_age;
          
          // If no age restrictions, include the question
          if (!minAge && !maxAge) return true;
          
          // Check age bounds
          if (minAge && userAge < minAge) return false;
          if (maxAge && userAge > maxAge) return false;
          
          return true;
        });
        console.log('Questions after age filtering:', questionsWithRelations?.length);
      }

      // Randomize and limit to 45 questions
      if (questionsWithRelations && questionsWithRelations.length > 0) {
        const shuffled = questionsWithRelations.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, 45);
        
        console.log(`Loaded ${questionsWithRelations.length} aptitude questions, selected ${selectedQuestions.length} after filtering and randomization`);
        console.log('Question distribution by sub-section:', 
          selectedQuestions.reduce((acc, q) => {
            const subSection = q.sub_section.name;
            acc[subSection] = (acc[subSection] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        );
        
        setQuestions(selectedQuestions);
      } else {
        console.error('No questions available after filtering');
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error loading aptitude questions:', err);
      setError('Failed to load aptitude questions');
    }
  };

  const loadBehavioralQuestions = async () => {
    if (!supabase) return;

    try {
      console.log('Loading behavioral questions...');
      
      // Get the Behavioural section ID
      const { data: sections, error: sectionError } = await supabase
        .from('sections_vo')
        .select('id, name')
        .eq('name', 'Behavioural')
        .maybeSingle();

      if (sectionError || !sections) {
        console.error('Error finding Behavioural section:', sectionError);
        throw new Error('Behavioural section not found');
      }

      const behavioralSectionId = sections.id;
      console.log('Found Behavioural section ID:', behavioralSectionId);

      // Get all sub-sections that belong to the Behavioural section
      const { data: behavioralSubSections, error: subSectionError } = await supabase
        .from('sub_sections_vo')
        .select('id, name')
        .eq('section_id', behavioralSectionId);

      if (subSectionError) {
        console.error('Error finding behavioral sub-sections:', subSectionError);
        throw subSectionError;
      }

      if (!behavioralSubSections || behavioralSubSections.length === 0) {
        console.error('No behavioral sub-sections found');
        throw new Error('No behavioral sub-sections found');
      }

      console.log('Found behavioral sub-sections:', behavioralSubSections?.map(ss => ss.name));

      // Get user's age for filtering questions
      let userAge = null;
      if (user) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('dob')
          .eq('id', user.id)
          .single();
        
        if (userProfile?.dob) {
          const birthDate = new Date(userProfile.dob);
          const today = new Date();
          userAge = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            userAge--;
          }
        }
      }

      // Get questions only from behavioral sub-sections
      const { data, error } = await supabase
        .from('questions_vo')
        .select(`
          *,
          options_vo (*),
          sub_sections_vo (
            *,
            sections_vo (*)
          )
        `)
        .in('sub_section_id', behavioralSubSections.map(ss => ss.id))
        .order('created_at', { ascending: false }); // Get all questions, we'll filter and randomize

      if (error) throw error;

      console.log('Raw behavioral questions fetched:', data?.length);

      let questionsWithRelations = data?.map(q => ({
        ...q,
        sub_section: {
          ...q.sub_sections_vo,
          section: q.sub_sections_vo?.sections_vo || null
        },
        options: q.options_vo || []
      })).filter(q => q.sub_section) as QuestionWithOptions[];

      console.log('Behavioral questions after transformation:', questionsWithRelations?.length);

      // Filter questions based on user age if available
      if (userAge && questionsWithRelations) {
        questionsWithRelations = questionsWithRelations.filter(q => {
          const minAge = q.min_age;
          const maxAge = q.max_age;
          
          // If no age restrictions, include the question
          if (!minAge && !maxAge) return true;
          
          // Check age bounds
          if (minAge && userAge < minAge) return false;
          if (maxAge && userAge > maxAge) return false;
          
          return true;
        });
        console.log('Behavioral questions after age filtering:', questionsWithRelations?.length);
      }

      // Randomize and limit to 87 questions
      if (questionsWithRelations && questionsWithRelations.length > 0) {
        const shuffled = questionsWithRelations.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, 87);
        
        console.log(`Loaded ${questionsWithRelations.length} behavioral questions, selected ${selectedQuestions.length} after filtering and randomization`);
        console.log('Question distribution by sub-section:', 
          selectedQuestions.reduce((acc, q) => {
            const subSection = q.sub_section.name;
            acc[subSection] = (acc[subSection] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        );
        
        setQuestions(selectedQuestions);
      } else {
        console.error('No behavioral questions available after filtering');
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error loading behavioral questions:', err);
      setError('Failed to load behavioral questions');
    }
  };

  const startExam = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Create exam and exam attempt in database
      let dbAttemptId = null;
      if (supabase) {
        try {
          // First, create or get an exam record
          const { data: existingExam, error: examCheckError } = await supabase
            .from('exams')
            .select('exam_id')
            .eq('exam_name', 'Comprehensive Assessment')
            .limit(1)
            .maybeSingle();

          let examId = existingExam?.exam_id;

          if (!examId) {
            // Create a new exam record
            const { data: newExam, error: examCreateError } = await supabase
              .from('exams')
              .insert({
                exam_name: 'Comprehensive Assessment',
                description: 'Aptitude and Behavioral Assessment',
                instructions: 'Complete both sections within the time limit',
                total_time: 50, // 30 + 20 minutes
                maximum_marks: 132, // 45 aptitude + 87 behavioral
                is_active: true,
                original_price: 0,
                discounted_price: 0,
                tax: 0
              })
              .select('exam_id')
              .single();

            if (examCreateError) {
              console.error('Failed to create exam record:', examCreateError);
              throw examCreateError;
            }
            examId = newExam.exam_id;
            console.log('Created new exam record:', examId);
          }

          // Now create the exam attempt with valid exam_id
          const { data: dbAttempt, error: dbError } = await supabase
            .from('exam_attempts')
            .insert({
              user_id: user.id,
              exam_id: examId,
              start_time: new Date().toISOString(),
              status: 'in_progress',
              total_score: 0,
              max_possible_score: 0,
              percentage: 0,
              answers: [],
              time_taken: 0
            })
            .select()
            .single();

          if (dbError) {
            console.error('Failed to create exam attempt in database:', dbError);
            throw dbError;
          } else {
            dbAttemptId = dbAttempt.attempt_id;
            console.log('Created exam attempt in database:', dbAttemptId);
          }
        } catch (dbErr) {
          console.error('Exception creating exam attempt:', dbErr);
          // Don't throw in test mode, continue with local attempt
          if (!isTestMode) {
            throw dbErr;
          }
        }
      }

      const attempt: ExamAttempt = {
        id: dbAttemptId || `local_attempt_${user.id}_${Date.now()}`,
        user_id: user.id,
        current_section: 1,
        status: 'aptitude_in_progress',
        started_at: new Date().toISOString(),
        section_started_at: new Date().toISOString(),
        aptitude_responses: [],
        behavioral_responses: []
      };

      localStorage.setItem(`exam_attempt_${user.id}`, JSON.stringify(attempt));
      setCurrentAttempt(attempt);
      setCurrentSection(examSections[0]);
      await loadAptitudeQuestions();
      
      // Start timer
      setTimeRemaining(30 * 60); // 30 minutes
      setIsTimerActive(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start exam');
      setLoading(false);
    }
  };

  const submitResponse = async (questionId: string, optionId: string, optionText: string, marks: number) => {
    if (!currentAttempt) return;

    try {
      const response = {
        question_id: questionId,
        selected_option_id: optionId,
        selected_option_text: optionText,
        option_marks: marks,
        answered_at: new Date().toISOString()
      };

      // Update local responses
      setResponses(prev => new Map(prev.set(questionId, response)));

      // Save to database
      if (supabase && user) {
        try {
          await supabase.from('exam_responses').insert({
            user_id: user.id,
            exam_attempt_id: currentAttempt.id,
            question_id: questionId,
            selected_option_id: optionId,
            selected_option_text: optionText,
            option_marks: marks,
            section_type: currentSection?.id === 'aptitude' ? 'aptitude' : 'behavioral',
            answered_at: new Date().toISOString()
          });
        } catch (dbError) {
          console.error('Failed to save response to database:', dbError);
          // Continue with local storage as fallback
        }
      }

      // Update attempt in localStorage
      const updatedAttempt = { ...currentAttempt };
      if (currentSection?.id === 'aptitude') {
        const existingIndex = updatedAttempt.aptitude_responses.findIndex(r => r.question_id === questionId);
        if (existingIndex >= 0) {
          updatedAttempt.aptitude_responses[existingIndex] = response;
        } else {
          updatedAttempt.aptitude_responses.push(response);
        }
      } else {
        const existingIndex = updatedAttempt.behavioral_responses.findIndex(r => r.question_id === questionId);
        if (existingIndex >= 0) {
          updatedAttempt.behavioral_responses[existingIndex] = response;
        } else {
          updatedAttempt.behavioral_responses.push(response);
        }
      }

      localStorage.setItem(`exam_attempt_${user?.id}`, JSON.stringify(updatedAttempt));
      setCurrentAttempt(updatedAttempt);
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };

  const nextSection = async () => {
    if (!currentAttempt) return;

    try {
      if (currentSection?.id === 'aptitude') {
        // Move to behavioral section
        const updatedAttempt = {
          ...currentAttempt,
          current_section: 2,
          status: 'behavioral_in_progress' as const,
          section_started_at: new Date().toISOString()
        };

        // Update database attempt status
        if (supabase && !currentAttempt.id.startsWith('local_attempt_')) {
          try {
            await supabase
              .from('exam_attempts')
              .update({
                status: 'in_progress',
                updated_at: new Date().toISOString()
              })
              .eq('attempt_id', currentAttempt.id);
          } catch (dbErr) {
            console.error('Failed to update attempt status in database:', dbErr);
          }
        }
        localStorage.setItem(`exam_attempt_${user?.id}`, JSON.stringify(updatedAttempt));
        setCurrentAttempt(updatedAttempt);
        setCurrentSection(examSections[1]);
        await loadBehavioralQuestions();
        
        // Reset timer for behavioral section
        setTimeRemaining(20 * 60); // 20 minutes
        setIsTimerActive(true);
        
        // Clear previous responses from state (but keep in localStorage)
        const behavioralResponses = new Map();
        updatedAttempt.behavioral_responses.forEach(resp => {
          behavioralResponses.set(resp.question_id, resp);
        });
        setResponses(behavioralResponses);
      } else {
        // Complete exam
        await completeExam();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to proceed to next section');
    }
  };

  const completeExam = async () => {
    if (!currentAttempt) return;

    try {
      // Calculate final scores
      const aptitudeScore = currentAttempt.aptitude_responses.reduce((sum, resp) => sum + resp.option_marks, 0);
      const behavioralScore = currentAttempt.behavioral_responses.reduce((sum, resp) => sum + resp.option_marks, 0);
      const totalScore = aptitudeScore + behavioralScore;
      const maxAptitudeScore = currentAttempt.aptitude_responses.length; // 1 mark per correct aptitude question
      const maxBehavioralScore = currentAttempt.behavioral_responses.length * 5; // 5 marks per behavioral question (Likert scale)
      const maxTotalScore = maxAptitudeScore + maxBehavioralScore;
      const percentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

      console.log('Final scores:', {
        aptitudeScore,
        behavioralScore,
        totalScore,
        maxAptitudeScore,
        maxBehavioralScore,
        maxTotalScore,
        percentage
      });

      const updatedAttempt = {
        ...currentAttempt,
        status: 'completed' as const,
        completed_at: new Date().toISOString()
      };

      localStorage.setItem(`exam_attempt_${user?.id}`, JSON.stringify(updatedAttempt));
      setCurrentAttempt(updatedAttempt);
      setIsTimerActive(false);
      setCurrentSection(null);

      // Save final results to database if needed
      if (supabase && !updatedAttempt.id.startsWith('local_attempt_')) {
        try {
          // Update final exam attempt with completion data
          const totalResponses = updatedAttempt.aptitude_responses.length + updatedAttempt.behavioral_responses.length;
          const totalTime = Math.floor((new Date().getTime() - new Date(updatedAttempt.started_at!).getTime()) / 1000);
          
          await supabase
            .from('exam_attempts')
            .update({
              status: 'completed',
              end_time: new Date().toISOString(),
              total_score: totalScore,
              max_possible_score: maxTotalScore,
              percentage: percentage,
              time_taken: totalTime,
              answers: {
                aptitude_count: updatedAttempt.aptitude_responses.length,
                behavioral_count: updatedAttempt.behavioral_responses.length,
                total_count: totalResponses,
                aptitude_score: aptitudeScore,
                behavioral_score: behavioralScore,
                total_score: totalScore
              },
              updated_at: new Date().toISOString()
            })
            .eq('attempt_id', updatedAttempt.id);
        } catch (logError) {
          console.error('Failed to update final exam attempt:', logError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete exam');
    }
  };

  const autoSubmitSection = useCallback(async () => {
    if (!currentAttempt) return;

    try {
      await nextSection();
    } catch (err) {
      console.error('Auto-submit failed:', err);
    }
  }, [currentAttempt]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            autoSubmitSection();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining, autoSubmitSection]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  return {
    examSections,
    currentAttempt,
    currentSection,
    questions,
    responses,
    loading,
    error,
    timeRemaining,
    isTimerActive,
    testMode,
    startExam,
    submitResponse,
    nextSection,
    completeExam
  };
};