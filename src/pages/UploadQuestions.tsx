import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  FileText, 
  BarChart3,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { supabase } from '../lib/supabase';

interface Category {
  category_id: string;
  domain: string;
  code: string;
  name: string;
  is_active: boolean;
}

interface QuestionOption {
  text: string;
  display_order: number;
}

interface QuestionForm {
  prompt: string;
  type: string;
  options: QuestionOption[];
  correct_option_index: number | null;
}

interface RecentQuestion {
  question_id: string;
  prompt: string;
  domain: string;
  code: string;
  name: string;
  type: string;
  created_at: string;
  option_count: number;
}

interface CategoryCount {
  domain: string;
  code: string;
  name: string;
  question_count: number;
}

export const UploadQuestions: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [csvUploading, setCsvUploading] = useState(false);

  // Form state
  const [questionForm, setQuestionForm] = useState<QuestionForm>({
    prompt: '',
    type: '',
    options: [
      { text: '', display_order: 1 },
      { text: '', display_order: 2 }
    ],
    correct_option_index: null
  });

  // Domain options
  const domains = [
    { value: 'aptitude', label: 'Aptitude' },
    { value: 'psychometric', label: 'Psychometric' },
    { value: 'adversity', label: 'Adversity' },
    { value: 'sei', label: 'Social Emotional Intelligence' },
    { value: 'interest', label: 'Interest' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      setQuestionForm(prev => ({
        ...prev,
        type: selectedDomain,
        correct_option_index: selectedDomain === 'aptitude' ? null : null
      }));
    }
  }, [selectedDomain]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('assessment_categories')
        .select('*')
        .eq('is_active', true)
        .order('domain, code');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch recent questions
      await fetchRecentQuestions();
      
      // Fetch category counts
      await fetchCategoryCounts();

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_questions')
        .select(`
          question_id,
          prompt,
          type,
          created_at,
          assessment_categories!inner (domain, code, name),
          assessment_options (option_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const processedQuestions = data?.map(q => ({
        question_id: q.question_id,
        prompt: q.prompt,
        domain: q.assessment_categories.domain,
        code: q.assessment_categories.code,
        name: q.assessment_categories.name,
        type: q.type,
        created_at: q.created_at,
        option_count: q.assessment_options?.length || 0
      })) || [];

      setRecentQuestions(processedQuestions);
    } catch (err) {
      console.error('Error fetching recent questions:', err);
    }
  };

  const fetchCategoryCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_categories')
        .select(`
          domain,
          code,
          name,
          assessment_questions (question_id)
        `)
        .eq('is_active', true)
        .order('domain, code');

      if (error) throw error;

      const counts = data?.map(cat => ({
        domain: cat.domain,
        code: cat.code,
        name: cat.name,
        question_count: cat.assessment_questions?.length || 0
      })) || [];

      setCategoryCounts(counts);
    } catch (err) {
      console.error('Error fetching category counts:', err);
    }
  };

  const filteredCategories = categories.filter(cat => 
    selectedDomain ? cat.domain === selectedDomain : true
  );

  const addOption = () => {
    if (questionForm.options.length < 5) {
      setQuestionForm(prev => ({
        ...prev,
        options: [
          ...prev.options,
          { text: '', display_order: prev.options.length + 1 }
        ]
      }));
    }
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length > 2) {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index).map((opt, i) => ({
          ...opt,
          display_order: i + 1
        })),
        correct_option_index: prev.correct_option_index === index ? null : 
          prev.correct_option_index && prev.correct_option_index > index ? 
          prev.correct_option_index - 1 : prev.correct_option_index
      }));
    }
  };

  const updateOption = (index: number, text: string) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, text } : opt
      )
    }));
  };

  const submitQuestion = async () => {
    // Validation
    if (!questionForm.prompt.trim()) {
      setError('Please enter a question prompt');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    const validOptions = questionForm.options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    if (selectedDomain === 'aptitude' && questionForm.correct_option_index === null) {
      setError('Please select the correct option for aptitude questions');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Insert question
      const { data: questionData, error: questionError } = await supabase
        .from('assessment_questions')
        .insert({
          category_id: selectedCategory,
          prompt: questionForm.prompt.trim(),
          type: questionForm.type
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Insert options
      const optionsToInsert = validOptions.map((opt, index) => ({
        question_id: questionData.question_id,
        text: opt.text.trim(),
        display_order: index + 1
      }));

      const { data: optionsData, error: optionsError } = await supabase
        .from('assessment_options')
        .insert(optionsToInsert)
        .select();

      if (optionsError) throw optionsError;

      // Set correct option for aptitude questions
      if (selectedDomain === 'aptitude' && questionForm.correct_option_index !== null) {
        const correctOption = optionsData[questionForm.correct_option_index];
        if (correctOption) {
          const { error: updateError } = await supabase
            .from('assessment_questions')
            .update({ correct_option_id: correctOption.option_id })
            .eq('question_id', questionData.question_id);

          if (updateError) throw updateError;
        }
      }

      setSuccess('Question uploaded successfully!');
      
      // Reset form
      setQuestionForm({
        prompt: '',
        type: selectedDomain,
        options: [
          { text: '', display_order: 1 },
          { text: '', display_order: 2 }
        ],
        correct_option_index: null
      });

      // Refresh data
      await fetchRecentQuestions();
      await fetchCategoryCounts();

    } catch (err) {
      console.error('Error submitting question:', err);
      setError('Failed to upload question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'domain',
      'code', 
      'question',
      'type',
      'option_text_1',
      'option_text_2',
      'option_text_3',
      'option_text_4',
      'option_text_5',
      'correct_option_index'
    ];

    const sampleRows = [
      'aptitude,vr,"What is the synonym of \'happy\'?",aptitude,Joyful,Sad,Angry,Confused,,1',
      'psychometric,openness,"I enjoy trying new things",psychometric,Strongly Agree,Agree,Neutral,Disagree,Strongly Disagree,',
      'adversity,control,"I can influence the outcome of difficult situations",adversity,Always,Often,Sometimes,Rarely,Never,'
    ];

    const csvContent = [headers.join(','), ...sampleRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'question_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvUploading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain headers and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const expectedHeaders = ['domain', 'code', 'question', 'type', 'option_text_1', 'option_text_2', 'option_text_3', 'option_text_4', 'option_text_5', 'correct_option_index'];
      
      // Validate headers
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }

      let successCount = 0;
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          // Validate required fields
          if (!row.domain || !row.code || !row.question || !row.type) {
            errors.push(`Line ${i + 1}: Missing required fields`);
            continue;
          }

          // Find category
          const category = categories.find(cat => 
            cat.domain === row.domain && cat.code === row.code
          );

          if (!category) {
            errors.push(`Line ${i + 1}: Invalid domain/code combination: ${row.domain}/${row.code}`);
            continue;
          }

          // Collect options
          const options = [];
          for (let j = 1; j <= 5; j++) {
            const optionText = row[`option_text_${j}`];
            if (optionText && optionText.trim()) {
              options.push({
                text: optionText.trim(),
                display_order: j
              });
            }
          }

          if (options.length < 2) {
            errors.push(`Line ${i + 1}: At least 2 options required`);
            continue;
          }

          // Insert question
          const { data: questionData, error: questionError } = await supabase
            .from('assessment_questions')
            .insert({
              category_id: category.category_id,
              prompt: row.question.trim(),
              type: row.type
            })
            .select()
            .single();

          if (questionError) {
            errors.push(`Line ${i + 1}: ${questionError.message}`);
            continue;
          }

          // Insert options
          const optionsToInsert = options.map(opt => ({
            question_id: questionData.question_id,
            text: opt.text,
            display_order: opt.display_order
          }));

          const { data: optionsData, error: optionsError } = await supabase
            .from('assessment_options')
            .insert(optionsToInsert)
            .select();

          if (optionsError) {
            errors.push(`Line ${i + 1}: ${optionsError.message}`);
            continue;
          }

          // Set correct option for aptitude questions
          if (row.domain === 'aptitude' && row.correct_option_index) {
            const correctIndex = parseInt(row.correct_option_index) - 1;
            if (correctIndex >= 0 && correctIndex < optionsData.length) {
              const { error: updateError } = await supabase
                .from('assessment_questions')
                .update({ correct_option_id: optionsData[correctIndex].option_id })
                .eq('question_id', questionData.question_id);

              if (updateError) {
                errors.push(`Line ${i + 1}: Failed to set correct option - ${updateError.message}`);
              }
            }
          }

          successCount++;

        } catch (err) {
          errors.push(`Line ${i + 1}: ${err.message}`);
        }
      }

      // Show results
      if (successCount > 0) {
        setSuccess(`Successfully uploaded ${successCount} questions`);
        await fetchRecentQuestions();
        await fetchCategoryCounts();
      }

      if (errors.length > 0) {
        setError(`Errors occurred:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? `\n... and ${errors.length - 10} more errors` : ''}`);
      }

    } catch (err) {
      console.error('CSV upload error:', err);
      setError(`CSV upload failed: ${err.message}`);
    } finally {
      setCsvUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/exam-management')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Question Upload</h1>
            <p className="text-gray-600">Upload questions for assessments with static categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Single Question Form */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-[#13377c]">
                  <Plus className="w-6 h-6 mr-3 text-[#3479ff]" />
                  Add Single Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Domain and Category Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#13377c] font-medium">Domain</Label>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map(domain => (
                          <SelectItem key={domain.value} value={domain.value}>
                            {domain.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#13377c] font-medium">Sub-Category</Label>
                    <Select 
                      value={selectedCategory} 
                      onValueChange={setSelectedCategory}
                      disabled={!selectedDomain}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map(category => (
                          <SelectItem key={category.category_id} value={category.category_id}>
                            {category.name} ({category.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Question Prompt */}
                <div>
                  <Label className="text-[#13377c] font-medium">Question Prompt</Label>
                  <Textarea
                    value={questionForm.prompt}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Enter your question here..."
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-[#13377c] font-medium">Options</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      disabled={questionForm.options.length >= 5}
                      className="rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            value={option.text}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="rounded-xl"
                          />
                        </div>
                        
                        {selectedDomain === 'aptitude' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="correct_option"
                              checked={questionForm.correct_option_index === index}
                              onChange={() => setQuestionForm(prev => ({ 
                                ...prev, 
                                correct_option_index: index 
                              }))}
                              className="w-4 h-4 text-[#3479ff]"
                            />
                            <Label className="text-sm text-gray-600">Correct</Label>
                          </div>
                        )}

                        {questionForm.options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="rounded-lg text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-600 text-sm">{success}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={submitQuestion}
                  disabled={submitting || !selectedCategory}
                  className="w-full bg-[#3479ff] hover:bg-[#2968e6] rounded-xl py-3"
                >
                  {submitting ? 'Uploading...' : 'Upload Question'}
                </Button>
              </CardContent>
            </Card>

            {/* CSV Upload */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-[#13377c]">
                  <Upload className="w-6 h-6 mr-3 text-[#3479ff]" />
                  Bulk CSV Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      disabled={csvUploading}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {csvUploading && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <p className="text-blue-600 text-sm">Processing CSV upload...</p>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <p className="mb-2">CSV Format Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Headers: domain, code, question, type, option_text_1-5, correct_option_index</li>
                    <li>At least 2 options required per question</li>
                    <li>For aptitude questions: correct_option_index (1-5) is required</li>
                    <li>Domain/code must match existing categories</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Counts */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-[#13377c]">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#3479ff]" />
                  Question Counts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
                {domains.map(domain => {
                  const domainCounts = categoryCounts.filter(c => c.domain === domain.value);
                  const totalCount = domainCounts.reduce((sum, c) => sum + c.question_count, 0);
                  
                  return (
                    <div key={domain.value} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#13377c] capitalize">{domain.label}</h4>
                        <Badge variant="outline" className="text-[#3479ff] border-[#3479ff]">
                          {totalCount}
                        </Badge>
                      </div>
                      <div className="space-y-1 ml-4">
                        {domainCounts.map(count => (
                          <div key={count.code} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{count.name}</span>
                            <span className="text-gray-800 font-medium">{count.question_count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Questions */}
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-[#13377c]">
                  <Clock className="w-5 h-5 mr-2 text-[#3479ff]" />
                  Recent Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No questions uploaded yet</p>
                  </div>
                ) : (
                  recentQuestions.map(question => (
                    <div key={question.question_id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {question.domain}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.name}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(question.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                        {question.prompt}
                      </p>
                      <p className="text-xs text-gray-500">
                        {question.option_count} options
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};