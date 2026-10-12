DROP POLICY IF EXISTS "Anyone can submit assessments" ON public.assessments;
CREATE POLICY "Anyone can submit assessments" ON public.assessments FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(child_name)) BETWEEN 1 AND 200
  AND length(parent_email) BETWEEN 3 AND 255 AND parent_email LIKE '%@%'
  AND length(grade) BETWEEN 1 AND 50
  AND coalesce(pdf_download_count, 0) = 0
  AND pdf_downloaded_at IS NULL
);

DROP POLICY IF EXISTS "Anyone can submit waitlist signup" ON public.waitlist_signups;
CREATE POLICY "Anyone can submit waitlist signup" ON public.waitlist_signups FOR INSERT TO anon, authenticated
WITH CHECK (length(email) BETWEEN 3 AND 255 AND email LIKE '%@%' AND (source IS NULL OR length(source) <= 100));

DROP POLICY IF EXISTS "Anyone can submit waitlist signup" ON public.homeschooling_coach_waitlist;
CREATE POLICY "Anyone can submit waitlist signup" ON public.homeschooling_coach_waitlist FOR INSERT TO anon, authenticated
WITH CHECK (length(email) BETWEEN 3 AND 255 AND email LIKE '%@%'
  AND (source IS NULL OR length(source) <= 100)
  AND (name IS NULL OR length(name) <= 200) AND (phone IS NULL OR length(phone) <= 50));

DROP POLICY IF EXISTS "Anyone can submit dbe registrations" ON public.dbe_registrations;
CREATE POLICY "Anyone can submit dbe registrations" ON public.dbe_registrations FOR INSERT TO anon, authenticated
WITH CHECK (
  length(parent_email) BETWEEN 3 AND 255 AND parent_email LIKE '%@%'
  AND length(btrim(parent_full_name)) BETWEEN 1 AND 200
  AND length(btrim(child_full_name)) BETWEEN 1 AND 200
  AND coalesce(payment_status, 'pending') = 'pending'
  AND payment_received_at IS NULL
  AND coalesce(coach_access_granted, false) = false
  AND coalesce(dbe_package_generated, false) = false
  AND dbe_package_pdf_url IS NULL
  AND dbe_approval_received_at IS NULL
);

DROP POLICY IF EXISTS "Anyone can submit funnel events" ON public.dbe_funnel_events;
CREATE POLICY "Anyone can submit funnel events" ON public.dbe_funnel_events FOR INSERT TO anon, authenticated
WITH CHECK (length(session_id) BETWEEN 1 AND 100 AND length(event_type) BETWEEN 1 AND 100
  AND (step_name IS NULL OR length(step_name) <= 200) AND (province IS NULL OR length(province) <= 100));

DROP POLICY IF EXISTS "Anyone can submit lesson plan requests" ON public.lesson_plan_requests;
CREATE POLICY "Anyone can submit lesson plan requests" ON public.lesson_plan_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(parent_name)) BETWEEN 1 AND 200
  AND length(btrim(child_name)) BETWEEN 1 AND 200
  AND length(whatsapp_number) BETWEEN 5 AND 30
  AND length(child_description) <= 5000
  AND status = 'pending'
);