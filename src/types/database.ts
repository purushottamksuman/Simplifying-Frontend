export interface Section {
  id: string;
  name: string;
  total_questions: number;
}

export interface SubSection {
  id: string;
  section_id: string;
  name: string;
  default_no_of_questions: number;
  has_default_options: boolean;
  question_type: 'MCQ' | 'Likert' | 'Agree_Disagree' | 'Frequency';
}

export interface Question {
  id: string;
  sub_section_id: string;
  question_text: string;
  marks: number;
  question_type: string;
  min_age?: number;
  max_age?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Option {
  id: string;
  question_id: string;
  option_text: string;
  marks: number;
}

export interface DefaultOption {
  id: string;
  sub_section_id: string;
  option_text: string;
  marks: number;
}

export interface QuestionWithOptions extends Question {
  options: Option[];
  sub_section: SubSection & { section: Section };
}