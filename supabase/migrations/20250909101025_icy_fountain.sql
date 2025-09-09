/*
  # Create exams and exam_assessments tables

  1. New Tables
    - `exams`
      - `exam_id` (uuid, primary key)
      - `exam_name` (text, not null)
      - `description` (text, nullable)
      - `instructions` (text, nullable)
      - `total_time` (integer, minutes)
      - `min_student_age` (integer, nullable)
      - `max_student_age` (integer, nullable)
      - `maximum_marks` (integer, not null)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `exam_assessments` (junction table)
      - `exam_id` (uuid, foreign key to exams)
      - `assessment_id` (uuid, foreign key to assessments)
      - `display_order` (integer, default 1)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage exams and relationships

  3. Constraints
    - Exam name must not be empty
    - Total time must be positive
    - Maximum marks must be positive
    - Age range validation (max >= min)
    - Composite primary key on exam_assessments
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
    min_student_age IS NULL OR 
    max_student_age IS NULL OR 
    max_student_age >= min_student_age
  )
);

-- Create exam_assessments junction table
CREATE TABLE IF NOT EXISTS exam_assessments (
  exam_id uuid NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (exam_id, assessment_id)
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_assessments ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_exams_active') THEN
    CREATE INDEX idx_exams_active ON exams(is_active);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_exams_created_at') THEN
    CREATE INDEX idx_exams_created_at ON exams(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_exam_assessments_exam_id') THEN
    CREATE INDEX idx_exam_assessments_exam_id ON exam_assessments(exam_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_exam_assessments_display_order') THEN
    CREATE INDEX idx_exam_assessments_display_order ON exam_assessments(exam_id, display_order);
  END IF;
END $$;

-- Create RLS policies for exams
DO $$
BEGIN
  -- Policy for authenticated users to read exams
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exams' 
    AND policyname = 'Authenticated users can read exams'
  ) THEN
    CREATE POLICY "Authenticated users can read exams"
      ON exams
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to insert exams
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exams' 
    AND policyname = 'Authenticated users can insert exams'
  ) THEN
    CREATE POLICY "Authenticated users can insert exams"
      ON exams
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for authenticated users to update exams
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exams' 
    AND policyname = 'Authenticated users can update exams'
  ) THEN
    CREATE POLICY "Authenticated users can update exams"
      ON exams
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to delete exams
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exams' 
    AND policyname = 'Authenticated users can delete exams'
  ) THEN
    CREATE POLICY "Authenticated users can delete exams"
      ON exams
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create RLS policies for exam_assessments
DO $$
BEGIN
  -- Policy for authenticated users to read exam assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_assessments' 
    AND policyname = 'Authenticated users can read exam assessments'
  ) THEN
    CREATE POLICY "Authenticated users can read exam assessments"
      ON exam_assessments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to insert exam assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_assessments' 
    AND policyname = 'Authenticated users can insert exam assessments'
  ) THEN
    CREATE POLICY "Authenticated users can insert exam assessments"
      ON exam_assessments
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for authenticated users to update exam assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_assessments' 
    AND policyname = 'Authenticated users can update exam assessments'
  ) THEN
    CREATE POLICY "Authenticated users can update exam assessments"
      ON exam_assessments
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to delete exam assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_assessments' 
    AND policyname = 'Authenticated users can delete exam assessments'
  ) THEN
    CREATE POLICY "Authenticated users can delete exam assessments"
      ON exam_assessments
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create updated_at trigger for exams
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_exams_updated_at'
  ) THEN
    CREATE TRIGGER update_exams_updated_at
      BEFORE UPDATE ON exams
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;