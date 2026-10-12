CREATE TABLE public.learner_blueprint_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL,
  whatsapp_number text NOT NULL UNIQUE,
  grade text NOT NULL,
  curriculum text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.learner_blueprint_waitlist TO authenticated;
GRANT ALL ON public.learner_blueprint_waitlist TO service_role;
ALTER TABLE public.learner_blueprint_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read learner blueprint waitlist" ON public.learner_blueprint_waitlist
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.waitlist_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX waitlist_rate_limits_visitor_idx ON public.waitlist_rate_limits (visitor_hash, created_at);
GRANT ALL ON public.waitlist_rate_limits TO service_role;
ALTER TABLE public.waitlist_rate_limits ENABLE ROW LEVEL SECURITY;