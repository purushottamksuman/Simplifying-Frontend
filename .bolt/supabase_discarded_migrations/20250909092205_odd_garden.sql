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
  -- Public read access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Public read access'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Public read access"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'assessment-images');
  END IF;

  -- Authenticated users can upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Authenticated users can upload'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can upload"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'assessment-images');
  END IF;

  -- Authenticated users can update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Authenticated users can update'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can update"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'assessment-images');
  END IF;

  -- Authenticated users can delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Authenticated users can delete'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Authenticated users can delete"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'assessment-images');
  END IF;
END $$;
