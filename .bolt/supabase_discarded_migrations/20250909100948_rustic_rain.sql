/*
  # Create categories table

  1. New Tables
    - `categories`
      - `category_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `parent_category_id` (uuid, self-referencing foreign key)
      - `category_name` (text, not null)
      - `description` (text, nullable)
      - `instructions` (text, nullable)
      - `total_time` (integer, nullable)
      - `maximum_marks` (integer, not null)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users to manage categories

  3. Constraints
    - Total time must be positive if specified
    - Maximum marks must be positive
    - Self-referencing foreign key for hierarchical structure
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(assessment_id) ON DELETE CASCADE,
  parent_category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE,
  category_name text NOT NULL,
  description text,
  instructions text,
  total_time integer CHECK (total_time > 0),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
  display_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_assessment_id') THEN
    CREATE INDEX idx_categories_assessment_id ON categories(assessment_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_parent_id') THEN
    CREATE INDEX idx_categories_parent_id ON categories(parent_category_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_display_order') THEN
    CREATE INDEX idx_categories_display_order ON categories(assessment_id, display_order);
  END IF;
END $$;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for authenticated users to read categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Authenticated users can read categories'
  ) THEN
    CREATE POLICY "Authenticated users can read categories"
      ON categories
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to insert categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Authenticated users can insert categories'
  ) THEN
    CREATE POLICY "Authenticated users can insert categories"
      ON categories
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for authenticated users to update categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Authenticated users can update categories'
  ) THEN
    CREATE POLICY "Authenticated users can update categories"
      ON categories
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Policy for authenticated users to delete categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Authenticated users can delete categories'
  ) THEN
    CREATE POLICY "Authenticated users can delete categories"
      ON categories
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
    WHERE tgname = 'update_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;