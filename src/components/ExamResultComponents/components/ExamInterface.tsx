import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, ArrowRight, FileText, Play, Flag, Send, Grid3X3 } from 'lucide-react';
import { useExam } from '../../../hooks/useExam';
import { ResultsPage } from './ResultsPage';

export const ExamInterface = () => {
  const {
    examSections,
    currentSection,
    currentAttempt,
    questions,
    responses,
    timeRemaining,
    isTimerActive,
    testMode,
    startExam,
    submitResponse,
    nextSection,
    completeExam,
    loading,
    error
  } = useExam();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [showSidebar, setShowSidebar] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isLastSection = currentSection?.section_order === 2;

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle option selection
  const handleOptionSelect = (optionId: string, optionText: string, marks: number, type: string) => {
    setSelectedOption(optionId);
    if (currentQuestion) {
      submitResponse(currentQuestion.id, optionId, optionText, marks, type);
    }
  };

  // Handle question navigation from sidebar
  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setShowSidebar(false);
    
    // Load existing response if available
    const question = questions[questionIndex];
    if (question) {
      const existingResponse = responses.get(question.id);
      setSelectedOption(existingResponse?.selected_option_id || '');
    }
  };

  // Toggle mark for review
  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  // Handle early submission
  const handleEarlySubmit = () => {
    const unansweredCount = questions.length - responses.size;
    if (unansweredCount > 0) {
      const confirmMessage = `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    if (isLastSection) {
      completeExam();
    } else {
      nextSection();
    }
  };
  // Handle next question
  const handleNext = () => {
    if (isLastQuestion) {
      if (isLastSection) {
        completeExam();
      } else {
        nextSection();
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption('');
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous response if exists
      const prevResponse = responses.get(questions[currentQuestionIndex - 1]?.id);
      setSelectedOption(prevResponse?.selected_option_id || '');
    }
  };

  // Start section
  const handleStartSection = () => {
    setShowInstructions(false);
    if (!currentAttempt) {
      startExam();
    }
  };

  // Reset for new section
  useEffect(() => {
    if (currentSection) {
      setCurrentQuestionIndex(0);
      setSelectedOption('');
      setShowInstructions(true);
      setMarkedForReview(new Set());
    }
  }, [currentSection?.id]);

  // Load existing response when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existingResponse = responses.get(currentQuestion.id);
      setSelectedOption(existingResponse?.selected_option_id || '');
    }
  }, [currentQuestion?.id, responses]);

  // Show results page if requested
  if (showResults && currentAttempt) {
    return <ResultsPage attemptId={currentAttempt.id} onBack={() => setShowResults(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Exam</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show exam start screen
  if (!currentAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" onMouseEnter={() => {}} onMouseLeave={() => {}}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Assessment</h1>
              <p className="text-lg text-gray-600">Aptitude & Behavioral Evaluation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Aptitude Section</h3>
                <div className="space-y-2 text-blue-800">
                  <p className="flex items-center"><Clock className="h-4 w-4 mr-2" /> 30 minutes</p>
                  <p className="flex items-center"><FileText className="h-4 w-4 mr-2" /> 45 questions</p>
                  <p className="text-sm">Tests reasoning and cognitive ability</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Behavioral Section</h3>
                <div className="space-y-2 text-green-800">
                  <p className="flex items-center"><Clock className="h-4 w-4 mr-2" /> 20 minutes</p>
                  <p className="flex items-center"><FileText className="h-4 w-4 mr-2" /> 87 questions</p>
                  <p className="text-sm">Measures personality and behavioral patterns</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Important Instructions
              </h3>
              <div className="text-yellow-700 space-y-2 text-sm">
                <p>• The assessment duration is 50 minutes in total (30 + 20 minutes)</p>
                <p>• The assessment must be completed in one sitting</p>
                <p>• Use a stable internet connection</p>
                <p>• Choose a quiet and distraction-free environment</p>
                <p>• Each section will auto-submit when its time limit expires</p>
                <p>• You cannot return to the previous section once you move forward</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startExam}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentAttempt?.status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Assessment Completed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the assessment. Your responses have been recorded successfully.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aptitude responses:</span>
              <span className="font-medium">{currentAttempt.aptitude_responses.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Behavioral responses:</span>
              <span className="font-medium">{currentAttempt.behavioral_responses.length}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span className="text-gray-900">Total responses:</span>
              <span className="text-blue-600">
                {currentAttempt.aptitude_responses.length + currentAttempt.behavioral_responses.length}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowResults(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Detailed Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showInstructions && currentSection) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Comprehensive Assessment</h1>
              <h2 className="text-xl font-semibold text-blue-600">{currentSection.title}</h2>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentSection.duration}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {currentSection.id === 'aptitude' ? '45' : '87'}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Section Instructions
              </h3>
              <div className="text-yellow-700 text-sm whitespace-pre-line">
                {currentSection.instructions}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartSection}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start {currentSection.title}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Question Navigator</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {currentSection?.title} • {responses.size}/{questions.length} answered
            </div>
          </div>

          {/* Question Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isAnswered = responses.has(question.id);
                const isCurrent = index === currentQuestionIndex;
                const isMarked = markedForReview.has(index);
                
                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`
                      relative w-10 h-10 rounded-lg text-sm font-medium transition-colors
                      ${isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : isAnswered 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                    {isMarked && (
                      <Flag className="absolute -top-1 -right-1 h-3 w-3 text-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-gray-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Flag className="h-3 w-3 text-orange-500 mr-2" />
                <span className="text-gray-600">Marked: {markedForReview.size}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                <span className="text-gray-600">Current</span>
              </div>
            </div>
            <button
              onClick={handleEarlySubmit}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit {isLastSection ? 'Assessment' : 'Section'}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header with timer */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-800 mr-3"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{currentSection?.title}</h1>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center px-4 py-2 rounded-lg ${
                  timeRemaining <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question content */}
        <div className="p-4 lg:p-8">
          {currentQuestion && (
            <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex-1">
                    {currentQuestion.question_text}
                  </h2>
                  <div className="ml-4 flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                    </span>
                    <button
                      onClick={toggleMarkForReview}
                      className={`p-2 rounded-lg transition-colors ${
                        markedForReview.has(currentQuestionIndex)
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Mark for review"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {currentQuestion.sub_section?.section?.name && (
                  <p className="text-sm text-gray-600">
                    {currentQuestion.sub_section.section.name} → {currentQuestion.sub_section.name}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => handleOptionSelect(option.id, option.option_text, option.marks, option.type)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option.option_text}</span>
                  </label>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {responses.size} of {questions.length} answered
                  </div>
                  {markedForReview.size > 0 && (
                    <div className="text-sm text-orange-600">
                      {markedForReview.size} marked for review
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLastQuestion ? (
                    isLastSection ? 'Complete Assessment' : 'Next Section'
                  ) : (
                    'Next Question'
                  )}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};