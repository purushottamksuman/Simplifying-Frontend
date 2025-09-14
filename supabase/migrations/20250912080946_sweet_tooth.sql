/*
  # Create assessment categories and questions system

  1. New Tables
    - `assessment_categories`
      - `category_id` (uuid, primary key)
      - `domain` (text, required) - aptitude, psychometric, adversity, sei, interest
      - `code` (text, required) - vr, na, ar, etc.
      - `name` (text, required) - Verbal, Numerical, etc.
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

    - `assessment_questions`
      - `question_id` (uuid, primary key)
      - `category_id` (uuid, foreign key to assessment_categories)
      - `prompt` (text, required)
      - `type` (text, required) - aptitude, psychometric, adversity, sei, interest
      - `correct_option_id` (uuid, nullable, foreign key to assessment_options)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

    - `assessment_options`
      - `option_id` (uuid, primary key)
      - `question_id` (uuid, foreign key to assessment_questions)
      - `text` (text, required)
      - `display_order` (integer, required)
      - `created_at` (timestamptz, auto)

  2. Security
    - Enable RLS on all tables
    - Read access for all authenticated users
    - Write access for authenticated users

  3. Static Data
    - Seed assessment_categories with predefined domains and codes
*/

-- Create assessment_categories table
CREATE TABLE IF NOT EXISTS assessment_categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL CHECK (domain IN ('aptitude', 'psychometric', 'adversity', 'sei', 'interest')),
  code text NOT NULL,
  name text NOT NULL CHECK (length(trim(name)) > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT assessment_categories_domain_code_unique UNIQUE (domain, code)
);

-- Create assessment_questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL,
  prompt text NOT NULL CHECK (length(trim(prompt)) > 0),
  type text NOT NULL CHECK (type IN ('aptitude', 'psychometric', 'adversity', 'sei', 'interest')),
  correct_option_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT assessment_questions_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES assessment_categories(category_id) ON DELETE CASCADE
);

-- Create assessment_options table
CREATE TABLE IF NOT EXISTS assessment_options (
  option_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL,
  text text NOT NULL CHECK (length(trim(text)) > 0),
  display_order integer NOT NULL CHECK (display_order > 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT assessment_options_question_id_fkey 
    FOREIGN KEY (question_id) REFERENCES assessment_questions(question_id) ON DELETE CASCADE,
  CONSTRAINT assessment_options_question_order_unique UNIQUE (question_id, display_order)
);

-- Add foreign key constraint for correct_option_id after assessment_options table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'assessment_questions_correct_option_id_fkey'
  ) THEN
    ALTER TABLE assessment_questions 
    ADD CONSTRAINT assessment_questions_correct_option_id_fkey 
    FOREIGN KEY (correct_option_id) REFERENCES assessment_options(option_id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_categories_domain ON assessment_categories(domain);
CREATE INDEX IF NOT EXISTS idx_assessment_categories_active ON assessment_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_category_id ON assessment_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_type ON assessment_questions(type);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_created_at ON assessment_questions(created_at);
CREATE INDEX IF NOT EXISTS idx_assessment_options_question_id ON assessment_options(question_id);
CREATE INDEX IF NOT EXISTS idx_assessment_options_display_order ON assessment_options(question_id, display_order);

-- Enable RLS
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_options ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Assessment Categories
CREATE POLICY "Anyone can read assessment categories"
  ON assessment_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage assessment categories"
  ON assessment_categories
  FOR ALL
  TO authenticated
  USING (true);

-- Assessment Questions
CREATE POLICY "Anyone can read assessment questions"
  ON assessment_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage assessment questions"
  ON assessment_questions
  FOR ALL
  TO authenticated
  USING (true);

-- Assessment Options
CREATE POLICY "Anyone can read assessment options"
  ON assessment_options
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage assessment options"
  ON assessment_options
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_assessment_categories_updated_at
  BEFORE UPDATE ON assessment_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_questions_updated_at
  BEFORE UPDATE ON assessment_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed static categories
INSERT INTO assessment_categories (domain, code, name) VALUES
  -- Aptitude
  ('aptitude', 'vr', 'Verbal'),
  ('aptitude', 'na', 'Numerical'),
  ('aptitude', 'ar', 'Abstract'),
  ('aptitude', 'psa', 'Speed and Accuracy'),
  ('aptitude', 'mr', 'Mechanical'),
  ('aptitude', 'sr', 'Space Relations'),
  ('aptitude', 'lu', 'Language Usage and Grammar'),
  
  -- Psychometric
  ('psychometric', 'openness', 'Openness'),
  ('psychometric', 'conscientiousness', 'Conscientiousness'),
  ('psychometric', 'extraversion', 'Extraversion'),
  ('psychometric', 'agreeableness', 'Agreeableness'),
  ('psychometric', 'neuroticism', 'Neuroticism'),
  
  -- Adversity
  ('adversity', 'control', 'Control'),
  ('adversity', 'ownership', 'Ownership'),
  ('adversity', 'reach', 'Reach'),
  ('adversity', 'endurance', 'Endurance'),
  
  -- SEI (Social Emotional Intelligence)
  ('sei', 'self_awareness', 'Self Awareness'),
  ('sei', 'self_management', 'Self Management'),
  ('sei', 'social_awareness', 'Social Awareness'),
  ('sei', 'social_skills', 'Social Skills'),
  
  -- Interest
  ('interest', 'realistic', 'Realistic'),
  ('interest', 'investigative', 'Investigative'),
  ('interest', 'artistic', 'Artistic'),
  ('interest', 'social', 'Social'),
  ('interest', 'enterprising', 'Enterprising'),
  ('interest', 'conventional', 'Conventional')
ON CONFLICT (domain, code) DO NOTHING;