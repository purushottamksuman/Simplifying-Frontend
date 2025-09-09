/*
  # Create Categories System

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
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users to manage categories

  3. Constraints
    - Positive marks validation
    - Positive time validation (if provided)
    - Non-empty category name
    - Self-referencing hierarchy support
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL,
  parent_category_id uuid,
  category_name text NOT NULL CHECK (length(trim(category_name)) > 0),
  description text,
  instructions text,
  total_time integer CHECK (total_time IS NULL OR total_time > 0),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_categories_assessment 
    FOREIGN KEY (assessment_id) 
    REFERENCES assessments(assessment_id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_categories_parent 
    FOREIGN KEY (parent_category_id) 
    REFERENCES categories(category_id) 
    ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_assessment_id ON categories(assessment_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(assessment_id, display_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();