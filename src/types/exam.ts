export interface Exam {
  id: string;
  title: string;
  description?: string;
  total_duration: number; // in minutes
  instructions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamSection {
  id: string;
  exam_id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  instructions?: string;
  section_order: number;
  created_at: string;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  current_section_id?: string;
  status: 'not_started' | 'in_progress' | 'section_completed' | 'completed' | 'auto_submitted';
  started_at?: string;
  section_started_at?: string;
  completed_at?: string;
  total_time_spent: number; // in seconds
  section_time_spent: number; // in seconds
  created_at: string;
  updated_at: string;
}

export interface ExamResponse {
  id: string;
  attempt_id: string;
  section_id: string;
  question_id: string;
  question_text: string;
  question_type: string;
  selected_option_id?: string;
  selected_option_text?: string;
  option_marks: number;
  response_time?: number; // in seconds
  answered_at: string;
}

export interface ExamResult {
  id: string;
  attempt_id: string;
  section_id: string;
  total_questions: number;
  answered_questions: number;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  time_taken: number; // in seconds
  created_at: string;
}

export interface QuestionWithOptions {
  id: string;
  sub_section_id: string;
  question_text: string;
  marks: number;
  question_type: string;
  min_age?: number;
  max_age?: number;
  options: Array<{
    id: string;
    option_text: string;
    marks: number;
  }>;
  sub_section: {
    id: string;
    name: string;
    section?: {
      id: string;
      name: string;
    } | null;
  } | null;
}