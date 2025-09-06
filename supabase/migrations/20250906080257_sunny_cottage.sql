/*
  # Create OTP verifications table

  1. New Tables
    - `otp_verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `email` (text, not null)
      - `phone` (text)
      - `otp_code` (text, not null)
      - `otp_type` (text, not null) - email/phone/registration
      - `is_verified` (boolean, default false)
      - `attempts` (integer, default 0)
      - `max_attempts` (integer, default 5)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
      - `verified_at` (timestamp)

  2. Security
    - Enable RLS on `otp_verifications` table
    - Add policies for OTP management
*/

-- Create otp_verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  otp_code text NOT NULL,
  otp_type text NOT NULL CHECK (otp_type IN ('email', 'phone', 'registration', 'password_reset')),
  is_verified boolean DEFAULT false,
  attempts integer DEFAULT 0,
  max_attempts integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 minutes'),
  verified_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own OTP verifications"
  ON otp_verifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt()->>'email');

CREATE POLICY "Users can insert OTP verifications"
  ON otp_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR email = auth.jwt()->>'email');

CREATE POLICY "Users can update own OTP verifications"
  ON otp_verifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt()->>'email');

-- Allow anonymous users to create OTP for registration
CREATE POLICY "Anonymous users can create registration OTP"
  ON otp_verifications
  FOR INSERT
  TO anon
  WITH CHECK (otp_type = 'registration');

CREATE POLICY "Anonymous users can verify registration OTP"
  ON otp_verifications
  FOR UPDATE
  TO anon
  USING (otp_type = 'registration' AND is_verified = false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_otp_verifications_user_id ON otp_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_code ON otp_verifications(otp_code);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires ON otp_verifications(expires_at);

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_verifications 
  WHERE expires_at < now() AND is_verified = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;