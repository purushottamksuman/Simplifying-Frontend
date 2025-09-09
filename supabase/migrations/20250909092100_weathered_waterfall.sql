/*
  # Create categories table

  1. New Tables
    - `categories`
      - `category_id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `parent_category_id` (uuid, self-referencing foreign key)
      - `category_name` (text, required)
      - `description` (text, optional)
      - `instructions` (text, optional)
      - `total_time` (integer, optional)
      - `maximum_marks` (integer, required)
      - `display_order` (integer, default 1)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for authenticated users to manage categories

  3. Relationships
    - Links to assessments table
    - Self-referencing for hierarchical structure
*/

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  category_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL,
  parent_category_id uuid,
  category_name text NOT NULL CHECK (length(trim(category_name)) > 0),
  description text,
  instructions text,
  total_time integer CHECK (total_time > 0),
  maximum_marks integer NOT NULL CHECK (maximum_marks > 0),
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
    WHERE conname = 'categories_assessment_id_fkey'
  ) THEN
    ALTER TABLE categories 
    ADD CONSTRAINT categories_assessment_id_fkey 
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'categories_parent_category_id_fkey'
  ) THEN
    ALTER TABLE categories 
    ADD CONSTRAINT categories_parent_category_id_fkey 
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes if they don't exist
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

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'categories' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create trigger if it doesn't exist
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

-- Create policies if they don't exist
DO $$
BEGIN
  -- Select policy
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

  -- Insert policy
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

  -- Update policy
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

  -- Delete policy
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