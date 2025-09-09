import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Save, FileText, ChevronDown, ChevronRight, Image, GripVertical } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
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

interface AssessmentNode {
  assessment: Assessment;
  questions: Question[];
  children: AssessmentNode[];
  expanded: boolean;
}

export const CreateAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const isEditing = !!assessmentId;

  // Main assessment form
  const [mainAssessment, setMainAssessment] = useState<Assessment>({
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

  // Hierarchical structure
  const [assessmentTree, setAssessmentTree] = useState<AssessmentNode[]>([]);
  
  // Dialog states
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  
  // Forms
  const [sectionForm, setSectionForm] = useState<Assessment>({
    assessment_name: '',
    description: '',
    instructions: '',
    total_time: 15,
    min_student_age: 10,
    max_student_age: 25,
    maximum_marks: 50,
    parent_assessment_id: null,
    display_order: 1,
    is_active: true
  });

  const [questionForm, setQuestionForm] = useState<Question>({
    question_text: '',
    question_type: 'MCQ',
    marks: 5,
    image_url: null,
    display_order: 1,
    is_active: true,
    options: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadAssessment();
    }
  }, [assessmentId]);

  const loadAssessment = async () => {
    if (!assessmentId) return;
    
    try {
      // Load main assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('assessment_id', assessmentId)
        .single();

      if (assessmentError) throw assessmentError;
      setMainAssessment(assessment);

      // Load hierarchical structure
      await loadAssessmentStructure(assessmentId);
    } catch (error) {
      console.error('Error loading assessment:', error);
    }
  };

  const loadAssessmentStructure = async (rootId: string) => {
    try {
      // Load all related assessments and questions
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .or(`assessment_id.eq.${rootId},parent_assessment_id.eq.${rootId}`)
        .order('display_order');

      if (assessmentsError) throw assessmentsError;

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          question_options (*)
        `)
        .in('assessment_id', assessments.map(a => a.assessment_id))
        .order('display_order');

      if (questionsError) throw questionsError;

      // Build tree structure
      const tree = buildAssessmentTree(assessments, questions || []);
      setAssessmentTree(tree);
    } catch (error) {
      console.error('Error loading structure:', error);
    }
  };

  const buildAssessmentTree = (assessments: Assessment[], questions: Question[]): AssessmentNode[] => {
    const assessmentMap = new Map<string, AssessmentNode>();
    
    // Initialize all assessments
    assessments.forEach(assessment => {
      assessmentMap.set(assessment.assessment_id!, {
        assessment,
        questions: questions.filter(q => q.assessment_id === assessment.assessment_id),
        children: [],
        expanded: true
      });
    });

    // Build hierarchy
    const roots: AssessmentNode[] = [];
    assessments.forEach(assessment => {
      const node = assessmentMap.get(assessment.assessment_id!)!;
      if (assessment.parent_assessment_id) {
        const parent = assessmentMap.get(assessment.parent_assessment_id);
        if (parent) {
          parent.children.push(node);
        }
      } else if (assessment.assessment_id !== mainAssessment.assessment_id) {
        roots.push(node);
      }
    });

    return roots;
  };

  const addSection = async () => {
    try {
      // Create assessment data with only the fields that exist in the database
      const assessmentData = {
        assessment_name: sectionForm.assessment_name.trim(),
        description: sectionForm.description?.trim() || '',
        instructions: sectionForm.instructions?.trim() || '',
        total_time: sectionForm.total_time || 30,
        min_student_age: sectionForm.min_student_age || 10,
        max_student_age: sectionForm.max_student_age || 25,
        maximum_marks: sectionForm.maximum_marks || 50,
        parent_assessment_id: selectedParentId,
        display_order: sectionForm.display_order || 1,
        is_active: true
      };

      const { data, error } = await supabase
        .from('assessments')
        .insert([assessmentData])
        .select()
        .single();

      if (error) throw error;

      // Refresh structure
      if (mainAssessment.assessment_id) {
        await loadAssessmentStructure(mainAssessment.assessment_id);
      }

      // Reset form
      setSectionForm({
        assessment_name: '',
        description: '',
        instructions: '',
        total_time: 15,
        min_student_age: 10,
        max_student_age: 25,
        maximum_marks: 50,
        parent_assessment_id: null,
        display_order: 1,
        is_active: true
      });
      setShowSectionDialog(false);
      setSelectedParentId(null);
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Error adding section: ' + (error as Error).message);
    }
  };

  const addQuestion = async () => {
    try {
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert([{
          ...questionForm,
          assessment_id: selectedParentId || mainAssessment.assessment_id,
          options: undefined
        }])
        .select()
        .single();

      if (questionError) throw questionError;

      // Add options for MCQ
      if (questionForm.question_type === 'MCQ' && questionForm.options && questionForm.options.length > 0) {
        const optionsToInsert = questionForm.options.map(option => ({
          ...option,
          question_id: questionData.question_id
        }));

        const { error: optionsError } = await supabase
          .from('question_options')
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }

      // Refresh structure
      if (mainAssessment.assessment_id) {
        await loadAssessmentStructure(mainAssessment.assessment_id);
      }

      setQuestionForm({
        question_text: '',
        question_type: 'MCQ',
        marks: 5,
        image_url: null,
        display_order: 1,
        is_active: true,
        options: []
      });
      setShowQuestionDialog(false);
      setSelectedParentId(null);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question: ' + (error as Error).message);
    }
  };

  const saveMainAssessment = async () => {
    try {
      setLoading(true);
      
      if (isEditing) {
        const { error } = await supabase
          .from('assessments')
          .update(mainAssessment)
          .eq('assessment_id', assessmentId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('assessments')
          .insert([mainAssessment])
          .select()
          .single();

        if (error) throw error;
        setMainAssessment(data);
      }

      alert('Assessment saved successfully!');
      navigate('/admin/exam-management');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'question' | 'option'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const filePath = `${type}-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assessment-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('assessment-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleQuestionImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file, 'question');
      setQuestionForm({ ...questionForm, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading question image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleOptionImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, optionIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file, 'option');
      const newOptions = [...(questionForm.options || [])];
      newOptions[optionIndex] = { ...newOptions[optionIndex], image_url: imageUrl };
      setQuestionForm({ ...questionForm, options: newOptions });
    } catch (error) {
      console.error('Error uploading option image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const toggleExpanded = (assessmentId: string) => {
    const updateNode = (nodes: AssessmentNode[]): AssessmentNode[] => {
      return nodes.map(node => {
        if (node.assessment.assessment_id === assessmentId) {
          return { ...node, expanded: !node.expanded };
        }
        return { ...node, children: updateNode(node.children) };
      });
    };
    setAssessmentTree(updateNode(assessmentTree));
  };

  const renderAssessmentNode = (node: AssessmentNode, level: number = 0): React.ReactNode => {
    const indentClass = level > 0 ? `ml-${level * 6}` : '';
    
    return (
      <div key={node.assessment.assessment_id} className={`${indentClass}`}>
        {/* Section/Category Header */}
        <Card className="mb-4 rounded-xl border-l-4 border-l-[#3479ff] bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(node.assessment.assessment_id!)}
                  className="p-1 h-auto"
                >
                  {node.expanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
                
                <div>
                  <h3 className="font-bold text-[#13377c] text-lg">{node.assessment.assessment_name}</h3>
                  <p className="text-gray-600 text-sm">{node.assessment.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {node.assessment.maximum_marks} marks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {node.assessment.total_time} min
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {node.questions.length} questions
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedParentId(node.assessment.assessment_id!);
                    setShowSectionDialog(true);
                  }}
                  className="rounded-lg"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Sub-section
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedParentId(node.assessment.assessment_id!);
                    setShowQuestionDialog(true);
                  }}
                  className="rounded-lg"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Question
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg text-red-600">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expanded Content */}
        {node.expanded && (
          <div className="ml-6 space-y-4">
            {/* Questions in this section */}
            {node.questions.map((question, qIndex) => (
              <Card key={question.question_id || qIndex} className="rounded-lg border border-gray-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <Badge variant={question.question_type === 'MCQ' ? "default" : "secondary"} className="rounded-full">
                          {question.question_type}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {question.marks} marks
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{question.question_text}</p>
                      
                      {question.image_url && (
                        <div className="mb-3">
                          <img 
                            src={question.image_url} 
                            alt="Question" 
                            className="max-w-xs h-24 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      
                      {/* MCQ Options */}
                      {question.question_type === 'MCQ' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={option.option_id || optionIndex} 
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
                              
                              {option.image_url && (
                                <div className="mt-2">
                                  <img 
                                    src={option.image_url} 
                                    alt="Option" 
                                    className="max-w-xs h-16 object-cover rounded border"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="rounded-lg">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Child sections */}
            {node.children.map(child => renderAssessmentNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getTotalMarks = (): number => {
    const calculateNodeMarks = (node: AssessmentNode): number => {
      const questionMarks = node.questions.reduce((sum, q) => sum + q.marks, 0);
      const childMarks = node.children.reduce((sum, child) => sum + calculateNodeMarks(child), 0);
      return questionMarks + childMarks;
    };
    
    return assessmentTree.reduce((sum, node) => sum + calculateNodeMarks(node), 0);
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
              <h1 className="text-3xl font-bold text-[#13377c]">
                {isEditing ? 'Edit Assessment' : 'Create Assessment'}
              </h1>
              <p className="text-gray-600">Build comprehensive assessments with hierarchical structure</p>
            </div>
          </div>
          
          <Button 
            onClick={saveMainAssessment}
            disabled={loading}
            className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl px-6 py-3 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Assessment'}
          </Button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{assessmentTree.length}</div>
              <div className="text-sm opacity-90">Sections</div>
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
              <div className="text-2xl font-bold">{Math.round((getTotalMarks() / mainAssessment.maximum_marks) * 100)}%</div>
              <div className="text-sm opacity-90">Marks Used</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{mainAssessment.total_time}</div>
              <div className="text-sm opacity-90">Total Time (min)</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Details */}
          <Card className="lg:col-span-1 rounded-[2rem] shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#13377c]">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assessment_name" className="text-[#13377c] font-medium">Assessment Name</Label>
                <Input
                  id="assessment_name"
                  value={mainAssessment.assessment_name}
                  onChange={(e) => setMainAssessment({...mainAssessment, assessment_name: e.target.value})}
                  placeholder="e.g., Aptitude Test, Behavioral Assessment"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-[#13377c] font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={mainAssessment.description}
                  onChange={(e) => setMainAssessment({...mainAssessment, description: e.target.value})}
                  placeholder="Describe what this assessment evaluates"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="instructions" className="text-[#13377c] font-medium">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={mainAssessment.instructions}
                  onChange={(e) => setMainAssessment({...mainAssessment, instructions: e.target.value})}
                  placeholder="Instructions for students"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="total_time" className="text-[#13377c] font-medium">Time (min)</Label>
                  <Input
                    id="total_time"
                    type="number"
                    value={mainAssessment.total_time}
                    onChange={(e) => setMainAssessment({...mainAssessment, total_time: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
                <div>
                  <Label htmlFor="maximum_marks" className="text-[#13377c] font-medium">Max Marks</Label>
                  <Input
                    id="maximum_marks"
                    type="number"
                    value={mainAssessment.maximum_marks}
                    onChange={(e) => setMainAssessment({...mainAssessment, maximum_marks: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="min_age" className="text-[#13377c] font-medium">Min Age</Label>
                  <Input
                    id="min_age"
                    type="number"
                    value={mainAssessment.min_student_age}
                    onChange={(e) => setMainAssessment({...mainAssessment, min_student_age: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
                <div>
                  <Label htmlFor="max_age" className="text-[#13377c] font-medium">Max Age</Label>
                  <Input
                    id="max_age"
                    type="number"
                    value={mainAssessment.max_student_age}
                    onChange={(e) => setMainAssessment({...mainAssessment, max_student_age: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t space-y-3">
                <Button
                  onClick={() => {
                    setSelectedParentId(null);
                    setShowSectionDialog(true);
                  }}
                  className="w-full bg-[#3479ff] hover:bg-[#2968e6] rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
                
                <Button
                  onClick={() => {
                    setSelectedParentId(null);
                    setShowQuestionDialog(true);
                  }}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question (Root Level)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Structure */}
          <div className="lg:col-span-2">
            <Card className="rounded-[2rem] shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-[#13377c]">Assessment Structure</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      {getTotalMarks()} / {mainAssessment.maximum_marks} marks
                    </Badge>
                    {getTotalMarks() > mainAssessment.maximum_marks && (
                      <Badge variant="destructive" className="text-sm">
                        Exceeds limit!
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {assessmentTree.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No sections created yet</p>
                    <p className="text-gray-400 text-sm">Add sections and questions to build your assessment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessmentTree.map(node => renderAssessmentNode(node))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Section Dialog */}
        <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
          <DialogContent className="max-w-2xl rounded-[1.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#13377c]">
                Add New {selectedParentId ? 'Sub-section' : 'Section'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="section_name" className="text-[#13377c] font-medium">Section Name</Label>
                <Input
                  id="section_name"
                  value={sectionForm.assessment_name}
                  onChange={(e) => setSectionForm({...sectionForm, assessment_name: e.target.value})}
                  placeholder="e.g., Logical Reasoning, Verbal Ability"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div>
                <Label htmlFor="section_description" className="text-[#13377c] font-medium">Description</Label>
                <Textarea
                  id="section_description"
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({...sectionForm, description: e.target.value})}
                  placeholder="Describe this section"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section_time" className="text-[#13377c] font-medium">Time (minutes)</Label>
                  <Input
                    id="section_time"
                    type="number"
                    value={sectionForm.total_time}
                    onChange={(e) => setSectionForm({...sectionForm, total_time: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
                <div>
                  <Label htmlFor="section_marks" className="text-[#13377c] font-medium">Maximum Marks</Label>
                  <Input
                    id="section_marks"
                    type="number"
                    value={sectionForm.maximum_marks}
                    onChange={(e) => setSectionForm({...sectionForm, maximum_marks: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowSectionDialog(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={addSection} className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl">
                  Add Section
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Question Dialog */}
        <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#13377c]">Add New Question</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
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
                      options: value === 'MCQ' ? [{ 
                        option_text: '', 
                        marks: 0, 
                        image_url: null, 
                        is_correct: false, 
                        display_order: 1 
                      }] : []
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
              
              {/* Question Image Upload */}
              <div>
                <Label className="text-[#13377c] font-medium">Question Image (Optional)</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQuestionImageUpload}
                      className="hidden"
                      id="question-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('question-image-upload')?.click()}
                      className="rounded-xl"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {questionForm.image_url && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setQuestionForm({...questionForm, image_url: null})}
                        className="rounded-xl text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  {questionForm.image_url && (
                    <div className="relative">
                      <img 
                        src={questionForm.image_url} 
                        alt="Question preview" 
                        className="max-w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* MCQ Options */}
              {questionForm.question_type === 'MCQ' && (
                <div className="space-y-4">
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
                    <Card key={index} className="rounded-xl border border-gray-200 bg-gray-50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#13377c] min-w-[20px]">{String.fromCharCode(65 + index)}.</span>
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
                        
                        {/* Option Image Upload */}
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImageUpload(e, index)}
                            className="hidden"
                            id={`option-image-${index}`}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById(`option-image-${index}`)?.click()}
                            className="rounded-lg"
                          >
                            <Image className="w-3 h-3 mr-1" />
                            Image
                          </Button>
                          {option.image_url && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newOptions = [...(questionForm.options || [])];
                                newOptions[index] = {...option, image_url: null};
                                setQuestionForm({...questionForm, options: newOptions});
                              }}
                              className="rounded-lg text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Option Image Preview */}
                        {option.image_url && (
                          <div className="mt-2">
                            <img 
                              src={option.image_url} 
                              alt="Option preview" 
                              className="max-w-full h-16 object-cover rounded border"
                            />
                          </div>
                        )}
                        
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowQuestionDialog(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button 
                  onClick={addQuestion}
                  className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl"
                  disabled={!questionForm.question_text.trim()}
                >
                  Add Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};