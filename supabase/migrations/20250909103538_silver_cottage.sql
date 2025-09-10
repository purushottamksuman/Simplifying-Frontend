/*
  # Add pricing fields to exams table

  1. New Columns
    - `original_price` (numeric) - Original price of the exam
    - `discounted_price` (numeric) - Discounted price of the exam  
    - `tax` (numeric) - Tax amount for the exam

  2. Constraints
    - All pricing fields must be non-negative
    - Discounted price cannot be greater than original price

  3. Security
    - No changes to existing RLS policies
*/

-- Add pricing columns to exams table
DO $$
BEGIN
  -- Add original_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exams' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE exams ADD COLUMN original_price NUMERIC(10,2) DEFAULT 0;
  END IF;

  -- Add discounted_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exams' AND column_name = 'discounted_price'
  ) THEN
    ALTER TABLE exams ADD COLUMN discounted_price NUMERIC(10,2) DEFAULT 0;
  END IF;

  -- Add tax column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exams' AND column_name = 'tax'
  ) THEN
    ALTER TABLE exams ADD COLUMN tax NUMERIC(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add constraints for pricing fields
DO $$
BEGIN
  -- Check if original_price constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'exams_original_price_check'
  ) THEN
    ALTER TABLE exams ADD CONSTRAINT exams_original_price_check CHECK (original_price >= 0);
  END IF;

  -- Check if discounted_price constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'exams_discounted_price_check'
  ) THEN
    ALTER TABLE exams ADD CONSTRAINT exams_discounted_price_check CHECK (discounted_price >= 0);
  END IF;

  -- Check if tax constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'exams_tax_check'
  ) THEN
    ALTER TABLE exams ADD CONSTRAINT exams_tax_check CHECK (tax >= 0);
  END IF;

  -- Check if pricing logic constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'exams_pricing_logic_check'
  ) THEN
    ALTER TABLE exams ADD CONSTRAINT exams_pricing_logic_check CHECK (discounted_price <= original_price);
  END IF;
END $$;