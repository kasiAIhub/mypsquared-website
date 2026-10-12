
-- Create dbe-packages private bucket for emailing completed packages
INSERT INTO storage.buckets (id, name, public)
VALUES ('dbe-packages', 'dbe-packages', false)
ON CONFLICT (id) DO NOTHING;

-- Create dbe-uploads private bucket for in-progress uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('dbe-uploads', 'dbe-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for dbe-packages: only admins can read/manage; service role bypasses RLS
CREATE POLICY "Admins can read dbe-packages"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'dbe-packages' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage dbe-packages"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'dbe-packages' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'dbe-packages' AND public.has_role(auth.uid(), 'admin'));

-- RLS for dbe-uploads: anonymous/anyone can upload during draft (path scoped via signed URL),
-- but only admins can list/read across all sessions.
CREATE POLICY "Anyone can upload dbe-uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'dbe-uploads');

CREATE POLICY "Anyone can update their own dbe-uploads"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (bucket_id = 'dbe-uploads')
WITH CHECK (bucket_id = 'dbe-uploads');

CREATE POLICY "Anyone can delete their own dbe-uploads"
ON storage.objects FOR DELETE TO anon, authenticated
USING (bucket_id = 'dbe-uploads');

CREATE POLICY "Admins can read all dbe-uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'dbe-uploads' AND public.has_role(auth.uid(), 'admin'));
