import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Target, 
  BookOpen, 
  Calendar,
  User,
  Trophy,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  ArrowLeft,
  Play,
  FileText,
  Award,
  Timer,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { supabase } from '../lib/supabase';

interface Exam {
  exam_id: string;
  exam_name: string;
  description: string;
  instructions: string;
  total_time: number;
  maximum_marks: number;
  original_price: number;
  discounted_price: number;
  tax: number;
  min_student_age: number;
  max_student_age: number;
  is_active: boolean;
  created_at: string;
}

interface ExamAttempt {
  attempt_id: string;
  start_time: string;
  end_time: string;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  time_taken: number;
  answers: any[];
  created_at: string;
}

interface Question {
  question_id: string;
  question_text: string;
  question_type: 'MCQ' | 'Subjective';
  marks: number;
  image_url?: string;
  display_order: number;
  options?: QuestionOption[];
}

interface QuestionOption {
  option_id: string;
  option_text: string;
  marks: number;
  image_url?: string;
  is_correct: boolean;
  display_order: number;
}

export const ExamDetailsPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  useEffect(() => {
    if (!examId) {
      navigate('/component/dashboard');
      return;
    }
    
    fetchExamDetails();
  }, [examId, navigate]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/component/login');
        return;
      }

      // Check if user has access to this exam
      const { data: purchase, error: purchaseError } = await supabase
        .from('exam_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_id', examId)
        .single();

      if (purchaseError || !purchase) {
        setError('You do not have access to this exam. Please purchase it first.');
        return;
      }

      setHasAccess(true);

      // Fetch exam details
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('exam_id', examId)
        .single();

      if (examError || !examData) {
        setError('Exam not found.');
        return;
      }

      setExam(examData);

      // Fetch user's attempts for this exam
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('exam_id', examId)
        .order('created_at', { ascending: false });

      if (attemptsError) {
        console.error('Error fetching attempts:', attemptsError);
      } else {
        setAttempts(attemptsData || []);
      }

      // Fetch questions for review
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          question_options (*)
        `)
        .eq('assessment_id', examData.exam_id)
        .eq('is_active', true)
        .order('display_order');

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
      } else {
        const processedQuestions = questionsData?.map(q => ({
          ...q,
          options: q.question_options?.sort((a: any, b: any) => a.display_order - b.display_order) || []
        })) || [];
        setQuestions(processedQuestions);
      }

    } catch (err) {
      console.error('Error fetching exam details:', err);
      setError('Failed to load exam details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startNewAttempt = () => {
    navigate(`/exam/${examId}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'abandoned': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const openReviewDialog = (attempt: ExamAttempt) => {
    setSelectedAttempt(attempt);
    setShowReviewDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/component/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exam) return null;

  const bestAttempt = attempts.filter(a => a.status === 'completed').sort((a, b) => b.percentage - a.percentage)[0];
  const completedAttempts = attempts.filter(a => a.status === 'completed').length;
  const averageScore = completedAttempts > 0 
    ? attempts.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.percentage, 0) / completedAttempts 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/component/dashboard')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{exam.exam_name}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exam Overview */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-[#13377c]">
                  <BookOpen className="w-6 h-6 mr-3 text-[#3479ff]" />
                  Exam Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Duration</p>
                    <p className="text-blue-600">{exam.total_time} minutes</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Total Marks</p>
                    <p className="text-green-600">{exam.maximum_marks}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Age Range</p>
                    <p className="text-purple-600">{exam.min_student_age}-{exam.max_student_age} years</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">Questions</p>
                    <p className="text-orange-600">{questions.length}</p>
                  </div>
                </div>

                {exam.instructions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
                    <div className="text-gray-700 whitespace-pre-line">{exam.instructions}</div>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button 
                    onClick={startNewAttempt}
                    className="bg-[#3479ff] hover:bg-[#2968e6] px-8 py-3 rounded-xl text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {attempts.length > 0 ? 'Reattempt Exam' : 'Start Exam'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exam Attempts */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-[#13377c]">
                  <Trophy className="w-6 h-6 mr-3 text-[#3479ff]" />
                  Your Attempts ({attempts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attempts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No attempts yet</p>
                    <p className="text-gray-400 text-sm">Start your first attempt to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attempts.map((attempt, index) => (
                      <Card key={attempt.attempt_id} className="rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <h3 className="font-bold text-[#13377c] text-lg">
                                  Attempt #{attempts.length - index}
                                </h3>
                                <Badge className={`rounded-full ${getStatusColor(attempt.status)}`}>
                                  {attempt.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                {attempt.status === 'completed' && (
                                  <Badge className={`rounded-full ${getGradeColor(attempt.percentage)}`}>
                                    {attempt.percentage.toFixed(1)}%
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#3479ff]" />
                                  <span className="text-gray-600">{formatDate(attempt.created_at)}</span>
                                </div>
                                {attempt.status === 'completed' && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <Target className="w-4 h-4 text-[#3479ff]" />
                                      <span className="text-gray-600">{attempt.total_score}/{attempt.max_possible_score}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-[#3479ff]" />
                                      <span className="text-gray-600">{formatTime(attempt.time_taken)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Award className="w-4 h-4 text-[#3479ff]" />
                                      <span className={`font-semibold ${getGradeColor(attempt.percentage)}`}>
                                        {attempt.percentage >= 90 ? 'Excellent' : 
                                         attempt.percentage >= 75 ? 'Good' : 
                                         attempt.percentage >= 60 ? 'Average' : 'Needs Improvement'}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {attempt.status === 'completed' && (
                              <Button 
                                variant="outline" 
                                onClick={() => openReviewDialog(attempt)}
                                className="rounded-lg"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#13377c]">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {bestAttempt ? (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#3479ff] mb-2">
                        {bestAttempt.percentage.toFixed(1)}%
                      </div>
                      <p className="text-gray-600">Best Score</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Attempts:</span>
                        <span className="font-semibold">{attempts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-semibold">{completedAttempts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Score:</span>
                        <span className="font-semibold">{averageScore.toFixed(1)}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No completed attempts yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#13377c]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={startNewAttempt}
                  className="w-full bg-[#3479ff] hover:bg-[#2968e6] rounded-xl"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {attempts.length > 0 ? 'New Attempt' : 'Start Exam'}
                </Button>
                
                {bestAttempt && (
                  <Button 
                    variant="outline" 
                    onClick={() => openReviewDialog(bestAttempt)}
                    className="w-full rounded-xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review Best Attempt
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#13377c] mb-4">
              Exam Review - {selectedAttempt?.percentage.toFixed(1)}%
            </DialogTitle>
          </DialogHeader>
          
          {selectedAttempt && (
            <div className="space-y-6">
              {/* Attempt Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3479ff]">{selectedAttempt.total_score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3479ff]">{selectedAttempt.percentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3479ff]">{formatTime(selectedAttempt.time_taken)}</div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3479ff]">{formatDate(selectedAttempt.created_at)}</div>
                  <div className="text-sm text-gray-600">Date</div>
                </div>
              </div>

              {/* Questions Review */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#13377c]">Questions & Answers</h3>
                {questions.map((question, index) => {
                  const userAnswer = selectedAttempt.answers.find((a: any) => a.question_id === question.question_id);
                  const isCorrect = question.question_type === 'MCQ' && userAnswer?.selected_option_id 
                    ? question.options?.find(opt => opt.option_id === userAnswer.selected_option_id)?.is_correct 
                    : false;

                  return (
                    <Card key={question.question_id} className="rounded-xl border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                Q{index + 1}
                              </Badge>
                              <Badge variant="secondary">
                                {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
                              </Badge>
                              {question.question_type === 'MCQ' && (
                                <Badge className={isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {isCorrect ? 'Correct' : 'Incorrect'}
                                </Badge>
                              )}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                              {question.question_text}
                            </h4>
                            
                            {question.image_url && (
                              <img 
                                src={question.image_url} 
                                alt="Question image"
                                className="max-w-full h-auto rounded-lg border mb-4"
                              />
                            )}
                          </div>
                        </div>

                        {question.question_type === 'MCQ' ? (
                          <div className="space-y-3">
                            {question.options?.map((option, optIndex) => {
                              const isSelected = userAnswer?.selected_option_id === option.option_id;
                              const isCorrectOption = option.is_correct;
                              
                              return (
                                <div 
                                  key={option.option_id} 
                                  className={`p-3 rounded-lg border-2 ${
                                    isCorrectOption 
                                      ? 'border-green-500 bg-green-50' 
                                      : isSelected 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 bg-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                      isCorrectOption 
                                        ? 'border-green-500 bg-green-500' 
                                        : isSelected 
                                          ? 'border-red-500 bg-red-500' 
                                          : 'border-gray-300'
                                    }`}>
                                      {(isCorrectOption || isSelected) && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                    <span className="font-medium mr-2">({String.fromCharCode(65 + optIndex)})</span>
                                    <span className="flex-1">{option.option_text}</span>
                                    {isCorrectOption && (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                    {isSelected && !isCorrectOption && (
                                      <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-2">Your Answer:</p>
                              <p className="text-gray-800">{userAnswer?.answer || 'No answer provided'}</p>
                            </div>
                            <p className="text-sm text-orange-600">
                              * Subjective answers require manual evaluation
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};