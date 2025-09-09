/*
  # Create question options table

  1. New Tables
    - `question_options`
      - `option_id` (uuid, primary key)
      - `question_id` (uuid, foreign key to questions)
      - `option_text` (text, required)
      - `marks` (integer, default 0)
      - `image_url` (text, optional)
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
  option_text text NOT NULL,
  marks integer DEFAULT 0,
  image_url text,
  is_correct boolean DEFAULT false,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE question_options 
ADD CONSTRAINT options_text_not_empty 
CHECK (length(trim(option_text)) > 0);

ALTER TABLE question_options 
ADD CONSTRAINT options_non_negative_marks 
CHECK (marks >= 0);

-- Add trigger for updated_at
CREATE TRIGGER update_question_options_updated_at
  BEFORE UPDATE ON question_options
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can read question options"
  ON question_options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert question options"
  ON question_options FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update question options"
  ON question_options FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete question options"
  ON question_options FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_question_options_display_order ON question_options(question_id, display_order);
CREATE INDEX IF NOT EXISTS idx_question_options_correct ON question_options(is_correct);