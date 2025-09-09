/*
  # Create Questions System

  1. New Tables
    - `questions`
      - `question_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `category_id` (uuid, foreign key to categories, optional)
      - `question_text` (text, required)
      - `question_type` (text, MCQ or Subjective)
      - `marks` (integer, required)
      - `image_url` (text, optional)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `questions` table
    - Add policies for authenticated users to manage questions

  3. Constraints
    - Positive marks validation
    - Question type validation (MCQ/Subjective)
    - Non-empty question text
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL,
  category_id uuid,
  question_text text NOT NULL CHECK (length(trim(question_text)) > 0),
  question_type text NOT NULL CHECK (question_type IN ('MCQ', 'Subjective')),
  marks integer NOT NULL CHECK (marks > 0),
  image_url text,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_questions_assessment 
    FOREIGN KEY (assessment_id) 
    REFERENCES assessments(assessment_id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_questions_category 
    FOREIGN KEY (category_id) 
    REFERENCES categories(category_id) 
    ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_display_order ON questions(assessment_id, display_order);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();