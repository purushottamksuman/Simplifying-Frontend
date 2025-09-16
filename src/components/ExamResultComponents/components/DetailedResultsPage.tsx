import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Download, Share2, BarChart3, TrendingUp, Users, Brain, Target, Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { calculateDetailedAssessmentResult } from '../../../../utils/utils/assessmentCalculation';
import type { DetailedAssessmentResult, QuestionSubmission, QuestionData } from '../../../../utils/utils/assessmentCalculation';
import jsPDF from 'jspdf';

interface DetailedResultsPageProps {
  attemptId: string;
  onBack: () => void;
}

interface ExamResponse {
  id: string;
  question_id: string;
  selected_option_id: string;
  selected_option_text: string;
  option_marks: number;
  section_type: string;
  answered_at: string;
}

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

  const handleDownloadPDF = () => {
    if (!detailedResults || !userInfo || !user) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Helper function to add multi-line text
    const addMultiLineText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 5) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line as string, x, y + index * lineHeight);
      });
      return lines.length * lineHeight;
    };

    // Helper to draw speech bubble
    const drawSpeechBubble = (text: string, x: number, y: number, width: number, height: number) => {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, y, width, height, 5, 5, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.roundedRect(x, y, width, height, 5, 5, 'D');
      // Tail
      doc.moveTo(x + 10, y + height);
      doc.lineTo(x + 20, y + height + 10);
      doc.lineTo(x + 30, y + height);
      doc.fill();
      doc.text(text, x + width / 2, y + height / 2 + 2, { align: 'center' });
    };

    // Aptitude descriptions and what it means templates
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

    // SEI what templates
    const seiWhatTemplates = {
      selfAwareness: {
        High: 'You are highly attuned to your emotions, strengths, and weaknesses. This self-insight allows you to make better decisions and build stronger relationships. Continue reflecting and seeking feedback to maintain this strength.',
        Moderate: 'You have a decent understanding of your emotions and behaviors. With more self-reflection, you can enhance this awareness. Practice journaling or mindfulness to improve.',
        Low: 'Sometimes, emotions can feel confusing, and you may not always notice how they impact your actions. For example, you might get upset with a friend without realizing that you\'re actually stressed about school. It can be tough to recognize feelings in the moment, but small steps like journaling or talking to a trusted person can help. Learning to notice and name your emotions will make it easier to understand yourself. With time, you can grow stronger in this area and feel more in control of your thoughts and reactions.',
      },
      selfManagement: {
        High: 'You excel at regulating your emotions and behaviors, staying motivated even in challenging situations. This skill helps in achieving long-term goals. Keep practicing stress management techniques.',
        Moderate: 'You can manage your emotions in many situations but may struggle in high-stress scenarios. Build resilience through goal-setting and positive habits.',
        Low: 'You might find it difficult to control your emotions, especially when something upsetting or stressful happens. For example, if you get a low grade on an assignment, you might react by shutting down or getting angry instead of looking for ways to improve. This can make it harder to achieve your goals. The good news is that self-management is a skill that can be improved! Simple habits like taking deep breaths, counting to ten, or asking for help when you need it can make a big difference. The more you practice staying calm and focused, the easier it will become in any situation.',
      },
      socialAwareness: {
        High: 'You are excellent at understanding others\' emotions and perspectives. This empathy helps in building strong relationships. Continue practicing active listening.',
        Moderate: 'You generally understand people\'s feelings and social dynamics, but sometimes you might miss small clues. For example, a classmate might seem upset, but you\'re not entirely sure why or how to respond. That\'s okay! Asking simple questions like "Are you okay?" can also help strengthen your ability to connect with people. With a little effort, you\'ll become even better at reading emotions and responding in a way that makes people feel understood and supported.',
        Low: 'You may find it challenging to pick up on social cues or understand others\' perspectives. Practice empathy exercises and observe social interactions to improve.',
      },
      socialSkills: {
        High: 'You are skilled at communicating, resolving conflicts, and building relationships. This ability is key for teamwork and leadership. Keep honing these skills in group settings.',
        Moderate: 'You have decent communication skills and can work well with others, but there\'s room to improve in handling conflicts or expressing ideas clearly. You might do fine in a group discussion but hesitate to give feedback or speak up in tough situations. With practice, you can become a stronger communicator. Smiles.',
        Low: 'You have room to grow in social interactions. Practice conversation skills and conflict resolution to build confidence.',
      },
    };

    // Adversity what templates
    const adversityWhatTemplates = {
      High: 'You have a high AQ, meaning you thrive in the face of challenges. You see setbacks as opportunities and persist until you succeed. This resilience will take you far in life. Continue to challenge yourself and support others in their journeys.',
      'Mod High': 'Your AQ is moderately high, indicating good resilience. You handle most challenges well but can improve in extreme situations. Focus on building endurance through consistent practice.',
      Moderate: 'You have a moderate AQ. You manage average challenges but may struggle with major setbacks. Work on ownership and control to enhance your resilience.',
      'Mod Low': 'Your AQ is moderately low. Challenges can feel difficult, but with effort, you can improve. Start with small goals to build confidence and persistence.',
      Low: 'This is just the beginning of your growth! Right now, challenges might feel overwhelming, and setbacks can seem like the end of the road. Maybe failing a test or facing rejection makes you want to stop trying. But remember—everyone starts somewhere! Building resilience takes time and effort. Start with small steps: ask for help, reflect on what you can learn from mistakes, and celebrate small wins. Over time, you\'ll see a huge change in how you handle difficulties. Believe in yourself—you have so much potential, and this is just the start of your journey!',
    };

    // Psychometric descriptions
    const psychometricDescriptions = {
      openness: 'Openness: People who like to learn new things and enjoy new experiences usually score high in openness. Openness includes personality traits like being insightful and imaginative and having a wide variety of interests.',
      conscientiousness: 'Conscientiousness: People that have a high degree of conscientiousness are reliable and prompt. Personality traits include being organized, methodical, and thorough.',
      extraversion: 'Extraversion: Extraverts get their energy from interacting with others, while introverts get their energy from within themselves. Extraversion includes the personality traits of energetic, talkative, and assertive.',
      agreeableness: 'Agreeableness: These individuals are friendly, cooperative, and compassionate. People with low agreeableness may be more distant. Personality traits include being kind, affectionate, and sympathetic.',
      neuroticism: 'Neuroticism: Neuroticism is also sometimes called Emotional Stability. This dimension relates to one\'s emotional stability and degree of negative emotions. People that score high on neuroticism often experience emotional instability and negative emotions. Personality traits include being moody and tense for example.',
    };

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
          name: data?.categoryDisplayText ?? realKey,   // fallback to key
          percentage: data?.categoryPercentage ?? 0,
          level: data?.categoryScoreLevel ?? "N/A",
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    // Get interest data
    const interests = detailedResults.interestAndPreferenceScore.categoryWiseScore;
    const sortedInterests = Object.entries(interests).sort(([, a], [, b]) => b.categoryScore - a.categoryScore).slice(0, 3);
    const interestCode = sortedInterests.map(([, data]) => data.categoryLetter ?? '').join('');

    // Get SEI data
    const sei = detailedResults.seiScore.categoryWiseScore;
    const seiCategories = {
      selfAwareness: sei.selfAwareness,
      selfManagement: sei.selfManagement,
      socialAwareness: sei.socialAwareness,
      socialSkills: sei.socialSkills,
    };

    // Get adversity data
    const adversity = detailedResults.adversityScore;
    const adversityCategories = adversity.categoryWiseScore || { control: { categoryScore: 0 }, ownership: { categoryScore: 0 }, reach: { categoryScore: 0 }, endurance: { categoryScore: 0 } };
    const adversityBars = [
      { name: 'CONTROL', score: adversityCategories.control.categoryScore ?? 0 },
      { name: 'OWNERSHIP', score: adversityCategories.ownership.categoryScore ?? 0 },
      { name: 'REACH', score: adversityCategories.reach.categoryScore ?? 0 },
      { name: 'ENDURANCE', score: adversityCategories.endurance.categoryScore ?? 0 },
    ];

    // Get psychometric data
    const psychometric = detailedResults.detailedPsychometricScore.categoryWiseScore;
    const psychometricCategories = ['extraversion', 'openness', 'agreeableness', 'neuroticism', 'conscientiousness'];
    const psychometricBars = psychometricCategories.map(cat => ({
      name: cat.toUpperCase(),
      percentage: (psychometric[cat].categoryPercentage || (psychometric[cat].categoryScore / 25 * 100)) ?? 0,
    }));

    // Start building PDF

    // Page 1: Cover
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 255);
    doc.text('Simplifying Skills Transforming Education', 10, 10);
    doc.setFontSize(50);
    doc.text('SkillSphere', 30, 50);
    doc.setFontSize(40);
    doc.text('Assessment', 30, 80);
    doc.setFillColor(255, 255, 0);
    doc.roundedRect(20, 95, 170, 30, 15, 15, 'F');
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(12);
    const yellowText1 = 'A 360° MEASURE OF PERSONALITY,';
    const yellowText2 = 'RESILIENCE, APTITUDE, AND INTERESTS';
    const yellowText3 = '—EMPOWERING EVERY STUDENT\'S JOURNEY';
    doc.text(yellowText1, 25, 105, { maxWidth: 160 });
    doc.text(yellowText2, 25, 110, { maxWidth: 160 });
    doc.text(yellowText3, 25, 115, { maxWidth: 160 });
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('"When we think we know, we cease to learn."', 50, 140);
    doc.text('Dr. Sarvepalli Radhakrishnan', 60, 150);
    doc.setFillColor(200, 220, 255);
    doc.roundedRect(20, 160, 170, 80, 10, 10, 'F');
    const desc = 'This report provides a comprehensive analysis of the student\'s personality traits, interests, aptitude, strengths, and growth areas, utilizing multiple industry-standard assessment frameworks. The insights gained are designed to guide the student\'s learning journey, enabling them to unlock their full potential and ultimately pursue successful and fulfilling careers.';
    addMultiLineText(desc, 25, 170, 160, 5);

    // Page 2: Student Info
    doc.addPage();
    doc.setFillColor(230, 240, 255);
    doc.rect(20, 20, 170, 70, 'F');
    doc.setDrawColor(0, 0, 255);
    doc.rect(20, 20, 170, 70);
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('STUDENT ID : ' + (attemptId ?? 'N/A').toUpperCase(), 25, 30);
    doc.text('NAME : ' + (userInfo?.name ?? 'N/A').toUpperCase(), 25, 40);
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    doc.text('ASSESSMENT DATE : ' + date, 25, 50);
    doc.text('EMAIL : ' + (user.email ?? 'N/A'), 25, 60);
    doc.text('PHONE : ' + (userInfo.phone ?? 'N/A'), 25, 70);
    doc.text('EVALUATOR : SKILLSPHERE ASSESSMENT SYSTEM', 25, 80);
    const cong = 'Congratulations on successfully completing the SkillSphere Assessment! Your results highlight key strengths such as brilliance, resilience, and a strong mindset, all of which position you for continued success. Each score reflects your dedication, intelligence, and boundless potential to conquer challenges and achieve extraordinary success.';
    addMultiLineText(cong, 10, 100, 190, 5);
    doc.line(50, 130, 160, 130);
    doc.setFontSize(16);
    doc.text('THIS ASSESSMENT MARKS THE BEGINNING OF YOUR PROFESSIONAL DEVELOPMENT JOURNEY.', 10, 140, { maxWidth: 190 });
    doc.setFillColor(255, 240, 220);
    doc.roundedRect(10, 150, 190, 40, 10, 10, 'F');
    const bottom = 'With your demonstrated talent and determination, there is significant potential for you to reach new heights in your career and personal growth. Keep striving toward excellence, as your future holds limitless possibilities.';
    addMultiLineText(bottom, 15, 160, 180, 5);

    // Page 3: Assessment Result
    doc.addPage();
    doc.setFontSize(24);
    doc.text('ASSESSMENT RESULT', 60, 20);
    // Central circle
    doc.setFillColor(0, 0, 255);
    doc.circle(105, 140, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('SkillSphere', 80, 135);
    doc.text('Assessment', 75, 145);
    doc.text('Result', 90, 155);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    // Aptitude circle
    doc.setFillColor(200, 100, 100);
    doc.circle(105, 60, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Aptitude', 95, 60);
    doc.setTextColor(0, 0, 0);
    let aptY = 50;
    aptitudeBars.slice(0, 3).forEach(bar => {
      doc.text(bar.name + ' ' + bar.percentage.toFixed(2) + '%', 85, aptY);
      aptY += 5;
    });
    doc.setFillColor(255, 255, 255);
    doc.rect(70, 30, 70, 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(70, 30, 70, 20);
    const aptBox = 'Measure skills, abilities, and potential to succeed in a particular role or environment. It is based on Differential Aptitude Test (DAT), which evaluates on 8 different components.';
    addMultiLineText(aptBox, 75, 35, 60, 4);
    // Interest circle
    doc.setFillColor(100, 200, 100);
    doc.circle(175, 110, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Interest and Preferences', 155, 100, { maxWidth: 40, align: 'center' });
    doc.setTextColor(0, 0, 0);
    let intY = 100;
    sortedInterests.forEach(([, data]) => {
      doc.text(data.categoryDisplayText ?? 'N/A', 160, intY);
      intY += 5;
    });
    doc.setFillColor(255, 255, 255);
    doc.rect(155, 70, 40, 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(155, 70, 40, 20);
    const intBox = 'Provides professional aspirations, values, and motivations. 6 personality types based on RIASEC model.';
    addMultiLineText(intBox, 160, 75, 30, 4);
    // SEI circle
    doc.setFillColor(100, 200, 200);
    doc.circle(35, 110, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Social Emotional Intelligence', 15, 100, { maxWidth: 40, align: 'center' });
    doc.setTextColor(0, 0, 0);
    let seiY = 100;
    Object.entries(seiCategories).forEach(([, data]) => {
      doc.text((data?.categoryDisplayText ?? 'N/A') + ' ' + String(data?.categoryScore ?? 0), 20, seiY);
      seiY += 5;
    });
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 70, 40, 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(15, 70, 40, 20);
    const seiBox = 'Measure individual\'s mental ability to succeed in any environmental circumstance. Leveraged from Bar-On Model of Emotional-Social Intelligence.';
    addMultiLineText(seiBox, 20, 75, 30, 4);
    // Psychometric circle
    doc.setFillColor(150, 100, 200);
    doc.circle(35, 180, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Psychometric Traits', 15, 170, { maxWidth: 40, align: 'center' });
    doc.setTextColor(0, 0, 0);
    let psyY = 170;
    psychometricBars.slice(0, 3).forEach(bar => {
      doc.text(bar.name, 20, psyY);
      psyY += 5;
    });
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 210, 40, 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(15, 210, 40, 20);
    const psyBox = 'Help identify personality type leveraging Big Five Model with 5 broad dimensions.';
    addMultiLineText(psyBox, 20, 215, 30, 4);
    // Adversity circle
    doc.setFillColor(255, 150, 0);
    doc.circle(175, 180, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Adversity Quotient', 155, 170, { maxWidth: 40, align: 'center' });
    doc.text('Adversity Response Profile', 155, 180, { maxWidth: 40, align: 'center' });
    doc.text('ARP ' + String(adversity.aqScore ?? 0), 160, 190);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(255, 255, 255);
    doc.rect(155, 210, 40, 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(155, 210, 40, 20);
    const advBox = 'Measures a person\'s ability to deal with life. Higher Score indicates better resilience to adversity. High score 200.';
    addMultiLineText(advBox, 160, 215, 30, 4);
    // Lines
    doc.setDrawColor(200, 200, 200);
    doc.line(105, 85, 105, 110);
    doc.line(130, 110, 105, 140);
    doc.line(80, 110, 105, 140);
    doc.line(80, 180, 105, 140);
    doc.line(130, 180, 105, 140);
    doc.line(105, 170, 105, 195); // Adjust if needed

    // Page 4: Detailed Assessment Report - Aptitude Intro
    doc.addPage();
    doc.setFillColor(0, 0, 255);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('DETAILED ASSESSMENT REPORT', 10, 15);
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 30, 190, pageHeight - 40, 10, 10, 'F');
    doc.setFillColor(0, 0, 255);
    doc.roundedRect(15, 35, 20, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('1', 20, 45);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Aptitude (IQ)', 40, 45);
    doc.setFontSize(12);
    const aptGeneral = 'Aptitude tests measure skills, abilities, and potential to succeed in a particular role or environment. This assessment framework is modeled after the widely recognized Differential Aptitude Test (DAT) and evaluates individuals across eight key aptitude components: Verbal Reasoning, Numerical Ability, Abstract Reasoning, Perceptual Speed and Accuracy, Mechanical Reasoning, Spatial Relations, Spelling, and Language Usage.';
    let y = 60;
    y += addMultiLineText(aptGeneral, 15, y, 180, 5);
    Object.keys(aptitudeDescriptions).forEach(key => {
      const desc = '• ' + aptitudeDescriptions[key as keyof typeof aptitudeDescriptions];
      y += addMultiLineText(desc, 15, y, 180, 5) + 5;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 5: Aptitude Scores
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    drawSpeechBubble('Your Score', 15, 20, 60, 20);
    y = 50;
    const colors: [number, number, number][] = [[0,255,255], [0,200,255], [0,150,255], [0,100,255], [0,50,255], [100,50,200], [150,50,150], [200,50,100]];
    let barWidth = 100;
    const centerX = pageWidth / 2;
    aptitudeBars.forEach((bar, index) => {
      const currentWidth = barWidth - index * 10; // Funnel effect
      const barX = centerX - currentWidth / 2;
      doc.text(bar.name, barX - 50, y + 5); // Label to the left
      doc.setFillColor(...colors[index % colors.length]);
      doc.rect(barX, y, currentWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(bar.percentage.toFixed(2) + '%', barX + currentWidth - 30, y + 7);
      doc.setTextColor(0, 0, 0);
      y += 15;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 6: Aptitude What it means
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    drawSpeechBubble('What it means', 15, 20, 80, 20);
    y = 50;
    aptitudeBars.forEach((bar) => {
      const category = Object.keys(aptitudeKeyMap).find(
        (c) => aptitude[aptitudeKeyMap[c]]?.categoryDisplayText === bar.name
      ) || "verbal";
      const template = aptitudeWhatTemplates[category as keyof typeof aptitudeWhatTemplates]?.[bar.level] ?? "";
      const text = '• You have scored ' + bar.percentage.toFixed(2) + '% in ' + bar.name + ' which is a ' + bar.level + ' score. ' + template;
      y += addMultiLineText(text, 15, y, 180, 5) + 10;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 7: Interest Intro
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    doc.setFillColor(0, 0, 255);
    doc.roundedRect(15, 15, 20, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('2', 20, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Interest & Preferences', 40, 25);
    doc.setFontSize(12);
    const interestGeneral = 'Interest & Preferences test results provide an objective basis for engaging in meaningful discussions about professional aspirations, values and motivations. This assessment framework is modeled after Holland\'s theory which defines personality types as: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional (RIASEC).';
    y = 40;
    y += addMultiLineText(interestGeneral, 15, y, 180, 5) + 5;
    Object.keys(interestDescriptions).forEach(key => {
      const desc = '• ' + interestDescriptions[key as keyof typeof interestDescriptions];
      y += addMultiLineText(desc, 15, y, 180, 5) + 5;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 8: Interest Scores
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    drawSpeechBubble('Your Score', 15, 20, 60, 20);
    // Hexagon
    const hexCenterX = 105;
    const hexCenterY = 60;
    const hexSize = 30;
    const hexPoints = [];
    for (let i = 0; i < 6; i++) {
      hexPoints.push([
        hexCenterX + hexSize * Math.cos(Math.PI / 3 * i),
        hexCenterY + hexSize * Math.sin(Math.PI / 3 * i)
      ]);
    }
    doc.setDrawColor(0, 0, 255);
    doc.lines(hexPoints.map((p, i) => [hexPoints[(i+1)%6][0] - p[0], hexPoints[(i+1)%6][1] - p[1]]), hexPoints[0][0], hexPoints[0][1]);
    // Labels
    const letters = ['R', 'I', 'A', 'S', 'E', 'C'];
    letters.forEach((letter, i) => {
      const px = hexPoints[i][0] + (i % 2 === 0 ? 5 : -5);
      const py = hexPoints[i][1] + (i < 3 ? -5 : 5);
      doc.text(letter, px, py);
    });
    // Highlight top 3 with triangle
    if (sortedInterests.length >= 3) {
      const topLetters = sortedInterests.map(([, data]) => data.categoryLetter ?? '');
      const topIndices = topLetters.map(l => letters.indexOf(l));
      if (topIndices.length === 3) {
        doc.setFillColor(150, 50, 150); // Purple fill for triangle
        doc.triangle(
          hexPoints[topIndices[0]][0], hexPoints[topIndices[0]][1],
          hexPoints[topIndices[1]][0], hexPoints[topIndices[1]][1],
          hexPoints[topIndices[2]][0], hexPoints[topIndices[2]][1],
          'F'
        );
      }
    }
    y = 100;
    const interestResult = 'Your results reflect the alignment of your skills and interests with specific areas within the RIASEC model, helping to identify the environments and roles where you are most likely to thrive. It also highlights areas where further development may enhance your effectiveness and satisfaction in your chosen field. This alignment is a valuable tool for making informed decisions about your personal growth, education, and career options, as it offers clarity on the types of roles that would best suit your strengths and ambitions.';
    y += addMultiLineText(interestResult, 15, y, 180, 5) + 5;
    doc.text('Your Interest Code: ' + interestCode, 15, y);
    y += 10;
    drawSpeechBubble('What it means', 15, y, 80, 20);
    y += 30;
    sortedInterests.forEach(([key, data]) => {
      const template = interestWhatTemplates[key as keyof typeof interestWhatTemplates] ?? '';
      const text = '• ' + (data.categoryDisplayText ?? 'N/A') + ': ' + template;
      y += addMultiLineText(text, 15, y, 180, 5) + 10;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 9: SEI Intro
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    doc.setFillColor(0, 0, 255);
    doc.roundedRect(15, 15, 20, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('3', 20, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Socio Emotional Intelligence (SEI)', 40, 25);
    doc.setFontSize(12);
    const seiGeneral = 'Socio Emotional Intelligence measures the individual\'s mental ability to succeed in any environmental circumstance. This assessment framework is leveraged from Bar-On Model of Emotional-Social Intelligence (ESI) which was developed by renowned psychologist Reuven Bar-On. As a measurement tool the Bar-On Emotion Quotient Inventory (EQ-i) was developed and estimates a person\'s both emotional and social intelligence.';
    y = 40;
    y += addMultiLineText(seiGeneral, 15, y, 180, 5) + 5;
    const seiDims = {
      selfAwareness: 'Self-awareness: This dimension involves recognizing and understanding your own emotions, strengths, weaknesses, values, and drivers. It helps you assess how your emotions affect your thoughts and behaviour and enables you to accurately assess your self-worth and confidence.',
      selfManagement: 'Self-management: Self-management is the ability to regulate your emotions, thoughts, and behaviours in different situations. This includes managing stress, controlling impulses, staying motivated, and setting and achieving personal goals. It helps in maintaining emotional balance even in challenging situations.',
      socialAwareness: 'Social awareness: This dimension focuses on the ability to recognize and understand the emotions, needs, and concerns of others. It includes empathy, the capacity to feel what others are feeling, and an awareness of social dynamics, allowing you to understand and relate to people from different backgrounds.',
      socialSkills: 'Social skills: Social skills involve the ability to communicate, build relationships, and work well with others. This includes effective communication, teamwork, conflict resolution, and the ability to influence and inspire others. Strong social skills help you navigate social situations and build strong, healthy relationships.',
    };
    Object.entries(seiDims).forEach(([key, desc]) => {
      y += addMultiLineText('• ' + desc, 15, y, 180, 5) + 5;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 10: SEI Scores
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    drawSpeechBubble('Your Score', 15, 20, 60, 20);
    // Puzzle pieces
    const puzzleColors = {
      selfAwareness: [0, 255, 0],
      selfManagement: [255, 255, 0],
      socialAwareness: [255, 0, 0],
      socialSkills: [255, 165, 0],
    };
    const puzzleX = 50;
    const puzzleY = 50;
    const puzzleWidth = 50;
    const puzzleHeight = 30;
    // Top left
    doc.setFillColor(...puzzleColors.selfAwareness);
    doc.roundedRect(puzzleX, puzzleY, puzzleWidth, puzzleHeight, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Self Awareness', puzzleX + 5, puzzleY + 10);
    doc.text(seiCategories.selfAwareness?.categoryScoreLevel ?? 'N/A', puzzleX + 5, puzzleY + 20);
    doc.text(String(seiCategories.selfAwareness?.categoryScore ?? 0), puzzleX + 40, puzzleY + 20);
    // Top right
    doc.setFillColor(...puzzleColors.selfManagement);
    doc.roundedRect(puzzleX + puzzleWidth, puzzleY, puzzleWidth, puzzleHeight, 5, 5, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Self Management', puzzleX + puzzleWidth + 5, puzzleY + 10);
    doc.text(seiCategories.selfManagement?.categoryScoreLevel ?? 'N/A', puzzleX + puzzleWidth + 5, puzzleY + 20);
    doc.text(String(seiCategories.selfManagement?.categoryScore ?? 0), puzzleX + puzzleWidth + 40, puzzleY + 20);
    // Bottom left
    doc.setFillColor(...puzzleColors.socialAwareness);
    doc.roundedRect(puzzleX, puzzleY + puzzleHeight, puzzleWidth, puzzleHeight, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Social Awareness', puzzleX + 5, puzzleY + puzzleHeight + 10);
    doc.text(seiCategories.socialAwareness?.categoryScoreLevel ?? 'N/A', puzzleX + 5, puzzleY + puzzleHeight + 20);
    doc.text(String(seiCategories.socialAwareness?.categoryScore ?? 0), puzzleX + 40, puzzleY + puzzleHeight + 20);
    // Bottom right
    doc.setFillColor(...puzzleColors.socialSkills);
    doc.roundedRect(puzzleX + puzzleWidth, puzzleY + puzzleHeight, puzzleWidth, puzzleHeight, 5, 5, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Social Skills', puzzleX + puzzleWidth + 5, puzzleY + puzzleHeight + 10);
    doc.text(seiCategories.socialSkills?.categoryScoreLevel ?? 'N/A', puzzleX + puzzleWidth + 5, puzzleY + puzzleHeight + 20);
    doc.text(String(seiCategories.socialSkills?.categoryScore ?? 0), puzzleX + puzzleWidth + 40, puzzleY + puzzleHeight + 20);
    doc.setTextColor(0, 0, 0);
    y = puzzleY + 70;
    const seiResult = 'This result looks at how well you understand and manage your emotions, connect with others, and navigate social interactions. It gives insight into your ability to build relationships, handle conflicts, and respond to social cues in everyday life.';
    y += addMultiLineText(seiResult, 15, y, 180, 5) + 5;
    drawSpeechBubble('What it means', 15, y, 80, 20);
    y += 30;
    Object.entries(seiCategories).forEach(([key, data]) => {
      const template = seiWhatTemplates[key as keyof typeof seiWhatTemplates]?.[data?.categoryScoreLevel ?? 'Moderate'] ?? '';
      const text = '• You have scored ' + String(data?.categoryScore ?? 0) + ' in ' + (data?.categoryDisplayText ?? 'N/A') + ' which is a ' + (data?.categoryScoreLevel ?? 'N/A') + ' score. ' + template;
      y += addMultiLineText(text, 15, y, 180, 5) + 10;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 11: Adversity Intro
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    doc.setFillColor(0, 0, 255);
    doc.roundedRect(15, 15, 20, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('4', 20, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Adversity Quotient', 40, 25);
    doc.setFontSize(12);
    const advGeneral = 'Adversity Quotient (AQ) is a score that measures a person\'s ability to deal with challenges in life. It\'s also known as the science of resilience. This test uses four dimensions: Control, Ownership, Reach, and Endurance (CORE) to evaluate AQ. The average ARP Score is 147.5. The higher the better!';
    y = 40;
    y += addMultiLineText(advGeneral, 15, y, 180, 5) + 5;
    const advDims = {
      control: 'Control: This dimension measures how much influence you believe you have over a situation or adversity. People with a high sense of control tend to feel empowered to act, even in difficult circumstances. Conversely, those with low control may feel overwhelmed or helpless when faced with challenges.',
      ownership: 'Ownership: Ownership assesses the extent to which people take responsibility for improving or resolving challenges. High ownership means holding themselves accountable for dealing with situations regardless of their cause. A low sense of ownership might lead to deflecting accountability, feeling victimized and helpless, and blaming external factors.',
      reach: 'Reach: Reach evaluates how far you allow adversity to affect other areas of your life. High reach suggests that you can compartmentalize challenges and prevent them from spilling over into unrelated aspects of life. It means they can keep setbacks and challenges in their place, not let them infest the healthy areas of their work and lives. Low reach may result in difficulties in one area impacting overall mood, relationships, or productivity.',
      endurance: 'Endurance: Endurance refers to your perception of how long adversity will last. High endurance is characterized by resilience and optimism, with the belief that challenges are temporary and solvable. Low endurance may involve feeling stuck or believing difficulties will persist indefinitely.',
    };
    Object.values(advDims).forEach(desc => {
      y += addMultiLineText('• ' + desc, 15, y, 180, 5) + 5;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });
    doc.text('Your Adversity Response Profile (ARP) = ' + String(adversity.aqScore ?? 0), 15, y);
    y += 5;
    doc.text('Your AQ is ' + (adversity.aqLevel ?? 'N/A'), 15, y);
    y += 10;

    // Page 12: Adversity Scores
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    drawSpeechBubble('Your Score', 15, 20, 60, 20);
    y = 50;
    const advColors = [[0, 255, 0], [255, 165, 0], [165, 42, 42], [255, 255, 0]];
    adversityBars.forEach((bar, index) => {
      doc.setFillColor(200, 200, 200);
      doc.rect(15, y, 80, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(bar.name, 20, y + 12);
      doc.setFillColor(...advColors[index]);
      doc.rect(95, y, 30, 20, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(String(bar.score), 100, y + 12);
      y += 25;
    });
    drawSpeechBubble('What it means', 15, y, 80, 20);
    y += 30;
    const advTemplate = adversityWhatTemplates[adversity.aqLevel as keyof typeof adversityWhatTemplates ?? 'Moderate'] ?? '';
    addMultiLineText(advTemplate, 15, y, 180, 5);

    // Page 13: Psychometric Intro
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    doc.setFillColor(0, 0, 255);
    doc.roundedRect(15, 15, 20, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('5', 20, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Psychometric Traits', 40, 25);
    doc.setFontSize(12);
    const psyGeneral = 'Psychometric tests help identify personality. Simplifying skills career quest uses Big Five model, also known as the Five Factor Model. This test delineates personality into five broad dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism (OCEAN).';
    y = 40;
    y += addMultiLineText(psyGeneral, 15, y, 180, 5) + 5;
    psychometricCategories.forEach(cat => {
      const desc = '• ' + (psychometricDescriptions[cat] ?? 'No description');
      y += addMultiLineText(desc, 15, y, 180, 5) + 5;
      if (y > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
        y = 20;
      }
    });

    // Page 14: Psychometric Scores
    doc.addPage();
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(10, 10, 190, pageHeight - 20, 10, 10, 'F');
    drawSpeechBubble('Your Score', 15, 20, 60, 20);
    y = 50;
    const psyColors = [[255, 0, 0], [0, 0, 255], [255, 255, 0], [0, 255, 0], [128, 0, 128]];
    const barSpacing = 30;
    barWidth = 20;
    const baseY = y + 100;
    psychometricBars.forEach((bar, index) => {
      const barX = 20 + index * barSpacing;
      doc.setFillColor(...psyColors[index]);
      doc.rect(barX, baseY - bar.percentage, barWidth, bar.percentage, 'F');
      doc.text(bar.name, barX, baseY + 10, { angle: 90 });
      doc.text(bar.percentage.toFixed(0) + '%', barX + 5, baseY - bar.percentage - 5);
    });

    // Save PDF
    doc.save(`SkillSphere_${(userInfo.name ?? 'User').toUpperCase().replace(' ', '_')}_${(attemptId ?? 'N/A').toUpperCase()}_Report.pdf`);
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
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                  <li>• <strong>Psychometric:</strong> High ≥17.5, Low &lt;17.5</li>
                  <li>• <strong>Aptitude:</strong> High ≥77%, Moderate 24-76%, Low &lt;24%</li>
                  <li>• <strong>AQ Score:</strong> High ≥178, Mod High ≥161, Moderate ≥135, Mod Low ≥118, Low &lt;118</li>
                  <li>• <strong>SEI:</strong> High ≥8, Moderate 5-7, Low &lt;5 (normalized)</li>
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