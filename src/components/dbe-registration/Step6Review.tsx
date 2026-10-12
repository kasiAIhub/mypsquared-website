import { useState, type ReactNode } from 'react';
import { Check, ExternalLink, Download, Loader2, Mail, Gift, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DBEFormData, provinceEmails, generateReferenceNumber } from '@/types/dbeRegistration';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  generateDBEPackage,
  downloadBlob,
  getZipFilename,
  generateApplicationFormPDFPreview,
  generateMotivationLetterPDFPreview,
} from '@/utils/generateDBEPackage';
import { toTitleCase, capitalizeSentences } from '@/utils/formatters';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

const YOCO_PUBLIC_KEY = import.meta.env.VITE_YOCO_PUBLIC_KEY as string | undefined;


const buildMotivationLetterPayload = (formData: DBEFormData, refNum: string) => ({
  province: formData.province,
  applicationYear: formData.applicationYear,
  childFullName: formData.childFullName,
  childDOB: formData.childDOB,
  childGender: formData.childGender,
  gradeApplying: formData.gradeApplying,
  previousSchool: formData.previousSchool,
  previousSchoolName: formData.previousSchoolDetails?.schoolName || '',
  prevGradeCompleted: formData.previousSchoolDetails?.gradeCompleted || '',
  disabilities: (formData.disabilities || []).filter((d) => d !== 'No diagnosed conditions'),
  academicPerformance: formData.academicPerformance,
  reportAverage: formData.reportAverage || '',
  childLearnerProfile: capitalizeSentences(formData.childLearnerProfile || ''),
  parentTitle: formData.parentTitle,
  parentFullName: formData.parentFullName,
  parentRelationship: formData.parentRelationship,
  parentQualification: formData.parentQualification,
  parentEmployment: formData.parentEmployment,
  parentBackground: capitalizeSentences(formData.parentBackground || ''),
  addressStreet: toTitleCase(formData.address.street || ''),
  addressSuburb: toTitleCase(formData.address.suburb || ''),
  addressCity: toTitleCase(formData.address.city || ''),
  addressPostalCode: formData.address.postalCode || '',
  circumstanceTriggers: formData.circumstanceTriggers,
  circumstanceOther: formData.circumstanceOther || '',
  circumstanceNarrative: capitalizeSentences(formData.circumstanceNarrative || ''),
  childNeeds: capitalizeSentences(formData.childNeeds || ''),
  schoolIncident: capitalizeSentences(formData.schoolIncident || ''),
  educationVision: capitalizeSentences(formData.educationVision || ''),
  chosenCurriculum: formData.chosenCurriculum,
  subjects: formData.subjects,
  subjectsOther: formData.subjectsOther || '',
  dailyHours: formData.dailyHours,
  weeklyDays: formData.weeklyDays || '5 days',
  learningSpace: formData.learningSpace,
  learningResources: formData.learningResources || [],
  extramurals: formData.extramurals || [],
  extramuralsSport: formData.extramuralsSport || '',
  extramuralsLanguage: formData.extramuralsLanguage || '',
  extramuralsOther: formData.extramuralsOther || '',
  usesTutor: formData.usesTutor,
  tutorName: formData.tutorDetails?.name || '',
  tutorQualifications: formData.tutorDetails?.qualifications || '',
  assessorCommitment: formData.assessorCommitment,
  parentPhone: formData.parentPhone,
  parentEmail: formData.parentEmail,
  referenceNumber: refNum,
});

interface Step6Props {
  formData: DBEFormData;
  goToStep: (step: number) => void;
  onBack: () => void;
  yocoReady?: boolean;
  yocoFailed?: boolean;
}

