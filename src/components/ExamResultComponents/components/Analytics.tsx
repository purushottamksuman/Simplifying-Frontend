import React from 'react';
import { BarChart, PieChart, TrendingUp, Users } from 'lucide-react';
import { useQuestions } from '../../../hooks/useQuestions';
import { useSections } from '../../../hooks/useSections';
import { useSubSections } from '../../../hooks/useSubSections';

export const Analytics = () => {
  const { questions } = useQuestions();
  const { sections } = useSections();
  const { subSections } = useSubSections();

  const questionsBySection = questions.reduce((acc, question) => {
    const sectionName = question.sub_section.section.name;
    acc[sectionName] = (acc[sectionName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const questionsBySubSection = questions.reduce((acc, question) => {
    const subSectionName = `${question.sub_section.section.name} - ${question.sub_section.name}`;
    acc[subSectionName] = (acc[subSectionName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalQuestions = questions.length;
  const totalSections = sections.length;
  const totalSubSections = subSections.length;
  const avgQuestionsPerSubSection = totalSubSections > 0 ? (totalQuestions / totalSubSections).toFixed(1) : 0;

  const getCompletionStatus = () => {
    return subSections.map(subSection => {
      const currentQuestions = questions.filter(q => q.sub_section_id === subSection.id).length;
      const targetQuestions = subSection.default_no_of_questions;
      const completionPercentage = targetQuestions > 0 ? (currentQuestions / targetQuestions) * 100 : 0;
      
      return {
        subSection: `${subSection.section.name} - ${subSection.name}`,
        current: currentQuestions,
        target: targetQuestions,
        percentage: Math.min(completionPercentage, 100)
      };
    });
  };

  const completionData = getCompletionStatus();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">System Analytics</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Questions</p>
                <p className="text-2xl font-bold text-blue-900">{totalQuestions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Sub-sections</p>
                <p className="text-2xl font-bold text-green-900">{totalSubSections}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Avg per Sub-section</p>
                <p className="text-2xl font-bold text-yellow-900">{avgQuestionsPerSubSection}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Sections</p>
                <p className="text-2xl font-bold text-purple-900">{totalSections}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions by Section */}
        <div className="mb-8">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Questions by Section</h3>
          <div className="space-y-2">
            {sections.map((section) => {
              const count = questionsBySection[section.name] || 0;
              return (
                <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{section.name}</span>
                  <span className="text-sm font-bold text-gray-900">{count} questions</span>
                </div>
              );
            })}
            {sections.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No sections available
              </div>
            )}
          </div>
        </div>

        {/* Completion Progress */}
        <div>
          <h3 className="text-md font-semibold text-gray-900 mb-4">Sub-section Completion Progress</h3>
          <div className="space-y-4">
            {completionData.map((item) => (
              <div key={item.subSection} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.subSection}</span>
                  <span className="text-sm text-gray-500">
                    {item.current}/{item.target} ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.percentage >= 100
                        ? 'bg-green-500'
                        : item.percentage >= 75
                        ? 'bg-blue-500'
                        : item.percentage >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};