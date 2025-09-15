import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Brain, Heart, Target, Users, ArrowLeft, Download, Share2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { calculateDetailedAssessmentResult } from '../../../../utils/utils/assessmentCalculation';
import { calculateRiasecWithTiebreaker, applyTiebreakerResults } from '../../../../utils/utils/riasecTiebreaker';
import { RiasecTiebreaker } from './RiasecTiebreaker';
import { BarChart3, PieChart } from 'lucide-react';

interface ResultsPageProps {
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

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  sub_section: {
    name: string;
    section: {
      name: string;
    };
  };
  options: Array<{
    id: string;
    option_text: string;
    marks: number;
  }>;
}

export const ResultsPage = ({ attemptId, onBack }: ResultsPageProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<ExamResponse[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<any>(null);
  const [showTiebreaker, setShowTiebreaker] = useState(false);
  const [riasecResult, setRiasecResult] = useState<any>(null);
  const [subSectionStats, setSubSectionStats] = useState<any>(null);

  useEffect(() => {
    if (user && attemptId) {
      fetchResultsData();
    }
  }, [user, attemptId]);

  const fetchResultsData = async () => {
    if (!supabase || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch user responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('exam_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_attempt_id', attemptId)
        .order('answered_at');

      if (responsesError) throw responsesError;

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

      if (questionsError) throw questionsError;

      // Transform questions data
      const transformedQuestions = questionsData?.map(q => ({
        ...q,
        sub_section: {
          ...q.sub_sections_vo,
          section: q.sub_sections_vo?.sections_vo || null
        },
        options: q.options_vo || []
      })).filter(q => q.sub_section) as Question[];

      setResponses(responsesData || []);
      setQuestions(transformedQuestions || []);

      if (responsesData && transformedQuestions) {
        await calculateResults(responsesData, transformedQuestions);
      }

      // Calculate sub-section wise statistics
      if (responsesData && transformedQuestions) {
        calculateSubSectionStats(responsesData, transformedQuestions);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubSectionStats = (responses: ExamResponse[], questions: Question[]) => {
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
      const subSectionId = question.sub_section?.name || 'Unknown';
      const sectionName = question.sub_section?.section?.name || 'Unknown';
      
      if (!stats[subSectionId]) {
        stats[subSectionId] = {
          subSectionName: subSectionId,
          sectionName: sectionName,
          totalQuestions: 0,
          answeredQuestions: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          percentage: 0,
          questionType: question.question_type
        };
      }
      
      stats[subSectionId].totalQuestions++;
      
      // Calculate max marks for this question
      const maxMarks = Math.max(...question.options.map(opt => opt.marks || 0));
      stats[subSectionId].totalMarks += maxMarks;
    });

    // Add response data
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.question_id);
      if (question) {
        const subSectionId = question.sub_section?.name || 'Unknown';
        if (stats[subSectionId]) {
          stats[subSectionId].answeredQuestions++;
          stats[subSectionId].obtainedMarks += response.option_marks || 0;
        }
      }
    });

    // Calculate percentages
    Object.values(stats).forEach(stat => {
      stat.percentage = stat.totalMarks > 0 ? (stat.obtainedMarks / stat.totalMarks) * 100 : 0;
    });

    setSubSectionStats(stats);
  };

  const calculateResults = async (responses: ExamResponse[], questions: Question[]) => {
    try {
      // Transform responses to match the scoring function format
      const submissions = responses.map(response => ({
        questionId: response.question_id,
        selectedOptionId: response.selected_option_id
      }));

      // Transform questions to match the scoring function format
      const scoringQuestions = questions.map(question => {
        // Validate question structure
        if (!question.sub_section || !question.sub_section.section) {
          console.warn('Question missing sub_section or section data:', question.id);
          return null;
        }
        
        // Determine question type based on section
        let questionType = 'aptitude'; 
        let category = 'general';
        const sectionName = question.sub_section?.section?.name?.toLowerCase();
        const subSectionName = question.sub_section?.name?.toLowerCase();

        console.log('Processing question:', {
          id: question.id,
          sectionName,
          subSectionName,
          questionText: question.question_text?.substring(0, 50)
        });
        if (sectionName === 'behavioural') {
          if (subSectionName?.includes('leadership') || subSectionName?.includes('teamwork') || 
              subSectionName?.includes('communication') || subSectionName?.includes('problem solving') || 
              subSectionName?.includes('adaptability')) {
            questionType = 'psychometric';
            category = subSectionName.replace(/\s+/g, ' ').trim();
          } else if (subSectionName?.includes('time management')) {
            questionType = 'adversity';
            category = 'time management';
          } else if (subSectionName?.includes('emotional') || subSectionName?.includes('social')) {
            questionType = 'sei';
            category = 'emotional intelligence';
          } else if (subSectionName?.includes('interest') || subSectionName?.includes('preference')) {
            questionType = 'interests_and_preferences';
            category = subSectionName.replace(/\s+/g, ' ').trim();
          } else {
            // Default behavioral questions to psychometric
            questionType = 'psychometric';
            category = subSectionName || 'general';
          }
        } else if (sectionName === 'aptitude') {
          questionType = 'aptitude';
          category = subSectionName?.replace(/\s+/g, ' ').trim() || 'general';
        }

        console.log('Question mapped to:', { questionType, category });
        return {
          id: question.id,
          tags: {
            question_type: questionType,
            category: category
          },
          options: (question.options || []).map(opt => ({
            id: opt.id,
            optionText: opt.option_text,
            marks: opt.marks
          })),
          correctOption: question.options.find(opt => opt.marks > 0)?.id,
          marks: question.marks || 1
        };
      }).filter(q => q !== null); // Remove invalid questions

      console.log('Total scoring questions created:', scoringQuestions.length);
      console.log('Question types distribution:', 
        scoringQuestions.reduce((acc, q) => {
          acc[q.tags.question_type] = (acc[q.tags.question_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
      // Calculate assessment results
      const assessmentResults = calculateDetailedAssessmentResult(submissions, scoringQuestions, 2);
      console.log('Assessment results calculated:', assessmentResults);
      setResults(assessmentResults);

      // Extract RIASEC scores from assessment results
      const riasecScores = assessmentResults.interestAndPreferenceScore.categoryWiseScore;
      const riasecScoreValues = Object.fromEntries(
        Object.entries(riasecScores).map(([key, value]) => [key, value.categoryScore])
      );
      
      // Validate we have valid questions and submissions
      if (scoringQuestions.length === 0) {
        throw new Error('No valid questions found for scoring');
      }
      
      if (submissions.length === 0) {
        throw new Error('No valid submissions found for scoring');
      }
      
      // Calculate RIASEC with tiebreaker detection
      const riasecResult = calculateRiasecWithTiebreaker(riasecScoreValues);
      setRiasecResult(riasecScores);

      // Check if we need tiebreaker
      if (riasecResult.needsTiebreaker) {
        // Check if tiebreaker already completed
        const { data: existingTiebreaker } = await supabase
          ?.from('riasec_tiebreaker_attempts')
          .select('*')
          .eq('exam_attempt_id', attemptId)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .maybeSingle();

        if (!existingTiebreaker) {
          setShowTiebreaker(true);
        } else {
          // Use tiebreaker results
          const finalTop3 = existingTiebreaker.final_top3;
          const updatedResult = applyTiebreakerResults(riasecResult, []);
          updatedResult.top3 = finalTop3;
          updatedResult.top3Letters = finalTop3.map((cat: string) => 
            CATEGORY_LETTERS[cat] || cat.charAt(0).toUpperCase()
          );
          setRiasecResult(updatedResult);
        }
      } else {
        setRiasecResult(riasecResult);
      }

    } catch (err) {
      console.error('Error calculating results:', err);
      setError('Failed to calculate results');
    }
  };

  const handleTiebreakerComplete = (finalTop3: string[]) => {
    if (riasecResult) {
      const updatedResult = applyTiebreakerResults(riasecResult, []);
      updatedResult.top3 = finalTop3;
      updatedResult.top3Letters = finalTop3.map(cat => 
        CATEGORY_LETTERS[cat] || cat.charAt(0).toUpperCase()
      );
      setRiasecResult(updatedResult);
    }
    setShowTiebreaker(false);
  };

  // Add CATEGORY_LETTERS constant
  const CATEGORY_LETTERS: Record<string, string> = {
    realistic: 'R',
    investigative: 'I',
    artistic: 'A',
    social: 'S',
    enterprising: 'E',
    conventional: 'C'
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'psychometric': return Brain;
      case 'aptitude': return TrendingUp;
      case 'adversity': return Target;
      case 'sei': return Heart;
      case 'interests': return Users;
      default: return Trophy;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'psychometric': return 'blue';
      case 'aptitude': return 'green';
      case 'adversity': return 'red';
      case 'sei': return 'purple';
      case 'interests': return 'orange';
      default: return 'gray';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'moderate': case 'moderately high': case 'moderately low': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Show tiebreaker if needed
  if (showTiebreaker && riasecResult) {
    return (
      <RiasecTiebreaker
        examAttemptId={attemptId}
        tiedCategories={riasecResult.tiedCategories}
        currentTop3={riasecResult.top3}
        onComplete={handleTiebreakerComplete}
        onBack={() => setShowTiebreaker(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <Trophy className="h-12 w-12 mx-auto" />
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
              Back to Dashboard
            </button>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
            <p className="text-lg text-gray-600">
              Comprehensive analysis of your aptitude and behavioral assessment
            </p>
            <div className="mt-4 flex justify-center space-x-8 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Responses:</span> {responses.length}
              </div>
              <div>
                <span className="font-medium">Completed:</span> {new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Version:</span> {results?.student || 2}
              </div>
            </div>
          </div>
        </div>

        {/* Results Sections */}
        {results && (
          <div className="space-y-8">
            {/* Sub-section Performance */}
            {subSectionStats && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <BarChart3 className="h-8 w-8 text-indigo-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Sub-section Performance</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aptitude Sub-sections */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      Aptitude Sub-sections
                    </h3>
                    <div className="space-y-3">
                      {Object.values(subSectionStats)
                        .filter((stat: any) => stat.sectionName.toLowerCase() === 'aptitude')
                        .map((stat: any) => (
                          <div key={stat.subSectionName} className="bg-green-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-green-900">{stat.subSectionName}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                stat.percentage >= 70 ? 'bg-green-100 text-green-800' :
                                stat.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {stat.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm text-green-700">
                              <div>
                                <span className="font-medium">Questions:</span> {stat.answeredQuestions}/{stat.totalQuestions}
                              </div>
                              <div>
                                <span className="font-medium">Score:</span> {stat.obtainedMarks}/{stat.totalMarks}
                              </div>
                              <div>
                                <span className="font-medium">Type:</span> {stat.questionType}
                              </div>
                            </div>
                            <div className="mt-2 w-full bg-green-200 rounded-full h-2">
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
                    <div className="space-y-3">
                      {Object.values(subSectionStats)
                        .filter((stat: any) => stat.sectionName.toLowerCase() === 'behavioural')
                        .map((stat: any) => (
                          <div key={stat.subSectionName} className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-purple-900">{stat.subSectionName}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                stat.percentage >= 70 ? 'bg-green-100 text-green-800' :
                                stat.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {stat.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm text-purple-700">
                              <div>
                                <span className="font-medium">Questions:</span> {stat.answeredQuestions}/{stat.totalQuestions}
                              </div>
                              <div>
                                <span className="font-medium">Score:</span> {stat.obtainedMarks}/{stat.totalMarks}
                              </div>
                              <div>
                                <span className="font-medium">Type:</span> {stat.questionType}
                              </div>
                            </div>
                            <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
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

            {/* Psychometric Results */}
            {results.detailedPsychometricScore && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Brain className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Psychometric Assessment</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(results.detailedPsychometricScore.categoryWiseScore).map(([category, data]: [string, any]) => (
                    <div key={category} className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3 capitalize">
                        {data.categoryDisplayText}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Score:</span>
                          <span className="font-medium">{data.categoryScore}/25</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Percentage:</span>
                          <span className="font-medium">{data.categoryPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Level:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(data.categoryScoreLevel)}`}>
                            {data.categoryScoreLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aptitude Results */}
            {results.aptitudeScore && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Aptitude Assessment</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(results.aptitudeScore.categoryWiseScore).map(([category, data]: [string, any]) => (
                    <div key={category} className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900 mb-3 capitalize">
                        {data.categoryDisplayText}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-700">Score:</span>
                          <span className="font-medium">{data.categoryScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Percentage:</span>
                          <span className="font-medium">{data.categoryPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Level:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(data.categoryScoreLevel)}`}>
                            {data.categoryScoreLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adversity Results */}
            {results.adversityScore && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Adversity Quotient</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-red-50 p-6 rounded-lg text-center">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Overall AQ Score</h3>
                      <div className="text-3xl font-bold text-red-600 mb-2">{results.adversityScore.aqScore}</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(results.adversityScore.aqLevel)}`}>
                        {results.adversityScore.aqLevel}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(results.adversityScore.categoryWiseScore).map(([category, data]: [string, any]) => (
                      <div key={category} className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-900 mb-2 capitalize">
                          {data.categoryDisplayText}
                        </h4>
                        <div className="text-2xl font-bold text-red-600">{data.categoryScore}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEI Results */}
            {results.seiScore && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Socio-Emotional Intelligence</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(results.seiScore.categoryWiseScore).map(([category, data]: [string, any]) => (
                    <div key={category} className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-900 mb-3 capitalize">
                        {data.categoryDisplayText}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-purple-700">Normalized Score:</span>
                          <span className="font-medium">{data.categoryScore}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Level:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(data.categoryScoreLevel)}`}>
                            {data.categoryScoreLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests Results */}
            {results.interestAndPreferenceScore && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-orange-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Interest & Preferences (RIASEC)</h2>
                </div>
                
                {riasecResult?.needsTiebreaker && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Tiebreaker Required
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>Some categories have the same score. Complete {riasecResult.tiebreakerQuestions?.length || 6} quick questions to determine your top 3 interests.</p>
                          <button
                            onClick={() => setShowTiebreaker(true)}
                            className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium"
                          >
                            Complete Tiebreaker ({riasecResult.tiebreakerQuestions?.length || 6} questions)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="bg-orange-50 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Your Top 3 Interest Areas</h3>
                    <div className="flex justify-center space-x-4">
                      {(riasecResult?.top3Letters || results.interestAndPreferenceScore.top3Letters || []).map((letter: string, index: number) => (
                        <div key={letter} className="bg-orange-200 text-orange-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(results.interestAndPreferenceScore.categoryWiseScore).map(([category, data]: [string, any]) => (
                    <div key={category} className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-orange-900 mb-3 capitalize">
                        {data.categoryDisplayText}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-orange-700">Score:</span>
                          <span className="font-medium">{data.categoryScore}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-700">Letter:</span>
                          <span className="font-medium">{data.categoryLetter}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Mapping */}
            {results.careerMapping && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Career Recommendations</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                      {results.careerMapping.clubToJoin}
                    </h3>
                    <p className="text-yellow-800 font-medium mb-2">{results.careerMapping.tagLine}</p>
                    <p className="text-yellow-700 text-sm">{results.careerMapping.idealFor}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ideal Career Paths:</h4>
                    <p className="text-gray-700">{results.careerMapping.idealCareer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {responses.filter(r => r.section_type === 'aptitude').length}
              </div>
              <div className="text-gray-600">Aptitude Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {responses.filter(r => r.section_type === 'behavioral').length}
              </div>
              <div className="text-gray-600">Behavioral Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results?.careerMapping?.ruleName || 'N/A'}
              </div>
              <div className="text-gray-600">Career Rule Applied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};