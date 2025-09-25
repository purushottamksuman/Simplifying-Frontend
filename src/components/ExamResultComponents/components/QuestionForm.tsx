import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useSections } from '../../../hooks/useSections';
import { useSubSections } from '../../../hooks/useSubSections';
import { Question, Option, DefaultOption } from '../../../types/database';
import { supabase } from '../../../lib/supabase';

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questionData: Omit<Question, 'id'>, options: Omit<Option, 'id' | 'question_id'>[]) => Promise<void>;
  editingQuestion?: Question & { options: Option[] };
}

export const QuestionForm = ({ isOpen, onClose, onSubmit, editingQuestion }: QuestionFormProps) => {
  const { sections, loading: sectionsLoading, error } = useSections();
  const { subSections, loading: subSectionsLoading } = useSubSections();
  
  // Debug logs
  console.log('QuestionForm - sections:', sections);
  console.log('QuestionForm - subSections:', subSections);
  console.log('QuestionForm - sectionsLoading:', sectionsLoading);
  console.log('QuestionForm - subSectionsLoading:', subSectionsLoading);
  console.log('QuestionForm - error:', error);
  
  const [formData, setFormData] = useState({
    section_id: '',
    sub_section_id: '',
    question_text: '',
    marks: 1,
    question_type: 'MCQ',
    min_age: undefined as number | undefined,
    max_age: undefined as number | undefined,
  });
  const [options, setOptions] = useState<Array<{ option_text: string; marks?: number; type?: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        section_id: editingQuestion.sub_section.section_id,
        sub_section_id: editingQuestion.sub_section_id,
        question_text: editingQuestion.question_text,
        marks: editingQuestion.marks,
        question_type: editingQuestion.question_type,
        min_age: editingQuestion.min_age ?? undefined,
        max_age: editingQuestion.max_age ?? undefined,
      });
      setOptions(editingQuestion.options.map(opt => ({
        option_text: opt.option_text,
        marks: opt.marks ?? undefined,
        type: opt.type ?? undefined,
      })));
    } else {
      setFormData({
        section_id: '',
        sub_section_id: '',
        question_text: '',
        marks: 1,
        question_type: 'MCQ',
        min_age: undefined,
        max_age: undefined,
      });
      setOptions([]);
    }
  }, [editingQuestion, isOpen]);

  useEffect(() => {
    if (formData.sub_section_id) {
      const selectedSubSection = subSections.find(ss => ss.id === formData.sub_section_id);
      if (selectedSubSection?.has_default_options && selectedSubSection.default_options.length > 0 && options.length === 0) {
        setOptions(selectedSubSection.default_options.map(defaultOpt => ({
          option_text: defaultOpt.option_text,
          marks: defaultOpt.marks ?? undefined,
          type: defaultOpt.type ?? undefined,
        })));
      }
    }
  }, [formData.sub_section_id, subSections, options.length]);

  // Reset sub-section when section changes
  useEffect(() => {
    if (formData.section_id && formData.sub_section_id) {
      const selectedSubSection = subSections.find(ss => ss.id === formData.sub_section_id);
      if (selectedSubSection && selectedSubSection.section_id !== formData.section_id) {
        setFormData(prev => ({ ...prev, sub_section_id: '' }));
        setOptions([]);
      }
    }
  }, [formData.section_id, formData.sub_section_id, subSections]);

  // Get filtered sub-sections based on selected section
  const filteredSubSections = formData.section_id 
    ? subSections.filter(ss => ss.section_id === formData.section_id)
    : [];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question_text.trim()) {
      alert('Please enter a question text');
      return;
    }

    if (!formData.section_id) {
      alert('Please select a section');
      return;
    }

    if (!formData.sub_section_id) {
      alert('Please select a sub-section');
      return;
    }
    if (options.length === 0) {
      alert('Please add at least one option');
      return;
    }

    if (formData.question_type === 'RIASEC') {
      if (options.length !== 2) {
        alert('RIASEC questions must have exactly 2 options');
        return;
      }
      if (options.some(opt => !opt.type)) {
        alert('Please select RIASEC type for all options');
        return;
      }
      if (options[0].type === options[1].type) {
        alert('Options must have different RIASEC types');
        return;
      }
    } else {
      if (options.some(opt => opt.marks == null)) {
        alert('Please enter marks for all options');
        return;
      }
    }

    setLoading(true);
    try {
      const parsedFormData = {
        ...formData,
        min_age: formData.min_age !== undefined ? formData.min_age : null,
        max_age: formData.max_age !== undefined ? formData.max_age : null,
      };
      const { section_id, ...questionData } = parsedFormData;
      const preparedOptions = options.map(opt => ({
        option_text: opt.option_text,
        marks: formData.question_type === 'RIASEC' ? null : (opt.marks ?? null),
        type: formData.question_type === 'RIASEC' ? opt.type ?? null : null,
      }));
      await onSubmit(questionData, preparedOptions);
      handleClose();
    } catch (error) {
      alert('Failed to save question');
      console.error('Error saving question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      section_id: '',
      sub_section_id: '',
      question_text: '',
      marks: 1,
      question_type: 'MCQ',
      min_age: undefined,
      max_age: undefined,
    });
    setOptions([]);
    onClose();
  };

  const addOption = () => {
    if (formData.question_type === 'RIASEC' && options.length >= 2) {
      alert('Only 2 options allowed for RIASEC questions');
      return;
    }
    const newOption: { option_text: string; marks?: number; type?: string } = { option_text: '' };
    if (formData.question_type === 'RIASEC') {
      newOption.type = '';
    } else {
      newOption.marks = 1;
    }
    setOptions([...options, newOption]);
  };

  const updateOption = (index: number, field: 'option_text' | 'marks' | 'type', value: string | number) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const loadDefaultOptions = () => {
    const selectedSubSection = subSections.find(ss => ss.id === formData.sub_section_id);
    if (selectedSubSection?.default_options) {
      let defaultOpts = selectedSubSection.default_options.map(defaultOpt => ({
        option_text: defaultOpt.option_text,
        marks: defaultOpt.marks ?? undefined,
        type: defaultOpt.type ?? undefined,
      }));
      if (formData.question_type === 'RIASEC' && defaultOpts.length > 2) {
        defaultOpts = defaultOpts.slice(0, 2);
      }
      setOptions(defaultOpts);
    }
  };

  if (!isOpen) return null;

  // Show connection message if Supabase is not connected
  if (!supabase) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Database Connection Required</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Please connect to Supabase to access the database and manage questions.
            </p>
            <p className="text-sm text-gray-500">
              Click the "Connect to Supabase" button in the top right corner.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Show loading or error states */}
        {(sectionsLoading || subSectionsLoading) && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading sections and sub-sections...</p>
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Error loading data: {error}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Please ensure you're connected to Supabase and the migration has been run.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!sectionsLoading && !subSectionsLoading && sections.length === 0 && !error && (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No sections found. The database tables may not be created yet.
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Please ensure the migration has been run to create the required tables and data.
              </p>
              <button
                onClick={() => {
                  console.log('Retrying data fetch...');
                  window.location.reload();
                }}
                className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!sectionsLoading && !subSectionsLoading && sections.length > 0 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Debug: Found {sections.length} sections and {subSections.length} sub-sections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={formData.section_id}
                onChange={(e) => setFormData({ ...formData, section_id: e.target.value, sub_section_id: '' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Available sections: {sections.map(s => s.name).join(', ')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-section
              </label>
              <select
                value={formData.sub_section_id}
                onChange={(e) => setFormData({ ...formData, sub_section_id: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.section_id}
              >
                <option value="">Select a sub-section</option>
                {filteredSubSections.map((subSection) => (
                  <option key={subSection.id} value={subSection.id}>
                    {subSection.name}
                  </option>
                ))}
              </select>
              {!formData.section_id && (
                <p className="mt-1 text-sm text-gray-500">Please select a section first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={formData.question_type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setFormData({ ...formData, question_type: newType });
                  if (newType === 'RIASEC' && options.length > 2) {
                    setOptions(options.slice(0, 2));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="Likert">Likert Scale</option>
                <option value="Agree_Disagree">Agree/Disagree</option>
                <option value="Frequency">Frequency</option>
                <option value="RIASEC">RIASEC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter your question here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Marks
            </label>
            <input
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Age
              </label>
              <input
                type="number"
                value={formData.min_age ?? ''}
                onChange={(e) => setFormData({ ...formData, min_age: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                placeholder="e.g., 18"
              />
              <p className="mt-1 text-sm text-gray-500">Leave empty if no minimum age requirement</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Age
              </label>
              <input
                type="number"
                value={formData.max_age ?? ''}
                onChange={(e) => setFormData({ ...formData, max_age: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                placeholder="e.g., 65"
              />
              <p className="mt-1 text-sm text-gray-500">Leave empty if no maximum age requirement</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Options</h3>
              <div className="space-x-2">
                {formData.sub_section_id && filteredSubSections.find(ss => ss.id === formData.sub_section_id)?.has_default_options && (
                  <button
                    type="button"
                    onClick={loadDefaultOptions}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load Default Options
                  </button>
                )}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={formData.question_type === 'RIASEC' && options.length >= 2}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option.option_text}
                      onChange={(e) => updateOption(index, 'option_text', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Option text"
                      required
                    />
                  </div>
                  {formData.question_type === 'RIASEC' ? (
                    <div className="w-48">
                      <select
                        value={option.type ?? ''}
                        onChange={(e) => updateOption(index, 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select RIASEC type</option>
                        <option value="R">Realistic (R)</option>
                        <option value="I">Investigative (I)</option>
                        <option value="A">Artistic (A)</option>
                        <option value="S">Social (S)</option>
                        <option value="E">Enterprising (E)</option>
                        <option value="C">Conventional (C)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="w-24">
                      <input
                        type="number"
                        value={option.marks ?? 0}
                        onChange={(e) => updateOption(index, 'marks', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Marks"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {options.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No options added yet. Click "Add Option" to get started.
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Add Question')}
            </button>
          </div>
          </form>
        )}
      </div>
    </div>
  );
};