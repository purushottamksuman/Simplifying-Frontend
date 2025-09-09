/*
  # Create questions table

  1. New Tables
    - `questions`
      - `question_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `category_id` (uuid, foreign key to categories, nullable)
      - `question_text` (text, not null)
      - `question_type` (text, check constraint)
      - `marks` (integer, not null)
      - `image_url` (text, nullable)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `questions` table
    - Add policies for authenticated users to manage questions

  3. Constraints
    - Question text must not be empty
    - Marks must be positive
    - Question type must be 'MCQ' or 'Subjective'
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  question_text text NOT NULL CHECK (length(trim(question_text)) > 0),
  question_type text NOT NULL CHECK (question_type IN ('MCQ', 'Subjective')),
  marks integer NOT NULL CHECK (marks > 0),
  image_url text,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_assessment_id') THEN
    CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_category_id') THEN
    CREATE INDEX idx_questions_category_id ON questions(category_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_type') THEN
    CREATE INDEX idx_questions_type ON questions(question_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_display_order') THEN
    CREATE INDEX idx_questions_display_order ON questions(assessment_id, category_id, display_order);
  END IF;
END $$;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for authenticated users to read questions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' 
    AND policyname = 'Authenticated users can read questions'
  ) THEN
    CREATE POLICY "Authenticated users can read questions"
      ON questions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to insert questions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' 
    AND policyname = 'Authenticated users can insert questions'
  ) THEN
    CREATE POLICY "Authenticated users can insert questions"
      ON questions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for authenticated users to update questions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' 
    AND policyname = 'Authenticated users can update questions'
  ) THEN
    CREATE POLICY "Authenticated users can update questions"
      ON questions
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to delete questions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' 
    AND policyname = 'Authenticated users can delete questions'
  ) THEN
    CREATE POLICY "Authenticated users can delete questions"
      ON questions
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
    WHERE tgname = 'update_questions_updated_at'
  ) THEN
    CREATE TRIGGER update_questions_updated_at
      BEFORE UPDATE ON questions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;