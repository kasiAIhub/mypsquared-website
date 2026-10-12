
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles: only admins can manage
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TABLE 1: assessments
-- ============================================
CREATE TABLE public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  child_name text NOT NULL,
  grade text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text,
  learning_style text NOT NULL,
  learning_style_scores jsonb,
  curriculum_recommendations jsonb,
  top_curriculum text,
  circumstance_triggers text[],
  circumstance_other text,
  mission text,
  values text,
  goals jsonb,
  desired_services text,
  pdf_generated boolean DEFAULT false,
  pdf_downloaded_at timestamptz,
  pdf_download_count integer DEFAULT 0
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_assessments_email ON public.assessments(parent_email);
CREATE INDEX idx_assessments_created ON public.assessments(created_at DESC);

-- Public can insert assessments (anonymous submissions)
CREATE POLICY "Anyone can submit assessments"
  ON public.assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "Admins can read assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update assessments"
  ON public.assessments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete assessments"
  ON public.assessments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TABLE 2: dbe_registrations
-- ============================================
CREATE TABLE public.dbe_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  assessment_id uuid REFERENCES public.assessments(id),
  parent_email text NOT NULL,
  parent_phone text,
  parent_full_name text NOT NULL,
  child_full_name text NOT NULL,
  child_date_of_birth date NOT NULL,
  child_id_number text NOT NULL,
  grade text NOT NULL,
  street_address text NOT NULL,
  suburb text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text NOT NULL,
  chosen_curriculum text,
  dbe_package_generated boolean DEFAULT false,
  dbe_package_generated_at timestamptz,
  dbe_package_pdf_url text,
  dbe_package_downloaded boolean DEFAULT false,
  dbe_package_downloaded_at timestamptz,
  dbe_download_count integer DEFAULT 0,
  payment_status text DEFAULT 'unpaid',
  payment_amount numeric DEFAULT 1499.00,
  payment_method text,
  payment_received_at timestamptz,
  payment_reference text,
  dbe_submission_status text,
  dbe_submitted_by_parent_at timestamptz,
  dbe_approval_received_at timestamptz,
  dbe_reference_number text,
  internal_notes text,
  support_tickets_count integer DEFAULT 0,
  last_contact_at timestamptz
);

ALTER TABLE public.dbe_registrations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_dbe_email ON public.dbe_registrations(parent_email);
CREATE INDEX idx_dbe_payment ON public.dbe_registrations(payment_status);
CREATE INDEX idx_dbe_created ON public.dbe_registrations(created_at DESC);

CREATE POLICY "Admins can read registrations"
  ON public.dbe_registrations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert registrations"
  ON public.dbe_registrations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.dbe_registrations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.dbe_registrations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TABLE 3: dbe_documents
-- ============================================
CREATE TABLE public.dbe_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  registration_id uuid REFERENCES public.dbe_registrations(id) NOT NULL,
  document_type text NOT NULL,
  document_name text NOT NULL,
  file_url text NOT NULL,
  file_size_bytes integer,
  version integer DEFAULT 1,
  is_current_version boolean DEFAULT true,
  download_count integer DEFAULT 0,
  last_downloaded_at timestamptz
);

ALTER TABLE public.dbe_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_docs_registration ON public.dbe_documents(registration_id);
CREATE INDEX idx_docs_type ON public.dbe_documents(document_type);

CREATE POLICY "Admins can read documents"
  ON public.dbe_documents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert documents"
  ON public.dbe_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
  ON public.dbe_documents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents"
  ON public.dbe_documents FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Storage bucket for DBE documents
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('dbe-documents', 'dbe-documents', false);

CREATE POLICY "Admins can read dbe-documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'dbe-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload dbe-documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dbe-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update dbe-documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'dbe-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dbe-documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'dbe-documents' AND public.has_role(auth.uid(), 'admin'));
