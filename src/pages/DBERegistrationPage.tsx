import { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DBEHero from '@/components/dbe-registration/DBEHero';
import ProvinceSelector from '@/components/dbe-registration/ProvinceSelector';
import FormProgress from '@/components/dbe-registration/FormProgress';
import Step1Parent from '@/components/dbe-registration/Step1Parent';
import Step2Child from '@/components/dbe-registration/Step2Child';
import Step3Circumstances from '@/components/dbe-registration/Step3Circumstances';
import Step4LearningPlan from '@/components/dbe-registration/Step4LearningPlan';
import Step5Motivation from '@/components/dbe-registration/Step5Motivation';
import Step6Review from '@/components/dbe-registration/Step6Review';
import POPIASection from '@/components/dbe-registration/POPIASection';
import { DBEFormData, initialFormData } from '@/types/dbeRegistration';
import { supabase } from '@/integrations/supabase/client';
import { trackFunnelEvent, DBE_STEP_NAMES } from '@/utils/trackFunnelEvent';

const DRAFT_KEY = 'psquared_dbe_draft';

interface SavedDraft {
  formData: DBEFormData;
  currentStep: number;
  savedAt: string;
}

interface FoundApplication {
  id: string;
  child_full_name: string;
  grade: string;
  province: string;
  payment_status: string | null;
  dbe_package_pdf_url: string | null;
}

export default function DBERegistrationPage() {
  const [formData, setFormData] = useState<DBEFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [yocoReady, setYocoReady] = useState(false);
  const [yocoFailed, setYocoFailed] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const provinceRef = useRef<HTMLDivElement>(null);

  // Stable session ID for upload paths
  const sessionId = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  ).current;

  // Save & resume
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedDraft, setSavedDraft] = useState<SavedDraft | null>(null);
  const [popiaError, setPopiaError] = useState(false);

  // Reference search
  const [showReferenceSearch, setShowReferenceSearch] = useState(false);
  const [searchRef, setSearchRef] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundApplication, setFoundApplication] = useState<FoundApplication | null>(null);

  // Load Yoco SDK with preflight tracking
  useEffect(() => {
    if ((window as unknown as { YocoSDK?: unknown }).YocoSDK) {
      setYocoReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"]',
    );
    if (existing) {
      existing.addEventListener('load', () => setYocoReady(true));
      existing.addEventListener('error', () => setYocoFailed(true));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
    script.async = true;
    script.onload = () => setYocoReady(true);
    script.onerror = () => setYocoFailed(true);
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch { /* already removed */ }
    };
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (formData.parentEmail) {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ formData, currentStep, savedAt: new Date().toISOString() }),
        );
      } catch { /* storage full / private mode */ }
    }
  }, [formData, currentStep]);

  // Track page view (once on mount)
  useEffect(() => {
    trackFunnelEvent({
      sessionId,
      eventType: 'page_view',
      metadata: { referrer: typeof document !== 'undefined' ? document.referrer : '' },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for resumable draft on mount
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(DRAFT_KEY); } catch { /* ignore */ }
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SavedDraft;
      const daysSaved =
        (Date.now() - new Date(parsed.savedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSaved < 7 && parsed.formData) {
        setSavedDraft(parsed);
        setShowResumePrompt(true);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    }
  }, []);

  const updateForm = useCallback((updates: Partial<DBEFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const scrollToProvince = () => {
    provinceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProvinceChange = (province: string) => {
    if (!formData.popiaConsent1 || !formData.popiaConsent2) {
      setPopiaError(true);
      return;
    }
    setPopiaError(false);
    updateForm({ province, address: { ...formData.address, province } });
    trackFunnelEvent({
      sessionId,
      eventType: 'province_selected',
      province,
    });
  };

  const startForm = () => {
    if (!formData.popiaConsent1 || !formData.popiaConsent2) {
      setPopiaError(true);
      return;
    }
    if (!formData.province) return;
    setCurrentStep(1);
    setTimeout(scrollToForm, 100);
  };

  const goStep = (step: number) => {
    // Track completion of the step the user is leaving
    if (currentStep >= 1) {
      trackFunnelEvent({
        sessionId,
        eventType: 'step_completed',
        stepNumber: currentStep,
        stepName: DBE_STEP_NAMES[currentStep],
        province: formData.province,
      });
    }
    if (step === 0) {
      setCurrentStep(0);
      setTimeout(scrollToProvince, 100);
      return;
    }
    // Track start of new step
    if (step >= 1) {
      trackFunnelEvent({
        sessionId,
        eventType: 'step_started',
        stepNumber: step,
        stepName: DBE_STEP_NAMES[step],
        province: formData.province,
      });
    }
    setCurrentStep(step);
    setTimeout(scrollToForm, 100);
  };

  const showForm = currentStep >= 1;

  const handleResume = () => {
    if (!savedDraft) return;
    setFormData(savedDraft.formData);
    setCurrentStep(savedDraft.currentStep);
    setShowResumePrompt(false);
    setTimeout(scrollToForm, 100);
  };

  const handleStartFresh = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setShowResumePrompt(false);
    setSavedDraft(null);
  };

  const handleReferenceSearch = async () => {
    setSearchError('');
    setFoundApplication(null);

    if (!searchRef.trim() || !searchEmail.trim()) {
      setSearchError('Please enter both your reference number and email address');
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('dbe_registrations')
        .select('id, child_full_name, grade, province, payment_status, dbe_package_pdf_url, internal_notes')
        .eq('parent_email', searchEmail.trim().toLowerCase())
        .filter('internal_notes->>referenceNumber', 'eq', searchRef.trim().toUpperCase())
        .maybeSingle();

      if (error || !data) {
        setSearchError(
          'No application found with those details. Check your reference number and email, or WhatsApp us: +27 81 890 5861',
        );
        return;
      }

      setFoundApplication({
        id: data.id,
        child_full_name: data.child_full_name,
        grade: data.grade,
        province: data.province,
        payment_status: data.payment_status,
        dbe_package_pdf_url: data.dbe_package_pdf_url,
      });
    } catch {
      setSearchError('Search failed. Please WhatsApp us: +27 81 890 5861');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 sm:pb-12">
      <Navbar />
      <div className="mt-14 md:mt-20">
        <DBEHero onCtaClick={scrollToProvince} />

        {showResumePrompt && savedDraft && (
          <div className="w-full sm:max-w-xl sm:mx-auto px-4 mt-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-emerald-800">You have an unfinished application</p>
              <p className="text-xs text-emerald-700 mt-1">
                {savedDraft.formData?.childFullName
                  ? `Saved for ${savedDraft.formData.childFullName}`
                  : 'Draft saved'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={handleResume}
                  className="bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg flex-1 hover:bg-emerald-700 transition"
                >
                  Continue where I left off
                </button>
                <button
                  onClick={handleStartFresh}
                  className="bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Start fresh
                </button>
              </div>
            </div>
          </div>
        )}

        {(() => {
          const consentsOk = !!formData.popiaConsent1 && !!formData.popiaConsent2;
          return (
            <>
              <POPIASection
                consent1={!!formData.popiaConsent1}
                consent2={!!formData.popiaConsent2}
                onChange={(u) => {
                  updateForm(u);
                  if (u.popiaConsent1 || u.popiaConsent2) setPopiaError(false);
                }}
                showError={popiaError}
              />

              <div
                ref={provinceRef}
                style={!consentsOk ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
                aria-disabled={!consentsOk}
              >
                <ProvinceSelector value={formData.province} onChange={handleProvinceChange} />
              </div>

              {formData.province && currentStep === 0 && (
                <div className="w-full sm:max-w-xl sm:mx-auto mt-6 mb-4 px-4">
                  <button
                    onClick={startForm}
                    disabled={!consentsOk}
                    className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start My Application
                  </button>
                </div>
              )}
            </>
          );
        })()}

        {currentStep === 0 && (
          <div className="w-full sm:max-w-xl sm:mx-auto px-4 mb-12">
            <button
              onClick={() => setShowReferenceSearch((p) => !p)}
              className="text-gray-500 text-xs underline w-full text-center hover:text-gray-700"
            >
              Have a reference number? Find your application →
            </button>

            {showReferenceSearch && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mt-3">
                <p className="text-sm font-semibold text-gray-800 mb-2">Find your application</p>
                <input
                  type="text"
                  placeholder="Reference number (e.g. PSQ-2025-1234)"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm mb-2 text-gray-900"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm mb-3 text-gray-900"
                />
                <button
                  onClick={handleReferenceSearch}
                  disabled={searching}
                  className="w-full bg-emerald-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                >
                  {searching ? 'Searching...' : 'Find my application'}
                </button>

                {searchError && (
                  <p className="text-red-500 text-xs mt-2">{searchError}</p>
                )}

                {foundApplication && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-emerald-800">Application found ✓</p>
                    <p className="text-xs text-emerald-700 mt-1">
                      {foundApplication.child_full_name} — {foundApplication.grade} — {foundApplication.province}
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                      Payment: <span className="font-medium">{foundApplication.payment_status || 'pending'}</span>
                    </p>
                    {foundApplication.dbe_package_pdf_url && (
                      <a
                        href={foundApplication.dbe_package_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3 bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg text-center hover:bg-emerald-700 transition"
                      >
                        Download my package again
                      </a>
                    )}
                    <a
                      href={`https://api.whatsapp.com/send?phone=27818905861&text=${encodeURIComponent(
                        'Hi P-Squared. My reference is ' + searchRef + '. I need help with my application.',
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 bg-gray-700 text-white text-xs px-3 py-2 rounded-lg text-center hover:bg-gray-800 transition"
                    >
                      WhatsApp us about this application
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showForm && (
          <div ref={formRef} className="w-full sm:max-w-2xl sm:mx-auto mt-8 mb-16 px-0">
            <div className="bg-white rounded-none sm:rounded-xl p-4 sm:p-8 shadow-md">
              <FormProgress currentStep={currentStep} />

              {currentStep === 1 && (
                <Step1Parent formData={formData} onChange={updateForm} onNext={() => goStep(2)} sessionId={sessionId} />
              )}
              {currentStep === 2 && (
                <Step2Child formData={formData} onChange={updateForm} onNext={() => goStep(3)} onBack={() => goStep(1)} sessionId={sessionId} />
              )}
              {currentStep === 3 && (
                <Step3Circumstances formData={formData} onChange={updateForm} onNext={() => goStep(4)} onBack={() => goStep(2)} />
              )}
              {currentStep === 4 && (
                <Step4LearningPlan formData={formData} onChange={updateForm} onNext={() => goStep(5)} onBack={() => goStep(3)} />
              )}
              {currentStep === 5 && (
                <Step5Motivation formData={formData} onChange={updateForm} onNext={() => goStep(6)} onBack={() => goStep(4)} />
              )}
              {currentStep === 6 && (
                <Step6Review formData={formData} goToStep={goStep} onBack={() => goStep(5)} yocoReady={yocoReady} yocoFailed={yocoFailed} />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
