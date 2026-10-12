ALTER TABLE public.dbe_registrations
  ADD COLUMN IF NOT EXISTS coach_access_granted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS coach_access_starts TIMESTAMP WITH TIME ZONE;