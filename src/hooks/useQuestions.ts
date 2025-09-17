import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Question, QuestionWithOptions, Option } from '../types/database';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!supabase) {
      setError('Supabase not connected. Please connect to Supabase first.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('questions_vo')
        .select(`
          *,
          options_vo (*),
          sub_sections_vo (
            *,
            sections_vo (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const questionsWithRelations = data?.map(q => ({
        ...q,
        sub_section: {
          ...q.sub_sections_vo,
          section: q.sub_sections_vo.sections_vo
        },
        options: q.options_vo || []
      })) as QuestionWithOptions[];

      setQuestions(questionsWithRelations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: Omit<Question, 'id'>, options: Omit<Option, 'id' | 'question_id'>[]) => {
    try {
      const { data: questionResult, error: questionError } = await supabase
        .from('questions_vo')
        .insert([questionData])
        .select()
        .single();

      if (questionError) throw questionError;

      if (options.length > 0) {
        const optionsWithQuestionId = options.map(option => ({
          ...option,
          question_id: questionResult.id
        }));

        const { error: optionsError } = await supabase
          .from('options_vo')
          .insert(optionsWithQuestionId);

        if (optionsError) throw optionsError;
      }

      await fetchQuestions();
      return questionResult;
    } catch (err) {
      console.log('Error creating question:', err);
      throw err instanceof Error ? err : new Error('Failed to create question');
    }
  };

  const updateQuestion = async (
    questionId: string, 
    questionData: Partial<Question>, 
    options: (Option | Omit<Option, 'id' | 'question_id'>)[]
  ) => {
    try {
      const { error: questionError } = await supabase
        .from('questions_vo')
        .update(questionData)
        .eq('id', questionId);

      if (questionError) throw questionError;

      // Delete existing options
      const { error: deleteError } = await supabase
        .from('options_vo')
        .delete()
        .eq('question_id', questionId);

      if (deleteError) throw deleteError;

      // Insert new options
      if (options.length > 0) {
        const optionsWithQuestionId = options.map(option => ({
          option_text: option.option_text,
          marks: option.marks,
          question_id: questionId
        }));

        const { error: optionsError } = await supabase
          .from('options_vo')
          .insert(optionsWithQuestionId);

        if (optionsError) throw optionsError;
      }

      await fetchQuestions();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update question');
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('questions_vo')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      await fetchQuestions();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete question');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refetch: fetchQuestions
  };
};