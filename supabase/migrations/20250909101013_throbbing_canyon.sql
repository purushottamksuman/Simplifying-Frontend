/*
  # Create question options table

  1. New Tables
    - `question_options`
      - `option_id` (uuid, primary key)
      - `question_id` (uuid, foreign key to questions)
      - `option_text` (text, not null)
      - `marks` (integer, default 0)
      - `image_url` (text, nullable)
      - `is_correct` (boolean, default false)
      - `display_order` (integer, default 1)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `question_options` table
    - Add policies for authenticated users to manage options

  3. Constraints
    - Option text must not be empty
    - Marks must be non-negative
*/

-- Create question_options table
CREATE TABLE IF NOT EXISTS question_options (
  option_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  option_text text NOT NULL CHECK (length(trim(option_text)) > 0),
  marks integer DEFAULT 0 CHECK (marks >= 0),
  image_url text,
  is_correct boolean DEFAULT false,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_options_question_id') THEN
    CREATE INDEX idx_question_options_question_id ON question_options(question_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_options_correct') THEN
    CREATE INDEX idx_question_options_correct ON question_options(question_id, is_correct);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_options_display_order') THEN
    CREATE INDEX idx_question_options_display_order ON question_options(question_id, display_order);
  END IF;
END $$;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for authenticated users to read question options
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'question_options' 
    AND policyname = 'Authenticated users can read question options'
  ) THEN
    CREATE POLICY "Authenticated users can read question options"
      ON question_options
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to insert question options
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'question_options' 
    AND policyname = 'Authenticated users can insert question options'
  ) THEN
    CREATE POLICY "Authenticated users can insert question options"
      ON question_options
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for authenticated users to update question options
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'question_options' 
    AND policyname = 'Authenticated users can update question options'
  ) THEN
    CREATE POLICY "Authenticated users can update question options"
      ON question_options
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to delete question options
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'question_options' 
    AND policyname = 'Authenticated users can delete question options'
  ) THEN
    CREATE POLICY "Authenticated users can delete question options"
      ON question_options
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
    WHERE tgname = 'update_question_options_updated_at'
  ) THEN
    CREATE TRIGGER update_question_options_updated_at
      BEFORE UPDATE ON question_options
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;