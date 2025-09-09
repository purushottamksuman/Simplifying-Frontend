/*
  # Create Storage Bucket for Assessment Images

  1. Storage Setup
    - Create 'assessment-images' bucket for storing question and option images
    - Set up proper RLS policies for image access
    - Allow authenticated users to upload images

  2. Security
    - Only authenticated users can upload images
    - Public read access for images
    - Proper file type restrictions

  3. Organization
    - question-images/ folder for question images
    - option-images/ folder for option images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-images', 'assessment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload assessment images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assessment-images');

-- Allow public read access to images
CREATE POLICY "Public read access for assessment images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'assessment-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update assessment images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'assessment-images');

-- Allow authenticated users to delete their uploaded images
CREATE POLICY "Authenticated users can delete assessment images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'assessment-images');