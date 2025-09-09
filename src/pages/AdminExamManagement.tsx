import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, ChevronRight, ChevronDown, BookOpen, FileText, HelpCircle, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { supabase } from '../lib/supabase';

interface Exam {
  exam_id: string;
  exam_name: string;
  description: string;
  instructions: string;
  total_time: number;
  min_student_age: number;
  max_student_age: number;
  maximum_marks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Assessment {
  assessment_id: string;
  exam_id: string;
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
  created_at: string;
  updated_at: string;
}

interface Question {
  question_id: string;
  assessment_id: string;
  question_text: string;
  question_type: 'MCQ' | 'Subjective';
  marks: number;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface QuestionOption {
  option_id: string;
  question_id: string;
  option_text: string;
  marks: number;
  image_url: string | null;
  is_correct: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const AdminExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionOptions, setQuestionOptions] = useState<QuestionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAssessments, setExpandedAssessments] = useState<Set<string>>(new Set());

  // Form states
  const [examForm, setExamForm] = useState({
    exam_name: '',
    description: '',
    instructions: '',
    total_time: 60,
    min_student_age: 10,
    max_student_age: 25,
    maximum_marks: 100
  });

  const [assessmentForm, setAssessmentForm] = useState({
    assessment_name: '',
    description: '',
    instructions: '',
    total_time: 30,
    min_student_age: 10,
    max_student_age: 25,
    maximum_marks: 50,
    parent_assessment_id: null as string | null
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    question_type: 'MCQ' as 'MCQ' | 'Subjective',
    marks: 5,
    image_url: ''
  });

