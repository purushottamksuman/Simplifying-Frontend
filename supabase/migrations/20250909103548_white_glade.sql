/*
  # Create exam purchases table

  1. New Tables
    - `exam_purchases`
      - `purchase_id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `exam_id` (uuid, foreign key to exams)
      - `payment_id` (uuid, foreign key to payments, nullable for free exams)
      - `purchase_type` (text) - 'free' or 'paid'
      - `amount_paid` (numeric) - Amount paid for the exam
      - `purchased_at` (timestamp)

  2. Security
    - Enable RLS on `exam_purchases` table
    - Add policies for users to manage their own purchases

  3. Indexes
    - Index on user_id for fast user purchase lookups
    - Index on exam_id for exam purchase analytics
    - Composite index on user_id and exam_id for access checks
*/

-- Create exam_purchases table
CREATE TABLE IF NOT EXISTS exam_purchases (
  purchase_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  exam_id uuid NOT NULL,
  payment_id uuid,
  purchase_type text NOT NULL DEFAULT 'free',
  amount_paid numeric(10,2) DEFAULT 0,
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
DO $$
BEGIN
  -- Check if purchase_type constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'exam_purchases_purchase_type_check'
  ) THEN
    ALTER TABLE exam_purchases ADD CONSTRAINT exam_purchases_purchase_type_check 
    CHECK (purchase_type IN ('free', 'paid'));
  END IF;

  -- Check if amount_paid constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'exam_purchases_amount_paid_check'
  ) THEN
    ALTER TABLE exam_purchases ADD CONSTRAINT exam_purchases_amount_paid_check 
    CHECK (amount_paid >= 0);
  END IF;

  -- Check if unique user_exam constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exam_purchases_user_exam_unique'
  ) THEN
    ALTER TABLE exam_purchases ADD CONSTRAINT exam_purchases_user_exam_unique 
    UNIQUE (user_id, exam_id);
  END IF;
END $$;

-- Add foreign key constraints
DO $$
BEGIN
  -- Check if user_id foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exam_purchases_user_id_fkey'
  ) THEN
    ALTER TABLE exam_purchases ADD CONSTRAINT exam_purchases_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;

  -- Check if exam_id foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exam_purchases_exam_id_fkey'
  ) THEN
    ALTER TABLE exam_purchases ADD CONSTRAINT exam_purchases_exam_id_fkey 
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE;
  END IF;

  -- Check if payment_id foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'exam_purchases_payment_id_fkey'
  ) THEN
    ALTER TABLE exam_purchases ADD CONSTRAINT exam_purchases_payment_id_fkey 
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
DO $$
BEGIN
  -- Index on user_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_exam_purchases_user_id'
  ) THEN
    CREATE INDEX idx_exam_purchases_user_id ON exam_purchases(user_id);
  END IF;

  -- Index on exam_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_exam_purchases_exam_id'
  ) THEN
    CREATE INDEX idx_exam_purchases_exam_id ON exam_purchases(exam_id);
  END IF;

  -- Index on purchase_type
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_exam_purchases_type'
  ) THEN
    CREATE INDEX idx_exam_purchases_type ON exam_purchases(purchase_type);
  END IF;

  -- Index on purchased_at
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_exam_purchases_purchased_at'
  ) THEN
    CREATE INDEX idx_exam_purchases_purchased_at ON exam_purchases(purchased_at);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE exam_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for users to read their own purchases
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_purchases' AND policyname = 'Users can read own purchases'
  ) THEN
    CREATE POLICY "Users can read own purchases"
      ON exam_purchases
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  -- Policy for users to insert their own purchases
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_purchases' AND policyname = 'Users can insert own purchases'
  ) THEN
    CREATE POLICY "Users can insert own purchases"
      ON exam_purchases
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Policy for users to update their own purchases
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exam_purchases' AND policyname = 'Users can update own purchases'
  ) THEN
    CREATE POLICY "Users can update own purchases"
      ON exam_purchases
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Add updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_exam_purchases_updated_at'
  ) THEN
    CREATE TRIGGER update_exam_purchases_updated_at
      BEFORE UPDATE ON exam_purchases
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;