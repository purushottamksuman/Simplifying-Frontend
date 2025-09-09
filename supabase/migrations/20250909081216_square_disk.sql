/*
  # Fix Assessment Schema - Remove exam_id constraint

  1. Schema Changes
    - Remove exam_id foreign key constraint from assessments table
    - Remove exam_id column from assessments table
    - Assessments are now independent and can be attached to exams via junction table

  2. Security
    - Maintain existing RLS policies
    - Keep all existing indexes and constraints except exam_id

  3. Notes
    - This allows assessments to be created independently
    - Exams can attach multiple assessments via exam_assessments junction table
    - Assessments can be reused across multiple exams
*/

-- Remove the foreign key constraint first
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'assessments_exam_id_fkey' 
    AND table_name = 'assessments'
  ) THEN
    ALTER TABLE assessments DROP CONSTRAINT assessments_exam_id_fkey;
  END IF;
END $$;

-- Remove the exam_id column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'exam_id'
  ) THEN
    ALTER TABLE assessments DROP COLUMN exam_id;
  END IF;
END $$;

-- Remove the index on exam_id if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_assessments_exam_id'
  ) THEN
    DROP INDEX IF EXISTS idx_assessments_exam_id;
  END IF;
END $$;