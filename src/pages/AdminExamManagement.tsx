import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen, FileText, Users, Clock, Target, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
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

export const AdminExamManagement: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);

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

  // Dialog states
  const [showExamDialog, setShowExamDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsResult, assessmentsResult] = await Promise.all([
        supabase.from('exams').select('*').order('created_at', { ascending: false }),
        supabase.from('assessments').select('*').order('created_at', { ascending: false })
      ]);

      if (examsResult.error) throw examsResult.error;
      if (assessmentsResult.error) throw assessmentsResult.error;

      setExams(examsResult.data || []);
      setAssessments(assessmentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

      // Create exam-assessment relationships if assessments are selected
      if (selectedAssessments.length > 0) {
        const examAssessments = selectedAssessments.map(assessmentId => ({
          exam_id: data.exam_id,
          assessment_id: assessmentId
        }));

        const { error: junctionError } = await supabase
          .from('exam_assessments')
          .insert(examAssessments);

        if (junctionError) {
          console.error('Error creating exam-assessment relationships:', junctionError);
          // Don't throw here, just log the error since the exam was created successfully
        }
      }

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
      setSelectedAssessments([]);
      setShowExamDialog(false);
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Error creating exam: ' + (error as Error).message);
    }
  };

  const toggleAssessmentSelection = (assessmentId: string) => {
    setSelectedAssessments(prev => 
      prev.includes(assessmentId) 
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Admin Exam Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create and manage comprehensive exams with assessments, questions, and detailed configurations.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Half - Exams Management */}
          <Card className="rounded-[2rem] shadow-xl border-0 bg-white">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-2xl font-bold text-[#13377c]">
                  <BookOpen className="w-6 h-6 mr-3 text-[#3479ff]" />
                  Exams ({exams.length})
                </CardTitle>
                
                <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl px-6 py-3 shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1.5rem]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-[#13377c] mb-4">Create New Exam</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left - Exam Details */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#13377c] border-b pb-2">Exam Details</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="exam_name" className="text-[#13377c] font-medium">Exam Name</Label>
                            <Input
                              id="exam_name"
                              value={examForm.exam_name}
                              onChange={(e) => setExamForm({...examForm, exam_name: e.target.value})}
                              placeholder="Enter exam name"
                              className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="description" className="text-[#13377c] font-medium">Description</Label>
                            <Textarea
                              id="description"
                              value={examForm.description}
                              onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                              placeholder="Enter exam description"
                              className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[100px]"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="instructions" className="text-[#13377c] font-medium">Instructions</Label>
                            <Textarea
                              id="instructions"
                              value={examForm.instructions}
                              onChange={(e) => setExamForm({...examForm, instructions: e.target.value})}
                              placeholder="Enter exam instructions"
                              className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff] min-h-[100px]"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="total_time" className="text-[#13377c] font-medium">Total Time (minutes)</Label>
                              <Input
                                id="total_time"
                                type="number"
                                value={examForm.total_time}
                                onChange={(e) => setExamForm({...examForm, total_time: parseInt(e.target.value)})}
                                className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="maximum_marks" className="text-[#13377c] font-medium">Maximum Marks</Label>
                              <Input
                                id="maximum_marks"
                                type="number"
                                value={examForm.maximum_marks}
                                onChange={(e) => setExamForm({...examForm, maximum_marks: parseInt(e.target.value)})}
                                className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="min_student_age" className="text-[#13377c] font-medium">Min Student Age</Label>
                              <Input
                                id="min_student_age"
                                type="number"
                                value={examForm.min_student_age}
                                onChange={(e) => setExamForm({...examForm, min_student_age: parseInt(e.target.value)})}
                                className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="max_student_age" className="text-[#13377c] font-medium">Max Student Age</Label>
                              <Input
                                id="max_student_age"
                                type="number"
                                value={examForm.max_student_age}
                                onChange={(e) => setExamForm({...examForm, max_student_age: parseInt(e.target.value)})}
                                className="rounded-xl border-gray-300 focus:border-[#3479ff] focus:ring-[#3479ff]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Assessment Selection */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#13377c] border-b pb-2">Select Assessments</h3>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {assessments.map((assessment) => (
                            <div
                              key={assessment.assessment_id}
                              onClick={() => toggleAssessmentSelection(assessment.assessment_id)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedAssessments.includes(assessment.assessment_id)
                                  ? 'border-[#3479ff] bg-[#3479ff]/10 shadow-md'
                                  : 'border-gray-200 hover:border-[#3479ff]/50 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-[#13377c]">{assessment.assessment_name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{assessment.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {assessment.maximum_marks} marks
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {assessment.total_time} min
                                    </Badge>
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 ${
                                  selectedAssessments.includes(assessment.assessment_id)
                                    ? 'bg-[#3479ff] border-[#3479ff]'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedAssessments.includes(assessment.assessment_id) && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {selectedAssessments.length > 0 && (
                          <div className="bg-[#3479ff]/10 p-4 rounded-xl">
                            <p className="text-sm text-[#13377c] font-medium">
                              {selectedAssessments.length} assessment{selectedAssessments.length !== 1 ? 's' : ''} selected
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowExamDialog(false)}
                        className="rounded-xl px-6"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={createExam}
                        className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl px-6"
                      >
                        Create Exam
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {exams.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No exams created yet</p>
                  <p className="text-gray-400 text-sm">Create your first exam to get started</p>
                </div>
              ) : (
                exams.map((exam) => (
                  <Card key={exam.exam_id} className="rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-[#3479ff]/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#13377c] text-lg mb-2">{exam.exam_name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#3479ff]" />
                              <span className="text-sm text-gray-600">{exam.total_time} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-[#3479ff]" />
                              <span className="text-sm text-gray-600">{exam.maximum_marks} marks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-[#3479ff]" />
                              <span className="text-sm text-gray-600">{exam.min_student_age}-{exam.max_student_age} years</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={exam.is_active ? "default" : "secondary"} className="rounded-full">
                              {exam.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              Created {new Date(exam.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Right Half - Assessments Management */}
          <Card className="rounded-[2rem] shadow-xl border-0 bg-white">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-2xl font-bold text-[#13377c]">
                  <FileText className="w-6 h-6 mr-3 text-[#3479ff]" />
                  Assessments ({assessments.length})
                </CardTitle>
                
                <Button 
                  onClick={() => navigate('/admin/create-assessment')}
                  className="bg-[#3479ff] hover:bg-[#2968e6] rounded-xl px-6 py-3 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assessment
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {assessments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No assessments created yet</p>
                  <p className="text-gray-400 text-sm">Create your first assessment to get started</p>
                </div>
              ) : (
                assessments.map((assessment) => (
                  <Card key={assessment.assessment_id} className="rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-[#3479ff]/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#13377c] text-lg mb-2">{assessment.assessment_name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assessment.description}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#3479ff]" />
                              <span className="text-sm text-gray-600">{assessment.total_time} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-[#3479ff]" />
                              <span className="text-sm text-gray-600">{assessment.maximum_marks} marks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-[#3479ff]" />
                              <span className="text-sm text-gray-600">{assessment.min_student_age}-{assessment.max_student_age} years</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={assessment.is_active ? "default" : "secondary"} className="rounded-full">
                              {assessment.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {assessment.parent_assessment_id && (
                              <Badge variant="outline" className="rounded-full text-xs">
                                Sub-section
                              </Badge>
                            )}
                            <span className="text-xs text-gray-400">
                              Created {new Date(assessment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-lg"
                            onClick={() => navigate(`/admin/edit-assessment/${assessment.assessment_id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto">
          <Card className="rounded-[1.5rem] border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold">{exams.length}</div>
              <div className="text-sm opacity-90">Total Exams</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-[1.5rem] border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold">{assessments.length}</div>
              <div className="text-sm opacity-90">Total Assessments</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-[1.5rem] border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold">{exams.filter(e => e.is_active).length}</div>
              <div className="text-sm opacity-90">Active Exams</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-[1.5rem] border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold">{assessments.filter(a => a.is_active).length}</div>
              <div className="text-sm opacity-90">Active Assessments</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};