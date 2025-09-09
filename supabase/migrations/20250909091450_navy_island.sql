/*
  # Create storage bucket for assessment images

  1. Storage Setup
    - Create 'assessment-images' bucket
    - Set as public bucket for easy access
    - Configure file size and type limits

  2. Security
    - RLS policies for authenticated users only
    - File type restrictions (images only)
    - File size limits (10MB max)

  3. Folder Structure
    - question-images/ for question images
    - option-images/ for option images
*/

-- Create storage bucket for assessment images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assessment-images',
  'assessment-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for assessment images
CREATE POLICY "Authenticated users can upload assessment images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assessment-images');

CREATE POLICY "Anyone can view assessment images"
ON storage.objects FOR SELECT
USING (bucket_id = 'assessment-images');

CREATE POLICY "Authenticated users can update assessment images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'assessment-images');

CREATE POLICY "Authenticated users can delete assessment images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'assessment-images');