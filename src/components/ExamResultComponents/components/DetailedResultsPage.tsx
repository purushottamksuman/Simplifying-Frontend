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

  
  function getInterpretation(categoryName: string, categoryPercentage: number): { level: string, text: string } {
    switch (categoryName.toLowerCase()) {
      case "verbal":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You have a natural strength in understanding and expressing ideas clearly. You can easily make sense of what you read or hear and explain it in a way that makes sense to others. This skill helps you in school, teamwork, and even leadership roles. Whether you’re sharing your thoughts, debating, or telling stories, you have a gift for making things interesting and easy to understand. This ability will help you in careers where you need to persuade, teach, or create content. Continuing to read, discuss ideas, and practice creative writing will make you even stronger in this area!"
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You have a good understanding of language and logical thinking. You can communicate well but may sometimes need a little more time or practice to make your points clearer and more convincing. With some focused effort—like reading more books, expanding your vocabulary, and practicing speaking or writing—you can sharpen these skills even more. You already do well in group discussions and teamwork, and with a little encouragement, you can become even more confident in speaking and thinking. Simple activities like family discussions, storytelling, or debating fun topics can help you grow in this area!"
          };
        } else {
          return {
            level: "Low",
            text: "You might sometimes find it tricky to express your thoughts clearly or understand complex information, but you know this is just an opportunity for growth! With practice, you can build your confidence in reading, writing, and speaking. Encouraging you to read engaging books, have daily conversations, and play word games can make a big difference. You learn at your own pace, and with the right support, you can develop strong communication skills over time. The key is to make learning fun and stress-free—celebrating small improvements will help you feel more confident in expressing your ideas!"
          };
        }

      case "speedandaccuracy":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You have a great ability to notice details quickly and accurately. You can process information fast and spot mistakes easily. This means you can handle tasks efficiently, make quick decisions, and work well under pressure. These skills are useful in careers that require accuracy, such as science, engineering, designing, or even gaming and coding. Your sharp eye for detail makes you an excellent problem solver, and you will likely enjoy activities that challenge your observation skills. You should explore puzzles, coding games, or even organizing tasks to make the most of your abilities!"
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You are quite good at paying attention to details and work at a steady pace. You can manage tasks that require accuracy but might take a little more time with complex or fast-moving tasks. With practice, you can improve your speed while maintaining accuracy. Doing fun brain games, memory challenges, or hands-on activities can help you build confidence. You have the potential to do well in roles that require a balance between speed and precision, such as organizing projects, managing events, or planning activities. With a little support, you can sharpen your focus and grow these skills further!"
          };
        } else {
          return {
            level: "Low",
            text: "You may take a little longer to process information and might sometimes miss small details, but you know this is something you can improve with regular practice! You can develop your attention skills through fun activities like spotting differences in pictures, playing memory games, or doing simple logic puzzles. With encouragement and patience, you can strengthen your ability to notice details and work more efficiently. These skills will help you in problem-solving and creative fields where thinking carefully is just as important as thinking quickly. The key is to build your confidence and make learning fun!"
          };
        }

      case "languageusageandgrammar":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You have a strong ability to express your thoughts and ideas clearly! Whether in writing or speaking, you can explain things well. This skill is a great asset in many careers, especially in fields like teaching, law, media, and leadership roles. Strong language skills also help you with writing essays, giving presentations, and even debating confidently. Continuing to read, write, and engage in discussions will further sharpen this talent. Your ability to communicate effectively will help you succeed in academics and beyond!"
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You have a good grasp of language and can communicate well in most situations. Sometimes, you might struggle with complex words or sentence structures, but with a little more practice, you can improve significantly. Simple activities like reading books, writing short stories, or having discussions at home can boost your confidence. Strengthening your language skills will help you in careers like marketing, customer relations, and corporate communication, where clear and precise language is important. With regular practice, you can become even better at expressing your thoughts!"
          };
        } else {
          return {
            level: "Low",
            text: "You might find it challenging to express your ideas clearly in writing or speaking, but the good news is that language skills can always improve with practice! Encouraging you to read, write short paragraphs, and participate in conversations will make a big difference. Small steps, like learning new words daily and practicing sentence formation, will help you gain confidence. Good communication is useful in all professions, from sales and administration to customer service and leadership roles. With support and regular practice, you can become a clear and confident communicator!"
          };
        }

      case "numerical":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You have a strong ability to work with numbers and make sense of data. You can quickly understand charts, graphs, and patterns, making you great at problem-solving and logical thinking. These skills are especially useful in areas like finance, science, technology, and business. A strong numerical ability helps you in everyday life too—like managing money, planning expenses, and making smart decisions based on facts. This skill will give you an advantage in many careers and help you think critically about the world around you. Keep challenging yourself with puzzles, logic games, and real-world math activities to keep sharpening your skills!"
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You have a good understanding of numbers and can handle basic math problems confidently. You may need a little extra practice with more complex number patterns and data analysis. The good news is that numerical skills can be improved with regular exposure to problem-solving activities, real-world applications (like calculating discounts or understanding statistics in sports), and fun exercises. Building confidence in this area can open doors to many exciting career options in business, technology, research, and management. Practice with games, real-life scenarios, and interactive learning to strengthen your skills further!"
          };
        } else {
          return {
            level: "Low",
            text: "You may find working with numbers a bit challenging, but that’s completely okay—this is a skill that you can develop over time! You may need extra support in understanding math concepts, interpreting data, or solving numerical problems. The key is to make learning fun and practical. Simple activities like playing number-based games, involving yourself in grocery budgeting, or using creative learning tools can make a big difference. With regular practice and the right approach, your confidence in numbers will grow, helping you in future careers that involve problem-solving and logical thinking. Encouragement and a positive mindset can make all the difference!"
          };
        }

      case "abstract":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You have a natural talent for thinking through problems and spotting patterns. You can easily analyze things from different perspectives and solve tricky problems with ease. Your ability to think creatively and adapt quickly will help you in fields that require innovative solutions, such as technology, engineering, design, and research. People with high abstract reasoning skills are known for being able to think outside the box and make smart decisions. Continue exploring challenges that allow you to use these skills—it will help you further develop your strengths and make a big impact in your future career!"
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You’re good at logical thinking and problem-solving, but you might find more complex situations a little tricky. However, you’re well on your way to improving! With more practice, you’ll get better at recognizing patterns and thinking creatively. These skills are valuable in fields like business, architecture, software development, and data science. Simple things like solving puzzles, tackling everyday challenges, or engaging in creative exercises will help strengthen your abilities. With consistent effort, you’ll develop a sharp mind capable of tackling even the toughest problems in any career you choose."
          };
        } else {
          return {
            level: "Low",
            text: "It’s okay if you struggle with abstract reasoning or finding patterns—it’s a skill that you can improve with time and practice. The key here is patience and consistent effort. You can try fun activities like puzzles, creative thinking exercises, or exploring new concepts that require abstract thought. These activities will help you improve your skills in recognizing patterns and solving problems. With continued practice, you can open doors to many careers that rely on analytical thinking and problem-solving, including in fields like science, technology, and even business. With time, you can definitely improve and excel!"
          };
        }

      case "mechanical":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You have a strong ability to understand how machines, tools, and systems work. You can easily visualize how different parts of a machine fit together and understand the principles behind forces and motion. This skill helps you solve complex mechanical problems. With this ability, you could excel in fields like engineering, construction, automotive, or manufacturing. You might enjoy designing, repairing, or improving mechanical systems, which is an excellent foundation for hands-on, technical careers."
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You have a solid understanding of how mechanical systems work, but you might need more practice to fully grasp the concepts. You can apply logic to solve mechanical problems, but you may need extra experience to feel confident. With time and continued practice, you can improve your understanding of how different systems function and work more effectively with machinery. This ability is important for careers in engineering or manufacturing, and with focus, you’ll become more comfortable with these systems and tasks."
          };
        } else {
          return {
            level: "Low",
            text: "You might find it challenging to understand how machines or tools function and may need extra support to grasp these concepts. While this can seem difficult at first, it’s completely normal and can be improved with practice. By working on this skill through hands-on learning, guided activities, and understanding how parts fit together and interact, you can develop the ability to solve mechanical problems more effectively. Over time, you’ll grow more comfortable with mechanical systems and even pursue careers in engineering or other technical fields."
          };
        }

      case "spacerelations":
        if (categoryPercentage >= 77) {
          return {
            level: "High",
            text: "You are excellent at thinking in 3D and can easily visualize how objects fit together or move in space. You can mentally manipulate shapes and objects, which is especially useful in careers like architecture, engineering, design, or aviation. This skill helps you understand technical drawings, blueprints, and maps with ease. You’re also good at hands-on tasks like building or taking apart complex objects. This ability is a significant advantage in fields that require creativity and technical expertise, allowing you to thrive in careers that demand spatial awareness and problem-solving skills."
          };
        } else if (categoryPercentage >= 24) {
          return {
            level: "Moderate",
            text: "You have a solid understanding of space and how objects relate to each other, but you may struggle with more complex spatial tasks. You are on the right track, but you may need more practice visualizing 3D objects and their relationships. With more experience, such as working with 3D models or solving spatial puzzles, you can sharpen this skill. Over time, this will help you in fields like design, engineering, or architecture, where spatial awareness plays a key role. With consistent practice, your skills will continue to improve."
          };
        } else {
          return {
            level: "Low",
            text: "You might find it challenging to understand how objects fit together in space or how they move relative to one another. This skill can be developed through activities like solving puzzles, working with 3D models, or engaging in hands-on tasks. While it may be a bit more difficult to grasp at first, consistent practice and exposure will help you improve. With time, you can enhance these skills and pursue exciting careers in creative and technical fields like architecture, engineering, or design."
          };
        }

      default:
        return { level: "Unknown", text: "No interpretation available for this category." };
    }
  }


  function buildAptitudeHtml(aptitudeScore: any): string {
    const categories = Object.values(aptitudeScore.categoryWiseScore);

    const bullets = categories.map((cat: any) => {
      const { level, text } = getInterpretation(cat.categoryName, cat.categoryPercentage);
      return `
        <li>
          <strong>You have scored ${cat.categoryPercentage}% in ${cat.categoryDisplayText} which is a ${level} score</strong>
          <p>${text}</p>
        </li>
      `;
    }).join("");

    return `
      <div class="report-container">
        <style>
          .report-container {
            max-width: 800px;
            margin: 20px auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            border: 2px solid #1E3A8A; /* dark blue border like screenshot */
            padding: 20px;
            border-radius: 8px;
            background-color: #fff;
          }

          .report-container h2 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #1E3A8A; /* dark blue heading */
            text-align: left;
          }

          .score-list {
            list-style-type: disc;
            padding-left: 25px;
          }

          .score-list li {
            margin-bottom: 20px;
            color: #333;
          }

          .score-list strong {
            display: block;
            margin-bottom: 8px;
            color: #111;
            font-size: 16px;
          }

          .score-list p {
            margin: 0;
            color: #555;
            font-size: 14px;
          }

          /* Optional: speech bubble for heading */
          .report-container h2::before {
            content: " ";
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #1E3A8A;
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle;
          }
        </style>
        <h2>What it means</h2>
        <ul class="score-list">
          ${bullets}
        </ul>
      </div>
    `;
  }





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
      '{{detailedReport.adversityScore.resultInterpretation}}': String(detailedResults.adversityScore?.resultInterpretation ?? ''),
      // Career mapping placeholders (if present in templates)
      '{{careerMapping.clubToJoin}}': String(detailedResults.careerMapping?.clubToJoin ?? ''),
      '{{careerMapping.tagLine}}': String(detailedResults.careerMapping?.tagLine ?? ''),
      '{{careerMapping.topLine}}': String(detailedResults.careerMapping?.topLine ?? ''),
      '{{careerMapping.idealCareer}}': String(detailedResults.careerMapping?.idealCareer ?? ''),
      '{{careerMapping.idealFor}}': String(detailedResults.careerMapping?.idealFor ?? ''),
    };

    // Top Aptitude (first three)
    for (let i = 0; i < 3; i++) {
      const item = aptiCategoryWiseScores[i]?.scoreObject;
      if (item) {
        replacements[`{{aptiCategoryWiseScores[${i}].scoreObject.categoryDisplayText}}`] = String(item.categoryDisplayText ?? '');
        replacements[`{{aptiCategoryWiseScores[${i}].scoreObject.categoryPercentage}}`] = String(item.categoryPercentage ?? '');
      }
    }

    // Single token used on page 15 header
    const topAptiCategoryWiseScoresDisplay = aptiCategoryWiseScores.slice(0, 3)
      .map((e: any) => e?.scoreObject?.categoryDisplayText)
      .filter(Boolean)
      .join(',');
    replacements['{{topAptiCategoryWiseScoresDisplay}}'] = topAptiCategoryWiseScoresDisplay;

    // Top Interests (first three names)
    for (let i = 0; i < 3; i++) {
      const item = interestAndPreferenceScore[i]?.scoreObject;
      if (item) {
        replacements[`{{interestAndPreferenceScore[${i}].scoreObject.categoryDisplayText}}`] = String(item.categoryDisplayText ?? '');
        replacements[`{{interestAndPreferenceScore[${i}].scoreObject.categoryLetter}}`] = String(item.categoryLetter ?? '');
      }
    }

    // SEI (four scores)
    for (let i = 0; i < 4; i++) {
      const item = seiScore[i]?.scoreObject;
      if (item) {
        replacements[`{{seiScore[${i}].scoreObject.categoryDisplayText}}`] = String(item.categoryDisplayText ?? '');
        replacements[`{{seiScore[${i}].scoreObject.categoryScore}}`] = String(item.categoryScore ?? '');
        replacements[`{{seiScore[${i}].scoreObject.categoryScoreLevel}}`] = String(item.categoryScoreLevel ?? '');
      }
    }

    // Adversity (aqScore array placeholders)
    const adversityCategoriesOrdered = ['control', 'ownership', 'reach', 'endurance'] as const;
    const aqScore = adversityCategoriesOrdered.map((key) => {
      const obj = detailedResults.adversityScore.categoryWiseScore?.[key] || { categoryScore: 0, categoryScoreLevel: '' };
      return { scoreObject: obj };
    });
    for (let i = 0; i < aqScore.length; i++) {
      replacements[`{{aqScore[${i}].scoreObject.categoryScore}}`] = String(aqScore[i].scoreObject.categoryScore ?? '');
      replacements[`{{aqScore[${i}].scoreObject.categoryScoreLevel}}`] = String(aqScore[i].scoreObject.categoryScoreLevel ?? '');
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

      // Expand aptitude interpretation loop (@for ...)
      const aptiLoopMatch = out.match(/@for \(item of aptiCategoryWiseScores[\s\S]*?\{([\s\S]*?)\}/);
      if (aptiLoopMatch) {
        const listHtml = aptiCategoryWiseScores.map((entry: any) => {
          const so = entry.scoreObject;
          return `<ul><li><span style="font-family:Lora,Lora_MSFontService,sans-serif; font-weight: 600;">You have scored ${so.categoryPercentage} in ${so.categoryDisplayText} which is a ${so.categoryScoreLevel} score</span><p>${so.categoryInterpretation ?? ''}</p></li></ul>`;
        }).join('');
        out = out.replace(/@for \(item of aptiCategoryWiseScores[\s\S]*?\{[\s\S]*?\}/, listHtml);
      }

      // Expand SEI list (*ngFor over seiScore)
      out = out.replace(/<li\s+\*ngFor="let item of seiScore;[\s\S]*?<\/li>/g, () => {
        return seiScore.map((entry: any) => {
          const so = entry.scoreObject;
          return `<li><span style="font-family:Lora,Lora_MSFontService,sans-serif; font-weight: 600;">${so.categoryScoreLevel} score in ${so.categoryDisplayText}</span><p>${so.categoryInterpretation ?? ''}</p></li>`;
        }).join('');
      });

      // Replace interest top-3 *ngFor block
      out = out.replace(/<li\s+\*ngFor="let item of interestAndPreferenceScore\.slice\(0,3\);[\s\S]*?<\/li>/g,
        () => {
          const items = interestAndPreferenceScore.slice(0, 3).map((entry: any) => {
            const so = entry.scoreObject;
            return `<li><span style=\"font-family:Lora,Lora_MSFontService,sans-serif; font-weight: 600;\">${so.categoryLetter} - ${so.categoryDisplayText}</span><p>${so.categoryInterpretation ?? ''}</p></li>`;
          }).join('');
          return items;
        });

      // Inject aptitude "Your Score" dynamic bar graph for page 5 if absolute-text is empty
      if (/<text[^>]*>Your Score<\/text>[\s\S]*?Spelling:/i.test(out) && /<div class="absolute-text">\s*<\/div>/.test(out)) {
        const maxPct = Math.max(1, ...aptiCategoryWiseScores.map((e: any) => Number(e.scoreObject.categoryPercentage) || 0));
        const colors = ['#22D3EE','#34AFC5','#1F76A8','#2F5B8F','#343C6E','#5A3B63','#7A4A63'];
        const graph = `
          <style>
            .apti-graph{font-family:Arial, sans-serif; max-width:640px;}
            .apti-row{display:flex; align-items:center; gap:12px; margin:8px 0;}
            .apti-label{width:200px; color:#1F2937; font-size:12px}
            .apti-bar-wrap{flex:1; background:#E5E7EB; height:18px; border-radius:4px; overflow:hidden}
            .apti-bar{height:100%; border-radius:4px}
            .apti-pct{width:60px; text-align:right; font-size:12px; color:#111827}
          </style>
          <div class="apti-graph">
            ${aptiCategoryWiseScores.map((e: any, idx: number) => {
              const pct = Math.max(0, Math.min(100, Number(e.scoreObject.categoryPercentage) || 0));
              const width = (pct / maxPct) * 100;
              const color = colors[idx % colors.length];
              const label = e.scoreObject.categoryDisplayText || e.category;
              return `<div class=\"apti-row\"><div class=\"apti-label\">${label}</div><div class=\"apti-bar-wrap\"><div class=\"apti-bar\" style=\"width:${width}%;background:${color}\"></div></div><div class=\"apti-pct\">${pct.toFixed(2)}%</div></div>`;
            }).join('')}
          </div>`;
        out = out.replace(/<div class="absolute-text">\s*<\/div>/, `<div class="absolute-text">${graph}</div>`);
      }

      // Inject psychometric "Your Score" summary for page 13 if absolute-text is empty
      if (/Psychometric traits/i.test(out) && /<text[^>]*>Your Score<\/text>/.test(out) && /<div class="absolute-text">\s*<\/div>/.test(out)) {
        const psyItems = Object.entries(detailedResults.detailedPsychometricScore.categoryWiseScore)
          .map(([category, so]: any) => ({ category, scoreObject: so }))
          .sort((a: any, b: any) => a.scoreObject.categoryOrder - b.scoreObject.categoryOrder || b.scoreObject.categoryScore - a.scoreObject.categoryScore);
        const summary = `<ul>${psyItems.map((e: any) => `<li><span style="font-family:Lora,Lora_MSFontService,sans-serif; font-weight:600;">${e.scoreObject.categoryDisplayText ?? e.category}</span> - ${e.scoreObject.categoryScore} (${e.scoreObject.categoryScoreLevel})</li>`).join('')}</ul>`;
        out = out.replace(/<div class="absolute-text">\s*<\/div>/, `<div class="absolute-text">${summary}</div>`);
      }

      // Inject career recommendations list if "$CAREER_LIST" token exists
      if (out.includes('$CAREER_LIST') && detailedResults.careerMapping?.idealCareer) {
        const careers = String(detailedResults.careerMapping.idealCareer)
          .split(',')
          .map(c => c.trim())
          .filter(Boolean)
          .map(c => `<li>${c}</li>`) 
          .join('');
        out = out.replace(/\$CAREER_LIST/g, `<ul>${careers}</ul>`);
      }

      // If it's the Career Recommendations page, inject career block even if *ngIf exists
      if (/(Career Recommendation|Career recommendations|Recommended Career Paths|Potential Career Roles)/i.test(out)) {
        const careers = String(detailedResults.careerMapping?.idealCareer || '')
          .split(',')
          .map(c => c.trim())
          .filter(Boolean)
          .map(c => `<li>${c}</li>`) 
          .join('');
        const club = String(detailedResults.careerMapping?.clubToJoin || '');
        const tag = String(detailedResults.careerMapping?.tagLine || '');
        const topLine = String(detailedResults.careerMapping?.topLine || '');
        const idealFor = String(detailedResults.careerMapping?.idealFor || '');
        const careerHtml = `
          <div>
            ${topLine ? `<p style="margin-bottom:8px;">${topLine}</p>` : ''}
            ${club ? `<h3 style="font-weight:700; color:#1f2937;">${club}</h3>` : ''}
            ${tag ? `<p style="color:#4b5563;">${tag}</p>` : ''}
            ${idealFor ? `<p style="margin:8px 0;"><strong>Ideal for:</strong> ${idealFor}</p>` : ''}
            ${careers ? `<h4 style="margin-top:8px;">Recommended Careers</h4><ul>${careers}</ul>` : ''}
          </div>
        `;
        // Replace Angular *ngIf block
        out = out.replace(/<div\s+\*ngIf=\"careerMapping\"\s+class=\"absolute-text\">[\s\S]*?<\/div>/, `<div class=\"absolute-text\">${careerHtml}</div>`);
        // Or fill empty absolute-text
        out = out.replace(/<div class=\"absolute-text\">\s*<\/div>/, `<div class=\"absolute-text\">${careerHtml}</div>`);
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
          let rawHtml: string;

          if(file === "page6/page6.component.html") {
            rawHtml = buildAptitudeHtml(detailedResults.aptitudeScore);
          }
          else {
            const res = await fetch(basePath + file);
            if (!res.ok) continue;
            rawHtml = await res.text();
          }
          const filledHtml = file === "page6/page6.component.html" ? rawHtml : applyReplacements(rawHtml);

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