/*
  # Create exam_assessments junction table

  1. New Tables
    - `exam_assessments`
      - `id` (uuid, primary key)
      - `exam_id` (uuid, foreign key to exams)
      - `assessment_id` (uuid, foreign key to assessments)
      - `display_order` (integer, default 1)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `exam_assessments` table
    - Add policy for authenticated users to manage exam assessments

  3. Constraints
    - Unique constraint on exam_id + assessment_id combination
    - Foreign key constraints with CASCADE delete
    - Indexes for performance
*/

-- Create exam_assessments junction table
CREATE TABLE IF NOT EXISTS exam_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL,
  assessment_id uuid NOT NULL,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, assessment_id)
);

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exam_assessments_exam_id_fkey'
  ) THEN
    ALTER TABLE exam_assessments 
    ADD CONSTRAINT exam_assessments_exam_id_fkey 
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exam_assessments_assessment_id_fkey'
  ) THEN
    ALTER TABLE exam_assessments 
    ADD CONSTRAINT exam_assessments_assessment_id_fkey 
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_assessments_exam_id ON exam_assessments(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_assessment_id ON exam_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_display_order ON exam_assessments(exam_id, display_order);

-- Enable RLS
ALTER TABLE exam_assessments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Admins can manage exam assessments"
  ON exam_assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);