export default function Step6Review({ formData, goToStep, onBack, yocoReady = false, yocoFailed = false }: Step6Props) {
  const [saving, setSaving] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [zipFilename, setZipFilename] = useState('');
  const [refMismatchDetected, setRefMismatchDetected] = useState(false);
  const [isYocoOpen, setIsYocoOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [previewingForm, setPreviewingForm] = useState(false);
  const [previewingLetter, setPreviewingLetter] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const handlePreviewApplicationForm = async () => {
    setPreviewingForm(true);
    setPreviewError('');
    try {
      const pdfBlob = await generateApplicationFormPDFPreview(formData, 'PSQ-PREVIEW-TEST');
      downloadBlob(pdfBlob, 'PREVIEW_DBE_Application_Form.pdf');
    } catch (err) {
      setPreviewError('Preview failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPreviewingForm(false);
    }
  };

  const handlePreviewMotivationLetter = async () => {
    setPreviewingLetter(true);
    setPreviewError('');
    try {
      const letterResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-motivation-letter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(buildMotivationLetterPayload(formData, 'PSQ-PREVIEW-TEST')),
        },
      );
      const letterData = letterResponse.ok ? await letterResponse.json() : {};
      const pdfBlob = await generateMotivationLetterPDFPreview(
        formData,
        'PSQ-PREVIEW-TEST',
        letterData.letter || letterData.content || letterData.text || '',
      );
      downloadBlob(pdfBlob, 'PREVIEW_Motivation_Letter.pdf');
    } catch (err) {
      setPreviewError('Preview failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPreviewingLetter(false);
    }
  };

  const email = provinceEmails[formData.province] || '';
  const isGmail = formData.province === 'Mpumalanga' || formData.province === 'Limpopo';
  const isHOD = formData.province === 'North West' || formData.province === 'Northern Cape';
  const hasPrevSchool = formData.previousSchool !== 'Never been enrolled' && formData.previousSchool !== '';
  const hasDisabilities = formData.disabilities.length > 0 && !formData.disabilities.every(d => d === 'No diagnosed conditions');
  const hasCustody = formData.parentMaritalStatus === 'Divorced' || formData.parentMaritalStatus === 'Co-parenting / Separated';
  const hasMedicalDocs = formData.supportingDocs.some(d => d.includes('Medical') || d.includes('psychological') || d.includes('Doctor'));

  const buildInternalNotes = (refNum: string, extra: Record<string, unknown> = {}) => JSON.stringify({
    referenceNumber: refNum,
    circumstanceTriggers: formData.circumstanceTriggers,
    circumstanceNarrative: formData.circumstanceNarrative,
    childNeeds: formData.childNeeds,
    educationVision: formData.educationVision,
    childLearnerProfile: formData.childLearnerProfile,
    academicPerformance: formData.academicPerformance,
    reportAverage: formData.reportAverage,
    schoolIncident: formData.schoolIncident,
    parentBackground: formData.parentBackground,
    supportingDocs: formData.supportingDocs,
    learningSpace: formData.learningSpace,
    subjects: formData.subjects,
    dailyHours: formData.dailyHours,
    weeklyDays: formData.weeklyDays,
    extramurals: formData.extramurals,
    extramuralsSport: formData.extramuralsSport,
    extramuralsLanguage: formData.extramuralsLanguage,
    extramuralsOther: formData.extramuralsOther,
    usesTutor: formData.usesTutor,
    tutorDetails: formData.tutorDetails,
    assessorCommitment: formData.assessorCommitment,
    disabilities: formData.disabilities,
    previousSchoolDetails: formData.previousSchoolDetails,
    ...extra,
  });

  const finalisePackage = async (refNum: string, yocoToken: string) => {
    const fdWithRef: DBEFormData = { ...formData, referenceNumber: refNum };

    // Mark payment paid + grant 7-day My Learning Coach access
    setLoadingMessage('Confirming payment...');
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('dbe_registrations')
      .update({
        payment_status: 'paid',
        payment_method: 'yoco_card',
        payment_received_at: new Date().toISOString(),
        payment_reference: yocoToken,
        coach_access_granted: true,
        coach_access_starts: tomorrow,
        internal_notes: buildInternalNotes(refNum, { yocoToken }),
      })
      .eq('internal_notes->>referenceNumber', refNum);

    // Generate motivation letter via edge function
    setLoadingMessage('Writing your motivation letter...');
    let motivationLetter = '';
    try {
      const letterResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-motivation-letter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(buildMotivationLetterPayload(formData, refNum)),
        },
      );
      console.log('Letter response status:', letterResponse.status);
      if (letterResponse.ok) {
        const letterData = await letterResponse.json();
        motivationLetter =
          letterData.letter || letterData.content || letterData.text || '';
        console.log('Letter length received:', motivationLetter.length);
      }
    } catch (letterErr) {
      console.warn('Motivation letter generation failed, using fallback', letterErr);
    }

    // Generate ZIP
    setLoadingMessage('Preparing your documents...');
    const filename = getZipFilename(fdWithRef);
    setZipFilename(filename);

    let blob = await generateDBEPackage(fdWithRef, motivationLetter);

    // Reference consistency check (non-blocking)
    const extractedRef = filename?.split('_')[1];
    if (extractedRef && extractedRef !== refNum) {
      console.error('Reference mismatch detected.', 'Expected:', refNum, 'In filename:', extractedRef);
      setRefMismatchDetected(true);
      try {
        blob = await generateDBEPackage(fdWithRef, motivationLetter);
      } catch (regenErr) {
        console.warn('Fallback regeneration failed; using original blob', regenErr);
      }
    }

    setZipBlob(blob);
    setLoadingMessage('Downloading your package...');
    downloadBlob(blob, filename);

    // Fire-and-forget: email package to parent (and store signed URL)
    setLoadingMessage(`Sending your package to ${formData.parentEmail}...`);
    try {
      const zipBase64 = await blobToBase64(blob);
      await supabase.functions.invoke('send-dbe-package-email', {
        body: {
          referenceNumber: refNum,
          parentEmail: formData.parentEmail,
          parentName: formData.parentFullName,
          childName: formData.childFullName,
          gradeApplying: formData.gradeApplying,
          province: formData.province,
          zipBase64,
        },
      });
    } catch (emailErr) {
      console.warn('Email send failed (non-fatal)', emailErr);
    }

    // Clear saved draft on success
    try { localStorage.removeItem('psquared_dbe_draft'); } catch { /* ignore */ }

    setShowConfirm(true);
  };

  const handlePay = async () => {
    // Hard guard — block if already in progress or done
    if (saving || isYocoOpen || paymentComplete) return;

    setSaving(true);
    setError('');
    try {
      // 1. Generate reference number
      setLoadingMessage('Saving your application...');
      const refNum = generateReferenceNumber();
      setReferenceNumber(refNum);

      // 2. Save to Supabase first (capture intent before payment)
      const { error: err } = await supabase.from('dbe_registrations').insert({
        parent_email: formData.parentEmail,
        parent_phone: formData.parentPhone,
        parent_full_name: formData.parentFullName,
        child_full_name: formData.childFullName,
        child_date_of_birth: formData.childDOB ? new Date(formData.childDOB).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        child_id_number: formData.childIdNumber || 'Not provided',
        grade: formData.gradeApplying,
        street_address: formData.address.street,
        suburb: formData.address.suburb,
        city: formData.address.city,
        province: formData.province,
        postal_code: formData.address.postalCode,
        chosen_curriculum: formData.chosenCurriculum,
        payment_status: 'pending',
        payment_amount: 999.00,
        internal_notes: buildInternalNotes(refNum),
      });
      if (err) throw err;

      // 3. Open Yoco popup
      setLoadingMessage('');
      setSaving(false);

      const YocoSDK = (window as unknown as { YocoSDK?: new (opts: { publicKey: string }) => { showPopup: (opts: Record<string, unknown>) => void } }).YocoSDK;
      if (!YocoSDK) {
        setError('Payment system is still loading. Please wait a moment and try again.');
        return;
      }

      const yoco = new YocoSDK({ publicKey: YOCO_PUBLIC_KEY });

      setIsYocoOpen(true);
      yoco.showPopup({
        amountInCents: 99900,
        currency: 'ZAR',
        name: 'P-Squared DBE Registration',
        description: `DBE Package — ${formData.childFullName} — ${formData.gradeApplying}`,
        callback: async (result: { id?: string; error?: { message?: string } }) => {
          setIsYocoOpen(false);
          if (result.error) {
            setError('Payment was not completed. Your application details have been saved. Try again or WhatsApp us on +27 81 890 5861.');
            return;
          }
          setSaving(true);
          try {
            await finalisePackage(refNum, result.id || '');
            setPaymentComplete(true);
          } catch {
            setError("Payment received but document generation failed. WhatsApp us immediately on +27 81 890 5861 with your reference: " + refNum);
          } finally {
            setSaving(false);
            setLoadingMessage('');
          }
        },
      });
    } catch {
      setError("Something went wrong. Please WhatsApp us on +27 81 890 5861 and we will sort it out immediately. Your application details have been saved.");
      setSaving(false);
      setLoadingMessage('');
      setIsYocoOpen(false);
    }
  };

  const handleRedownload = () => {
    if (zipBlob) downloadBlob(zipBlob, zipFilename);
  };

  const whatsappMessage =
    `Hi P-Squared. My reference number is ${referenceNumber}. ` +
    `Child: ${formData.childFullName}, ${formData.gradeApplying}, ${formData.applicationYear}. ` +
    `Province: ${formData.province}. ` +
    `I just completed my DBE registration and my package has downloaded. ` +
    `Please confirm receipt.`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=27818905861&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Review your application</h3>
        <p className="text-sm text-gray-500 mt-1">Check everything before you pay. Your package will be generated immediately after payment.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-4 text-sm">
        <SummaryRow label="LEARNER" value={`${formData.childFullName} | Grade ${formData.gradeApplying} | ${formData.applicationYear}`} onEdit={() => goToStep(2)} />
        <SummaryRow label="PROVINCE" value={formData.province} onEdit={() => goToStep(0)} />
        <SummaryRow label="PARENT" value={`${formData.parentTitle} ${formData.parentFullName}\n${formData.parentEmail} | ${formData.parentPhone}`} onEdit={() => goToStep(1)} />
        <SummaryRow label="CURRICULUM" value={formData.chosenCurriculum} onEdit={() => goToStep(4)} />
        <SummaryRow label="CIRCUMSTANCES" value={formData.circumstanceTriggers.join(' · ') || '—'} onEdit={() => goToStep(3)} />
        <SummaryRow label="SUPPORTING DOCUMENTS" value={formData.supportingDocs.length > 0 && !formData.supportingDocs.includes('None yet') ? formData.supportingDocs.join(', ') : 'None listed yet'} onEdit={() => goToStep(5)} />
      </div>

      {/* Document Checklist */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">What's in your package</h4>
        <p className="text-sm text-gray-500 mb-4">35% of rejections are caused by missing or incorrect documents. Here is exactly what P-Squared prepares for you and what you must attach yourself.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="font-bold text-[13px] text-emerald-700">P-Squared generates these ✅</p>
            <CheckItem text="DBE Application Form (pre-filled)" />
            <CheckItem text="Motivation Letter" />
            <CheckItem text="Educational Programme (196-day plan)" />
            <CheckItem text="Weekly Subject Timetable" />
            <CheckItem text="Assessment Commitment Letter" />
            <CheckItem text="Submission Instructions (PDF)" />
            <CheckItem text="Email Cover Letter" />
            {formData.province === 'KwaZulu-Natal' && <CheckItem text="Liaison School Request Letter" />}
            {formData.usesTutor === 'Yes' && <CheckItem text="Tutor Authorisation Declaration" />}
          </div>

          <div className="space-y-2">
            <p className="font-bold text-[13px] text-gray-700">You must attach these 📎</p>
            <DocItem text="Certified copy of your ID (less than 3 months old)" />
            <DocItem text="Certified copy of child's birth certificate (less than 3 months old)" />
            {hasPrevSchool && (
              <>
                <DocItem text="Certified copy of last school report (signed by principal)" />
                <DocItem text="Certified copy of transfer certificate" />
              </>
            )}
            {hasDisabilities && <DocItem text="Medical practitioner's letter or assessment report" />}
            {formData.province === 'Gauteng' && <DocItem text="Proof of residence (utility bill or lease)" />}
            {hasCustody && <DocItem text="Court order" />}
            {formData.province === 'KwaZulu-Natal' && (
              <DocItem text="Liaison School agreement — signed by a school principal (template letter included in your package)" />
            )}
          </div>
        </div>

        <div
          className="mt-4 rounded-lg p-3 text-[12px]"
          style={{ background: '#fef9ee', border: '0.5px solid #f59e0b', color: '#92400e' }}
        >
          All certified copies must not be older than 3 months. Certification must be done at a police station or commissioner of oaths.
        </div>
      </div>

      {/* Submission Email */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-bold text-gray-900 mb-2">Where you will submit</h4>
        <p className="text-sm text-gray-600">Province: <span className="font-medium">{formData.province}</span></p>
        <p className="text-sm text-gray-600 mt-1">Submit to: <span className="font-medium text-emerald-700 break-all">{email}</span></p>
        {isGmail && (
          <div className="bg-[#fefce8] border border-amber-300 rounded-lg p-2 text-xs text-amber-800 mt-2">
            This is a Gmail address. It is the confirmed official contact. Keep your sent email as proof of submission.
          </div>
        )}
        {isHOD && (
          <div className="bg-[#fefce8] border border-amber-300 rounded-lg p-2 text-xs text-amber-800 mt-2">
            Address your email to: The Head of Department, {formData.province} Department of Education.
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">Processing times: Gauteng and Western Cape typically 14–30 days. Other provinces may take longer. Under the BELA Act, no response within 60 days = application legally deemed approved. Keep your proof of submission.</p>
      </div>

      {/* Preview Documents (no payment, local download only) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white">
        <h4 className="font-bold text-gray-900 mb-1">Preview your documents</h4>
        <p className="text-sm text-gray-500 mb-4">
          Download and review before paying. No payment needed for previews. Use these to confirm
          the DBE form is filled in correctly before completing your purchase.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePreviewApplicationForm}
            disabled={previewingForm}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {previewingForm ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {previewingForm ? 'Generating...' : 'Preview sample form (watermarked)'}
          </button>
          <button
            type="button"
            onClick={handlePreviewMotivationLetter}
            disabled={previewingLetter}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {previewingLetter ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {previewingLetter ? 'Generating… please be patient, this takes a moment' : 'Preview sample letter (watermarked)'}
          </button>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-motivation-letter`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                      },
                      body: JSON.stringify({ testMode: true }),
                    },
                  );
                  const data = await res.json();
                  alert(JSON.stringify(data, null, 2));
                } catch (e) {
                  alert('Test failed: ' + (e instanceof Error ? e.message : String(e)));
                }
              }}
              className="text-xs bg-yellow-800 text-yellow-200 px-3 py-2 rounded-lg"
            >
              Test API Connection
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Previews are watermarked samples only. Your complete submission-ready documents are
          released after payment.
        </p>
        {previewingLetter && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-3">
            Please be patient — the motivation letter is being written for your family and usually takes 20–40 seconds to generate.
          </p>
        )}
        {previewError && (
          <p className="text-red-600 text-xs mt-3">{previewError}</p>
        )}
      </div>

      {/* Payment Card */}
      <div className="border-2 border-emerald-500 rounded-xl p-6 shadow-md">
        <h4 className="text-xl font-bold text-gray-900">DBE Registration Package</h4>
        <p className="text-[28px] font-bold text-emerald-600 mt-1 leading-tight">R999</p>
        <p className="text-sm text-gray-500 mb-3">Once-off. No subscription. No hidden fees.</p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3 mb-4 flex items-start gap-2">
          <Gift className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800">
            Includes 7 days of My Learning Coach free — your calm daily guide through
            your first week of homeschooling. Delivered every morning at 7am via WhatsApp.
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {[
            'Pre-filled official DBE application form',
            'Province-specific motivation letter',
            '196-day educational programme',
            'Weekly subject timetable',
            'Assessment commitment letter',
            "Province submission instructions + email address",
            'FREE: 7-Day Homeschooling Implementation Toolkit',
            'Approval tracking — we follow up with the department for you',
            '30 days of WhatsApp aftercare',
          ].map(t => (
            <div key={t} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{t}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 mb-4">Payment via Yoco — card or QR code.</p>

        {import.meta.env.DEV && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-amber-800 text-xs mb-3">
            ⚠️ TEST MODE — Use card number 4111 1111 1111 1111, any future expiry, any CVV. No real charges will be made.
          </div>
        )}

        {(() => {
          const isDisabled = saving || isYocoOpen || paymentComplete || !yocoReady;
          let label: ReactNode;
          if (paymentComplete) {
            label = 'Payment received ✓';
          } else if (saving) {
            label = (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {loadingMessage || 'Working...'}
              </>
            );
          } else if (isYocoOpen) {
            label = 'Complete your payment in the popup...';
          } else {
            label = 'Complete Payment — R999';
          }
          const bg = paymentComplete
            ? 'bg-green-600 hover:bg-green-600'
            : 'bg-emerald-500 hover:bg-emerald-600';
          return (
            <button
              onClick={handlePay}
              disabled={isDisabled}
              className={`w-full ${bg} text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2`}
            >
              {label}
            </button>
          );
        })()}

        {/* Yoco SDK preflight status */}
        {!yocoReady && !yocoFailed && (
          <div className="flex items-center gap-2 text-gray-500 text-xs mt-2 justify-center">
            <Loader2 className="animate-spin h-3 w-3" />
            Loading payment system...
          </div>
        )}
        {yocoFailed && (
          <div className="bg-red-50 border border-red-400 rounded-lg p-3 text-red-700 text-sm mt-2">
            ⚠️ Payment system could not load. Please check your internet connection and refresh the page. If the problem continues, WhatsApp us: +27 81 890 5861
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <p className="text-xs text-gray-500 mt-3">By completing payment you confirm that you will submit the documents yourself directly to the Department of Education. P-Squared prepares your documents but does not submit on your behalf. This is a legal requirement under the Policy on Home Education (2018).</p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
        <button
          onClick={onBack}
          disabled={saving || isYocoOpen || paymentComplete}
          className="w-full sm:w-auto border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="w-full sm:max-w-[480px] p-6 sm:p-8 rounded-t-2xl sm:rounded-xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-emerald-600">You're on your way. ✅</h3>

          {referenceNumber && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-700 font-medium">Your Reference Number</p>
              <p className="text-emerald-600 font-bold mt-1 text-2xl tracking-wider">{referenceNumber}</p>
              <p className="text-xs text-gray-600 mt-2">Save this. Use it when you WhatsApp us for status updates.</p>
              {refMismatchDetected && (
                <p className="text-amber-500 text-xs mt-2 text-center">
                  Note: If your filename looks different to the reference above, WhatsApp us with both — we will confirm your correct reference.
                </p>
              )}
            </div>
          )}

          <div className="bg-emerald-500 rounded-lg p-4 text-white mt-4">
            <p className="font-semibold text-base">Your Learning Coach starts tomorrow. 🎉</p>
            <p className="text-sm opacity-90 mt-1">
              Your 7-day free access to My Learning Coach begins tomorrow morning at 7am.
              Watch for your first WhatsApp message. Day 1: Creating your learning space.
            </p>
          </div>

          <div className="text-sm text-gray-700 space-y-3 mt-4">
            {zipBlob && (
              <>
                <p>Your document package has been downloaded to your device. Check your Downloads folder for your P-Squared DBE Package ZIP file.</p>
                {zipFilename && (
                  <p className="text-xs text-gray-400 break-all">
                    Your ZIP file is named: {zipFilename}
                  </p>
                )}
              </>
            )}

            <p className="font-medium">Here is what happens next:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>WhatsApp us your reference number — we confirm receipt within 2 hours</li>
              <li>We review and enhance your motivation letter within 24 hours</li>
              <li>We send you the final package via WhatsApp</li>
              <li>We track your application with the department and update you on progress</li>
              <li>You submit from your own email — we show you exactly how</li>
            </ol>
          </div>

          <div className="space-y-3 mt-6">
            {zipBlob && (
              <button
                onClick={handleRedownload}
                className="flex items-center justify-center gap-2 w-full border border-emerald-500 text-emerald-700 font-semibold py-3 rounded-lg hover:bg-emerald-50 transition"
              >
                <Download className="h-4 w-4" /> Download Package Again
              </button>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition"
            >
              WhatsApp Us Now <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="/"
              className="block text-center w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Return to Home
            </a>
            {referenceNumber && (
              <a
                href={`/my-application/${referenceNumber}`}
                className="block w-full text-center text-emerald-600 text-xs mt-1 underline hover:text-emerald-700"
              >
                Track your application status →
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex justify-between items-start border-b border-gray-200 pb-2 last:border-0">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-gray-800 whitespace-pre-line">{value}</p>
      </div>
      <button onClick={onEdit} className="text-emerald-600 text-xs font-medium hover:underline flex-shrink-0 ml-4">Edit</button>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function DocItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">📎</span>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
