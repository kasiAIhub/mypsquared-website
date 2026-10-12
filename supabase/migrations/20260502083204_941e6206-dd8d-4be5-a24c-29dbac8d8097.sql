-- Ensure payment_status has a default
ALTER TABLE public.dbe_registrations
  ALTER COLUMN payment_status SET DEFAULT 'pending';

-- Funnel events table (anonymous behavioural tracking only)
CREATE TABLE IF NOT EXISTS public.dbe_funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  step_number INTEGER,
  step_name TEXT,
  province TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_dbe_funnel_events_created_at ON public.dbe_funnel_events (created_at);
CREATE INDEX IF NOT EXISTS idx_dbe_funnel_events_event_type ON public.dbe_funnel_events (event_type);
CREATE INDEX IF NOT EXISTS idx_dbe_funnel_events_session_id ON public.dbe_funnel_events (session_id);

ALTER TABLE public.dbe_funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit funnel events"
  ON public.dbe_funnel_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read funnel events"
  ON public.dbe_funnel_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update funnel events"
  ON public.dbe_funnel_events
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete funnel events"
  ON public.dbe_funnel_events
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));