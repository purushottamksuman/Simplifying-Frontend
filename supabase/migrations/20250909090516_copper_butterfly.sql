/*
  # Create Assessments System

  1. New Tables
    - `assessments`
      - `assessment_id` (uuid, primary key)
      - `assessment_name` (text, required)
      - `description` (text, optional)
      - `instructions` (text, optional)
      - `total_time` (integer, minutes, required)
      - `min_student_age` (integer, optional)
      - `max_student_age` (integer, optional)
      - `maximum_marks` (integer, required)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `assessments` table
    - Add policies for authenticated users to manage assessments

  3. Constraints
    - Positive marks and time validation
    - Age range validation (max >= min)
    - Non-empty assessment name
*/

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
    (min_student_age IS NULL OR max_student_age IS NULL) OR 
    (max_student_age >= min_student_age)
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_active ON assessments(is_active);
CREATE INDEX IF NOT EXISTS idx_assessments_age_range ON assessments(min_student_age, max_student_age);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can read assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assessments"
  ON assessments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete assessments"
  ON assessments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();