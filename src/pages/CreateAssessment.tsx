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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
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
  is_active: boolean;
}

interface Category {
  category_id?: string;
  assessment_id: string;
  parent_category_id: string | null;
  category_name: string;
  description: string;
  instructions: string;
  total_time: number;
  maximum_marks: number;
  display_order: number;
  is_active: boolean;
}

interface Question {
  question_id?: string;
  assessment_id: string;
  category_id: string | null;
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

interface CategoryNode {
  category: Category;
  questions: Question[];
  children: CategoryNode[];
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
    is_active: true
  });

  // Hierarchical structure
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [rootQuestions, setRootQuestions] = useState<Question[]>([]);
  
  // Dialog states
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedParentType, setSelectedParentType] = useState<'assessment' | 'category'>('assessment');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'category' | 'question', id: string, name: string} | null>(null);
  
  // Forms
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    category_name: '',
    description: '',
    instructions: '',
    total_time: 15,
    maximum_marks: 50,
    display_order: 1,
    is_active: true
  });

  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
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

  const loadAssessmentStructure = async (assessmentId: string) => {
    try {
      // Load categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Load all questions for this assessment
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          question_options (*)
        `)
        .eq('assessment_id', assessmentId)
        .order('display_order');

      if (questionsError) throw questionsError;

      // Build tree structure
      const tree = buildCategoryTree(categories || [], questions || []);
      setCategoryTree(tree);

      // Set root questions (questions without categories)
      const rootQs = (questions || []).filter(q => !q.category_id);
      setRootQuestions(rootQs);
    } catch (error) {
      console.error('Error loading structure:', error);
    }
  };

  const buildCategoryTree = (categories: Category[], questions: Question[]): CategoryNode[] => {
    const categoryMap = new Map<string, CategoryNode>();
    
    // Initialize all categories
    categories.forEach(category => {
      categoryMap.set(category.category_id!, {
        category,
        questions: questions.filter(q => q.category_id === category.category_id),
        children: [],
        expanded: true
      });
    });

    // Build hierarchy
    const roots: CategoryNode[] = [];
    categories.forEach(category => {
      const node = categoryMap.get(category.category_id!)!;
      if (category.parent_category_id) {
        const parent = categoryMap.get(category.parent_category_id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const addCategory = async () => {
    try {
      if (!mainAssessment.assessment_id) {
        alert('Please save the assessment first');
        return;
      }

      const categoryData = {
        assessment_id: mainAssessment.assessment_id,
        parent_category_id: selectedParentType === 'category' ? selectedParentId : null,
        category_name: categoryForm.category_name?.trim() || '',
        description: categoryForm.description?.trim() || null,
        instructions: categoryForm.instructions?.trim() || null,
        total_time: categoryForm.total_time || 15,
        maximum_marks: categoryForm.maximum_marks || 50,
        display_order: categoryForm.display_order || 1,
        is_active: true
      };

      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      // Refresh structure
      await loadAssessmentStructure(mainAssessment.assessment_id);

      // Reset form
      setCategoryForm({
        category_name: '',
        description: '',
        instructions: '',
        total_time: 15,
        maximum_marks: 50,
        display_order: 1,
        is_active: true
      });
      setShowCategoryDialog(false);
      setSelectedParentId(null);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category: ' + (error as Error).message);
    }
  };

  const addQuestion = async () => {
    try {
      if (!mainAssessment.assessment_id) {
        alert('Please save the assessment first');
        return;
      }

      // Insert question
      const questionData = {
        assessment_id: mainAssessment.assessment_id,
        category_id: selectedParentType === 'category' ? selectedParentId : null,
        question_text: questionForm.question_text?.trim() || '',
        question_type: questionForm.question_type || 'MCQ',
        marks: questionForm.marks || 5,
        image_url: questionForm.image_url,
        display_order: questionForm.display_order || 1,
        is_active: true
      };

      const { data: questionData_result, error: questionError } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
        .single();

      if (questionError) throw questionError;

      // Add options for MCQ
      if (questionForm.question_type === 'MCQ' && questionForm.options && questionForm.options.length > 0) {
        const optionsToInsert = questionForm.options.map(option => ({
          question_id: questionData_result.question_id,
          option_text: option.option_text?.trim() || '',
          marks: option.marks || 0,
          image_url: option.image_url,
          is_correct: option.is_correct || false,
          display_order: option.display_order || 1
        }));

        const { error: optionsError } = await supabase
          .from('question_options')
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }

      // Refresh structure
      await loadAssessmentStructure(mainAssessment.assessment_id);

      // Reset form
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
      
      const assessmentData = {
        assessment_name: mainAssessment.assessment_name.trim(),
        description: mainAssessment.description?.trim() || null,
        instructions: mainAssessment.instructions?.trim() || null,
        total_time: mainAssessment.total_time,
        min_student_age: mainAssessment.min_student_age,
        max_student_age: mainAssessment.max_student_age,
        maximum_marks: mainAssessment.maximum_marks,
        is_active: mainAssessment.is_active
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('assessments')
          .update(assessmentData)
          .eq('assessment_id', assessmentId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('assessments')
          .insert([assessmentData])
          .select()
          .single();

        if (error) throw error;
        setMainAssessment(data);
      }

      alert('Assessment saved successfully!');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async () => {
    try {
      if (!editingCategory?.category_id) return;

      const categoryData = {
        category_name: categoryForm.category_name?.trim() || '',
        description: categoryForm.description?.trim() || null,
        instructions: categoryForm.instructions?.trim() || null,
        total_time: categoryForm.total_time || 15,
        maximum_marks: categoryForm.maximum_marks || 50,
        display_order: categoryForm.display_order || 1,
        is_active: categoryForm.is_active ?? true
      };

      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('category_id', editingCategory.category_id);

      if (error) throw error;

      // Refresh structure
      await loadAssessmentStructure(mainAssessment.assessment_id!);

      // Reset form
      setCategoryForm({
        category_name: '',
        description: '',
        instructions: '',
        total_time: 15,
        maximum_marks: 50,
        display_order: 1,
        is_active: true
      });
      setShowEditCategoryDialog(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + (error as Error).message);
    }
  };

  const editQuestion = async () => {
    try {
      if (!editingQuestion?.question_id) return;

      // Update question
      const questionData = {
        question_text: questionForm.question_text?.trim() || '',
        question_type: questionForm.question_type || 'MCQ',
        marks: questionForm.marks || 5,
        image_url: questionForm.image_url,
        display_order: questionForm.display_order || 1,
        is_active: questionForm.is_active ?? true
      };

      const { error: questionError } = await supabase
        .from('questions')
        .update(questionData)
        .eq('question_id', editingQuestion.question_id);

      if (questionError) throw questionError;

      // Delete existing options and recreate for MCQ
      if (questionForm.question_type === 'MCQ') {
        // Delete existing options
        await supabase
          .from('question_options')
          .delete()
          .eq('question_id', editingQuestion.question_id);

        // Add new options
        if (questionForm.options && questionForm.options.length > 0) {
          const optionsToInsert = questionForm.options.map(option => ({
            question_id: editingQuestion.question_id,
            option_text: option.option_text?.trim() || '',
            marks: option.marks || 0,
            image_url: option.image_url,
            is_correct: option.is_correct || false,
            display_order: option.display_order || 1
          }));

          const { error: optionsError } = await supabase
            .from('question_options')
            .insert(optionsToInsert);

          if (optionsError) throw optionsError;
        }
      }

      // Refresh structure
      await loadAssessmentStructure(mainAssessment.assessment_id!);

      // Reset form
      setQuestionForm({
        question_text: '',
        question_type: 'MCQ',
        marks: 5,
        image_url: null,
        display_order: 1,
        is_active: true,
        options: []
      });
      setShowEditQuestionDialog(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Error updating question: ' + (error as Error).message);
    }
  };

  const deleteItem = async () => {
    try {
      if (!deleteTarget) return;

      if (deleteTarget.type === 'category') {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('category_id', deleteTarget.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('questions')
          .delete()
          .eq('question_id', deleteTarget.id);

        if (error) throw error;
      }

      // Refresh structure
      await loadAssessmentStructure(mainAssessment.assessment_id!);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item: ' + (error as Error).message);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      category_name: category.category_name,
      description: category.description || '',
      instructions: category.instructions || '',
      total_time: category.total_time,
      maximum_marks: category.maximum_marks,
      display_order: category.display_order,
      is_active: category.is_active
    });
    setShowEditCategoryDialog(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question_text: question.question_text,
      question_type: question.question_type,
      marks: question.marks,
      image_url: question.image_url,
      display_order: question.display_order,
      is_active: question.is_active,
      options: question.options || []
    });
    setShowEditQuestionDialog(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteTarget({
      type: 'category',
      id: category.category_id!,
      name: category.category_name
    });
    setShowDeleteDialog(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setDeleteTarget({
      type: 'question',
      id: question.question_id!,
      name: question.question_text
    });
    setShowDeleteDialog(true);
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

  const toggleExpanded = (categoryId: string) => {
    const updateNode = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes.map(node => {
        if (node.category.category_id === categoryId) {
          return { ...node, expanded: !node.expanded };
        }
        return { ...node, children: updateNode(node.children) };
      });
    };
    setCategoryTree(updateNode(categoryTree));
  };

  const renderCategoryNode = (node: CategoryNode, level: number = 0): React.ReactNode => {
    const indentClass = level > 0 ? `ml-${level * 6}` : '';
    
    return (
      <div key={node.category.category_id} className={`${indentClass}`}>
        {/* Category Header */}
        <Card className="mb-4 rounded-xl border-l-4 border-l-[#3479ff] bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(node.category.category_id!)}
                  className="p-1 h-auto"
                >
                  {node.expanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
                
                <div>
                  <h3 className="font-bold text-[#13377c] text-lg">{node.category.category_name}</h3>
                  <p className="text-gray-600 text-sm">{node.category.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {node.category.maximum_marks} marks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {node.category.total_time} min
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
                    setSelectedParentId(node.category.category_id!);
                    setSelectedParentType('category');
                    setShowCategoryDialog(true);
                  }}
                  className="rounded-lg"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Sub-category
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedParentId(node.category.category_id!);
                    setSelectedParentType('category');
                    setShowQuestionDialog(true);
                  }}
                  className="rounded-lg"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Question
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-lg"
                  onClick={() => handleEditCategory(node.category)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-lg text-red-600"
                  onClick={() => handleDeleteCategory(node.category)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expanded Content */}
        {node.expanded && (
          <div className="ml-6 space-y-4">
            {/* Questions in this category */}
            {node.questions.map((question, qIndex) => renderQuestion(question, qIndex))}

            {/* Child categories */}
            {node.children.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = (question: Question, qIndex: number): React.ReactNode => {
    return (
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
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg"
                onClick={() => handleEditQuestion(question)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg text-red-600"
                onClick={() => handleDeleteQuestion(question)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getTotalMarks = (): number => {
    const calculateNodeMarks = (node: CategoryNode): number => {
      const questionMarks = node.questions.reduce((sum, q) => sum + q.marks, 0);
      const childMarks = node.children.reduce((sum, child) => sum + calculateNodeMarks(child), 0);
      return questionMarks + childMarks;
    };
    
    const categoryMarks = categoryTree.reduce((sum, node) => sum + calculateNodeMarks(node), 0);
    const rootQuestionMarks = rootQuestions.reduce((sum, q) => sum + q.marks, 0);
    
    return categoryMarks + rootQuestionMarks;
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
              <p className="text-gray-600">Build comprehensive assessments with hierarchical categories</p>
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
              <div className="text-2xl font-bold">{categoryTree.length}</div>
              <div className="text-sm opacity-90">Categories</div>
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
                    setSelectedParentType('assessment');
                    setShowCategoryDialog(true);
                  }}
                  className="w-full bg-[#3479ff] hover:bg-[#2968e6] rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
                
                <Button
                  onClick={() => {
                    setSelectedParentId(null);
                    setSelectedParentType('assessment');
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
                {/* Root Questions */}
                {rootQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#13377c] text-lg">Direct Questions</h3>
                    {rootQuestions.map((question, qIndex) => renderQuestion(question, qIndex))}
                  </div>
                )}

                {/* Categories */}
                {categoryTree.length === 0 && rootQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No categories or questions created yet</p>
                    <p className="text-gray-400 text-sm">Add categories and questions to build your assessment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categoryTree.map(node => renderCategoryNode(node))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="max-w-2xl rounded-[1.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#13377c]">
                Add New {selectedParentType === 'category' ? 'Sub-category' : 'Category'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="category_name" className="text-[#13377c] font-medium">Category Name</Label>
                <Input
                  id="category_name"
                  value={categoryForm.category_name || ''}
                  onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})}
                  placeholder="e.g., Logical Reasoning, Verbal Ability"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div>
                <Label htmlFor="category_description" className="text-[#13377c] font-medium">Description</Label>
                <Textarea
                  id="category_description"
                  value={categoryForm.description || ''}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Describe this category"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_time" className="text-[#13377c] font-medium">Time (minutes)</Label>
                  <Input
                    id="category_time"
                    type="number"
                    value={categoryForm.total_time || 15}
                    onChange={(e) => setCategoryForm({...categoryForm, total_time: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
                <div>
                  <Label htmlFor="category_marks" className="text-[#13377c] font-medium">Maximum Marks</Label>
                  <Input
                    id="category_marks"
                    type="number"
                    value={categoryForm.maximum_marks || 50}
                    onChange={(e) => setCategoryForm({...categoryForm, maximum_marks: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={addCategory} className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl">
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
          <DialogContent className="max-w-2xl rounded-[1.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#13377c]">
                Edit Category
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_category_name" className="text-[#13377c] font-medium">Category Name</Label>
                <Input
                  id="edit_category_name"
                  value={categoryForm.category_name || ''}
                  onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})}
                  placeholder="e.g., Logical Reasoning, Verbal Ability"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div>
                <Label htmlFor="edit_category_description" className="text-[#13377c] font-medium">Description</Label>
                <Textarea
                  id="edit_category_description"
                  value={categoryForm.description || ''}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Describe this category"
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_category_time" className="text-[#13377c] font-medium">Time (minutes)</Label>
                  <Input
                    id="edit_category_time"
                    type="number"
                    value={categoryForm.total_time || 15}
                    onChange={(e) => setCategoryForm({...categoryForm, total_time: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_category_marks" className="text-[#13377c] font-medium">Maximum Marks</Label>
                  <Input
                    id="edit_category_marks"
                    type="number"
                    value={categoryForm.maximum_marks || 50}
                    onChange={(e) => setCategoryForm({...categoryForm, maximum_marks: parseInt(e.target.value)})}
                    className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowEditCategoryDialog(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={editCategory} className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl">
                  Update Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Question Dialog */}
        <Dialog open={showEditQuestionDialog} onOpenChange={setShowEditQuestionDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#13377c]">Edit Question</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="edit_question_text" className="text-[#13377c] font-medium">Question Text</Label>
                <Textarea
                  id="edit_question_text"
                  value={questionForm.question_text || ''}
                  onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                  placeholder="Enter your question here..."
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_question_type" className="text-[#13377c] font-medium">Question Type</Label>
                  <Select
                    value={questionForm.question_type || 'MCQ'}
                    onValueChange={(value: 'MCQ' | 'Subjective') => setQuestionForm({
                      ...questionForm, 
                      question_type: value,
                      options: value === 'MCQ' ? (questionForm.options || [{ 
                        option_text: '', 
                        marks: 0, 
                        image_url: null, 
                        is_correct: false, 
                        display_order: 1 
                      }]) : []
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
                  <Label htmlFor="edit_marks" className="text-[#13377c] font-medium">Marks</Label>
                  <Input
                    id="edit_marks"
                    type="number"
                    value={questionForm.marks || 5}
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
                      id="edit-question-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('edit-question-image-upload')?.click()}
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
                            id={`edit-option-image-${index}`}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById(`edit-option-image-${index}`)?.click()}
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
                                newOptions[index] = {...option, marks: parseInt(e.target.value) || 0};
                                setQuestionForm({...questionForm, options: newOptions});
                              }}
                              className="w-20 rounded-lg"
                              min="0"
                              max={questionForm.marks || 5}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowEditQuestionDialog(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button 
                  onClick={editQuestion}
                  className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl"
                  disabled={!questionForm.question_text?.trim()}
                >
                  Update Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="rounded-[1.5rem]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-red-600">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg">
                Are you sure you want to delete this {deleteTarget?.type}?
                <br />
                <span className="font-semibold text-gray-800">"{deleteTarget?.name}"</span>
                <br /><br />
                {deleteTarget?.type === 'category' && (
                  <span className="text-red-600 font-medium">
                    ⚠️ This will also delete all questions and sub-categories within this category.
                  </span>
                )}
                {deleteTarget?.type === 'question' && (
                  <span className="text-red-600 font-medium">
                    ⚠️ This will also delete all options for this question.
                  </span>
                )}
                <br /><br />
                <span className="text-gray-600">This action cannot be undone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={deleteItem}
                className="bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Delete {deleteTarget?.type}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                  value={questionForm.question_text || ''}
                  onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                  placeholder="Enter your question here..."
                  className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="question_type" className="text-[#13377c] font-medium">Question Type</Label>
                  <Select
                    value={questionForm.question_type || 'MCQ'}
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
                    value={questionForm.marks || 5}
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
                                newOptions[index] = {...option, marks: parseInt(e.target.value) || 0};
                                setQuestionForm({...questionForm, options: newOptions});
                              }}
                              className="w-20 rounded-lg"
                              min="0"
                              max={questionForm.marks || 5}
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
                  disabled={!questionForm.question_text?.trim()}
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