/*
  # Create Questions System

  1. New Tables
    - `questions`
      - `question_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `category_id` (uuid, foreign key to categories - optional)
      - `question_text` (text, required)
      - `question_type` (text, MCQ or Subjective)
      - `marks` (integer, default 5)
      - `image_url` (text, optional - Supabase storage URL)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `question_options`
      - `option_id` (uuid, primary key)
      - `question_id` (uuid, foreign key to questions)
      - `option_text` (text, required)
      - `marks` (integer, default 0)
      - `image_url` (text, optional - Supabase storage URL)
      - `is_correct` (boolean, default false)
      - `display_order` (integer, default 1)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage questions and options

  3. Constraints
    - Foreign keys to assessments and categories
    - Check constraints for positive marks
    - Question type validation
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('MCQ', 'Subjective')),
  marks integer DEFAULT 5 CHECK (marks > 0),
  image_url text,
  display_order integer DEFAULT 1 CHECK (display_order > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create question_options table
CREATE TABLE IF NOT EXISTS question_options (
  option_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  option_text text NOT NULL,
  marks integer DEFAULT 0 CHECK (marks >= 0),
  image_url text,
  is_correct boolean DEFAULT false,
  display_order integer DEFAULT 1 CHECK (display_order > 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_display_order ON questions(assessment_id, display_order);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_question_options_display_order ON question_options(question_id, display_order);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;

-- Create policies for questions
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

-- Create policies for question_options
CREATE POLICY "Authenticated users can read question options"
  ON question_options
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert question options"
  ON question_options
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update question options"
  ON question_options
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete question options"
  ON question_options
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_questions_updated_at'
  ) THEN
    CREATE TRIGGER update_questions_updated_at
      BEFORE UPDATE ON questions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;