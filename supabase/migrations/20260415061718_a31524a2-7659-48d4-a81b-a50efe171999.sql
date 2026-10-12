CREATE POLICY "Anyone can submit dbe registrations"
ON public.dbe_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);