import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Users, Lightbulb } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

interface RiasecTiebreakerProps {
  examAttemptId: string;
  tiedCategories: string[];
  currentTop3: string[];
  onComplete: (finalTop3: string[]) => void;
  onBack: () => void;
}

interface TiebreakerQuestion {
  id: string;
  category_a: string;
  category_b: string;
  option_a_text: string;
  option_b_text: string;
}

interface TiebreakerAttempt {
  id: string;
  tied_categories: string[];
  current_round: number;
  status: string;
  final_top3: string[];
}

const CATEGORY_NAMES = {
  realistic: 'Realistic (R)',
  investigative: 'Investigative (I)', 
  artistic: 'Artistic (A)',
  social: 'Social (S)',
  enterprising: 'Enterprising (E)',
  conventional: 'Conventional (C)'
};

const CATEGORY_DESCRIPTIONS = {
  realistic: 'Work with tools, machines, and physical materials',
  investigative: 'Research, analyze, and solve complex problems',
  artistic: 'Create, design, and express through various art forms',
  social: 'Help, teach, and work directly with people',
  enterprising: 'Lead, persuade, and manage business operations',
  conventional: 'Organize, process data, and follow detailed procedures'
};

export const RiasecTiebreaker = ({ 
  examAttemptId, 
  tiedCategories, 
  currentTop3, 
  onComplete, 
  onBack 
}: RiasecTiebreakerProps) => {
  const { user } = useAuth();
  const [tiebreakerAttempt, setTiebreakerAttempt] = useState<TiebreakerAttempt | null>(null);
  const [questions, setQuestions] = useState<TiebreakerQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [currentRoundCategories, setCurrentRoundCategories] = useState<string[]>([]);
  const [roundScores, setRoundScores] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (user && supabase) {
      initializeTiebreaker();
    }
  }, [user, examAttemptId]);

  const initializeTiebreaker = async () => {
    if (!supabase || !user) return;

    try {
      setLoading(true);

      // Check if tiebreaker attempt already exists
      const { data: existingAttempt } = await supabase
        .from('riasec_tiebreaker_attempts')
        .select('*')
        .eq('exam_attempt_id', examAttemptId)
        .eq('user_id', user.id)
        .maybeSingle();

      let attempt: TiebreakerAttempt;

      if (existingAttempt) {
        attempt = existingAttempt;
      } else {
        // Create new tiebreaker attempt
        const { data: newAttempt, error } = await supabase
          .from('riasec_tiebreaker_attempts')
          .insert({
            exam_attempt_id: examAttemptId,
            user_id: user.id,
            tied_categories: tiedCategories,
            current_round: 1,
            status: 'in_progress'
          })
          .select()
          .single();

        if (error) throw error;
        attempt = newAttempt;
      }

      setTiebreakerAttempt(attempt);
      setCurrentRoundCategories(attempt.tied_categories);
      
      // Load questions for current round
      await loadQuestionsForRound(attempt.tied_categories);
      
    } catch (error) {
      console.error('Error initializing tiebreaker:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionsForRound = async (categories: string[]) => {
    if (!supabase || categories.length < 2) return;

    try {
      // Get all possible pairs from tied categories
      const pairs: Array<{categoryA: string, categoryB: string}> = [];
      for (let i = 0; i < categories.length; i++) {
        for (let j = i + 1; j < categories.length; j++) {
          pairs.push({ categoryA: categories[i], categoryB: categories[j] });
        }
      }

      // Load questions for each pair (5 questions per pair)
      const allQuestions: TiebreakerQuestion[] = [];
      
      for (const pair of pairs) {
        const { data: pairQuestions, error } = await supabase
          .from('riasec_tiebreaker_questions')
          .select('*')
          .or(`and(category_a.eq.${pair.categoryA},category_b.eq.${pair.categoryB}),and(category_a.eq.${pair.categoryB},category_b.eq.${pair.categoryA})`)
          .eq('is_active', true)
          .limit(5);

        if (error) throw error;
        if (pairQuestions) {
          allQuestions.push(...pairQuestions);
        }
      }

      // Shuffle questions
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);

    } catch (error) {
      console.error('Error loading tiebreaker questions:', error);
    }
  };

  const handleOptionSelect = async (selectedCategory: string) => {
    if (!tiebreakerAttempt || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      // Save response to database
      await supabase?.from('riasec_tiebreaker_responses').insert({
        tiebreaker_attempt_id: tiebreakerAttempt.id,
        question_id: currentQuestion.id,
        selected_category: selectedCategory,
        round_number: tiebreakerAttempt.current_round
      });

      // Update local responses
      setResponses(prev => new Map(prev.set(currentQuestion.id, selectedCategory)));

      // Update round scores
      setRoundScores(prev => {
        const newScores = new Map(prev);
        const currentScore = newScores.get(selectedCategory) || 0;
        newScores.set(selectedCategory, currentScore + 1);
        return newScores;
      });

      // Move to next question or complete round
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        await completeCurrentRound();
      }

    } catch (error) {
      console.error('Error saving tiebreaker response:', error);
    }
  };

  const completeCurrentRound = async () => {
    if (!tiebreakerAttempt) return;

    try {
      // Calculate winners from current round
      const sortedScores = Array.from(roundScores.entries())
        .sort(([,a], [,b]) => b - a);

      // Determine how many categories to keep for next round
      const remainingCategories = [...currentTop3];
      const availableSlots = 3 - remainingCategories.length;
      
      // Add winners from this round
      for (let i = 0; i < Math.min(availableSlots, sortedScores.length); i++) {
        const [category] = sortedScores[i];
        if (!remainingCategories.includes(category)) {
          remainingCategories.push(category);
        }
      }

      // Check if we need another round
      const stillTied = sortedScores.filter(([,score], index) => 
        index > 0 && score === sortedScores[0][1]
      ).map(([category]) => category);

      if (stillTied.length > 0 && remainingCategories.length < 3) {
        // Start another round with tied categories
        const nextRoundCategories = [sortedScores[0][0], ...stillTied];
        
        await supabase?.from('riasec_tiebreaker_attempts')
          .update({
            current_round: tiebreakerAttempt.current_round + 1,
            tied_categories: nextRoundCategories
          })
          .eq('id', tiebreakerAttempt.id);

        setCurrentRoundCategories(nextRoundCategories);
        setRoundScores(new Map());
        await loadQuestionsForRound(nextRoundCategories);
        
      } else {
        // Complete tiebreaker
        const finalTop3 = remainingCategories.slice(0, 3);
        
        await supabase?.from('riasec_tiebreaker_attempts')
          .update({
            status: 'completed',
            final_top3: finalTop3
          })
          .eq('id', tiebreakerAttempt.id);

        onComplete(finalTop3);
      }

    } catch (error) {
      console.error('Error completing tiebreaker round:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tiebreaker questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Results
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RIASEC Tiebreaker</h1>
                <p className="text-sm text-gray-600">
                  Round {tiebreakerAttempt?.current_round} • Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Round Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-blue-900">
              Resolving Tie Between Categories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRoundCategories.map(category => (
              <div key={category} className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">
                  {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                </h3>
                <p className="text-sm text-gray-600">
                  {CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS]}
                </p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-blue-600">
                    Score: {roundScores.get(category) || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Which option appeals to you more?
              </h2>
              <p className="text-gray-600">
                Choose the activity that you would prefer to do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A */}
              <button
                onClick={() => handleOptionSelect(currentQuestion.category_a)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-blue-600">
                    {CATEGORY_NAMES[currentQuestion.category_a as keyof typeof CATEGORY_NAMES]}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {currentQuestion.option_a_text}
                </p>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleOptionSelect(currentQuestion.category_b)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-blue-600">
                    {CATEGORY_NAMES[currentQuestion.category_b as keyof typeof CATEGORY_NAMES]}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {currentQuestion.option_b_text}
                </p>
              </button>
            </div>

            {/* Progress indicator */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < currentQuestionIndex
                        ? 'bg-green-500'
                        : index === currentQuestionIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {currentQuestionIndex + 1} of {questions.length} questions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};