import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useSections } from '../../../hooks/useSections';
import { useSubSections } from '../../../hooks/useSubSections';
import { useQuestions } from '../../../hooks/useQuestions';
import { supabase } from '../../../lib/supabase';

interface BulkUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkUpload = ({ isOpen, onClose, onSuccess }: BulkUploadProps) => {
  const { sections } = useSections();
  const { subSections } = useSubSections();
  const { createQuestion } = useQuestions();
  const [selectedSubSection, setSelectedSubSection] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const generateTemplate = (subSectionId: string) => {
    const subSection = subSections.find(ss => ss.id === subSectionId);
    if (!subSection) return;

    const sampleData = getSampleDataForSubSection(subSection);
    const excelContent = generateExcelContent(sampleData, subSection);
    
    // Create Excel file and download
    downloadExcelFile(excelContent, `${subSection.section.name}_${subSection.name}_template.xlsx`);
  };

  const getSampleDataForSubSection = (subSection: any) => {
    const baseData = {
      question_text: '',
      marks: 1,
      question_type: subSection.question_type
    };

    switch (subSection.name) {
      case 'Numerical Reasoning':
        return [
          {
            ...baseData,
            question_text: 'If a train travels 120 km in 2 hours, what is its average speed?',
            option1: '60 km/h',
            option1_marks: 1,
            option2: '50 km/h',
            option2_marks: 0,
            option3: '70 km/h',
            option3_marks: 0,
            option4: '80 km/h',
            option4_marks: 0
          },
          {
            ...baseData,
            question_text: 'What is 25% of 200?',
            option1: '50',
            option1_marks: 1,
            option2: '40',
            option2_marks: 0,
            option3: '60',
            option3_marks: 0,
            option4: '45',
            option4_marks: 0
          }
        ];

      case 'Verbal Reasoning':
        return [
          {
            ...baseData,
            question_text: 'Choose the word that best completes the analogy: Book is to Reading as Fork is to ___',
            option1: 'Eating',
            option1_marks: 1,
            option2: 'Cooking',
            option2_marks: 0,
            option3: 'Kitchen',
            option3_marks: 0,
            option4: 'Spoon',
            option4_marks: 0
          },
          {
            ...baseData,
            question_text: 'Which word is the antonym of "Abundant"?',
            option1: 'Scarce',
            option1_marks: 1,
            option2: 'Plentiful',
            option2_marks: 0,
            option3: 'Rich',
            option3_marks: 0,
            option4: 'Ample',
            option4_marks: 0
          }
        ];

      case 'Leadership':
        return [
          {
            ...baseData,
            question_text: 'I enjoy taking charge of group projects and guiding team members.',
            option1: 'Strongly Agree',
            option1_marks: 5,
            option2: 'Agree',
            option2_marks: 4,
            option3: 'Neutral',
            option3_marks: 3,
            option4: 'Disagree',
            option4_marks: 2,
            option5: 'Strongly Disagree',
            option5_marks: 1
          },
          {
            ...baseData,
            question_text: 'I am comfortable making difficult decisions under pressure.',
            option1: 'Strongly Agree',
            option1_marks: 5,
            option2: 'Agree',
            option2_marks: 4,
            option3: 'Neutral',
            option3_marks: 3,
            option4: 'Disagree',
            option4_marks: 2,
            option5: 'Strongly Disagree',
            option5_marks: 1
          }
        ];

      case 'Time Management':
        return [
          {
            ...baseData,
            question_text: 'How often do you complete tasks before their deadlines?',
            option1: 'Always',
            option1_marks: 5,
            option2: 'Often',
            option2_marks: 4,
            option3: 'Sometimes',
            option3_marks: 3,
            option4: 'Rarely',
            option4_marks: 2,
            option5: 'Never',
            option5_marks: 1
          },
          {
            ...baseData,
            question_text: 'How frequently do you use planning tools or schedules?',
            option1: 'Daily',
            option1_marks: 5,
            option2: 'Weekly',
            option2_marks: 4,
            option3: 'Monthly',
            option3_marks: 3,
            option4: 'Occasionally',
            option4_marks: 2,
            option5: 'Never',
            option5_marks: 1
          }
        ];

      default:
        // Generic template for other sub-sections
        return [
          {
            ...baseData,
            question_text: 'Sample question for ' + subSection.name,
           min_age: 18,
           max_age: 65,
            option1: 'Option 1',
            option1_marks: 1,
            option2: 'Option 2',
            option2_marks: 0,
            option3: 'Option 3',
            option3_marks: 0,
            option4: 'Option 4',
            option4_marks: 0
          }
        ];
    }
  };

