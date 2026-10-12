DROP POLICY IF EXISTS "Anyone can submit lesson plan requests" ON public.lesson_plan_requests;
CREATE POLICY "Anyone can submit lesson plan requests" ON public.lesson_plan_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(parent_name)) BETWEEN 1 AND 200
  AND length(btrim(child_name)) BETWEEN 1 AND 200
  AND length(whatsapp_number) BETWEEN 5 AND 30
  AND length(child_description) <= 5000
  AND status = 'new'
);