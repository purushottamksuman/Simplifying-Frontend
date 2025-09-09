/*
  # Create Exams System

  1. New Tables
    - `exams`
      - `exam_id` (uuid, primary key)
      - `exam_name` (text, required)
      - `description` (text, optional)
      - `instructions` (text, optional)
      - `total_time` (integer, default 60 minutes)
      - `min_student_age` (integer, default 10)
      - `max_student_age` (integer, default 25)
      - `maximum_marks` (integer, default 100)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `exam_assessments`
      - `exam_assessment_id` (uuid, primary key)
      - `exam_id` (uuid, foreign key to exams)
      - `assessment_id` (uuid, foreign key to assessments)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage exams

  3. Constraints
    - Foreign keys to assessments table
    - Unique constraint on exam-assessment pairs
    - Check constraints for positive values
*/

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  exam_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name text NOT NULL,
  description text,
  instructions text,
  total_time integer DEFAULT 60 CHECK (total_time > 0),
  min_student_age integer DEFAULT 10 CHECK (min_student_age > 0),
  max_student_age integer DEFAULT 25 CHECK (max_student_age > 0),
  maximum_marks integer DEFAULT 100 CHECK (maximum_marks > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_age_range CHECK (max_student_age >= min_student_age)
);

-- Create exam_assessments junction table
CREATE TABLE IF NOT EXISTS exam_assessments (
  exam_assessment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  display_order integer DEFAULT 1 CHECK (display_order > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, assessment_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_exams_age_range ON exams(min_student_age, max_student_age);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_exam_id ON exam_assessments(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_assessment_id ON exam_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_display_order ON exam_assessments(exam_id, display_order);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for exams
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

-- Create policies for exam_assessments
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

-- Create updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_exams_updated_at'
  ) THEN
    CREATE TRIGGER update_exams_updated_at
      BEFORE UPDATE ON exams
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;