import React, { useState } from 'react';
import { Edit, Trash2, Filter, Search, Plus, Upload } from 'lucide-react';
import { useQuestions } from '../../../hooks/useQuestions';
import { useSections } from '../../../hooks/useSections';
import { useSubSections } from '../../../hooks/useSubSections';
import { QuestionWithOptions } from '../../../types/database';
import { supabase } from '../../../lib/supabase';

interface QuestionsListProps {
  onEditQuestion: (question: QuestionWithOptions) => void;
  onAddQuestion: () => void;
  onBulkUpload: () => void;
}

export const QuestionsList = ({ onEditQuestion, onAddQuestion, onBulkUpload }: QuestionsListProps) => {
  const { questions, loading, error, deleteQuestion } = useQuestions();
  const { sections } = useSections();
  const { subSections } = useSubSections();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubSection, setSelectedSubSection] = useState('');

  // Filter sub-sections based on selected section
  const filteredSubSections = selectedSection 
    ? subSections.filter(ss => ss.section_id === selectedSection)
    : subSections;

  // Reset sub-section filter when section changes
  React.useEffect(() => {
    if (selectedSection && selectedSubSection) {
      const subSection = subSections.find(ss => ss.id === selectedSubSection);
      if (subSection && subSection.section_id !== selectedSection) {
        setSelectedSubSection('');
      }
    }
  }, [selectedSection, selectedSubSection, subSections]);
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = !selectedSection || question.sub_section.section_id === selectedSection;
    const matchesSubSection = !selectedSubSection || question.sub_section_id === selectedSubSection;
    return matchesSearch && matchesSection && matchesSubSection;
  });

  const handleDelete = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(questionId);
      } catch (error) {
        alert('Failed to delete question');
        console.error('Error deleting question:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading questions...</span>
      </div>
    );
  }

  // Show connection message if Supabase is not connected
  if (!supabase) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Database Connection Required</h3>
          <p className="text-gray-600 mb-4">
            Please connect to Supabase to access the database and manage questions.
          </p>
          <p className="text-sm text-gray-500">
            Click the "Connect to Supabase" button in the top right corner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Questions Management</h2>
          <div className="flex space-x-3">
            <button
              onClick={onBulkUpload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </button>
            <button
              onClick={onAddQuestion}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedSubSection}
              onChange={(e) => setSelectedSubSection(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Sub-sections</option>
              {filteredSubSections.map((subSection) => (
                <option key={subSection.id} value={subSection.id}>
                  {subSection.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section / Sub-section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm || selectedSubSection ? 'No questions found matching your filters.' : 'No questions yet. Click "Add Question" to get started.'}
                </td>
              </tr>
            ) : (
              filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {question.question_text}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{question.sub_section.section.name}</div>
                    <div className="text-sm text-gray-500">{question.sub_section.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {question.question_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.marks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.min_age || question.max_age ? (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {question.min_age || 0}-{question.max_age || '∞'}
                      </span>
                    ) : (
                      <span className="text-gray-400">No limit</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.options.length} options
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditQuestion(question)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};