import React, { useState, useEffect } from 'react';
import { Layout } from '../ExamResultComponents/components/Layout';
import { HomePage } from '../ExamResultComponents/components/HomePage';
import { NewExamInterface } from '../ExamResultComponents/components/NewExamInterface';
import { ExamInterface } from '../ExamResultComponents/components/ExamInterface';
import { QuestionsList } from '../ExamResultComponents/components/QuestionsList';
import { PaymentRequired } from '../../layouts/PaymentRequired';
import { QuestionForm } from '../ExamResultComponents/components/QuestionForm';
import { BulkUpload } from '../ExamResultComponents/components/BulkUpload';
import { Analytics } from '../ExamResultComponents/components/Analytics';
import { Settings } from '../ExamResultComponents/components/Settings';
import { DatabaseTest } from '../ExamResultComponents/components/DatabaseTest';
import { ReportMethods } from '../ExamResultComponents/components/ReportMethods';
import { ExamReviewPage } from '../ExamResultComponents/components/ExamReviewPage';
import { DetailedResultsPage } from '../ExamResultComponents/components/DetailedResultsPage';
import { PropertyLoginSubsection } from '../../screens/Frame/sections/PropertyLoginSubsection/PropertyLoginSubsection';
import { useAuth } from '../../hooks/useAuth';
import { useQuestions } from '../../hooks/useQuestions';
import { QuestionWithOptions } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { razorpayService } from '../../lib/razorpay';
import { useNavigate } from 'react-router-dom';

type ExtendedUser = {
  id: string;
  email?: string;
  full_name?: string;
  skillsphere_enabled?: boolean;
};

type CurrentViewType = 'home' | 'new-exam' | 'exam-review' | 'detailed-results' | 'api-response';

interface Exam {
  exam_id: string;
  exam_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  tax: number;
  total_time: number;
  maximum_marks: number;
  is_active: boolean;
}

function QuestionManagementSystem() {
  const { user, loading: authLoading } = useAuth() as { user: ExtendedUser | null; loading: boolean };
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState<CurrentViewType>('home');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // will be fetched from Supabase
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithOptions | undefined>();
  const [exams, setExams] = useState<Exam[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { createQuestion, updateQuestion } = useQuestions();
  const navigate = useNavigate();

  // Fetch active exams on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setExams(data || []);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };

    fetchExams();
  }, []);

  // Fetch latest user profile to check purchase status
  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('skillsphere_enabled')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setIsPurchased(!!data.skillsphere_enabled);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  // Refresh on mount or when user changes
  useEffect(() => {
    if (user) refreshUserProfile();
  }, [user?.id]);

  const handleExamPayment = async (exam: Exam) => {
    setPaymentLoading(true);
    try {
      const totalAmount = exam.discounted_price + exam.tax;
      const paymentResult = await razorpayService.initiatePayment({
        amount: totalAmount,
        currency: 'INR',
        description: `${exam.exam_name} - Exam Payment`,
        notes: { exam_id: exam.exam_id, user_id: user?.id },
      });

      if (paymentResult.success) {
        // Record purchase
        await supabase
          .from('exam_purchases')
          .upsert(
            {
              user_id: user?.id,
              exam_id: exam.exam_id,
              payment_id: paymentResult.payment.payment_id,
              purchase_type: 'paid',
              amount_paid: totalAmount,
            },
            { onConflict: 'user_id,exam_id' }
          );

        // Enable SkillSphere
        await supabase
          .from('user_profiles')
          .update({ skillsphere_enabled: true })
          .eq('id', user?.id);

        // Refresh purchase status
        await refreshUserProfile();

        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Payment failed:', err);
      alert(err.message || 'Payment failed. Please try again.');
      return false;
    } finally {
      setPaymentLoading(false);
    }
  };

  // Question form handlers
  const handleEditQuestion = (question: QuestionWithOptions) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };
  const handleAddQuestion = () => { setEditingQuestion(undefined); setShowQuestionForm(true); };
  const handleBulkUpload = () => setShowBulkUpload(true);
  const handleFormSubmit = async (questionData: any, options: any[]) => {
    if (editingQuestion) await updateQuestion(editingQuestion.id, questionData, options);
    else await createQuestion(questionData, options);
  };
  const handleCloseForm = () => { setShowQuestionForm(false); setShowBulkUpload(false); setEditingQuestion(undefined); };
  const handleStartNewExam = () => setActiveTab('old-exam');
  const handleViewExamReview = (attemptId: string) => { setSelectedAttemptId(attemptId); setCurrentView('exam-review'); };
  const handleViewAPIResponse = (attemptId: string) => { setSelectedAttemptId(attemptId); setCurrentView('api-response'); };
  const handleBackToHome = () => { setCurrentView('home'); setSelectedAttemptId(null); };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onStartExam={handleStartNewExam} onViewExamReview={handleViewExamReview} onViewAPIResponse={handleViewAPIResponse} />;
      case 'old-exam':
        return <ExamInterface />;
      case 'questions':
        return <QuestionsList onEditQuestion={handleEditQuestion} onAddQuestion={handleAddQuestion} onBulkUpload={handleBulkUpload} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'test':
        return <DatabaseTest />;
      case 'report-methods':
        return <ReportMethods />;
      default:
        return <QuestionsList onEditQuestion={handleEditQuestion} onAddQuestion={handleAddQuestion} onBulkUpload={handleBulkUpload} />;
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <PropertyLoginSubsection />;

  // Payment gating
  if (!isPurchased) {
    return (
      <PaymentRequired
        examName="SkillSphere Assessment"
        exams={exams}
        handleExamPayment={handleExamPayment}
        paymentLoading={paymentLoading}
        isPurchased={isPurchased}
        onViewExam={() => navigate('/exam')}
      />
    );
  }

  // Non-home views
  if (activeTab === 'home' && currentView !== 'home') {
    if (currentView === 'new-exam') return <NewExamInterface onBack={handleBackToHome} />;
    if (currentView === 'exam-review' && selectedAttemptId) return <ExamReviewPage attemptId={selectedAttemptId} onBack={handleBackToHome} />;
    if (currentView === 'api-response' && selectedAttemptId) return <DetailedResultsPage attemptId={selectedAttemptId} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>

      <QuestionForm isOpen={showQuestionForm} onClose={handleCloseForm} onSubmit={handleFormSubmit} editingQuestion={editingQuestion} />
      <BulkUpload isOpen={showBulkUpload} onClose={handleCloseForm} onSuccess={() => setShowBulkUpload(false)} />
    </div>
  );
}

export default QuestionManagementSystem;
