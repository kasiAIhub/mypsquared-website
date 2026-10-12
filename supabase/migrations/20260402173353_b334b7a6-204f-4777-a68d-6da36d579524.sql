-- Grant INSERT privilege to anon role on assessments table
GRANT INSERT ON public.assessments TO anon;

-- Also grant SELECT on the id column so the .select('id') after insert works
GRANT SELECT (id) ON public.assessments TO anon;
