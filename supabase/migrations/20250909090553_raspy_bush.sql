/*
  # Create Exams System

  1. New Tables
    - `exams`
      - `exam_id` (uuid, primary key)
      - `exam_name` (text, required)
      - `description` (text, optional)
      - `instructions` (text, optional)
      - `total_time` (integer, minutes, required)
      - `min_student_age` (integer, optional)
      - `max_student_age` (integer, optional)
      - `maximum_marks` (integer, required)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

    - `exam_assessments` (junction table)
      - `id` (uuid, primary key)
      - `exam_id` (uuid, foreign key to exams)
      - `assessment_id` (uuid, foreign key to assessments)
      - `display_order` (integer, default 1)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users

  3. Constraints
    - Positive marks and time validation
    - Age range validation
    - Unique exam-assessment pairs
*/

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  exam_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL CHECK (length(trim(exam_name)) > 0),
  description text,
  instructions text,
  total_time integer NOT NULL CHECK (total_time > 0),
  min_student_age integer CHECK (min_student_age >= 0),
  max_student_age integer CHECK (max_student_age >= 0),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_exam_age_range CHECK (
    (min_student_age IS NULL OR max_student_age IS NULL) OR 
    (max_student_age >= min_student_age)
  )
);

-- Create exam_assessments junction table
CREATE TABLE IF NOT EXISTS exam_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL,
  assessment_id uuid NOT NULL,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_exam_assessments_exam 
    FOREIGN KEY (exam_id) 
    REFERENCES exams(exam_id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_exam_assessments_assessment 
    FOREIGN KEY (assessment_id) 
    REFERENCES assessments(assessment_id) 
    ON DELETE CASCADE,
    
  -- Unique constraint to prevent duplicate exam-assessment pairs
  CONSTRAINT unique_exam_assessment UNIQUE (exam_id, assessment_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_exams_age_range ON exams(min_student_age, max_student_age);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at);

CREATE INDEX IF NOT EXISTS idx_exam_assessments_exam_id ON exam_assessments(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_assessment_id ON exam_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_display_order ON exam_assessments(exam_id, display_order);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for exams
CREATE POLICY "Authenticated users can read exams"
  ON exams
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert exams"
  ON exams
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exams"
  ON exams
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete exams"
  ON exams
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for exam_assessments
CREATE POLICY "Authenticated users can read exam assessments"
  ON exam_assessments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert exam assessments"
  ON exam_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exam assessments"
  ON exam_assessments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete exam assessments"
  ON exam_assessments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();