import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { provinces } from '@/types/dbeRegistration';

interface ProvinceSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const provinceAlerts: Record<string, { style: string; text: string }> = {
  Gauteng: {
    style: 'bg-[#fefce8] border-amber-300 text-amber-800',
    text: '⚠️ Gauteng requires certified documents less than 3 months old and a principal-signed last school report. We\'ll guide you through exactly what to prepare.',
  },
  'Western Cape': {
    style: 'bg-[#eff6ff] border-blue-300 text-blue-800',
    text: '📅 Western Cape has a September deadline for next-year applications. If applying mid-year, include a late application motivation. We write this.',
  },
  'KwaZulu-Natal': {
    style: 'bg-[#fff7ed] border-orange-300 text-orange-800',
    text: '🏫 KwaZulu-Natal requires a Liaison School agreement — a letter from a local school principal agreeing to monitor your child\'s progress. This document is included in your package.',
  },
  Limpopo: {
    style: 'bg-[#fef2f2] border-red-300 text-red-800',
    text: '⚠️ Note: This province uses a non-government email address as their official DBE contact. This is correct and confirmed. We will include proof-of-submission guidance in your package.',
  },
  Mpumalanga: {
    style: 'bg-[#fef2f2] border-red-300 text-red-800',
    text: '⚠️ Note: This province uses a non-government email address as their official DBE contact. This is correct and confirmed. We will include proof-of-submission guidance in your package.',
  },
  'North West': {
    style: 'bg-[#fff7ed] border-orange-300 text-orange-800',
    text: '⚠️ North West has no dedicated home education officer. Your application goes to the Head of Department directly. We prepare your cover letter accordingly.',
  },
  'Northern Cape': {
    style: 'bg-[#fff7ed] border-orange-300 text-orange-800',
    text: '⚠️ Northern Cape has no dedicated home education officer. We prepare your submission with the correct addressing for the Head of Department.',
  },
  'Eastern Cape': {
    style: 'bg-[#fefce8] border-amber-300 text-amber-800',
    text: '📍 Eastern Cape has a single home education contact for the entire province. Response times can be slow. We include a follow-up email template in your package.',
  },
  'Free State': {
    style: '',
    text: '',
  },
};

export default function ProvinceSelector({ value, onChange }: ProvinceSelectorProps) {
  const alert = value ? provinceAlerts[value] : null;

  return (
    <>
      <div className="w-full sm:max-w-xl sm:mx-auto mt-12 mb-4 px-4">
        <div className="w-full px-4 sm:px-8 py-6 sm:py-8 rounded-xl bg-white shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Where are you based?</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your province determines your requirements, your submission email, and your document checklist. We handle all of it.
          </p>

          <Label htmlFor="province-select" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Select your province
          </Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full py-6 text-base" id="province-select">
              <SelectValue placeholder="Choose your province..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {provinces.map((p) => (
                <SelectItem key={p} value={p} className="py-3">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {alert && alert.text && (
        <div className="w-full sm:max-w-xl sm:mx-auto mt-3 mb-16 md:mb-24 px-4">
          <div className={`border rounded-lg px-4 py-3 text-sm leading-relaxed animate-in fade-in duration-300 ${alert.style}`}>
            {alert.text}
          </div>
        </div>
      )}

      {(!alert || !alert.text) && <div className="mb-16 md:mb-24" />}
    </>
  );
}

