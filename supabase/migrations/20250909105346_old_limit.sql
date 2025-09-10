/*
  # Create exam attempts table

  1. New Tables
    - `exam_attempts`
      - `attempt_id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `exam_id` (uuid, foreign key to exams)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `total_score` (integer)
      - `max_possible_score` (integer)
      - `percentage` (numeric)
      - `status` (text: 'in_progress', 'completed', 'abandoned')
      - `answers` (jsonb)
      - `time_taken` (integer, in seconds)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `exam_attempts` table
    - Add policies for users to manage their own attempts
    
  3. Indexes
    - Add indexes for performance optimization
*/

CREATE TABLE IF NOT EXISTS exam_attempts (
  attempt_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  exam_id uuid NOT NULL,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  total_score integer DEFAULT 0,
  max_possible_score integer DEFAULT 0,
  percentage numeric(5,2) DEFAULT 0,
  status text DEFAULT 'in_progress',
  answers jsonb DEFAULT '[]'::jsonb,
  time_taken integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT exam_attempts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT exam_attempts_exam_id_fkey 
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE,
  CONSTRAINT exam_attempts_status_check 
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  CONSTRAINT exam_attempts_score_check 
    CHECK (total_score >= 0 AND total_score <= max_possible_score),
  CONSTRAINT exam_attempts_percentage_check 
    CHECK (percentage >= 0 AND percentage <= 100),
  CONSTRAINT exam_attempts_time_taken_check 
    CHECK (time_taken >= 0)
);

-- Enable RLS
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert own exam attempts"
  ON exam_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own exam attempts"
  ON exam_attempts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own exam attempts"
  ON exam_attempts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id 
  ON exam_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id 
  ON exam_attempts(exam_id);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_status 
  ON exam_attempts(status);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_created_at 
  ON exam_attempts(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_exam_attempts_updated_at
  BEFORE UPDATE ON exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();