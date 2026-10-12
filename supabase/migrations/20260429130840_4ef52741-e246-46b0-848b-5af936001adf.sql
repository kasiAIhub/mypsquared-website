ALTER TABLE public.dbe_registrations 
ADD COLUMN IF NOT EXISTS dbe_submission_status text DEFAULT 'pending';