  const generateExcelContent = (data: any[], subSection: any) => {
    const maxOptions = Math.max(...data.map(item => {
      let count = 0;
      for (let i = 1; i <= 10; i++) {
        if (item[`option${i}`]) count = i;
      }
      return count;
    }));

    // Generate headers for Excel
    const headers = ['question_text', 'marks', 'question_type'];
    for (let i = 1; i <= maxOptions; i++) {
      headers.push(`option${i}`, `option${i}_marks`);
    }

    // Generate Excel data
    const excelData = [headers];
    
    data.forEach(item => {
      const row = [
        item.question_text,
        item.marks,
        item.question_type
      ];
      
      for (let i = 1; i <= maxOptions; i++) {
        row.push(item[`option${i}`] || '');
        row.push(item[`option${i}_marks`] || 0);
      }
      
      excelData.push(row);
    });

    return excelData;
  };

  const downloadExcelFile = (data: any[][], filename: string) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths for better readability
    const colWidths = [
      { wch: 50 }, // question_text
      { wch: 8 },  // marks
      { wch: 15 }, // question_type
    ];
    
    // Add widths for option columns
    const maxOptions = (data[0].length - 3) / 2;
    for (let i = 0; i < maxOptions; i++) {
      colWidths.push({ wch: 25 }); // option text
      colWidths.push({ wch: 8 });  // option marks
    }
    
    ws['!cols'] = colWidths;
    
    // Add some styling to headers
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E3F2FD" } },
      alignment: { horizontal: "center" }
    };
    
    // Apply header styling
    for (let i = 0; i < data[0].length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = headerStyle;
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Questions Template');
    
    // Save the file
    XLSX.writeFile(wb, filename);
  };

  const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must have at least a header and one data row');
          }
          
          const headers = jsonData[0] as string[];
          const questions = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (!row || row.length === 0) continue;
            
            const question: any = {
              question_text: row[0]?.toString().trim() || '',
              marks: parseInt(row[1]) || 1,
              question_type: row[2]?.toString().trim() || 'MCQ'
            };
            
            const options = [];
            for (let j = 3; j < row.length; j += 2) {
              const optionText = row[j]?.toString().trim();
              const optionMarks = parseInt(row[j + 1]) || 0;
              
              if (optionText) {
                options.push({
                  option_text: optionText,
                  marks: optionMarks
                });
              }
            }
            
            if (question.question_text && options.length > 0) {
              questions.push({ question, options });
            }
          }
          
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  };









  const handleFileUpload = async () => {
    if (!uploadFile || !selectedSubSection) {
      alert('Please select a sub-section and upload an Excel file');
      return;
    }

    setUploading(true);
    setUploadResults(null);

    try {
      const parsedQuestions = await parseExcel(uploadFile);
      
      let successCount = 0;
      const errors: string[] = [];

      for (const { question, options } of parsedQuestions) {
        try {
          await createQuestion(
            {
              ...question,
              sub_section_id: selectedSubSection
            },
            options
          );
          successCount++;
        } catch (error) {
          errors.push(`Failed to create question "${question.question_text}": ${error}`);
        }
      }

      setUploadResults({ success: successCount, errors });
      
      if (successCount > 0) {
        onSuccess();
      }
    } catch (error) {
      setUploadResults({ 
        success: 0, 
        errors: [`Failed to parse Excel file: ${error}`] 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedSubSection('');
    setUploadFile(null);
    setUploadResults(null);
    onClose();
  };

  if (!isOpen) return null;

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
              Please connect to Supabase to access the bulk upload feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Bulk Upload Questions</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">How to use bulk upload:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Select a sub-section from the dropdown</li>
                  <li>Download the template Excel file for that sub-section</li>
                  <li>Fill in your questions and options in the template</li>
                  <li>Upload the completed Excel file</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sub-section Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Sub-section
            </label>
            <select
              value={selectedSubSection}
              onChange={(e) => setSelectedSubSection(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a sub-section...</option>
              {sections.map(section => (
                <optgroup key={section.id} label={section.name}>
                  {subSections
                    .filter(ss => ss.section_id === section.id)
                    .map(subSection => (
                      <option key={subSection.id} value={subSection.id}>
                        {subSection.name} ({subSection.question_type})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Template Download */}
          {selectedSubSection && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Download Template</h3>
                  <p className="text-sm text-gray-600">
                    Get a pre-filled Excel template with sample questions for this sub-section
                  </p>
                </div>
                <button
                  onClick={() => generateTemplate(selectedSubSection)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {uploadFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upload Results */}
          {uploadResults && (
            <div className="space-y-3">
              {uploadResults.success > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Successfully uploaded {uploadResults.success} questions
                    </span>
                  </div>
                </div>
              )}
              
              {uploadResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium mb-2">
                        {uploadResults.errors.length} errors occurred:
                      </p>
                      <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                        {uploadResults.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {uploadResults.errors.length > 5 && (
                          <li>... and {uploadResults.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Close
            </button>
            <button
              onClick={handleFileUpload}
              disabled={!uploadFile || !selectedSubSection || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Questions'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};