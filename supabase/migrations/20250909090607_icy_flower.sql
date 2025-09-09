/*
  # Create Storage Bucket for Assessment Images

  1. Storage Setup
    - Create 'assessment-images' bucket
    - Set bucket as public for easy access
    - Configure proper file size and type limits

  2. Security
    - RLS policies for authenticated users only
    - Proper CRUD permissions for image management

  3. File Organization
    - question-images/ folder for question images
    - option-images/ folder for option images
*/

-- Create storage bucket for assessment images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assessment-images',
  'assessment-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for storage
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