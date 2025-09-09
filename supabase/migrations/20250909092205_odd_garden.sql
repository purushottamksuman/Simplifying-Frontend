/*
  # Create storage bucket for assessment images

  1. Storage
    - Create `assessment-images` bucket if not exists
    - Set bucket to public for easy access
    - Add file size and type restrictions

  2. Security
    - RLS policies for authenticated users only
    - File upload restrictions (images only, max 10MB)
*/

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets 
    WHERE id = 'assessment-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'assessment-images',
      'assessment-images',
      true,
      10485760, -- 10MB
      ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    );
  END IF;
END $$;

-- Create storage policies if they don't exist
DO $$
BEGIN
  -- Select policy (public read access)
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'assessment-images');
  END IF;

  -- Insert policy (authenticated users only)
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Authenticated users can upload'
  ) THEN
    CREATE POLICY "Authenticated users can upload"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'assessment-images');
  END IF;

  -- Update policy (authenticated users only)
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Authenticated users can update'
  ) THEN
    CREATE POLICY "Authenticated users can update"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'assessment-images');
  END IF;

  -- Delete policy (authenticated users only)
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'assessment-images' 
    AND name = 'Authenticated users can delete'
  ) THEN
    CREATE POLICY "Authenticated users can delete"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'assessment-images');
  END IF;
END $$;