import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SubSection, Section, DefaultOption } from '../types/database';

interface SubSectionWithSection extends SubSection {
  section: Section;
  default_options: DefaultOption[];
}

export const useSubSections = () => {
  const [subSections, setSubSections] = useState<SubSectionWithSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubSections = async () => {
    if (!supabase) {
      setError('Supabase not connected. Please connect to Supabase first.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching sub-sections from sub_sections_vo table...');
      const { data, error } = await supabase
        .from('sub_sections_vo')
        .select(`
          *,
          sections_vo (*),
          default_options_vo (*)
        `)
        .order('name');

      if (error) {
        console.error('Error fetching sub-sections:', error);
        throw error;
      }

      console.log('Sub-sections fetched:', data);
      console.log('Number of sub-sections:', data?.length || 0);
      
      if (data && data.length > 0) {
        console.log('Sub-section names:', data.map(ss => ss.name));
      }
      
      const subSectionsWithRelations = data?.map(ss => ({
        ...ss,
        section: ss.sections_vo,
        default_options: ss.default_options_vo || []
      })) as SubSectionWithSection[];

      setSubSections(subSectionsWithRelations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching sub-sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubSections();
  }, []);

  // Debug log whenever sub-sections change
  useEffect(() => {
    console.log('Sub-sections state updated:', subSections);
  }, [subSections]);
  return {
    subSections,
    loading,
    error,
    refetch: fetchSubSections
  };
};