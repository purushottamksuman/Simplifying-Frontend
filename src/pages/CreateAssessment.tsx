import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Save, FileText, HelpCircle, Settings, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { supabase } from '../lib/supabase';

interface Assessment {
  assessment_id?: string;
  assessment_name: string;
  description: string;
  instructions: string;
  total_time: number;
  min_student_age: number;
  max_student_age: number;
  maximum_marks: number;
  parent_assessment_id: string | null;
  display_order: number;
  is_active: boolean;
}

interface Question {
  question_id?: string;
  assessment_id?: string;
  question_text: string;
  question_type: 'MCQ' | 'Subjective';
  marks: number;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  options?: QuestionOption[];
}

interface QuestionOption {
  option_id?: string;
  question_id?: string;
  option_text: string;
  marks: number;
  image_url: string | null;
  is_correct: boolean;
  display_order: number;
}

export const CreateAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Main assessment form
  const [assessmentForm, setAssessmentForm] = useState<Assessment>({
    assessment_name: '',
    description: '',
    instructions: '',
    total_time: 30,
    min_student_age: 10,
    max_student_age: 25,
    maximum_marks: 100,
    parent_assessment_id: null,
    display_order: 1,
    is_active: true
  });

  // Question form
  const [questionForm, setQuestionForm] = useState<Question>({
    question_text: '',
    question_type: 'MCQ',
    marks: 5,
    image_url: null,
    display_order: 1,
    is_active: true,
    options: []
  });

  useEffect(() => {
    fetchExistingAssessments();
  }, []);

  const fetchExistingAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      ...questionForm,
      display_order: questions.length + 1,
      options: questionForm.question_type === 'MCQ' ? [
        { option_text: '', marks: 0, image_url: null, is_correct: false, display_order: 1 }
      ] : []
    };
    setQuestions([...questions, newQuestion]);
    setQuestionForm({
      question_text: '',
      question_type: 'MCQ',
      marks: 5,
      image_url: null,
      display_order: 1,
      is_active: true,
      options: []
    });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOptionToQuestion = (questionIndex: number) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    if (question.options) {
      question.options.push({
        option_text: '',
        marks: 0,
        image_url: null,
        is_correct: false,
        display_order: question.options.length + 1
      });
    }
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, updatedOption: QuestionOption) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options![optionIndex] = updatedOption;
    }
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options = newQuestions[questionIndex].options!.filter((_, i) => i !== optionIndex);
    }
    setQuestions(newQuestions);
  };

  const saveAssessment = async () => {
    try {
      // Save main assessment
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .insert([assessmentForm])
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Save questions
      for (const question of questions) {
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .insert([{
            ...question,
            assessment_id: assessmentData.assessment_id,
            options: undefined // Remove options from question insert
          }])
          .select()
          .single();

        if (questionError) throw questionError;

        // Save options for MCQ questions
        if (question.question_type === 'MCQ' && question.options && question.options.length > 0) {
          const optionsToInsert = question.options.map(option => ({
            ...option,
            question_id: questionData.question_id
          }));

          const { error: optionsError } = await supabase
            .from('question_options')
            .insert(optionsToInsert);

          if (optionsError) throw optionsError;
        }
      }

      alert('Assessment created successfully!');
      navigate('/admin/exam-management');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment: ' + (error as Error).message);
    }
  };

  const getTotalMarks = () => {
    return questions.reduce((total, question) => total + question.marks, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/admin/exam-management')}
              variant="outline"
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exams
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#13377c]">Create Assessment</h1>
              <p className="text-gray-600">Build comprehensive assessments with questions and sub-sections</p>
            </div>
          </div>
          
          <Button 
            onClick={saveAssessment}
            className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl px-6 py-3 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Assessment
          </Button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{questions.length}</div>
              <div className="text-sm opacity-90">Questions</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{getTotalMarks()}</div>
              <div className="text-sm opacity-90">Total Marks</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{questions.filter(q => q.question_type === 'MCQ').length}</div>
              <div className="text-sm opacity-90">MCQ Questions</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{questions.filter(q => q.question_type === 'Subjective').length}</div>
              <div className="text-sm opacity-90">Subjective Questions</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-white shadow-lg p-1">
            <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-[#3479ff] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Assessment Details
            </TabsTrigger>
            <TabsTrigger value="structure" className="rounded-lg data-[state=active]:bg-[#3479ff] data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Structure & Sub-sections
            </TabsTrigger>
            <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-[#3479ff] data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4 mr-2" />
              Questions & Options
            </TabsTrigger>
          </TabsList>

          {/* Assessment Details Tab */}
          <TabsContent value="details" className="mt-8">
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#13377c]">Assessment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="assessment_name" className="text-[#13377c] font-medium">Assessment Name</Label>
                      <Input
                        id="assessment_name"
                        value={assessmentForm.assessment_name}
                        onChange={(e) => setAssessmentForm({...assessmentForm, assessment_name: e.target.value})}
                        placeholder="e.g., Aptitude Test, Behavioral Assessment"
                        className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-[#13377c] font-medium">Description</Label>
                      <Textarea
                        id="description"
                        value={assessmentForm.description}
                        onChange={(e) => setAssessmentForm({...assessmentForm, description: e.target.value})}
                        placeholder="Describe what this assessment evaluates"
                        className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[120px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructions" className="text-[#13377c] font-medium">Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={assessmentForm.instructions}
                        onChange={(e) => setAssessmentForm({...assessmentForm, instructions: e.target.value})}
                        placeholder="Instructions for students taking this assessment"
                        className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[120px]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="total_time" className="text-[#13377c] font-medium">Time Limit (minutes)</Label>
                        <Input
                          id="total_time"
                          type="number"
                          value={assessmentForm.total_time}
                          onChange={(e) => setAssessmentForm({...assessmentForm, total_time: parseInt(e.target.value)})}
                          className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maximum_marks" className="text-[#13377c] font-medium">Maximum Marks</Label>
                        <Input
                          id="maximum_marks"
                          type="number"
                          value={assessmentForm.maximum_marks}
                          onChange={(e) => setAssessmentForm({...assessmentForm, maximum_marks: parseInt(e.target.value)})}
                          className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min_age" className="text-[#13377c] font-medium">Min Student Age</Label>
                        <Input
                          id="min_age"
                          type="number"
                          value={assessmentForm.min_student_age}
                          onChange={(e) => setAssessmentForm({...assessmentForm, min_student_age: parseInt(e.target.value)})}
                          className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_age" className="text-[#13377c] font-medium">Max Student Age</Label>
                        <Input
                          id="max_age"
                          type="number"
                          value={assessmentForm.max_student_age}
                          onChange={(e) => setAssessmentForm({...assessmentForm, max_student_age: parseInt(e.target.value)})}
                          className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="parent_assessment" className="text-[#13377c] font-medium">Parent Assessment (Optional)</Label>
                      <Select
                        value={assessmentForm.parent_assessment_id || ''}
                        onValueChange={(value) => setAssessmentForm({...assessmentForm, parent_assessment_id: value || null})}
                      >
                        <SelectTrigger className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]">
                          <SelectValue placeholder="Select parent assessment (for sub-sections)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None (Root Assessment)</SelectItem>
                          {assessments.filter(a => !a.parent_assessment_id).map((assessment) => (
                            <SelectItem key={assessment.assessment_id} value={assessment.assessment_id!}>
                              {assessment.assessment_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="mt-8">
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#13377c]">Assessment Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Structure management coming soon</p>
                  <p className="text-gray-400 text-sm">This will allow you to create nested sub-sections</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Question Form */}
              <Card className="lg:col-span-1 rounded-[1.5rem] shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#13377c]">
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question_text" className="text-[#13377c] font-medium">Question Text</Label>
                    <Textarea
                      id="question_text"
                      value={questionForm.question_text}
                      onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                      placeholder="Enter your question here..."
                      className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="question_type" className="text-[#13377c] font-medium">Question Type</Label>
                      <Select
                        value={questionForm.question_type}
                        onValueChange={(value: 'MCQ' | 'Subjective') => setQuestionForm({
                          ...questionForm, 
                          question_type: value,
                          options: value === 'MCQ' ? [{ option_text: '', marks: 0, image_url: null, is_correct: false, display_order: 1 }] : []
                        })}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MCQ">Multiple Choice</SelectItem>
                          <SelectItem value="Subjective">Subjective</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="marks" className="text-[#13377c] font-medium">Marks</Label>
                      <Input
                        id="marks"
                        type="number"
                        value={questionForm.marks}
                        onChange={(e) => setQuestionForm({...questionForm, marks: parseInt(e.target.value)})}
                        className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="image_url" className="text-[#13377c] font-medium">Image URL (Optional)</Label>
                    <Input
                      id="image_url"
                      value={questionForm.image_url || ''}
                      onChange={(e) => setQuestionForm({...questionForm, image_url: e.target.value || null})}
                      placeholder="Enter image URL"
                      className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                    />
                  </div>

                  {/* MCQ Options */}
                  {questionForm.question_type === 'MCQ' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[#13377c] font-medium">Options</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setQuestionForm({
                            ...questionForm,
                            options: [...(questionForm.options || []), {
                              option_text: '',
                              marks: 0,
                              image_url: null,
                              is_correct: false,
                              display_order: (questionForm.options?.length || 0) + 1
                            }]
                          })}
                          className="rounded-lg"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      
                      {questionForm.options?.map((option, index) => (
                        <div key={index} className="p-3 border rounded-xl bg-gray-50 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#13377c]">{String.fromCharCode(65 + index)}.</span>
                            <Input
                              value={option.option_text}
                              onChange={(e) => {
                                const newOptions = [...(questionForm.options || [])];
                                newOptions[index] = {...option, option_text: e.target.value};
                                setQuestionForm({...questionForm, options: newOptions});
                              }}
                              placeholder="Enter option text"
                              className="flex-1 rounded-lg"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newOptions = questionForm.options?.filter((_, i) => i !== index) || [];
                                setQuestionForm({...questionForm, options: newOptions});
                              }}
                              className="rounded-lg text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={option.is_correct}
                                onChange={(e) => {
                                  const newOptions = [...(questionForm.options || [])];
                                  newOptions[index] = {...option, is_correct: e.target.checked};
                                  setQuestionForm({...questionForm, options: newOptions});
                                }}
                                className="rounded"
                              />
                              <Label className="text-sm">Correct Answer</Label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Marks:</Label>
                              <Input
                                type="number"
                                value={option.marks}
                                onChange={(e) => {
                                  const newOptions = [...(questionForm.options || [])];
                                  newOptions[index] = {...option, marks: parseInt(e.target.value)};
                                  setQuestionForm({...questionForm, options: newOptions});
                                }}
                                className="w-20 rounded-lg"
                                min="0"
                                max={questionForm.marks}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    onClick={addQuestion}
                    className="w-full bg-[#3479ff] hover:bg-[#2968e6] rounded-xl"
                    disabled={!questionForm.question_text.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Marks Summary */}
              <Card className="mt-6 rounded-[1.5rem] shadow-lg border-0 bg-gradient-to-r from-[#3479ff] to-[#4f8bff] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Marks Summary</h3>
                      <p className="text-sm opacity-90">Total allocated: {getTotalMarks()} / {assessmentForm.maximum_marks} marks</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{Math.round((getTotalMarks() / assessmentForm.maximum_marks) * 100)}%</div>
                      <div className="text-sm opacity-90">Allocated</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min((getTotalMarks() / assessmentForm.maximum_marks) * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#13377c]">Questions ({questions.length})</h2>
                {getTotalMarks() > assessmentForm.maximum_marks && (
                  <Badge variant="destructive" className="rounded-full">
                    Marks exceed limit by {getTotalMarks() - assessmentForm.maximum_marks}
                  </Badge>
                )}
              </div>
              
              {questions.length === 0 ? (
                <Card className="rounded-[1.5rem] border-2 border-dashed border-gray-300">
                  <CardContent className="p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No questions added yet</p>
                    <p className="text-gray-400 text-sm">Add questions using the form on the left</p>
                  </CardContent>
                </Card>
              ) : (
                questions.map((question, index) => (
                  <Card key={index} className="rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-[#13377c]">Q{index + 1}.</span>
                            <Badge variant={question.question_type === 'MCQ' ? "default" : "secondary"} className="rounded-full">
                              {question.question_type}
                            </Badge>
                            <Badge variant="outline" className="rounded-full">
                              {question.marks} marks
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-4">{question.question_text}</p>
                          
                          {question.image_url && (
                            <div className="mb-4">
                              <img 
                                src={question.image_url} 
                                alt="Question" 
                                className="max-w-xs rounded-lg border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* MCQ Options */}
                          {question.question_type === 'MCQ' && question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex} 
                                  className={`p-3 rounded-lg border ${
                                    option.is_correct ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="font-medium text-[#13377c]">
                                        {String.fromCharCode(65 + optionIndex)}.
                                      </span>
                                      <span>{option.option_text}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {option.marks} marks
                                      </Badge>
                                      {option.is_correct && (
                                        <Badge className="bg-green-500 text-xs">
                                          Correct
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-lg"
                            onClick={() => {
                              setQuestionForm(question);
                              setEditingQuestion(question);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-lg text-red-600 hover:text-red-700"
                            onClick={() => removeQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};