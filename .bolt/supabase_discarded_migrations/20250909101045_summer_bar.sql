/*
  # Create storage bucket for images

  1. Storage Setup
    - Create 'assessment-images' bucket for question and option images
    - Set public access for easy retrieval
    - Configure file size limits (10MB max)
    - Restrict to image file types only

  2. Security
    - Enable RLS on storage bucket
    - Allow authenticated users to upload images
    - Allow public read access for images
*/

-- Create storage bucket for assessment images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'assessment-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'assessment-images',
      'assessment-images',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    );
  END IF;
END $$;

-- Create storage policies
DO $$
BEGIN
  -- Policy for authenticated users to upload images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'assessment-images');
  END IF;

  -- Policy for public read access
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Public can view images'
  ) THEN
    CREATE POLICY "Public can view images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'assessment-images');
  END IF;

  -- Policy for authenticated users to update their images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Authenticated users can update images'
  ) THEN
    CREATE POLICY "Authenticated users can update images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'assessment-images');
  END IF;

  -- Policy for authenticated users to delete their images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Authenticated users can delete images'
  ) THEN
    CREATE POLICY "Authenticated users can delete images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'assessment-images');
  END IF;
END $$;