import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: string[] = [];

    try {
      // Test 1: Check if supabase is connected
      if (!supabase) {
        results.push('❌ Supabase not connected');
        setTestResults(results);
        setLoading(false);
        return;
      }
      results.push('✅ Supabase client created');

      // Test 2: Check if we can connect to database
      try {
        const { data, error } = await supabase.from('sections_vo').select('count', { count: 'exact', head: true });
        if (error) {
          results.push(`❌ Cannot access sections_vo table: ${error.message}`);
        } else {
          results.push(`✅ sections_vo table exists with ${data} rows`);
        }
      } catch (err) {
        results.push(`❌ Error accessing sections_vo: ${err}`);
      }

      // Test 3: Try to fetch sections
      try {
        const { data: sections, error: sectionsError } = await supabase
          .from('sections_vo')
          .select('*');
        
        if (sectionsError) {
          results.push(`❌ Error fetching sections: ${sectionsError.message}`);
        } else {
          results.push(`✅ Fetched ${sections?.length || 0} sections`);
          sections?.forEach(section => {
            results.push(`  - ${section.name} (ID: ${section.id})`);
          });
        }
      } catch (err) {
        results.push(`❌ Exception fetching sections: ${err}`);
      }

      // Test 4: Try to fetch sub-sections
      try {
        const { data: subSections, error: subSectionsError } = await supabase
          .from('sub_sections_vo')
          .select('*');
        
        if (subSectionsError) {
          results.push(`❌ Error fetching sub-sections: ${subSectionsError.message}`);
        } else {
          results.push(`✅ Fetched ${subSections?.length || 0} sub-sections`);
        }
      } catch (err) {
        results.push(`❌ Exception fetching sub-sections: ${err}`);
      }

      // Test 5: Try to create a test section
      try {
        const { data: newSection, error: insertError } = await supabase
          .from('sections_vo')
          .insert([{ name: 'Test Section', total_questions: 5 }])
          .select()
          .single();

        if (insertError) {
          results.push(`❌ Cannot insert test section: ${insertError.message}`);
        } else {
          results.push(`✅ Successfully created test section: ${newSection.name}`);
          
          // Clean up test data
          await supabase.from('sections_vo').delete().eq('id', newSection.id);
          results.push(`✅ Cleaned up test section`);
        }
      } catch (err) {
        results.push(`❌ Exception creating test section: ${err}`);
      }

    } catch (error) {
      results.push(`❌ General error: ${error}`);
    }

    setTestResults(results);
    setLoading(false);
  };

  const createSampleData = async () => {
    if (!supabase) {
      alert('Supabase not connected');
      return;
    }

    try {
      setLoading(true);
      
      // Create sections
      const { data: sections, error: sectionsError } = await supabase
        .from('sections_vo')
        .insert([
          { name: 'Aptitude', total_questions: 50 },
          { name: 'Behavioural', total_questions: 30 }
        ])
        .select();

      if (sectionsError) {
        alert(`Error creating sections: ${sectionsError.message}`);
        return;
      }

      const aptitudeSection = sections.find(s => s.name === 'Aptitude');
      const behaviouralSection = sections.find(s => s.name === 'Behavioural');

      // Create sub-sections
      const subSections = [
        // Aptitude sub-sections
        { section_id: aptitudeSection.id, name: 'Numerical Reasoning', default_no_of_questions: 10, has_default_options: true, question_type: 'MCQ' },
        { section_id: aptitudeSection.id, name: 'Verbal Reasoning', default_no_of_questions: 10, has_default_options: true, question_type: 'MCQ' },
        { section_id: aptitudeSection.id, name: 'Logical Reasoning', default_no_of_questions: 10, has_default_options: true, question_type: 'MCQ' },
        { section_id: aptitudeSection.id, name: 'Abstract Reasoning', default_no_of_questions: 10, has_default_options: true, question_type: 'MCQ' },
        { section_id: aptitudeSection.id, name: 'Spatial Reasoning', default_no_of_questions: 10, has_default_options: true, question_type: 'MCQ' },
        
        // Behavioural sub-sections
        { section_id: behaviouralSection.id, name: 'Leadership', default_no_of_questions: 5, has_default_options: true, question_type: 'Likert' },
        { section_id: behaviouralSection.id, name: 'Teamwork', default_no_of_questions: 5, has_default_options: true, question_type: 'Likert' },
        { section_id: behaviouralSection.id, name: 'Communication', default_no_of_questions: 5, has_default_options: true, question_type: 'Likert' },
        { section_id: behaviouralSection.id, name: 'Problem Solving', default_no_of_questions: 5, has_default_options: true, question_type: 'Likert' },
        { section_id: behaviouralSection.id, name: 'Adaptability', default_no_of_questions: 5, has_default_options: true, question_type: 'Likert' },
        { section_id: behaviouralSection.id, name: 'Time Management', default_no_of_questions: 5, has_default_options: true, question_type: 'Frequency' }
      ];

      const { error: subSectionsError } = await supabase
        .from('sub_sections_vo')
        .insert(subSections);

      if (subSectionsError) {
        alert(`Error creating sub-sections: ${subSectionsError.message}`);
        return;
      }

      alert('Sample data created successfully!');
      setLoading(false);
      
    } catch (error) {
      alert(`Error: ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={runTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run Database Tests'}
          </button>
          
          <button
            onClick={createSampleData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Sample Data'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Test Results:</h3>
            <div className="space-y-1 font-mono text-sm">
              {testResults.map((result, index) => (
                <div key={index} className={result.startsWith('❌') ? 'text-red-600' : 'text-green-600'}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};