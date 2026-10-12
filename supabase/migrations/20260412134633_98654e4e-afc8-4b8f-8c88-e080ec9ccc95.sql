
CREATE TABLE public.homeschooling_coach_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  assessment_id UUID REFERENCES public.assessments(id),
  source TEXT DEFAULT 'homepage'
);

ALTER TABLE public.homeschooling_coach_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit waitlist signup"
ON public.homeschooling_coach_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read waitlist"
ON public.homeschooling_coach_waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete waitlist entries"
ON public.homeschooling_coach_waitlist
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
