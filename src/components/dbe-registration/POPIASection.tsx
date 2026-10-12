import { ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface POPIASectionProps {
  consent1: boolean;
  consent2: boolean;
  onChange: (updates: { popiaConsent1?: boolean; popiaConsent2?: boolean }) => void;
  showError?: boolean;
}

export default function POPIASection({ consent1, consent2, onChange, showError }: POPIASectionProps) {
  return (
    <section
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e8e5de',
        padding: '32px 16px',
      }}
      className="sm:px-10"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-8 items-start">
        <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-2">
          <ShieldCheck className="h-12 w-12 text-emerald-500" strokeWidth={1.6} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>POPIA Compliant</p>
            <p style={{ fontSize: 12, color: '#666' }}>Your data is protected</p>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0d1b2a', margin: 0 }}>
            How P-Squared uses your information
          </h2>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginTop: 10 }}>
            <p>
              P-Squared collects personal information from you and your child solely to prepare your DBE
              home education registration documents. We do not sell, share, or disclose your information
              to any third party. You have the right to access, correct, or request deletion of your data
              at any time by contacting tsholo@mypsquared.com.
            </p>
            <p style={{ marginTop: 10 }}>
              Processing is conducted in accordance with the Protection of Personal Information Act
              (POPIA) 4 of 2013.
            </p>
            <p style={{ marginTop: 10 }}>
              Data controller: Tsholo Monyausi, P-Squared / kasiAIhub<br />
              Contact: tsholo@mypsquared.com
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={consent1}
                onCheckedChange={(v) => onChange({ popiaConsent1: !!v })}
                className="mt-0.5 accent-emerald-500"
                required
              />
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                I understand and consent to P-Squared processing my personal information to prepare my
                DBE registration documents, in accordance with POPIA 4 of 2013.
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={consent2}
                onCheckedChange={(v) => onChange({ popiaConsent2: !!v })}
                className="mt-0.5 accent-emerald-500"
                required
              />
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                I confirm that I am the parent or legal guardian of the child named in this
                application and that all information I provide is accurate.
              </span>
            </label>
          </div>

          {showError && (
            <p className="text-red-600 text-sm font-medium mt-3">
              Please confirm both statements to continue.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
