CREATE TABLE public.lesson_plan_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  parent_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_grade TEXT NOT NULL,
  learning_type TEXT NOT NULL,
  curriculum TEXT,
  subjects TEXT,
  struggles TEXT,
  child_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_plan_requests TO authenticated;
GRANT INSERT ON public.lesson_plan_requests TO anon;
GRANT ALL ON public.lesson_plan_requests TO service_role;

ALTER TABLE public.lesson_plan_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lesson plan requests"
  ON public.lesson_plan_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view lesson plan requests"
  ON public.lesson_plan_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson plan requests"
  ON public.lesson_plan_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson plan requests"
  ON public.lesson_plan_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));