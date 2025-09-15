import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Section } from '../types/database';

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    if (!supabase) {
      setError('Supabase not connected. Please connect to Supabase first.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching sections from sections_vo table...');
      
      const { data, error } = await supabase
        .from('sections_vo')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching sections:', error);
        throw error;
      }

      console.log('Sections fetched:', data);
      console.log('Number of sections:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('Section names:', data.map(s => s.name));
      }
      
      setSections(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Debug log whenever sections change
  useEffect(() => {
    console.log('Sections state updated:', sections);
  }, [sections]);
  return {
    sections,
    loading,
    error,
    refetch: fetchSections
  };
};