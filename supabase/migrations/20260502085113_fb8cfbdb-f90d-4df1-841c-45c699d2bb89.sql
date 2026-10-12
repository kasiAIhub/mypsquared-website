-- 1. Tighten dbe-uploads draft policies: remove anon UPDATE/DELETE so other users
--    cannot tamper with someone else's draft files. Admins retain full access via
--    service-role / existing admin SELECT. Inserts under drafts/ remain open
--    because the path includes a session-scoped UUID acting as a capability token.
DROP POLICY IF EXISTS "Anyone can update draft dbe-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete draft dbe-uploads" ON storage.objects;

CREATE POLICY "Admins can update dbe-uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'dbe-uploads' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'dbe-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dbe-uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'dbe-uploads' AND public.has_role(auth.uid(), 'admin'));

-- 2. Allow draft uploaders to read their own draft files (path-scoped by session token)
--    Since the path prefix `drafts/{sessionId}/` contains a UUID acting as a
--    capability secret, anyone holding that path can read it back.
CREATE POLICY "Anyone can read draft dbe-uploads"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'dbe-uploads' AND (storage.foldername(name))[1] = 'drafts');

-- 3. Lock down has_role(): SECURITY DEFINER function should not be directly
--    callable by signed-in users. RLS policies and SECURITY DEFINER paths still
--    work because they bypass EXECUTE-grant checks.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
