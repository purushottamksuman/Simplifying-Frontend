/*
  # Create payments table for Razorpay integration

  1. New Tables
    - `payments`
      - `payment_id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `razorpay_order_id` (text, unique)
      - `razorpay_payment_id` (text, nullable)
      - `amount` (integer, in paise)
      - `currency` (text, default INR)
      - `status` (text, enum: pending, completed, failed, refunded)
      - `payment_method` (text, nullable)
      - `description` (text)
      - `receipt` (text, unique)
      - `notes` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `payments` table
    - Add policy for users to read their own payments
    - Add policy for authenticated users to insert payments
    - Add policy for system to update payment status

  3. Indexes
    - Index on user_id for fast user payment lookups
    - Index on razorpay_order_id for webhook processing
    - Index on status for payment status queries
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  razorpay_order_id text UNIQUE NOT NULL,
  razorpay_payment_id text,
  amount integer NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  description text NOT NULL,
  receipt text UNIQUE NOT NULL,
  notes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create indexes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
    CREATE INDEX idx_payments_user_id ON payments(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_razorpay_order_id') THEN
    CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON payments(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_created_at') THEN
    CREATE INDEX idx_payments_created_at ON payments(created_at);
  END IF;
END $$;

-- Create updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at') THEN
    CREATE TRIGGER update_payments_updated_at
      BEFORE UPDATE ON payments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- RLS Policies
DO $$
BEGIN
  -- Users can read their own payments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own payments' AND tablename = 'payments') THEN
    CREATE POLICY "Users can read own payments"
      ON payments
      FOR SELECT
      TO authenticated
      USING (user_id = uid());
  END IF;

  -- Users can insert their own payments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own payments' AND tablename = 'payments') THEN
    CREATE POLICY "Users can insert own payments"
      ON payments
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = uid());
  END IF;

  -- System can update payment status (for webhooks)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can update payment status' AND tablename = 'payments') THEN
    CREATE POLICY "System can update payment status"
      ON payments
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;