/*
  # Create Categories System

  1. New Tables
    - `categories`
      - `category_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `parent_category_id` (uuid, foreign key to categories - for hierarchy)
      - `category_name` (text, required)
      - `description` (text, optional)
      - `instructions` (text, optional)
      - `total_time` (integer, default 15 minutes)
      - `maximum_marks` (integer, default 50)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users to manage categories

  3. Constraints
    - Foreign key to assessments table
    - Self-referencing foreign key for hierarchy
    - Check constraint for positive marks and time
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  parent_category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  category_name text NOT NULL,
  description text,
  instructions text,
  total_time integer DEFAULT 15 CHECK (total_time > 0),
  maximum_marks integer DEFAULT 50 CHECK (maximum_marks > 0),
  display_order integer DEFAULT 1 CHECK (display_order > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_assessment_id ON categories(assessment_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(assessment_id, display_order);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;