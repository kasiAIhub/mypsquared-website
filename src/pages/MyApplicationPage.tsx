import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Loader2, Download, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { openWhatsApp, getWhatsAppUrl } from '@/lib/whatsapp';

type Stage = {
  key: 'package_ready' | 'submitted_to_dbe' | 'acknowledged' | 'approved';
  label: string;
  description: string;
};

const statusStages: Stage[] = [
  {
    key: 'package_ready',
    label: 'Package Ready',
    description:
      'Your document package has been prepared and sent to your email.',
  },
  {
    key: 'submitted_to_dbe',
    label: 'Submitted to DBE',
    description:
      'You have submitted your application to the Department of Education.',
  },
  {
    key: 'acknowledged',
    label: 'Acknowledged by DBE',
    description: 'The department has confirmed receipt of your application.',
  },
  {
    key: 'approved',
    label: 'Approved ✓',
    description: 'Your home education registration has been approved.',
  },
];

type Record = {
  child_full_name: string;
  grade: string;
  province: string;
  payment_status: string | null;
  dbe_submission_status: string | null;
  dbe_submitted_by_parent_at: string | null;
  dbe_approval_received_at: string | null;
  dbe_package_pdf_url: string | null;
  created_at: string;
  internal_notes: string | null;
};

function resolveStage(record: Record): Stage['key'] {
  if (record.dbe_approval_received_at) return 'approved';
  if (record.dbe_submission_status === 'acknowledged') return 'acknowledged';
  if (record.dbe_submitted_by_parent_at) return 'submitted_to_dbe';
  if (record.payment_status === 'paid') return 'package_ready';
  return 'package_ready';
}

export default function MyApplicationPage() {
  const { ref } = useParams();
  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ref) return;
    setLoading(true);
    supabase
      .from('dbe_registrations')
      .select(
        'child_full_name, grade, province, payment_status, dbe_submission_status, dbe_submitted_by_parent_at, dbe_approval_received_at, dbe_package_pdf_url, created_at, internal_notes'
      )
      .filter('internal_notes->>referenceNumber', 'eq', ref.toUpperCase())
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setRecord(data as Record);
        }
        setLoading(false);
      });
  }, [ref]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (notFound || !record) {
    const helpMsg =
      `Hi P-Squared. I can't find my application with reference ${ref}. ` +
      `Please help.`;
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900/60 border border-gray-800 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Application not found</h1>
          <p className="text-sm text-gray-400 mt-3">Reference: <span className="font-mono text-emerald-400">{ref}</span></p>
          <p className="text-sm text-gray-300 mt-4">
            Check your reference number or WhatsApp us:
          </p>
          <button
            onClick={() => openWhatsApp(helpMsg)}
            className="inline-flex items-center justify-center gap-2 mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp P-Squared
          </button>
        </div>
      </div>
    );
  }

  const currentStage = resolveStage(record);
  const currentIndex = statusStages.findIndex((s) => s.key === currentStage);

  const whatsappMsg =
    `Hi P-Squared. My reference is ${ref}. ` +
    `Child: ${record.child_full_name}, ${record.grade}, ${record.province}. ` +
    `I have a question about my application.`;
  const whatsappHref = getWhatsAppUrl(whatsappMsg);

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Application Status</p>
          <h1 className="text-3xl font-bold text-white mt-2">{record.child_full_name}</h1>
          <p className="text-sm text-gray-400 mt-1">{record.grade} · {record.province}</p>
          <div className="inline-block mt-4 bg-gray-900/60 border border-gray-800 rounded-full px-4 py-1.5">
            <span className="text-xs text-gray-400">REF: </span>
            <span className="text-xs font-mono text-emerald-400 tracking-wider">{ref}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Your application journey</h2>

          <div>
            {statusStages.map((stage, index) => {
              const isComplete = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const isLast = index === statusStages.length - 1;

              return (
                <div key={stage.key} className="flex gap-4">
                  {/* Circle + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isComplete ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      {isComplete ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs text-gray-300">{index + 1}</span>
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 my-1 ${
                          index < currentIndex ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className={`pb-6 ${isLast ? 'pb-0' : ''} flex-1`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          isComplete ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                          ← current
                        </span>
                      )}
                    </div>
                    {isCurrent && (
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* BELA Act notice */}
          <div className="mt-2 bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-4">
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Under the BELA Act, if the department does not respond within 60 days of submission, your application is legally deemed approved. Keep your proof of submission email.
            </p>
          </div>

          {/* Re-download */}
          {record.dbe_package_pdf_url && (
            <a
              href={record.dbe_package_pdf_url}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm text-center py-3 rounded-xl mt-4 font-medium transition"
            >
              <Download className="h-4 w-4" />
              Download my package again
            </a>
          )}

          {/* WhatsApp */}
          <a
            href={whatsappHref}
            onClick={(e) => {
              e.preventDefault();
              openWhatsApp(whatsappMsg);
            }}
            className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm text-center py-3 rounded-xl mt-3 transition"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp P-Squared about this application
          </a>

          <p className="text-center text-[10px] text-gray-600 mt-6">mypsquared.com</p>
        </div>
      </div>
    </div>
  );
}
