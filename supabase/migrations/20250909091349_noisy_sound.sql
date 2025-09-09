/*
  # Create categories table

  1. New Tables
    - `categories`
      - `category_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `parent_category_id` (uuid, foreign key to categories, optional)
      - `category_name` (text, required)
      - `description` (text, optional)
      - `instructions` (text, optional)
      - `total_time` (integer, minutes, optional)
      - `maximum_marks` (integer, required)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users to manage categories

  3. Constraints
    - Category name must not be empty
    - Maximum marks must be positive
    - Total time must be positive (when provided)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  parent_category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  category_name text NOT NULL,
  description text,
  instructions text,
  total_time integer,
  maximum_marks integer NOT NULL,
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE categories 
ADD CONSTRAINT categories_name_not_empty 
CHECK (length(trim(category_name)) > 0);

ALTER TABLE categories 
ADD CONSTRAINT categories_positive_marks 
CHECK (maximum_marks > 0);

ALTER TABLE categories 
ADD CONSTRAINT categories_positive_time 
CHECK (total_time IS NULL OR total_time > 0);

-- Add trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_assessment_id ON categories(assessment_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(assessment_id, display_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);