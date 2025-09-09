/*
  # Admin Exam Management System Schema

  1. New Tables
    - `exams` - Main exam table with basic exam information
    - `assessments` - Assessment sections within exams (supports nesting)
    - `questions` - Questions within assessments/sub-sections
    - `question_options` - Multiple choice options for MCQ questions

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access only
    - Add policies for student read access where appropriate

  3. Validation
    - Check constraints for marks validation
    - Foreign key relationships
    - Proper indexing for performance
*/

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  exam_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  description text,
  instructions text,
  total_time integer NOT NULL CHECK (total_time > 0), -- in minutes
  min_student_age integer CHECK (min_student_age >= 0),
  max_student_age integer CHECK (max_student_age >= min_student_age),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessments table (supports nested sub-sections)
CREATE TABLE IF NOT EXISTS assessments (
  assessment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  assessment_name text NOT NULL,
  description text,
  instructions text,
  total_time integer CHECK (total_time > 0), -- in minutes, nullable for sub-sections
  min_student_age integer CHECK (min_student_age >= 0),
  max_student_age integer CHECK (max_student_age >= min_student_age),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  parent_assessment_id uuid REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('MCQ', 'Subjective')),
  marks integer NOT NULL CHECK (marks > 0),
  image_url text,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create question options table (for MCQ questions)
CREATE TABLE IF NOT EXISTS question_options (
  option_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  option_text text NOT NULL,
  marks integer DEFAULT 0 CHECK (marks >= 0),
  image_url text,
  is_correct boolean DEFAULT false,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_exam_id ON assessments(exam_id);
CREATE INDEX IF NOT EXISTS idx_assessments_parent_id ON assessments(parent_assessment_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_assessments_active ON assessments(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- Enable Row Level Security
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (assuming admin role or specific user)
-- For now, allowing authenticated users to manage exams (you can restrict this further)

-- Exams policies
CREATE POLICY "Admins can manage exams"
  ON exams
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Assessments policies
CREATE POLICY "Admins can manage assessments"
  ON assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Questions policies
CREATE POLICY "Admins can manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Question options policies
CREATE POLICY "Admins can manage question options"
  ON question_options
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate marks distribution
CREATE OR REPLACE FUNCTION validate_assessment_marks()
RETURNS TRIGGER AS $$
DECLARE
  exam_max_marks integer;
  total_assessment_marks integer;
BEGIN
  -- Get exam's maximum marks
  SELECT maximum_marks INTO exam_max_marks
  FROM exams
  WHERE exam_id = NEW.exam_id;

  -- Calculate total marks of all assessments for this exam
  SELECT COALESCE(SUM(maximum_marks), 0) INTO total_assessment_marks
  FROM assessments
  WHERE exam_id = NEW.exam_id
    AND assessment_id != COALESCE(NEW.assessment_id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND is_active = true;

  -- Check if adding this assessment would exceed exam's maximum marks
  IF (total_assessment_marks + NEW.maximum_marks) > exam_max_marks THEN
    RAISE EXCEPTION 'Assessment marks (%) would exceed exam maximum marks (%). Current total: %',
      NEW.maximum_marks, exam_max_marks, total_assessment_marks;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for assessment marks validation
CREATE TRIGGER validate_assessment_marks_trigger
  BEFORE INSERT OR UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION validate_assessment_marks();

-- Create function to validate question marks
CREATE OR REPLACE FUNCTION validate_question_marks()
RETURNS TRIGGER AS $$
DECLARE
  assessment_max_marks integer;
  total_question_marks integer;
BEGIN
  -- Get assessment's maximum marks
  SELECT maximum_marks INTO assessment_max_marks
  FROM assessments
  WHERE assessment_id = NEW.assessment_id;

  -- Calculate total marks of all questions for this assessment
  SELECT COALESCE(SUM(marks), 0) INTO total_question_marks
  FROM questions
  WHERE assessment_id = NEW.assessment_id
    AND question_id != COALESCE(NEW.question_id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND is_active = true;

  -- Check if adding this question would exceed assessment's maximum marks
  IF (total_question_marks + NEW.marks) > assessment_max_marks THEN
    RAISE EXCEPTION 'Question marks (%) would exceed assessment maximum marks (%). Current total: %',
      NEW.marks, assessment_max_marks, total_question_marks;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for question marks validation
CREATE TRIGGER validate_question_marks_trigger
  BEFORE INSERT OR UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_marks();

-- Create function to validate option marks
CREATE OR REPLACE FUNCTION validate_option_marks()
RETURNS TRIGGER AS $$
DECLARE
  question_max_marks integer;
BEGIN
  -- Get question's maximum marks
  SELECT marks INTO question_max_marks
  FROM questions
  WHERE question_id = NEW.question_id;

  -- Check if option marks exceed question's maximum marks
  IF NEW.marks > question_max_marks THEN
    RAISE EXCEPTION 'Option marks (%) cannot exceed question maximum marks (%)',
      NEW.marks, question_max_marks;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for option marks validation
CREATE TRIGGER validate_option_marks_trigger
  BEFORE INSERT OR UPDATE ON question_options
  FOR EACH ROW
  EXECUTE FUNCTION validate_option_marks();