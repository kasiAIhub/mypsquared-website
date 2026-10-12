
-- Tighten dbe-uploads policies: restrict anon access to the 'drafts/' prefix only
DROP POLICY IF EXISTS "Anyone can upload dbe-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own dbe-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete their own dbe-uploads" ON storage.objects;

CREATE POLICY "Anyone can upload draft dbe-uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'dbe-uploads'
  AND (storage.foldername(name))[1] = 'drafts'
);

CREATE POLICY "Anyone can update draft dbe-uploads"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (
  bucket_id = 'dbe-uploads'
  AND (storage.foldername(name))[1] = 'drafts'
)
WITH CHECK (
  bucket_id = 'dbe-uploads'
  AND (storage.foldername(name))[1] = 'drafts'
);

CREATE POLICY "Anyone can delete draft dbe-uploads"
ON storage.objects FOR DELETE TO anon, authenticated
USING (
  bucket_id = 'dbe-uploads'
  AND (storage.foldername(name))[1] = 'drafts'
);
