/*
  # Complete Exam System Schema

  1. New Tables
    - `assessments` - Main assessment containers
    - `categories` - Hierarchical categories within assessments  
    - `questions` - Questions that can belong to categories or assessments directly
    - `question_options` - MCQ options for questions
    - `exams` - Exam containers that include multiple assessments
    - `exam_assessments` - Junction table linking exams to assessments

  2. Hierarchy Structure
    - Assessments → Categories (multiple levels) → Questions
    - Questions can also belong directly to assessments (without categories)
    - Exams → Multiple Assessments

  3. Image Storage
    - Questions and options store image URLs in database
    - Images uploaded to Supabase storage

  4. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS exam_assessments CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS exams CASCADE;

-- Create assessments table
CREATE TABLE assessments (
  assessment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_name text NOT NULL,
  description text,
  instructions text,
  total_time integer CHECK (total_time > 0),
  min_student_age integer CHECK (min_student_age >= 0),
  max_student_age integer CHECK (max_student_age >= min_student_age),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table (hierarchical structure within assessments)
CREATE TABLE categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  parent_category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  category_name text NOT NULL,
  description text,
  instructions text,
  total_time integer CHECK (total_time > 0),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('MCQ', 'Subjective')),
  marks integer NOT NULL CHECK (marks > 0),
  image_url text, -- Store image URL from Supabase storage
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create question_options table
CREATE TABLE question_options (
  option_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  option_text text NOT NULL,
  marks integer DEFAULT 0 CHECK (marks >= 0),
  image_url text, -- Store image URL from Supabase storage
  is_correct boolean DEFAULT false,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exams table
CREATE TABLE exams (
  exam_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  description text,
  instructions text,
  total_time integer NOT NULL CHECK (total_time > 0),
  min_student_age integer CHECK (min_student_age >= 0),
  max_student_age integer CHECK (max_student_age >= min_student_age),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exam_assessments junction table
CREATE TABLE exam_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, assessment_id)
);

-- Create indexes for better performance
CREATE INDEX idx_categories_assessment_id ON categories(assessment_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_category_id);
CREATE INDEX idx_categories_display_order ON categories(assessment_id, display_order);
CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX idx_questions_category_id ON questions(category_id);
CREATE INDEX idx_questions_display_order ON questions(assessment_id, display_order);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_exam_assessments_exam_id ON exam_assessments(exam_id);
CREATE INDEX idx_exam_assessments_assessment_id ON exam_assessments(assessment_id);

-- Enable RLS on all tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users (admins)
CREATE POLICY "Admins can manage assessments" ON assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage questions" ON questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage question options" ON question_options FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage exams" ON exams FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage exam assessments" ON exam_assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assessment-images', 'assessment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view assessment images" ON storage.objects FOR SELECT USING (bucket_id = 'assessment-images');
CREATE POLICY "Authenticated users can upload assessment images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'assessment-images');
CREATE POLICY "Authenticated users can update assessment images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'assessment-images');
CREATE POLICY "Authenticated users can delete assessment images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'assessment-images');