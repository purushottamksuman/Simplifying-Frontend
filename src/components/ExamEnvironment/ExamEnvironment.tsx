import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Flag,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Target,
  Timer,
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { supabase } from '../../lib/supabase';

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

interface Exam {
  exam_id: string;
  exam_name: string;
  description: string;
  instructions: string;
  total_time: number;
  maximum_marks: number;
}

interface UserAnswer {
  question_id: string;
  answer: string;
  selected_option_id?: string;
}

export const ExamEnvironment: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  // Exam data
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map());
  
  // Exam state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Fetch exam data
  useEffect(() => {
    if (!examId) {
      navigate('/component/dashboard');
      return;
    }
    
    fetchExamData();
  }, [examId, navigate]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || examSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeRemaining]);

  // Prevent page refresh/navigation during exam
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setShowExitDialog(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [examStarted, examSubmitted]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      
      // Check if user has purchased this exam
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

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

      // Fetch exam details
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('exam_id', examId)
        .eq('is_active', true)
        .single();

      if (examError || !examData) {
        setError('Exam not found or inactive.');
        return;
      }

      setExam(examData);
      setTimeRemaining(examData.total_time * 60); // Convert minutes to seconds

      // Fetch questions with options through exam_assessments junction table
      const { data: examAssessments, error: examAssessmentsError } = await supabase
        .from('exam_assessments')
        .select(`
          assessment_id,
          assessments!inner (
            assessment_id,
            assessment_name
          )
        `)
        .eq('exam_id', examId)
        .order('display_order');

      if (examAssessmentsError) {
        console.error('Error fetching exam assessments:', examAssessmentsError);
        setError('Failed to load exam assessments.');
        return;
      }

      if (!examAssessments || examAssessments.length === 0) {
        console.log('No assessments found for this exam');
        setQuestions([]);
        return;
      }

      // Get all assessment IDs for this exam
      const assessmentIds = examAssessments.map(ea => ea.assessment_id);

      // Fetch questions from all assessments
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          question_options (*)
        `)
        .in('assessment_id', assessmentIds)
        .eq('is_active', true)
        .order('assessment_id, display_order');

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        setError('Failed to load exam questions.');
        return;
      }

      // Process questions and sort options
      const processedQuestions = questionsData?.map(q => ({
        ...q,
        options: q.question_options?.sort((a: any, b: any) => a.display_order - b.display_order) || []
      })) || [];

      setQuestions(processedQuestions);

    } catch (err) {
      console.error('Error fetching exam data:', err);
      setError('Failed to load exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    setExamStarted(true);
    setExamStartTime(new Date());
    console.log('🚀 Exam started:', exam?.exam_name);
  };

  const handleAnswerChange = (questionId: string, answer: string, optionId?: string) => {
    setUserAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(questionId, {
        question_id: questionId,
        answer,
        selected_option_id: optionId
      });
      return newAnswers;
    });
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
  };

  const handleAutoSubmit = useCallback(() => {
    console.log('⏰ Time up! Auto-submitting exam...');
    submitExam();
  }, []);

  const submitExam = async () => {
    try {
      console.log('🔄 Submitting exam to database...');
      setExamSubmitted(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Calculate score
      let totalScore = 0;
      const answersArray = Array.from(userAnswers.values());
      
      for (const userAnswer of answersArray) {
        const question = questions.find(q => q.question_id === userAnswer.question_id);
        if (!question) continue;

        if (question.question_type === 'MCQ' && userAnswer.selected_option_id) {
          const selectedOption = question.options?.find(opt => opt.option_id === userAnswer.selected_option_id);
          if (selectedOption?.is_correct) {
            totalScore += question.marks;
          }
        }
        // For subjective questions, manual evaluation would be needed
      }

      const endTime = new Date();
      const timeTaken = examStartTime ? Math.floor((endTime.getTime() - examStartTime.getTime()) / 1000) : 0;
      const percentage = exam?.maximum_marks ? (totalScore / exam.maximum_marks) * 100 : 0;

      console.log('📊 Exam results:', {
        totalScore,
        maxMarks: exam?.maximum_marks,
        percentage: percentage.toFixed(1),
        timeTaken,
        answersCount: answersArray.length
      });

      // Save exam attempt to database
      const { data: examAttempt, error: attemptError } = await supabase
        .from('exam_attempts')
        .insert({
          user_id: user.id,
          exam_id: examId,
          start_time: examStartTime?.toISOString(),
          end_time: endTime.toISOString(),
          total_score: totalScore,
          max_possible_score: exam?.maximum_marks || 0,
          percentage: percentage,
          status: 'completed',
          answers: answersArray,
          time_taken: timeTaken
        })
        .select()
        .single();

      if (attemptError) {
        console.error('❌ Error saving exam attempt:', attemptError);
        setError('Failed to save exam attempt. Please try again.');
        setExamSubmitted(false);
        return;
      }

      console.log('✅ Exam attempt saved successfully:', examAttempt);

      // Log activity
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: 'exam_completed',
          activity_details: {
            exam_id: examId,
            attempt_id: examAttempt.attempt_id,
            score: totalScore,
            percentage: percentage.toFixed(1),
            time_taken: timeTaken
          }
        });
      
      alert(`🎉 Exam submitted successfully!\n\nYour Score: ${totalScore}/${exam?.maximum_marks}\nPercentage: ${((totalScore / (exam?.maximum_marks || 1)) * 100).toFixed(1)}%`);
      
      // Navigate back to dashboard
      navigate('/component/dashboard');
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      setError('Failed to submit exam. Please try again.');
      setExamSubmitted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const totalTime = (exam?.total_time || 0) * 60;
    const percentage = (timeRemaining / totalTime) * 100;
    
    if (percentage <= 10) return 'text-red-500';
    if (percentage <= 25) return 'text-orange-500';
    return 'text-green-500';
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = userAnswers.size;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading exam...</p>
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

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{exam?.exam_name}</h1>
              <p className="text-gray-600">{exam?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Duration</p>
                <p className="text-blue-600">{exam?.total_time} minutes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Total Marks</p>
                <p className="text-green-600">{exam?.maximum_marks}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">Questions</p>
                <p className="text-purple-600">{questions.length}</p>
              </div>
            </div>

            {exam?.instructions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Instructions
                </h3>
                <div className="text-gray-700 whitespace-pre-line">{exam.instructions}</div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-red-800 mb-3">Important Guidelines:</h3>
              <ul className="text-red-700 space-y-2 text-sm">
                <li>• Do not refresh the page or navigate away during the exam</li>
                <li>• Your exam will be auto-submitted when time expires</li>
                <li>• Make sure you have a stable internet connection</li>
                <li>• You can flag questions for review before submitting</li>
                <li>• Once submitted, you cannot change your answers</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/component/dashboard')}
                className="px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={startExam}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Start Exam
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Exam Submitted Successfully!</h2>
            <p className="text-gray-600 mb-8">
              Your answers have been recorded. Results will be available soon.
            </p>
            <Button 
              onClick={() => navigate('/component/dashboard')}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             
              <div>
                <h1 className="text-xl font-bold text-gray-800">{exam?.exam_name}</h1>
                <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 ${getTimeColor()}`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-32">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={() => setShowSubmitDialog(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => {
                    const isAnswered = userAnswers.has(question.question_id);
                    const isFlagged = flaggedQuestions.has(question.question_id);
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <Button
                        key={question.question_id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        variant="outline"
                        size="sm"
                        className={`relative h-10 w-10 p-0 ${
                          isCurrent 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : isAnswered 
                              ? 'bg-green-100 text-green-700 border-green-300' 
                              : 'bg-white'
                        }`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 w-3 h-3 text-orange-500 fill-orange-500" />
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span>Flagged</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <Card>
                <CardContent className="p-8">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {currentQuestion.question_type}
                        </Badge>
                        <Badge variant="secondary">
                          {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                        </Badge>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                        Q{currentQuestionIndex + 1}. {currentQuestion.question_text}
                      </h2>
                      
                      {currentQuestion.image_url && (
                        <div className="mt-4">
                          <img 
                            src={currentQuestion.image_url} 
                            alt="Question image"
                            className="max-w-full h-auto rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => toggleFlag(currentQuestion.question_id)}
                      variant="ghost"
                      size="sm"
                      className={`ml-4 ${
                        flaggedQuestions.has(currentQuestion.question_id)
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-400'
                      }`}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Answer Section */}
                  <div className="mb-8">
                    {currentQuestion.question_type === 'MCQ' ? (
                      <RadioGroup
                        value={userAnswers.get(currentQuestion.question_id)?.selected_option_id || ''}
                        onValueChange={(value) => {
                          const option = currentQuestion.options?.find(opt => opt.option_id === value);
                          handleAnswerChange(currentQuestion.question_id, option?.option_text || '', value);
                        }}
                        className="space-y-4"
                      >
                        {currentQuestion.options?.map((option, index) => (
                          <div key={option.option_id} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <RadioGroupItem 
                              value={option.option_id} 
                              id={option.option_id}
                              className="mt-1"
                            />
                            <Label 
                              htmlFor={option.option_id} 
                              className="flex-1 cursor-pointer text-gray-700 leading-relaxed"
                            >
                              <span className="font-medium mr-2">({String.fromCharCode(65 + index)})</span>
                              {option.option_text}
                              {option.image_url && (
                                <img 
                                  src={option.image_url} 
                                  alt={`Option ${index + 1}`}
                                  className="mt-2 max-w-full h-auto rounded border"
                                />
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Your Answer:
                        </Label>
                        <Textarea
                          value={userAnswers.get(currentQuestion.question_id)?.answer || ''}
                          onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
                          placeholder="Type your answer here..."
                          className="min-h-[200px] resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => toggleFlag(currentQuestion.question_id)}
                        variant="outline"
                        className={flaggedQuestions.has(currentQuestion.question_id) ? 'border-orange-300 text-orange-600' : ''}
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        {flaggedQuestions.has(currentQuestion.question_id) ? 'Unflag' : 'Flag for Review'}
                      </Button>
                      
                      {currentQuestionIndex === questions.length - 1 ? (
                        <Button
                          onClick={() => setShowSubmitDialog(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Submit Exam
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You have answered {answeredCount} out of {questions.length} questions.
              {flaggedQuestions.size > 0 && (
                <span className="block mt-2 text-orange-600">
                  You have {flaggedQuestions.size} question(s) flagged for review.
                </span>
              )}
              <span className="block mt-2 font-medium">
                Once submitted, you cannot change your answers.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Again</AlertDialogCancel>
            <AlertDialogAction 
              onClick={submitExam}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the exam? Your progress will be lost and you'll need to start over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/component/dashboard')}
              className="bg-red-600 hover:bg-red-700"
            >
              Exit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};