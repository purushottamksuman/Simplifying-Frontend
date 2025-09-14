import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Trophy, FileText, CheckCircle, XCircle, Target } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { DetailedResultsPage } from './DetailedResultsPage';

interface ExamReviewPageProps {
  attemptId: string;
  onBack: () => void;
}

interface ExamAttempt {
  attempt_id: string;
  start_time: string;
  end_time: string;
  status: string;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  time_taken: number;
}

interface QuestionResponse {
  id: string;
  question_id: string;
  question_text: string;
  selected_option_id: string;
  selected_option_text: string;
  option_marks: number;
  section_type: string;
  answered_at: string;
  question_marks: number;
  correct_answer?: string;
  is_correct?: boolean;
}

export const ExamReviewPage = ({ attemptId, onBack }: ExamReviewPageProps) => {
  const { user } = useAuth();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'all' | 'aptitude' | 'behavioral'>('all');

  useEffect(() => {
    if (user && supabase) {
      fetchExamDetails();
    }
  }, [user, attemptId]);

  const fetchExamDetails = async () => {
    if (!supabase || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch exam attempt details
      const { data: attemptData, error: attemptError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('attempt_id', attemptId)
        .eq('user_id', user.id)
        .single();

      if (attemptError) throw attemptError;
      setAttempt(attemptData);

      // Fetch all responses for this attempt
      const { data: responsesData, error: responsesError } = await supabase
        .from('exam_responses')
        .select(`
          *,
          questions_vo (
            question_text,
            marks,
            options_vo (
              id,
              option_text,
              marks
            )
          )
        `)
        .eq('exam_attempt_id', attemptId)
        .eq('user_id', user.id)
        .order('answered_at');

      if (responsesError) throw responsesError;

      // Process responses to include question details and correctness
      const processedResponses = responsesData?.map(response => {
        const question = response.questions_vo;
        const allOptions = question?.options_vo || [];
        const selectedOption = allOptions.find(opt => opt.id === response.selected_option_id);
        const correctOption = allOptions.find(opt => opt.marks > 0);
        
        return {
          id: response.id,
          question_id: response.question_id,
          question_text: question?.question_text || 'Question not found',
          selected_option_id: response.selected_option_id,
          selected_option_text: response.selected_option_text,
          option_marks: response.option_marks,
          section_type: response.section_type,
          answered_at: response.answered_at,
          question_marks: question?.marks || 1,
          correct_answer: correctOption?.option_text,
          is_correct: response.section_type === 'aptitude' ? (response.option_marks > 0) : undefined
        };
      }) || [];

      setResponses(processedResponses);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exam details');
      console.error('Error fetching exam details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const filteredResponses = responses.filter(response => {
    if (selectedSection === 'all') return true;
    return response.section_type === selectedSection;
  });

  const sectionStats = {
    aptitude: {
      total: responses.filter(r => r.section_type === 'aptitude').length,
      correct: responses.filter(r => r.section_type === 'aptitude' && r.is_correct).length,
      score: responses.filter(r => r.section_type === 'aptitude').reduce((sum, r) => sum + r.option_marks, 0)
    },
    behavioral: {
      total: responses.filter(r => r.section_type === 'behavioral').length,
      score: responses.filter(r => r.section_type === 'behavioral').reduce((sum, r) => sum + r.option_marks, 0),
      maxScore: responses.filter(r => r.section_type === 'behavioral').length * 5
    }
  };

  // Show detailed results page if requested
  if (showDetailedResults) {
    return <DetailedResultsPage attemptId={attemptId} onBack={() => setShowDetailedResults(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Exam</h2>
          <p className="text-gray-600 mb-4">{error || 'Exam not found'}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Exam Review</h1>
                <p className="text-sm text-gray-600">Attempt ID: {attemptId}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{attempt.percentage}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Final Score</p>
                <p className="text-2xl font-bold text-gray-900">{attempt.total_score}/{attempt.max_possible_score}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Taken</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(attempt.time_taken)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sectionStats.aptitude.total > 0 
                    ? Math.round((sectionStats.aptitude.correct / sectionStats.aptitude.total) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aptitude Section</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Answered:</span>
                <span className="font-medium">{sectionStats.aptitude.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-medium text-green-600">{sectionStats.aptitude.correct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{sectionStats.aptitude.score}/{sectionStats.aptitude.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">
                  {sectionStats.aptitude.total > 0 
                    ? Math.round((sectionStats.aptitude.correct / sectionStats.aptitude.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Section</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Answered:</span>
                <span className="font-medium">{sectionStats.behavioral.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Score:</span>
                <span className="font-medium">{sectionStats.behavioral.score}/{sectionStats.behavioral.maxScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Response:</span>
                <span className="font-medium">
                  {sectionStats.behavioral.total > 0 
                    ? (sectionStats.behavioral.score / sectionStats.behavioral.total).toFixed(1)
                    : 0}/5
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion:</span>
                <span className="font-medium">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question-wise Review */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Question-wise Review</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedSection('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSection === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({responses.length})
                </button>
                <button
                  onClick={() => setSelectedSection('aptitude')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSection === 'aptitude' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Aptitude ({sectionStats.aptitude.total})
                </button>
                <button
                  onClick={() => setSelectedSection('behavioral')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSection === 'behavioral' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Behavioral ({sectionStats.behavioral.total})
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredResponses.map((response, index) => (
              <div key={response.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Q{index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        response.section_type === 'aptitude' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {response.section_type}
                      </span>
                      {response.is_correct !== undefined && (
                        <span className={`flex items-center text-xs ${
                          response.is_correct ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {response.is_correct ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {response.is_correct ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {response.question_text}
                    </h4>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-blue-600">
                      {response.option_marks}
                      {response.section_type === 'aptitude' ? '/1' : '/5'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                  <p className="font-medium text-gray-900">{response.selected_option_text}</p>
                  
                  {response.correct_answer && response.section_type === 'aptitude' && !response.is_correct && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                      <p className="font-medium text-green-600">{response.correct_answer}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Started At:</p>
              <p className="font-medium">{formatDate(attempt.start_time)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed At:</p>
              <p className="font-medium">{formatDate(attempt.end_time)}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowDetailedResults(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mr-4"
            >
              View Detailed Analysis
            </button>
            <button
              onClick={() => {
                // Navigate to API response format page
                window.open(`/detailed-results/${attemptId}`, '_blank');
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              View API Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};