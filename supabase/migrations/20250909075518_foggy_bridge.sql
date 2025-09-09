/*
  # Create exam-assessments junction table

  1. New Tables
    - `exam_assessments`
      - `id` (uuid, primary key)
      - `exam_id` (uuid, foreign key to exams)
      - `assessment_id` (uuid, foreign key to assessments)
      - `display_order` (integer, for ordering assessments in exam)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `exam_assessments` table
    - Add policy for authenticated users to manage exam-assessment relationships

  3. Indexes
    - Add indexes for efficient querying
    - Unique constraint on exam_id + assessment_id combination
*/

-- Create exam_assessments junction table
CREATE TABLE IF NOT EXISTS exam_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique combination of exam and assessment
  UNIQUE(exam_id, assessment_id)
);

-- Enable RLS
ALTER TABLE exam_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage exam assessments"
  ON exam_assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_assessments_exam_id ON exam_assessments(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_assessment_id ON exam_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_exam_assessments_display_order ON exam_assessments(exam_id, display_order);