/*
  # Create payments table for Razorpay integration

  1. New Tables
    - `payments`
      - `payment_id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `razorpay_order_id` (text, unique)
      - `razorpay_payment_id` (text, nullable)
      - `amount` (numeric, not null)
      - `currency` (text, default 'INR')
      - `status` (text, check constraint)
      - `description` (text)
      - `receipt` (text)
      - `payment_method` (text, nullable)
      - `notes` (jsonb, default '{}')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payments` table
    - Add policies for authenticated users to manage their own payments

  3. Indexes
    - Index on user_id for performance
    - Index on razorpay_order_id for lookups
    - Index on status for filtering
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  razorpay_order_id text UNIQUE NOT NULL,
  razorpay_payment_id text,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'INR' NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description text,
  receipt text,
  payment_method text,
  notes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
    CREATE INDEX idx_payments_user_id ON payments(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_order_id') THEN
    CREATE INDEX idx_payments_order_id ON payments(razorpay_order_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON payments(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_created_at') THEN
    CREATE INDEX idx_payments_created_at ON payments(created_at);
  END IF;
END $$;

-- Create RLS policies
DO $$
BEGIN
  -- Policy for users to read their own payments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' 
    AND policyname = 'Users can read own payments'
  ) THEN
    CREATE POLICY "Users can read own payments"
      ON payments
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  -- Policy for users to insert their own payments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' 
    AND policyname = 'Users can insert own payments'
  ) THEN
    CREATE POLICY "Users can insert own payments"
      ON payments
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Policy for users to update their own payments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' 
    AND policyname = 'Users can update own payments'
  ) THEN
    CREATE POLICY "Users can update own payments"
      ON payments
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Create updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_payments_updated_at'
  ) THEN
    CREATE TRIGGER update_payments_updated_at
      BEFORE UPDATE ON payments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;