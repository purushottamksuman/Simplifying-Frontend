/*
  # Create assessments table

  1. New Tables
    - `assessments`
      - `assessment_id` (uuid, primary key)
      - `assessment_name` (text, not null)
      - `description` (text, nullable)
      - `instructions` (text, nullable)
      - `total_time` (integer, minutes)
      - `min_student_age` (integer, nullable)
      - `max_student_age` (integer, nullable)
      - `maximum_marks` (integer, not null)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `assessments` table
    - Add policies for authenticated users to manage assessments

  3. Constraints
    - Assessment name must not be empty
    - Total time must be positive
    - Maximum marks must be positive
    - Age range validation (max >= min)
    - Age values must be non-negative
*/

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  assessment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_name text NOT NULL CHECK (length(trim(assessment_name)) > 0),
  description text,
  instructions text,
  total_time integer NOT NULL CHECK (total_time > 0),
  min_student_age integer CHECK (min_student_age >= 0),
  max_student_age integer CHECK (max_student_age >= 0),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_age_range CHECK (
    min_student_age IS NULL OR 
    max_student_age IS NULL OR 
    max_student_age >= min_student_age
  )
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessments_active') THEN
    CREATE INDEX idx_assessments_active ON assessments(is_active);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessments_created_at') THEN
    CREATE INDEX idx_assessments_created_at ON assessments(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessments_age_range') THEN
    CREATE INDEX idx_assessments_age_range ON assessments(min_student_age, max_student_age);
  END IF;
END $$;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for authenticated users to read assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assessments' 
    AND policyname = 'Authenticated users can read assessments'
  ) THEN
    CREATE POLICY "Authenticated users can read assessments"
      ON assessments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to insert assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assessments' 
    AND policyname = 'Authenticated users can insert assessments'
  ) THEN
    CREATE POLICY "Authenticated users can insert assessments"
      ON assessments
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for authenticated users to update assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assessments' 
    AND policyname = 'Authenticated users can update assessments'
  ) THEN
    CREATE POLICY "Authenticated users can update assessments"
      ON assessments
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to delete assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assessments' 
    AND policyname = 'Authenticated users can delete assessments'
  ) THEN
    CREATE POLICY "Authenticated users can delete assessments"
      ON assessments
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_assessments_updated_at'
  ) THEN
    CREATE TRIGGER update_assessments_updated_at
      BEFORE UPDATE ON assessments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;