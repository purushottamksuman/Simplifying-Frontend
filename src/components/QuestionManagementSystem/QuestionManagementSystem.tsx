import React, { useState } from 'react';
import { AuthForm } from '../ExamResultComponents/components/AuthForm';
import { Layout } from '../ExamResultComponents/components/Layout';
import { HomePage } from '../ExamResultComponents/components/HomePage';
import { NewExamInterface } from '../ExamResultComponents/components/NewExamInterface';
import { ExamInterface } from '../ExamResultComponents/components/ExamInterface'; // Old system
import { QuestionsList } from '../ExamResultComponents/components/QuestionsList';
import { QuestionForm } from '../ExamResultComponents/components/QuestionForm';
import { BulkUpload } from '../ExamResultComponents/components/BulkUpload';
import { Analytics } from '../ExamResultComponents/components/Analytics';
import { Settings } from '../ExamResultComponents/components/Settings';
import { DatabaseTest } from '../ExamResultComponents/components/DatabaseTest';
import { ReportMethods } from '../ExamResultComponents/components/ReportMethods';
import { ResultsPage } from '../ExamResultComponents/components/ResultsPage';
import { ExamReviewPage } from '../ExamResultComponents/components/ExamReviewPage';
import { DetailedResultsPage } from '../ExamResultComponents/components/DetailedResultsPage';
import { useAuth } from '../../hooks/useAuth';
import { useQuestions } from '../../hooks/useQuestions';
import { QuestionWithOptions } from '../../types/database';
import { PropertyLoginSubsection } from '../../screens/Frame/sections/PropertyLoginSubsection/PropertyLoginSubsection';

function QuestionManagementSystem() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState<'home' | 'new-exam' | 'exam-review' | 'detailed-results' | 'api-response'>('home');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithOptions | undefined>();
  const { createQuestion, updateQuestion } = useQuestions();

  const handleAuthSuccess = () => {
    // Auth success is handled by the useAuth hook
    console.log('Authentication successful');
  };

  const handleEditQuestion = (question: QuestionWithOptions) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setShowQuestionForm(true);
  };

  const handleBulkUpload = () => {
    setShowBulkUpload(true);
  };

  const handleFormSubmit = async (questionData: any, options: any[]) => {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, questionData, options);
    } else {
      await createQuestion(questionData, options);
    }
  };

  const handleCloseForm = () => {
    setShowQuestionForm(false);
    setShowBulkUpload(false);
    setEditingQuestion(undefined);
  };

  const handleStartNewExam = () => {
    setActiveTab('old-exam');
  };

  const handleViewExamReview = (attemptId: string) => {
    setSelectedAttemptId(attemptId);
    setCurrentView('exam-review');
  };

  const handleViewAPIResponse = (attemptId: string) => {
    setSelectedAttemptId(attemptId);
    setCurrentView('api-response');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAttemptId(null);
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Show auth form if user is not authenticated
  if (!user) {
    // return <AuthForm onAuthSuccess={handleAuthSuccess} />;
    return <PropertyLoginSubsection />
  }

  // Handle new exam system views
  if (activeTab === 'home' && currentView !== 'home') {
    if (currentView === 'new-exam') {
      return <NewExamInterface onBack={handleBackToHome} />;
    }
    
    if (currentView === 'exam-review' && selectedAttemptId) {
      return <ExamReviewPage attemptId={selectedAttemptId} onBack={handleBackToHome} />;
    }
    
    if (currentView === 'api-response' && selectedAttemptId) {
      return <DetailedResultsPage attemptId={selectedAttemptId} onBack={handleBackToHome} />;
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onStartExam={handleStartNewExam}
            onViewExamReview={handleViewExamReview}
            onViewAPIResponse={handleViewAPIResponse}
          />
        );
      case 'old-exam':
        return <ExamInterface />;
      case 'report-methods':
        return <ReportMethods />;
      case 'report-methods':
        return <ReportMethods />;
      case 'questions':
        return (
          <QuestionsList
            onEditQuestion={handleEditQuestion}
            onAddQuestion={handleAddQuestion}
            onBulkUpload={handleBulkUpload}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'test':
        return <DatabaseTest />;
      default:
        return (
          <QuestionsList
            onEditQuestion={handleEditQuestion}
            onAddQuestion={handleAddQuestion}
            onBulkUpload={handleBulkUpload}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>

      <QuestionForm
        isOpen={showQuestionForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingQuestion={editingQuestion}
      />

      <BulkUpload
        isOpen={showBulkUpload}
        onClose={handleCloseForm}
        onSuccess={() => {
          setShowBulkUpload(false);
          // Optionally show a success message or refresh data
        }}
      />
    </div>
  );
}

export default QuestionManagementSystem;