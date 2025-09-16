import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Download, Share2, BarChart3, TrendingUp, Users, Brain, Target, Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { calculateDetailedAssessmentResult } from '../../../../utils/utils/assessmentCalculation';
import type { DetailedAssessmentResult, QuestionSubmission, QuestionData } from '../../../../utils/utils/assessmentCalculation';
import { jsPDF } from 'jspdf';

interface DetailedResultsPageProps {
  attemptId: string;
  onBack: () => void;
}

// Removed unused ExamResponse interface

interface UserInfo {
  name: string;
  phone: string;
}

export const DetailedResultsPage = ({ attemptId, onBack }: DetailedResultsPageProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedResults, setDetailedResults] = useState<DetailedAssessmentResult | null>(null);
  const [subSectionStats, setSubSectionStats] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (user && attemptId) {
      fetchAndCalculateResults();
    }
  }, [user, attemptId]);

  const fetchAndCalculateResults = async () => {
    if (!supabase || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch user info
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      setUserInfo({ name: userData.full_name, phone: userData.phone });

      console.log('Fetching exam responses for attempt:', attemptId);

      // Fetch user responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('exam_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_attempt_id', attemptId)
        .order('answered_at');

      if (responsesError) {
        console.error('Error fetching responses:', responsesError);
        throw responsesError;
      }

      console.log('Fetched responses:', responsesData?.length);

      // Fetch all questions with their options and sub-sections
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions_vo')
        .select(`
          *,
          options_vo (*),
          sub_sections_vo (
            *,
            sections_vo (*)
          )
        `);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      console.log('Fetched questions:', questionsData?.length);

      // Transform questions data
      const transformedQuestions: QuestionData[] = questionsData?.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        sub_section: {
          name: q.sub_sections_vo?.name || '',
          section: {
            name: q.sub_sections_vo?.sections_vo?.name || ''
          }
        },
        options: q.options_vo?.map((opt: any) => ({
          id: opt.id,
          option_text: opt.option_text,
          marks: opt.marks ?? 0
        })) || []
      })).filter(q => q.sub_section.name && q.sub_section.section.name) || [];

      console.log('Transformed questions:', transformedQuestions.length);

      // Transform responses to submissions
      const submissions: QuestionSubmission[] = responsesData?.map(response => ({
        questionId: response.question_id,
        selectedOptionId: response.selected_option_id
      })) || [];

      console.log('Transformed submissions:', submissions.length);

      // Calculate detailed results using our algorithm
      if (submissions.length > 0 && transformedQuestions.length > 0) {
        console.log('Calculating detailed results...');
        const results = calculateDetailedAssessmentResult(submissions, transformedQuestions, 2);
        console.log('Calculated results:', results);
        setDetailedResults(results);
      } else {
        throw new Error('No valid data found for calculation');
      }

      // Calculate sub-section wise statistics
      if (responsesData && transformedQuestions) {
        calculateSubSectionStats(responsesData, transformedQuestions);
      }

    } catch (err) {
      console.error('Error in fetchAndCalculateResults:', err);
      setError(err instanceof Error ? err.message : 'Failed to load and calculate results');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubSectionStats = (responses: any[], questions: any[]) => {
    const stats: Record<string, {
      subSectionName: string;
      sectionName: string;
      totalQuestions: number;
      answeredQuestions: number;
      totalMarks: number;
      obtainedMarks: number;
      percentage: number;
      questionType: string;
    }> = {};

    // Group questions by sub-section
    questions.forEach(question => {
      const subSectionName = question.sub_section?.name || 'Unknown';
      const sectionName = question.sub_section?.section?.name || 'Unknown';
      
      if (!stats[subSectionName]) {
        stats[subSectionName] = {
          subSectionName: subSectionName,
          sectionName: sectionName,
          totalQuestions: 0,
          answeredQuestions: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          percentage: 0,
          questionType: question.question_type
        };
      }
      
      stats[subSectionName].totalQuestions++;
      
      // Calculate max marks for this question
      const maxMarks = Math.max(...question.options.map((opt: any) => opt.marks || 0));
      stats[subSectionName].totalMarks += maxMarks;
    });

    // Add response data
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.question_id);
      if (question) {
        const subSectionName = question.sub_section?.name || 'Unknown';
        if (stats[subSectionName]) {
          stats[subSectionName].answeredQuestions++;
          stats[subSectionName].obtainedMarks += response.option_marks || 0;
        }
      }
    });

    // Calculate percentages
    Object.values(stats).forEach(stat => {
      stat.percentage = stat.totalMarks > 0 ? (stat.obtainedMarks / stat.totalMarks) * 100 : 0;
    });

    setSubSectionStats(stats);
  };

  const handleGenerateHTML = () => {
    if (!detailedResults || !userInfo || !user) return;

    // Aptitude descriptions and templates (same as in PDF)
    const aptitudeDescriptions = {
      verbal: 'Verbal Reasoning: This test measures the ability to reason with words, to understand and use concepts expressed in words. This skill is important in academic courses, in jobs requiring written or oral communication and in jobs involving high levels of authority and responsibility.',
      numerical: 'Numerical Reasoning: This test measures the ability to perform mathematical reasoning tasks. This strength is generally important in schoolwork especially for fields such as math, chemistry, physics and engineering.',
      abstract: 'Abstract Reasoning: This test is a non-verbal, non-numerical measure of reasoning power. It tests the ability to see relationships among objects, patterns, diagrams or designs. This skill is useful in careers requiring the person to see relationships between objects in terms of their size, shape, position and quantity.',
      speedAndAccuracy: 'Perceptual Speed & Accuracy: This test measures perceptual speed and accuracy in perceiving and marking simple letter and number combinations. Important in paperwork in school, offices, laboratories, stores, warehouses and wherever records are made or filed or checked. Sometimes a low score on this test may indicate a great emphasis on accuracy rather than genuine lack of ability to work rapidly.',
      mechanical: 'Mechanical Reasoning: This test measures the ability to understand the basic mechanical principles of machinery, tools and motion and the laws of everyday physics. Students who do well in this test tend to find it easy to learn how to repair and operate complex devices.',
      spaceRelations: 'Space Relations: This test measures the ability to visualise, to think in three dimensions or to picture mentally the size, shape, and position of objects when shown only two-dimensional pictures or pattern. This skill is vital to understand technical drawings.',
      languageUsageAndGrammar: 'Language Usage (Grammar): This test measures how well one can distinguish between correct and improper grammar, punctuation, and wording of sentences. This is an excellent predictor of high grades in most school and college courses.',
    };

    const aptitudeWhatTemplates = {
      verbal: {
        High: 'You have scored a natural strength in understanding and expressing ideas clearly. You can easily make sense of what you read or hear and explain it in a way that makes sense to others. This skill helps you in school, team work, and even leadership roles. Whether you\'re sharing your thoughts, debating, or telling stories, you have a gift for making things interesting and easy to understand. This ability will help you in careers where you need to persuade, teach, create content. Continuing to read, discuss ideas, and practice creative writing will make you even stronger in this area!',
        Moderate: 'You have a good understanding of words and can communicate effectively in most situations. You may occasionally find complex texts or ideas a bit challenging, but with practice, you can improve. This skill is useful in school, team work, and leadership roles. To strengthen it, try reading more, discussing ideas, or practicing writing. It will help in careers involving communication, teaching, or content creation.',
        Low: 'You may find it challenging to understand or explain complex ideas in words. This skill can be developed with practice. Start with simple reading and discussions to build confidence. It\'s important for school and jobs involving communication. With effort, you can improve and open doors to careers in teaching, writing, or leadership.',
      },
      mechanical: {
        High: 'You have a strong ability to understand how machines, tools, and systems work. You can easily visualize how different parts of a machine fit together and understand the principles behind forces and motion. This skill helps you solve complex mechanical problems. With this ability, you could excel in fields like engineering, construction, automotive, or manufacturing. You might enjoy designing, repairing, or improving mechanical systems, which is a great foundation for hands-on, technical careers.',
        Moderate: 'You have a solid understanding of mechanical principles and can handle basic tasks involving machinery and tools. You may need some practice with more complex systems. This skill is valuable in technical fields. Try hands-on projects or workshops to build confidence. It can lead to careers in engineering, maintenance, or manufacturing.',
        Low: 'You may find it difficult to understand mechanical principles or visualize how machines work. This skill can be built with practice and exposure to simple mechanical tasks. Start with basic tools and projects. With time, you can improve and explore technical careers.',
      },
      numerical: {
        High: 'You have an excellent grasp of numbers and can handle complex mathematical problems with ease. This strength is important in fields like science, finance, and engineering. Continue challenging yourself with advanced problems to maintain and grow this skill.',
        Moderate: 'You have a good understanding of numbers and can handle basic math problems confidently. You may need a little extra practice with more complex number patterns and data analysis. The good news is that numerical skills can be improved with regular exposure to problem-solving activities, real-world applications like calculating discounts or understanding statistics in sports, and fun exercises. Building confidence in this area can open doors to many exciting career options in business, technology, research, and management. Practice with games, real-life scenarios, and interactive learning to strengthen your skills further!',
        Low: 'You may struggle with numerical concepts and calculations. This skill can be improved with consistent practice starting from basics. Use fun apps or games to make learning enjoyable. It\'s key for many careers, and with effort, you can progress.',
      },
      languageUsageAndGrammar: {
        High: 'You have exceptional command over language, grammar, and expression. This skill helps in academic success and careers requiring strong communication. Keep honing it through writing and reading.',
        Moderate: 'You have a good grasp of language and can communicate well in most situations. Sometimes, you might struggle with complex words or sentence structures, but with a little more practice, you can improve significantly. Simple activities like reading books, writing short stories, or having discussions at home can boost your confidence. Strengthening your language skills will help you in careers like marketing, customer relations, and corporate communication, where clear and precise language is important. With regular practice, you can become even better at expressing your thoughts!',
        Low: 'You may find it challenging to use correct grammar and structure sentences properly. Practice with simple writing exercises and reading to improve. This skill is crucial for effective communication in any career.',
      },
      speedAndAccuracy: {
        High: 'You excel at quick and accurate processing of information. This skill is valuable in fast-paced environments. Maintain it with timed exercises.',
        Moderate: 'You can manage tasks that require accuracy but might take a little more time with complex or fast-moving tasks. With practice, you can improve your speed while maintaining accuracy. Doing brain games, memory challenges, or hands-on activities can help you build confidence. You have the potential to do well in roles that require a balance between speed and precision, such as organizing projects, managing events, or planning activities. With a little support, you can sharpen your focus and grow these skills further!',
        Low: 'You may need more time for tasks requiring speed and accuracy. Practice with timed activities to improve. This skill is important for efficiency in work and studies.',
      },
      abstract: {
        High: 'You are excellent at recognizing patterns and solving abstract problems. This skill opens doors to careers in science, technology, and analysis. Keep challenging yourself with puzzles.',
        Moderate: 'You have a reasonable ability to handle abstract concepts. With practice, you can improve in recognizing patterns. Try puzzles and brainteasers to strengthen this skill.',
        Low: 'It\'s ok if you struggle with abstract reasoning or finding patterns—it\'s a skill that you can improve with time and practice. The key here is patience and consistent effort. You can try fun activities like puzzles, brainteasers, or exploring new concepts that require obstinate thought. These activities will help you improve your skills in recognizing patterns and solving problems. With continued practice, you can open doors to many careers that rely on analytical thinking and problem-solving, including in fields like science, technology, and even business. With time, you can definitely improve and excel!',
      },
      spaceRelations: {
        High: 'You have strong spatial visualization skills, useful in design, architecture, and engineering. Continue with 3D modeling or drawing to enhance.',
        Moderate: 'You have moderate ability in visualizing spatial relations. Practice with drawings and models to improve.',
        Low: 'You might find it challenging to visualize objects in space or how they move relative to one another. This skill can be developed through activities like solving puzzles, working with 3D models, or engaging in hands-on tasks. While it may take some time, consistent practice will help you improve. With time, you can enhance these skills and pursue exciting careers in creative and technical fields like architecture, engineering, or design.',
      },
    };

    // Interest descriptions
    const interestDescriptions = {
      realistic: 'Realistic (Doers): Realistic types generally like to work with things and are often good at mechanical or athletic jobs. They are described as genuine, sensible, practical, natural, thrift, modest, persistent, and honest.',
      investigative: 'Investigative (Thinkers): Investigative types typically like to work with ideas. They like to learn, analyze and solve problems. They are usually described as curious, exact, intellectual, cautious, independent, quiet, and modest.',
      artistic: 'Artistic (Creators): These people like to work in unstructured situations where they can use their creativity. They are usually described as open, creative, independent, emotional, impulsive, and original.',
      social: 'Social (Helpers): These people like to work with other people rather than things. They are often described as helpful, understanding, responsible, warm, cooperative, convincing, friendly, kind, generous, and patient.',
      enterprising: 'Enterprising (Persuaders): These people like to work with others and enjoy persuading and performing. They are usually described as outgoing, adventurous, energetic, optimistic, sociable, and self-confident.',
      conventional: 'Conventional (Organizers): These people are very detail-oriented and organized and like to work with data. They are typically described as practical, careful, thrifty, efficient, orderly, and persistent.',
    };

    const interestWhatTemplates = {
      realistic: 'You are a Doer! You love to get things done with your hands. Whether it\'s fixing a broken item, building something new, or solving a practical challenge, you feel most fulfilled when you can work physically. You\'re not afraid to get your hands dirty and love working outdoors, whether it\'s in nature or on a construction site. This hands-on approach makes you well-suited for careers in fields like construction, engineering, mechanics, agriculture, or forestry. In these roles, you\'ll have the opportunity to build, design, repair, create things that have a real impact on the world. Your problem-solving mindset, combined with your love for working with your hands, will help you succeed in jobs that require physical work and practical thinking.',
      investigative: 'You are a Thinker! You have a natural curiosity and love to explore ideas, solve problems, and discover how things work. You enjoy research, analysis, and using logic to find answers. Careers in science, medicine, technology, or research would suit you well, where you can investigate complex issues and make meaningful discoveries.',
      artistic: 'You are a Creator! You thrive in environments that allow for self-expression and creativity. You enjoy art, music, writing, or design, and find fulfillment in producing original work. Careers in the arts, media, or design fields would be ideal, where you can use your imagination to create and innovate.',
      social: 'You are a Helper! You enjoy working with people, helping them grow, and making a positive impact on their lives. You\'re empathetic, patient, and good at communication. Careers in teaching, counseling, healthcare, or social work would be fulfilling, where you can support and guide others.',
      enterprising: 'You are a Persuader! You have the ability to inspire and motivate others to take action, whether it\'s convincing them of your vision or leading them in a shared goal. You\'re not afraid to take charge and lead the way, and your ability to persuade others is one of your strongest skills. Careers in business, marketing, public relations, or entrepreneurship are a great fit for you. In these roles, you\'ll be able to use your leadership abilities to turn ideas into reality, motivate others, and drive success. Your energy and confidence will help you thrive in dynamic, fast-paced environments, where you can set goals, lead teams, and make an impact. Whether it\'s starting your own business, leading a marketing campaign, or building relationships with clients, your ability to persuade and inspire others will be key to your success.',
      conventional: 'You are an Organizer! You\'re someone who loves structure and order. You thrive in environments where things are planned out, organized, and clearly defined. You pay attention to the smallest details, and you can take pride in keeping things running smoothly. Whether it\'s managing data, following rules, or handling paperwork, you enjoy tasks that require precision and consistency. This makes you perfect for careers in administration, finance, accounting, or any field where organization is key. Your ability to organize and manage is a skill that will help you succeed in any career that requires planning, coordination, and structure.',
    };

    // SEI templates
    // Removed unused SEI templates

    // Adversity templates
    // Removed unused Adversity templates

    // Psychometric descriptions
    // Removed unused Psychometric descriptions

    // Get aptitude data
    const aptitude = detailedResults.aptitudeScore.categoryWiseScore;
    const aptitudeKeyMap: Record<string, string> = {
      verbal: "verbal",
      mechanical: "mechanical",
      numerical: "numerical",
      languageUsageAndGrammar: "language usage and grammar",
      speedAndAccuracy: "speed and accuracy",
      abstract: "abstract",
      spaceRelations: "space relations",
    };

    const aptitudeBars = Object.keys(aptitudeKeyMap)
      .map((key) => {
        const realKey = aptitudeKeyMap[key];
        const data = aptitude[realKey];

        return {
          name: data?.categoryDisplayText ?? realKey,   
          percentage: data?.categoryPercentage ?? 0,
          level: data?.categoryScoreLevel ?? "N/A",
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    // Get interest data
    const interests = detailedResults.interestAndPreferenceScore.categoryWiseScore;
    const sortedInterests = Object.entries(interests).sort(([, a], [, b]) => b.categoryScore - a.categoryScore).slice(0, 3);
    const interestCode = sortedInterests.map(([, data]) => data.categoryLetter ?? '').join('');

    // Removed unused derived data declarations

    // Compute sorted scores outside the template
    const aptiCategoryWiseScores = Object.entries(detailedResults.aptitudeScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => b.scoreObject.categoryPercentage - a.scoreObject.categoryPercentage);

    const interestAndPreferenceScore = Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore);

    const seiScore = Object.entries(detailedResults.seiScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore);

    const psychometricScore = Object.entries(detailedResults.detailedPsychometricScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => b.scoreObject.categoryScore - a.scoreObject.categoryScore);

    // Build HTML content
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillSphere Assessment Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0; }
        .page { background-color: white; padding: 20px; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: #333; }
        .cover { text-align: center; }
        .section-header { background-color: #0000ff; color: white; padding: 10px; }
        .bubble { background-color: #fff; border: 1px solid #000; border-radius: 5px; padding: 5px; display: inline-block; }
        .bar { height: 20px; background-color: #00aaff; color: white; text-align: right; padding-right: 5px; }
        .funnel-bar { margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        ul { list-style-type: disc; padding-left: 20px; }
        .svg-container {
            position: relative;
        }
        svg {
            max-width: 100%;
            height: auto;
        }
        text {
            white-space: pre;
        }
        .absolute-text {
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="svg-container">
            <svg viewBox="0 0 595 842">
                <text x="0" y="20">
 
     
         
         
             
        
    
     
         
         
             
                 
            
        
         
             
                 
                     
                
            
        
         “When we think we know, we cease to
            learn.”
         Dr
         Sarvepalli
         Radhakrishnan
         
             
                 
                     
                
            
        
         
             
                 
                     
                
            
        
         SkillSphere
         Assessment
         
         A 360
         °
         MEASURE OF PERSONALITY,
         RESILIENCE, APTITUDE, AND
            INTERESTS
         —
         EMPOWERING EVERY STUDENT’S
            JOURNEY
         This report provides a comprehensive
            analysis of the
         student's personality traits, interests,
            aptitude, strengths, and
         growth areas, utilizing multiple industry
         -
         standard
         assessment frameworks. The insights gained
            are designed to
         guide the student's learning journey,
            enabling them to unlock
         their full potential and ultimately
            pursue successful and
         fulfilling careers.
    
                </text>
            </svg>
        </div>
    </div>

    <div class="page">
        <div class="svg-container">
            <svg viewBox="0 0 595 842">
                
            
                
                
            
                
                
            
                
                
            
            
                
            
            
            
            
                
                
                    
                        
                        
                    
                
            
            
                
                    
                        
                            
                        
                    
                
            
            </svg>
            <div class="absolute-text">
                <pre>
Congratulations on
                successfully completing the SkillSphere Assessment!
Your results highlight key
                strengths such as brilliance, resilience, and a
            strong mindset, all of
                which position you for continued success. Each
            score reflects your
                dedication, intelligence, and boundless potential to
            conquer challenges and
                achieve extraordinary success.
            THIS ASSESSMENT MARKS THE
                BEGINNING OF YOUR
            PROFESSIONAL DEVELOPMENT
                JOURNEY
            With your demonstrated talent and
                determination, there is
            significant potential for you to reach new
                heights in your career
            and personal growth. Keep striving toward
                excellence, as your
            future holds limitless possibilities.
            STUDENT ID : ${attemptId ?? 'N/A'}
            NAME: ${userInfo.name ?? 'N/A'}
            ASSESSMENT DATE : ${detailedResults.assessmentDate ? new Date(detailedResults.assessmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 16, 2025'}
            EMAIL: ${user.email ?? 'N/A'}
            PHONE
            :
            ${userInfo.phone ?? 'N/A'}
            EVALUATOR :
            SKILLSPHERE ASSESSMENT SYSTEM
            
                
                    
                        
                    
                
            
        
                </pre>
            </div>
        </div>
    </div>

    <div class="page">
        <div class="svg-container">
            <svg viewBox="0 0 595 842">
                
                
            
            
                
                
            
            
                
                
            
            
            
            
                
                
            
            </svg>
            <div class="absolute-text">
                <pre>

    
        
            
        
        
            
        
        
            
        
        
    
    
        
        
            
                
            
        Assessment RESULT
        
        
        
        SkillSphereAssessmentResult
        Aptitude•${aptiCategoryWiseScores[0]?.scoreObject.categoryDisplayText ?? ''}: ${aptiCategoryWiseScores[0]?.scoreObject.categoryPercentage ?? ''}•${aptiCategoryWiseScores[1]?.scoreObject.categoryDisplayText ?? ''}: ${aptiCategoryWiseScores[1]?.scoreObject.categoryPercentage ?? ''}•${aptiCategoryWiseScores[2]?.scoreObject.categoryDisplayText ?? ''}: ${aptiCategoryWiseScores[2]?.scoreObject.categoryPercentage ?? ''}
        Interest and
            Preferences•${interestAndPreferenceScore[0]?.scoreObject.categoryDisplayText ?? ''}•${interestAndPreferenceScore[1]?.scoreObject.categoryDisplayText ?? ''}•${interestAndPreferenceScore[2]?.scoreObject.categoryDisplayText ?? ''}
        Psychometric
            Traits•${psychometricScore[0]?.scoreObject.categoryDisplayText ?? psychometricScore[0]?.category ?? ''}•${psychometricScore[1]?.scoreObject.categoryDisplayText ?? psychometricScore[1]?.category ?? ''}•${psychometricScore[2]?.scoreObject.categoryDisplayText ?? psychometricScore[2]?.category ?? ''}
        Socio
            EconomicIntelligence•${seiScore[0]?.scoreObject.categoryDisplayText ?? ''}: ${seiScore[0]?.scoreObject.categoryScore ?? ''}•${seiScore[1]?.scoreObject.categoryDisplayText ?? ''}: ${seiScore[1]?.scoreObject.categoryScore ?? ''}•${seiScore[2]?.scoreObject.categoryDisplayText ?? ''}: ${seiScore[2]?.scoreObject.categoryScore ?? ''}•${seiScore[3]?.scoreObject.categoryDisplayText ?? ''}: ${seiScore[3]?.scoreObject.categoryScore ?? ''}
        Adversity Quotient
            score•Adversity Response Profile(ARP) : ${detailedResults.adversityScore.aqScore ?? ''}
        Measure skills, abilities, and
            potentialto succeed in a particular role orenvironment.It is based on DifferentialAptitude Test (DAT), which evaluateson 8 different aptitude components.
        Provides
            professionalaspirations, values, andmotivations.It is measured on 6personality types based onHolland’s model.
        Helps identify
            personalitytype leveragingBig FiveModel with 5 broaddimensions.
        Measures the individual’s
            mental abilityto succeed in any environmentalcircumstance.Leverages Bar-On Model of Emotional-Social Intelligence.
        Measures a person's
            abilityto deal with challenges inlife.Higher score indicatesbetter resilience toadversity. Highest possiblescore: 200
    
                </pre>
            </div>
        </div>
    </div>

    <div class="page">
        <div class="section-header">DETAILED ASSESSMENT REPORT</div>
        <h2>1. Aptitude (IQ)</h2>
        <p>Aptitude tests measure skills, abilities, and potential to succeed in a particular role or environment. This assessment framework is modeled after the widely recognized Differential Aptitude Test (DAT) and evaluates individuals across eight key aptitude components: Verbal Reasoning, Numerical Ability, Abstract Reasoning, Perceptual Speed and Accuracy, Mechanical Reasoning, Spatial Relations, Spelling, and Language Usage.</p>
        <ul>
            ${Object.values(aptitudeDescriptions).map(desc => `<li>${desc}</li>`).join('')}
        </ul>
    </div>

    <div class="page">
        <div class="bubble">Your Score</div>
        <div>
            ${aptitudeBars.map((bar, index) => `
                <div class="funnel-bar" style="width: ${100 - index * 10}%; background-color: cyan; color: white; padding: 5px;">
                    ${bar.name} ${bar.percentage.toFixed(2)}%
                </div>
            `).join('')}
        </div>
    </div>

    <div class="page">
        <div class="bubble">What it means</div>
        <ul>
            ${(() => {
              const getTemplate = (catDisplayName: string, level: string): string => {
                const categoryKey = (Object.keys(aptitudeKeyMap) as Array<keyof typeof aptitudeKeyMap>)
                  .find(c => aptitude[aptitudeKeyMap[c]]?.categoryDisplayText === catDisplayName);
                if (!categoryKey) return '';
                if (level === 'High' || level === 'Moderate' || level === 'Low') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return (aptitudeWhatTemplates as any)[categoryKey]?.[level] ?? '';
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (aptitudeWhatTemplates as any)[categoryKey]?.['Low'] ?? '';
              };
              return aptitudeBars.map(bar => `<li>You have scored ${bar.percentage.toFixed(2)}% in ${bar.name} which is a ${bar.level} score. ${getTemplate(bar.name, bar.level)}</li>`).join('');
            })()}
        </ul>
    </div>

    <!-- Add similar div.page for other sections: Interest, SEI, Adversity, Psychometric -->

    <div class="page">
        <h2>2. Interest & Preferences</h2>
        <p>Interest & Preferences test results provide an objective basis for engaging in meaningful discussions about professional aspirations, values and motivations. This assessment framework is modeled after Holland's theory which defines personality types as: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional (RIASEC).</p>
        <ul>
            ${Object.values(interestDescriptions).map(desc => `<li>${desc}</li>`).join('')}
        </ul>
    </div>

    <div class="page">
        <div class="bubble">Your Score</div>
        <!-- Hexagon representation can be approximated with CSS or text -->
        <p>Your Interest Code: ${interestCode}</p>
        <p>Your results reflect the alignment of your skills and interests with specific areas within the RIASEC model...</p>
        <div class="bubble">What it means</div>
        <ul>
            ${sortedInterests.map(([key, data]) => {
              const template = interestWhatTemplates[key as keyof typeof interestWhatTemplates] ?? '';
              return `<li>${data.categoryDisplayText ?? 'N/A'}: ${template}</li>`;
            }).join('')}
        </ul>
    </div>

    <!-- Continue for SEI, Adversity, Psychometric similarly, using tables or lists for scores, ul for descriptions -->

</body>
</html>
    `;

    // Download HTML
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillSphere_${(userInfo.name ?? 'User').toUpperCase().replace(' ', '_')}_${(attemptId ?? 'N/A').toUpperCase()}_Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!detailedResults || !userInfo || !user) return;

    const loadHtml2Canvas = async (): Promise<void> => {
      if ((window as any).html2canvas) return;
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load html2canvas'));
        document.body.appendChild(script);
      });
    };

    const pageFiles = [
      'page1/page1.component.html',
      'page2/page2.component.html',
      'page3/page3.component.html',
      'page4/page4.component.html',
      'page5/page5.component.html',
      'page6/page6.component.html',
      'page7/page7.component.html',
      'page8/page8.component.html',
      'page9/page9.component.html',
      'page10/page10.component.html',
      'page11/page11.component.html',
      'page12/page12.component.html',
      'page13/page13.component.html',
      'page14/page14.component.html',
      'page15/page15.component.html',
      'page16/page16.component.html',
      'page17/page17.component.html',
      'page18/page18.component.html',
      'page19/page19.component.html',
    ];

    // Compute helper arrays similar to Angular template usage
    const aptiCategoryWiseScores = Object.entries(detailedResults.aptitudeScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => (b as any).scoreObject.categoryPercentage - (a as any).scoreObject.categoryPercentage) as any[];

    const interestAndPreferenceScore = Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => (b as any).scoreObject.categoryScore - (a as any).scoreObject.categoryScore) as any[];

    const seiScore = Object.entries(detailedResults.seiScore.categoryWiseScore)
      .map(([category, scoreObject]) => ({ category, scoreObject }))
      .sort((a, b) => (b as any).scoreObject.categoryScore - (a as any).scoreObject.categoryScore) as any[];

    const assessmentDate = detailedResults.assessmentDate
      ? new Date(detailedResults.assessmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const replacements: Record<string, string> = {
      '{{detailedReport.student?.id}}': attemptId ?? 'N/A',
      '{{detailedReport.student?.studentName}}': userInfo.name ?? 'N/A',
      '{{detailedReport.assessmentDate | date}}': assessmentDate,
      '{{detailedReport.student?.emailAddress}}': user.email ?? 'N/A',
      '{{detailedReport.student?.details?.contactNumber}}': userInfo.phone ?? 'N/A',
      '{{detailedReport.adversityScore.aqScore}}': String(detailedResults.adversityScore?.aqScore ?? ''),
    };

    // Top Aptitude (first three)
    for (let i = 0; i < 3; i++) {
      const item = aptiCategoryWiseScores[i]?.scoreObject;
      if (item) {
        replacements[`{{aptiCategoryWiseScores[${i}].scoreObject.categoryDisplayText}}`] = String(item.categoryDisplayText ?? '');
        replacements[`{{aptiCategoryWiseScores[${i}].scoreObject.categoryPercentage}}`] = String(item.categoryPercentage ?? '');
      }
    }

    // Top Interests (first three names)
    for (let i = 0; i < 3; i++) {
      const item = interestAndPreferenceScore[i]?.scoreObject;
      if (item) {
        replacements[`{{interestAndPreferenceScore[${i}].scoreObject.categoryDisplayText}}`] = String(item.categoryDisplayText ?? '');
      }
    }

    // SEI (four scores)
    for (let i = 0; i < 4; i++) {
      const item = seiScore[i]?.scoreObject;
      if (item) {
        replacements[`{{seiScore[${i}].scoreObject.categoryDisplayText}}`] = String(item.categoryDisplayText ?? '');
        replacements[`{{seiScore[${i}].scoreObject.categoryScore}}`] = String(item.categoryScore ?? '');
      }
    }

    // Optional placeholders that appeared without moustache in some pages
    const topPsychometric = Object.entries(detailedResults.detailedPsychometricScore.categoryWiseScore)
      .sort(([, a], [, b]) => (b as any).categoryScore - (a as any).categoryScore)
      .slice(0, 3)
      .map(([, data]) => (data as any).categoryDisplayText ?? '');
    // Replace $BCA, $BCB, $BCC if found
    replacements['$BCA'] = topPsychometric[0] ?? '';
    replacements['$BCB'] = topPsychometric[1] ?? '';
    replacements['$BCC'] = topPsychometric[2] ?? '';

    const applyReplacements = (html: string): string => {
      let out = html;
      for (const [key, value] of Object.entries(replacements)) {
        out = out.split(key).join(value);
      }
      return out;
    };

    try {
      await loadHtml2Canvas();
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Offscreen container to render pages
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.style.width = `${pageWidth}px`;
      container.style.background = '#ffffff';
      document.body.appendChild(container);

      const basePath = '/detailed/';
      let firstPage = true;

      for (const file of pageFiles) {
        try {
          const res = await fetch(basePath + file);
          if (!res.ok) continue;
          const rawHtml = await res.text();
          const filledHtml = applyReplacements(rawHtml);

          const pageDiv = document.createElement('div');
          pageDiv.style.width = `${pageWidth}px`;
          pageDiv.style.minHeight = `${pageHeight}px`;
          pageDiv.innerHTML = filledHtml;
          container.appendChild(pageDiv);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const canvas = await (window as any).html2canvas(pageDiv, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/png');

          // Fit image to page
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (!firstPage) {
            pdf.addPage();
          }
          firstPage = false;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          container.removeChild(pageDiv);
        } catch (e) {
          // skip failed pages
          // no-op
        }
      }

      document.body.removeChild(container);

      const fileName = `SkillSphere_${(userInfo.name ?? 'User').toUpperCase().replace(/\s+/g, '_')}_${(attemptId ?? 'N/A').toUpperCase()}_Report.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating detailed results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <Calculator className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!detailedResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No detailed results available</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Results
            </button>
            <div className="flex space-x-3">
              <button 
                onClick={handleGenerateHTML}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </button>
            </div>
          </div>

          <div className="text-center">
            <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Assessment Results</h1>
            <p className="text-lg text-gray-600">
              Complete assessment analysis
            </p>
          </div>
        </div>

        {/* Sub-section Performance */}
        {subSectionStats && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Sub-section Performance Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Aptitude Sub-sections */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  Aptitude Sub-sections
                </h3>
                <div className="space-y-4">
                  {Object.values(subSectionStats)
                    .filter((stat: any) => stat.sectionName.toLowerCase() === 'aptitude')
                    .map((stat: any) => (
                      <div key={stat.subSectionName} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-green-900">{stat.subSectionName}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            stat.percentage >= 70 ? 'bg-green-100 text-green-800' :
                            stat.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stat.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm text-green-700 mb-3">
                          <div className="text-center">
                            <div className="font-medium text-green-900">{stat.answeredQuestions}</div>
                            <div className="text-xs">Questions</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-900">{stat.obtainedMarks}/{stat.totalMarks}</div>
                            <div className="text-xs">Marks</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-900">{stat.questionType}</div>
                            <div className="text-xs">Type</div>
                          </div>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Behavioral Sub-sections */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  Behavioral Sub-sections
                </h3>
                <div className="space-y-4">
                  {Object.values(subSectionStats)
                    .filter((stat: any) => stat.sectionName.toLowerCase() === 'behavioural')
                    .map((stat: any) => (
                      <div key={stat.subSectionName} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-purple-900">{stat.subSectionName}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            stat.percentage >= 70 ? 'bg-green-100 text-green-800' :
                            stat.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stat.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm text-purple-700 mb-3">
                          <div className="text-center">
                            <div className="font-medium text-purple-900">{stat.answeredQuestions}</div>
                            <div className="text-xs">Questions</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-900">{stat.obtainedMarks}/{stat.totalMarks}</div>
                            <div className="text-xs">Marks</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-900">{stat.questionType}</div>
                            <div className="text-xs">Type</div>
                          </div>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JSON Response Display */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Career Insights Section */}
          {detailedResults.careerMapping && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Brain className="h-8 w-8 text-indigo-600 mr-3" />
                Career Recommendation Insights
              </h2>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3">Why This Career Path?</h3>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                        <h4 className="font-medium text-gray-900 mb-1">Top Interest Area</h4>
                        <p className="text-gray-700">
                          {(() => {
                            const topInterest = Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
                              .sort(([,a], [,b]) => b.categoryScore - a.categoryScore)[0];
                            return `${topInterest?.[1]?.categoryDisplayText} (${topInterest?.[1]?.categoryScore} points)`;
                          })()}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-green-500">
                        <h4 className="font-medium text-gray-900 mb-1">Strongest Aptitude</h4>
                        <p className="text-gray-700">
                          {(() => {
                            const topAptitude = Object.entries(detailedResults.aptitudeScore.categoryWiseScore)
                              .sort(([,a], [,b]) => b.categoryPercentage - a.categoryPercentage)[0];
                            return `${topAptitude?.[1]?.categoryDisplayText} (${topAptitude?.[1]?.categoryPercentage.toFixed(1)}%)`;
                          })()}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                        <h4 className="font-medium text-gray-900 mb-1">Personality Strength</h4>
                        <p className="text-gray-700">
                          {(() => {
                            const topPersonality = Object.entries(detailedResults.detailedPsychometricScore.categoryWiseScore)
                              .sort(([,a], [,b]) => b.categoryScore - a.categoryScore)[0];
                            return `${topPersonality?.[1]?.categoryDisplayText} (${topPersonality?.[1]?.categoryScoreLevel})`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3">Career Match Analysis</h3>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">{detailedResults.careerMapping.clubToJoin}</h4>
                      <p className="text-indigo-700 text-sm mb-3">{detailedResults.careerMapping.tagLine}</p>
                      <p className="text-gray-700 text-sm mb-4">{detailedResults.careerMapping.idealFor}</p>
                      
                      <div className="bg-indigo-50 p-3 rounded">
                        <h5 className="font-medium text-indigo-900 mb-2">Calculation Logic ({detailedResults.careerMapping.ruleName})</h5>
                        <div className="text-xs text-indigo-700 space-y-1">
                          <p>• Interest alignment: {Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
                            .sort(([,a], [,b]) => b.categoryScore - a.categoryScore)
                            .slice(0, 2)
                            .map(([,data]) => data.categoryDisplayText)
                            .join(', ')}</p>
                          <p>• Aptitude strengths: {Object.entries(detailedResults.aptitudeScore.categoryWiseScore)
                            .filter(([,data]) => data.categoryScoreLevel === 'High')
                            .map(([,data]) => data.categoryDisplayText)
                            .join(', ') || 'Developing'}</p>
                          <p>• Personality fit: {Object.entries(detailedResults.detailedPsychometricScore.categoryWiseScore)
                            .filter(([,data]) => data.categoryScoreLevel === 'High')
                            .map(([,data]) => data.categoryDisplayText)
                            .join(', ') || 'Balanced'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* RIASEC Top 3 Display */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                  <Users className="h-6 w-6 text-orange-600 mr-2" />
                  Your RIASEC Profile - Top 3 Interest Areas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {(() => {
                    const riasecCategories = Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
                      .sort(([,a], [,b]) => b.categoryScore - a.categoryScore)
                      .slice(0, 3);
                    
                    const categoryDescriptions = {
                      realistic: { 
                        description: "Work with tools, machines, and physical materials",
                        careers: "Engineer, Mechanic, Carpenter, Farmer"
                      },
                      investigative: { 
                        description: "Research, analyze, and solve complex problems",
                        careers: "Scientist, Researcher, Doctor, Analyst"
                      },
                      artistic: { 
                        description: "Create, design, and express through various art forms",
                        careers: "Designer, Artist, Writer, Musician"
                      },
                      social: { 
                        description: "Help, teach, and work directly with people",
                        careers: "Teacher, Counselor, Social Worker, Nurse"
                      },
                      enterprising: { 
                        description: "Lead, persuade, and manage business operations",
                        careers: "Manager, Entrepreneur, Sales, Lawyer"
                      },
                      conventional: { 
                        description: "Organize, process data, and follow detailed procedures",
                        careers: "Accountant, Administrator, Clerk, Banker"
                      }
                    };
                    
                    return riasecCategories.map(([category, data], index) => (
                      <div key={category} className="bg-white p-4 rounded-lg border-2 border-orange-200 relative">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div className="text-center mb-3">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl font-bold text-orange-600">{data.categoryLetter}</span>
                          </div>
                          <h4 className="font-bold text-orange-900">{data.categoryDisplayText}</h4>
                          <div className="text-sm text-orange-700 mt-1">
                            Score: <span className="font-semibold">{data.categoryScore}/5</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-700 space-y-2">
                          <p className="font-medium">What you enjoy:</p>
                          <p className="text-gray-600">
                            {categoryDescriptions[category as keyof typeof categoryDescriptions]?.description}
                          </p>
                          <p className="font-medium">Career examples:</p>
                          <p className="text-gray-600">
                            {categoryDescriptions[category as keyof typeof categoryDescriptions]?.careers}
                          </p>
                        </div>
                        
                        <div className="mt-3 w-full bg-orange-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.categoryScore / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                
                {/* RIASEC Code Display */}
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-3 text-center">Your RIASEC Code</h4>
                  <div className="flex justify-center items-center space-x-2 mb-3">
                    {(() => {
                      const top3Letters = Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
                        .sort(([,a], [,b]) => b.categoryScore - a.categoryScore)
                        .slice(0, 3)
                        .map(([,data]) => data.categoryLetter);
                      
                      return top3Letters.map((letter, index) => (
                        <React.Fragment key={letter}>
                          <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                            {letter}
                          </div>
                          {index < top3Letters.length - 1 && (
                            <div className="text-orange-400 text-2xl">-</div>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Your three-letter RIASEC code represents your strongest interest areas in order of preference
                  </p>
                </div>
                
                {/* Interest Score Breakdown */}
                <div className="mt-4 bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-3">Complete Interest Profile</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(detailedResults.interestAndPreferenceScore.categoryWiseScore)
                      .sort(([,a], [,b]) => b.categoryScore - a.categoryScore)
                      .map(([category, data]) => (
                        <div key={category} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-bold text-orange-700">{data.categoryLetter}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{data.categoryDisplayText}</span>
                          </div>
                          <span className="text-sm font-bold text-orange-600">{data.categoryScore}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-3">Recommended Career Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {detailedResults.careerMapping.idealCareer.split(', ').map((career: string, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border border-yellow-300">
                      <span className="text-sm font-medium text-gray-900">{career.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detailed Assessment Result</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(detailedResults, null, 2));
                  alert('JSON copied to clipboard!');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(detailedResults, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `assessment-results-${attemptId}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Download JSON
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 overflow-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(detailedResults, null, 2)}
            </pre>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-3">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Psychometric</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(detailedResults.detailedPsychometricScore.categoryWiseScore)
                    .filter((cat: any) => cat.categoryScoreLevel === 'High').length}/5
                </div>
                <p className="text-sm text-blue-700">High-level traits</p>
                <div className="text-xs text-blue-600">
                  Strongest: {Object.entries(detailedResults.detailedPsychometricScore.categoryWiseScore)
                    .sort(([,a], [,b]) => (b as any).categoryScore - (a as any).categoryScore)[0]?.[1]?.categoryDisplayText}
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Aptitude</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(detailedResults.aptitudeScore.categoryWiseScore)
                    .filter((cat: any) => cat.categoryScoreLevel === 'High').length}/7
                </div>
                <p className="text-sm text-green-700">High-level abilities</p>
                <div className="text-xs text-green-600">
                  Best: {Object.entries(detailedResults.aptitudeScore.categoryWiseScore)
                    .sort(([,a], [,b]) => (b as any).categoryPercentage - (a as any).categoryPercentage)[0]?.[1]?.categoryDisplayText}
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-900">Adversity</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">{detailedResults.adversityScore.aqScore}</div>
                <p className="text-sm text-red-700">AQ Score</p>
                <div className="text-xs text-red-600">{detailedResults.adversityScore.aqLevel}</div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center mb-3">
                <Heart className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-900">SEI</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(detailedResults.seiScore.categoryWiseScore)
                    .filter((cat: any) => cat.categoryScoreLevel === 'High').length}/4
                </div>
                <p className="text-sm text-purple-700">High EQ areas</p>
                <div className="text-xs text-purple-600">
                  Top: {Object.entries(detailedResults.seiScore.categoryWiseScore)
                    .sort(([,a], [,b]) => (b as any).categoryScore - (a as any).categoryScore)[0]?.[1]?.categoryDisplayText}
                </div>
              </div>
            </div>
          </div>
          
          {/* Calculation Methodology */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Calculation Methodology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scoring Methods</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• <strong>Psychometric:</strong> 1-5 Likert scale (Extremely Unlikely to Extremely Likely)</li>
                  <li>• <strong>Aptitude:</strong> Binary scoring (1 for correct, 0 for incorrect)</li>
                  <li>• <strong>Adversity:</strong> 1-5 frequency scale (Never to Always)</li>
                  <li>• <strong>SEI:</strong> 1-5 intensity scale with normalization</li>
                  <li>• <strong>Interests:</strong> Binary preference (Agree/Disagree)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Level Determination</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• <strong>Psychometric:</strong> High ≥17.5, Low {'<'} 17.5</li>
                  <li>• <strong>Aptitude:</strong> High ≥77%, Moderate 24-76%, Low {'<'} 24%</li>
                  <li>• <strong>AQ Score:</strong> High ≥178, Mod High ≥161, Moderate ≥135, Mod Low ≥118, Low {'<'} 118</li>
                  <li>• <strong>SEI:</strong> High ≥8, Moderate 5-7, Low {'<'} 5 (normalized)</li>
                  <li>• <strong>Career Rules:</strong> Based on top interest + aptitude + personality combination</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};