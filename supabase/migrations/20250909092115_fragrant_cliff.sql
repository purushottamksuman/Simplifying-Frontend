/*
  # Create questions table

  1. New Tables
    - `questions`
      - `question_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `category_id` (uuid, optional foreign key to categories)
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

  3. Relationships
    - Links to assessments table
    - Optional link to categories table
*/

-- Create questions table if it doesn't exist
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
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'questions_assessment_id_fkey'
  ) THEN
    ALTER TABLE questions 
    ADD CONSTRAINT questions_assessment_id_fkey 
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'questions_category_id_fkey'
  ) THEN
    ALTER TABLE questions 
    ADD CONSTRAINT questions_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_assessment_id') THEN
    CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_category_id') THEN
    CREATE INDEX idx_questions_category_id ON questions(category_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_display_order') THEN
    CREATE INDEX idx_questions_display_order ON questions(assessment_id, category_id, display_order);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_questions_type') THEN
    CREATE INDEX idx_questions_type ON questions(question_type);
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'questions' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create trigger if it doesn't exist
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

-- Create policies if they don't exist
DO $$
BEGIN
  -- Select policy
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

  -- Insert policy
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

  -- Update policy
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

  -- Delete policy
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