import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, FileText, Zap } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { ResultsPage } from './ResultsPage';

interface NewExamInterfaceProps {
  onBack: () => void;
}

interface ExamAttempt {
  attempt_id: string;
  user_id: string;
  exam_id: string;
  status: string;
  start_time: string;
  end_time?: string;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  time_taken: number;
}

export const NewExamInterface = ({ onBack }: NewExamInterfaceProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const startManualExam = async () => {
    if (!supabase || !user) {
      alert('Database connection required');
      return;
    }

    try {
      setLoading(true);

      // Create or get exam record
      const { data: existingExam } = await supabase
        .from('exams')
        .select('exam_id')
        .eq('exam_name', 'Comprehensive Assessment')
        .limit(1)
        .maybeSingle();

      let examId = existingExam?.exam_id;

      if (!examId) {
        const { data: newExam, error: examError } = await supabase
          .from('exams')
          .insert({
            exam_name: 'Comprehensive Assessment',
            description: 'Automated Aptitude and Behavioral Assessment',
            instructions: 'Automated assessment with random responses',
            total_time: 50,
            maximum_marks: 480, // 45 aptitude + 435 behavioral (87*5)
            is_active: true,
            original_price: 0,
            discounted_price: 0,
            tax: 0
          })
          .select('exam_id')
          .single();

        if (examError) throw examError;
        examId = newExam.exam_id;
      }

      // Create exam attempt
      const { data: attempt, error: attemptError } = await supabase
        .from('exam_attempts')
        .insert({
          user_id: user.id,
          exam_id: examId,
          start_time: new Date().toISOString(),
          status: 'in_progress',
          total_score: 0,
          max_possible_score: 480,
          percentage: 0,
          answers: [],
          time_taken: 0
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Store attempt ID and redirect to exam interface
      setCurrentAttempt(attempt);
      setShowResults(false);
      
      // Redirect to manual exam interface
      window.location.href = '/exam';

    } catch (error) {
      console.error('Error in automated exam:', error);
      alert(`Failed to complete automated exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (showResults && currentAttempt) {
    return <ResultsPage attemptId={currentAttempt.attempt_id} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Automated Assessment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Setting up your assessment...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <Play className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Assessment</h2>
              <p className="text-lg text-gray-600 mb-8">
                You'll be taken to the exam interface where you can manually answer questions.
              </p>
              
              <button
                onClick={startManualExam}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Manual Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};