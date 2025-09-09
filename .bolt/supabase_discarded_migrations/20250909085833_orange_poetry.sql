/*
  # Create Storage Bucket for Assessment Images

  1. Storage Setup
    - Create `assessment-images` bucket for storing question and option images
    - Set up proper policies for authenticated users

  2. Security
    - Allow authenticated users to upload, view, update, and delete images
    - Restrict access to authenticated users only
*/

-- Create storage bucket for assessment images
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-images', 'assessment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Authenticated users can view assessment images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'assessment-images');

CREATE POLICY "Authenticated users can upload assessment images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'assessment-images');

CREATE POLICY "Authenticated users can update assessment images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'assessment-images');

CREATE POLICY "Authenticated users can delete assessment images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'assessment-images');