  const [optionForm, setOptionForm] = useState({
    option_text: '',
    marks: 0,
    image_url: '',
    is_correct: false
  });

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Dialog states
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showOptionDialog, setShowOptionDialog] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchAssessments(selectedExam.exam_id);
    }
  }, [selectedExam]);

  useEffect(() => {
    if (selectedAssessment) {
      fetchQuestions(selectedAssessment.assessment_id);
    }
  }, [selectedAssessment]);

  useEffect(() => {
    if (selectedQuestion) {
      fetchQuestionOptions(selectedQuestion.question_id);
    }
  }, [selectedQuestion]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async (examId: string) => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('exam_id', examId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const fetchQuestions = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchQuestionOptions = async (questionId: string) => {
    try {
      const { data, error } = await supabase
        .from('question_options')
        .select('*')
        .eq('question_id', questionId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setQuestionOptions(data || []);
    } catch (error) {
      console.error('Error fetching question options:', error);
    }
  };

  const createExam = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([examForm])
        .select()
        .single();

      if (error) throw error;

      setExams([data, ...exams]);
      setExamForm({
        exam_name: '',
        description: '',
        instructions: '',
        total_time: 60,
        min_student_age: 10,
        max_student_age: 25,
        maximum_marks: 100
      });
      setShowExamDialog(false);
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Error creating exam: ' + (error as Error).message);
    }
  };

  const createAssessment = async () => {
    if (!selectedExam) return;

    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert([{
          ...assessmentForm,
          exam_id: selectedExam.exam_id
        }])
        .select()
        .single();

      if (error) throw error;

      setAssessments([...assessments, data]);
      setAssessmentForm({
        assessment_name: '',
        description: '',
        instructions: '',
        total_time: 30,
        min_student_age: 10,
        max_student_age: 25,
        maximum_marks: 50,
        parent_assessment_id: null
      });
      setShowAssessmentDialog(false);
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert('Error creating assessment: ' + (error as Error).message);
    }
  };

  const createQuestion = async () => {
    if (!selectedAssessment) return;

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([{
          ...questionForm,
          assessment_id: selectedAssessment.assessment_id,
          image_url: questionForm.image_url || null
        }])
        .select()
        .single();

      if (error) throw error;

      setQuestions([...questions, data]);
      setQuestionForm({
        question_text: '',
        question_type: 'MCQ',
        marks: 5,
        image_url: ''
      });
      setShowQuestionDialog(false);
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Error creating question: ' + (error as Error).message);
    }
  };

  const createOption = async () => {
    if (!selectedQuestion) return;

    try {
      const { data, error } = await supabase
        .from('question_options')
        .insert([{
          ...optionForm,
          question_id: selectedQuestion.question_id,
          image_url: optionForm.image_url || null
        }])
        .select()
        .single();

      if (error) throw error;

      setQuestionOptions([...questionOptions, data]);
      setOptionForm({
        option_text: '',
        marks: 0,
        image_url: '',
        is_correct: false
      });
      setShowOptionDialog(false);
    } catch (error) {
      console.error('Error creating option:', error);
      alert('Error creating option: ' + (error as Error).message);
    }
  };

  const toggleAssessmentExpansion = (assessmentId: string) => {
    const newExpanded = new Set(expandedAssessments);
    if (newExpanded.has(assessmentId)) {
      newExpanded.delete(assessmentId);
    } else {
      newExpanded.add(assessmentId);
    }
    setExpandedAssessments(newExpanded);
  };

  const getAssessmentHierarchy = () => {
    const rootAssessments = assessments.filter(a => !a.parent_assessment_id);
    const childAssessments = assessments.filter(a => a.parent_assessment_id);
    
    return rootAssessments.map(root => ({
      ...root,
      children: childAssessments.filter(child => child.parent_assessment_id === root.assessment_id)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
            <p className="text-gray-600 mt-2">Create and manage exams, assessments, and questions</p>
          </div>
          
          <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exam_name">Exam Name</Label>
                  <Input
                    id="exam_name"
                    value={examForm.exam_name}
                    onChange={(e) => setExamForm({...examForm, exam_name: e.target.value})}
                    placeholder="Enter exam name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={examForm.description}
                    onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                    placeholder="Enter exam description"
                  />
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={examForm.instructions}
                    onChange={(e) => setExamForm({...examForm, instructions: e.target.value})}
                    placeholder="Enter exam instructions"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total_time">Total Time (minutes)</Label>
                    <Input
                      id="total_time"
                      type="number"
                      value={examForm.total_time}
                      onChange={(e) => setExamForm({...examForm, total_time: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maximum_marks">Maximum Marks</Label>
                    <Input
                      id="maximum_marks"
                      type="number"
                      value={examForm.maximum_marks}
                      onChange={(e) => setExamForm({...examForm, maximum_marks: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_student_age">Min Student Age</Label>
                    <Input
                      id="min_student_age"
                      type="number"
                      value={examForm.min_student_age}
                      onChange={(e) => setExamForm({...examForm, min_student_age: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_student_age">Max Student Age</Label>
                    <Input
                      id="max_student_age"
                      type="number"
                      value={examForm.max_student_age}
                      onChange={(e) => setExamForm({...examForm, max_student_age: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowExamDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createExam}>
                    Create Exam
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exams List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Exams ({exams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exams.map((exam) => (
                  <div
                    key={exam.exam_id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedExam?.exam_id === exam.exam_id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="font-medium">{exam.exam_name}</div>
                    <div className="text-sm text-gray-500">
                      {exam.maximum_marks} marks • {exam.total_time} min
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge variant={exam.is_active ? "default" : "secondary"}>
                        {exam.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Assessments
                </div>
                {selectedExam && (
                  <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Assessment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="assessment_name">Assessment Name</Label>
                          <Input
                            id="assessment_name"
                            value={assessmentForm.assessment_name}
                            onChange={(e) => setAssessmentForm({...assessmentForm, assessment_name: e.target.value})}
                            placeholder="Enter assessment name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="parent_assessment">Parent Assessment (Optional)</Label>
                          <Select
                            value={assessmentForm.parent_assessment_id || ''}
                            onValueChange={(value) => setAssessmentForm({...assessmentForm, parent_assessment_id: value || null})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent assessment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None (Root Assessment)</SelectItem>
                              {assessments.filter(a => !a.parent_assessment_id).map((assessment) => (
                                <SelectItem key={assessment.assessment_id} value={assessment.assessment_id}>
                                  {assessment.assessment_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="assessment_time">Time (minutes)</Label>
                            <Input
                              id="assessment_time"
                              type="number"
                              value={assessmentForm.total_time}
                              onChange={(e) => setAssessmentForm({...assessmentForm, total_time: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="assessment_marks">Maximum Marks</Label>
                            <Input
                              id="assessment_marks"
                              type="number"
                              value={assessmentForm.maximum_marks}
                              onChange={(e) => setAssessmentForm({...assessmentForm, maximum_marks: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowAssessmentDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={createAssessment}>
                            Create Assessment
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExam ? (
                <div className="space-y-2">
                  {getAssessmentHierarchy().map((assessment) => (
                    <div key={assessment.assessment_id}>
                      <div
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedAssessment?.assessment_id === assessment.assessment_id
                            ? 'bg-green-50 border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{assessment.assessment_name}</div>
                            <div className="text-sm text-gray-500">
                              {assessment.maximum_marks} marks
                              {assessment.total_time && ` • ${assessment.total_time} min`}
                            </div>
                          </div>
                          {assessment.children.length > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAssessmentExpansion(assessment.assessment_id);
                              }}
                            >
                              {expandedAssessments.has(assessment.assessment_id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Sub-assessments */}
                      {expandedAssessments.has(assessment.assessment_id) && assessment.children.map((child) => (
                        <div
                          key={child.assessment_id}
                          className={`ml-6 mt-2 p-2 rounded border cursor-pointer transition-colors ${
                            selectedAssessment?.assessment_id === child.assessment_id
                              ? 'bg-green-50 border-green-200'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedAssessment(child)}
                        >
                          <div className="font-medium text-sm">{child.assessment_name}</div>
                          <div className="text-xs text-gray-500">
                            {child.maximum_marks} marks
                            {child.total_time && ` • ${child.total_time} min`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select an exam to view assessments
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Questions
                </div>
                {selectedAssessment && (
                  <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Question</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="question_text">Question Text</Label>
                          <Textarea
                            id="question_text"
                            value={questionForm.question_text}
                            onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                            placeholder="Enter question text"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="question_type">Question Type</Label>
                            <Select
                              value={questionForm.question_type}
                              onValueChange={(value: 'MCQ' | 'Subjective') => setQuestionForm({...questionForm, question_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MCQ">Multiple Choice</SelectItem>
                                <SelectItem value="Subjective">Subjective</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="question_marks">Marks</Label>
                            <Input
                              id="question_marks"
                              type="number"
                              value={questionForm.marks}
                              onChange={(e) => setQuestionForm({...questionForm, marks: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="question_image">Image URL (Optional)</Label>
                          <Input
                            id="question_image"
                            value={questionForm.image_url}
                            onChange={(e) => setQuestionForm({...questionForm, image_url: e.target.value})}
                            placeholder="Enter image URL"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={createQuestion}>
                            Create Question
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAssessment ? (
                <div className="space-y-2">
                  {questions.map((question) => (
                    <div
                      key={question.question_id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedQuestion?.question_id === question.question_id
                          ? 'bg-purple-50 border-purple-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedQuestion(question)}
                    >
                      <div className="font-medium text-sm">{question.question_text.substring(0, 100)}...</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={question.question_type === 'MCQ' ? "default" : "secondary"}>
                          {question.question_type}
                        </Badge>
                        <span className="text-sm text-gray-500">{question.marks} marks</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select an assessment to view questions
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Question Options */}
        {selectedQuestion && selectedQuestion.question_type === 'MCQ' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Question Options
                </div>
                <Dialog open={showOptionDialog} onOpenChange={setShowOptionDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Option</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="option_text">Option Text</Label>
                        <Input
                          id="option_text"
                          value={optionForm.option_text}
                          onChange={(e) => setOptionForm({...optionForm, option_text: e.target.value})}
                          placeholder="Enter option text"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="option_marks">Marks</Label>
                          <Input
                            id="option_marks"
                            type="number"
                            value={optionForm.marks}
                            onChange={(e) => setOptionForm({...optionForm, marks: parseInt(e.target.value)})}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_correct"
                            checked={optionForm.is_correct}
                            onChange={(e) => setOptionForm({...optionForm, is_correct: e.target.checked})}
                          />
                          <Label htmlFor="is_correct">Correct Answer</Label>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="option_image">Image URL (Optional)</Label>
                        <Input
                          id="option_image"
                          value={optionForm.image_url}
                          onChange={(e) => setOptionForm({...optionForm, image_url: e.target.value})}
                          placeholder="Enter image URL"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowOptionDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createOption}>
                          Create Option
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {questionOptions.map((option, index) => (
                  <div
                    key={option.option_id}
                    className={`p-3 rounded-lg border ${
                      option.is_correct ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option.option_text}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={option.is_correct ? "default" : "secondary"}>
                          {option.marks} marks
                        </Badge>
                        {option.is_correct && (
                          <Badge className="bg-green-500">
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};