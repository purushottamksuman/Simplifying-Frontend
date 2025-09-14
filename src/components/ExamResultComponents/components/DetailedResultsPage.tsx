import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Download, Share2, BarChart3, TrendingUp, Users, Brain, Target, Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { calculateDetailedAssessmentResult } from '../../../../utils/utils/assessmentCalculation';
import type { DetailedAssessmentResult, QuestionSubmission, QuestionData } from '../../../../utils/utils/assessmentCalculation';

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

export const DetailedResultsPage = ({ attemptId, onBack }: DetailedResultsPageProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedResults, setDetailedResults] = useState<DetailedAssessmentResult | null>(null);
  const [subSectionStats, setSubSectionStats] = useState<any>(null);

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
            <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Response Format</h1>
            <p className="text-lg text-gray-600">
              Complete assessment results in JSON format
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