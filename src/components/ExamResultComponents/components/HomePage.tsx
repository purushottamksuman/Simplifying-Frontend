import React, { useState, useEffect } from 'react';
import { Play, History, Trophy, Clock, FileText, User, Calendar } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

interface HomePageProps {
  onStartExam: () => void;
  onViewExamReview: (attemptId: string) => void;
  onViewAPIResponse: (attemptId: string) => void;
}

interface ExamAttempt {
  attempt_id: string;
  start_time: string;
  end_time?: string;
  status: string;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  time_taken: number;
}

export const HomePage = ({ onStartExam, onViewExamReview, onViewAPIResponse }: HomePageProps) => {
  const { user } = useAuth();
  const [previousAttempts, setPreviousAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    bestScore: 0,
    averageScore: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    if (user && supabase) {
      fetchPreviousAttempts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPreviousAttempts = async () => {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) throw error;

      setPreviousAttempts(data || []);
      
      // Calculate stats
      if (data && data.length > 0) {
        const completedAttempts = data.filter(attempt => attempt.status === 'completed');
        const totalAttempts = completedAttempts.length;
        const bestScore = Math.max(...completedAttempts.map(a => a.percentage || 0));
        const averageScore = totalAttempts > 0 
          ? completedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts 
          : 0;
        const totalTimeSpent = completedAttempts.reduce((sum, a) => sum + (a.time_taken || 0), 0);

        setStats({
          totalAttempts,
          bestScore,
          averageScore: Math.round(averageScore),
          totalTimeSpent: Math.round(totalTimeSpent / 60) // Convert to minutes
        });
      }
    } catch (error) {
      console.error('Error fetching previous attempts:', error);
    } finally {
      setLoading(false);
    }
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'abandoned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Dashboard</h1>
            <p className="text-xl text-gray-600">Welcome back, {user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bestScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTimeSpent}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Start New Exam */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Play className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start New Assessment</h3>
              <p className="text-gray-600 mb-6">
                Take a comprehensive assessment covering aptitude and behavioral evaluation.
                Answer questions across multiple categories to get detailed insights about your abilities.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-blue-900">Duration</p>
                    <p className="text-blue-700">50 minutes</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Questions</p>
                    <p className="text-blue-700">132 total</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Sections</p>
                    <p className="text-blue-700">Aptitude + Behavioral</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Mode</p>
                    <p className="text-blue-700">Manual</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onStartExam}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Start Assessment
              </button>
            </div>
          </div>

          {/* Previous Attempts */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Previous Attempts</h3>
              <History className="h-6 w-6 text-gray-400" />
            </div>
            
            {previousAttempts.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No previous attempts found</p>
                <p className="text-sm text-gray-500">Start your first assessment to see results here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {previousAttempts.map((attempt) => (
                  <div
                    key={attempt.attempt_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attempt.status)}`}>
                          {attempt.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(attempt.start_time)}
                        </span>
                      </div>
                      {attempt.status === 'completed' && (
                        <span className="text-lg font-bold text-blue-600">
                          {attempt.percentage}%
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {attempt.status === 'completed' && (
                          <>
                            Score: {attempt.total_score}/{attempt.max_possible_score} • 
                            Time: {formatDuration(attempt.time_taken)}
                          </>
                        )}
                        {attempt.status === 'in_progress' && (
                          <span className="text-blue-600">In Progress</span>
                        )}
                      </div>
                      
                      {attempt.status === 'completed' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewExamReview(attempt.attempt_id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Review →
                          </button>
                          <button
                            onClick={() => onViewAPIResponse(attempt.attempt_id)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            API →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};