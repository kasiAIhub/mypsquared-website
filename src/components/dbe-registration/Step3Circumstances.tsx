import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DBEFormData, circumstanceOptions } from '@/types/dbeRegistration';
import { step3Schema, zodIssuesToFieldErrors } from '@/schemas/dbeFormSchema';

interface Step3Props {
  formData: DBEFormData;
  onChange: (updates: Partial<DBEFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Circumstances({ formData, onChange, onNext, onBack }: Step3Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    circumstanceTriggers: useRef<HTMLDivElement>(null),
    circumstanceNarrative: useRef<HTMLDivElement>(null),
  };
  const showOther = formData.circumstanceTriggers.includes('Other');

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev }; delete next[key]; return next;
    });
  };

  const toggleTrigger = (opt: string, checked: boolean) => {
    const next = checked
      ? [...formData.circumstanceTriggers, opt]
      : formData.circumstanceTriggers.filter((t) => t !== opt);
    onChange({ circumstanceTriggers: next });
    if (next.length > 0) clearError('circumstanceTriggers');
  };

  const handleNarrativeChange = (val: string) => {
    if (val.length <= 600) onChange({ circumstanceNarrative: val });
    const trimmed = val.trim();
    if (trimmed.length >= 50) {
      clearError('circumstanceNarrative');
    } else if (trimmed.length > 0 && fieldErrors.circumstanceNarrative) {
      setFieldErrors((prev) => ({ ...prev, circumstanceNarrative: `Please tell us a little more (minimum 50 characters) — ${50 - trimmed.length} characters remaining` }));
    }
  };

  const narrativeLen = formData.circumstanceNarrative.trim().length;
  const narrativeRemaining = 50 - narrativeLen;
  const showNarrativeHint = narrativeLen > 0 && narrativeLen < 50;

  const handleNext = () => {
    const result = step3Schema.safeParse({
      circumstanceTriggers: formData.circumstanceTriggers,
      circumstanceNarrative: formData.circumstanceNarrative.trim(),
    });
    if (!result.success) {
      const zodErrors = zodIssuesToFieldErrors(result.error);
      // Append remaining-character hint for narrative
      const trimmed = formData.circumstanceNarrative.trim();
      if (zodErrors.circumstanceNarrative && trimmed.length < 50 && trimmed.length > 0) {
        zodErrors.circumstanceNarrative =
          `Please tell us a little more (minimum 50 characters) — ${50 - trimmed.length} characters remaining`;
      }
      setFieldErrors(zodErrors);
      const firstKey = Object.keys(zodErrors)[0];
      refs[firstKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFieldErrors({});
    onNext();
  };

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Why are you choosing home education?</h3>
        <p className="text-sm text-gray-500 mt-1">
          This shapes your motivation letter — the most important document in your application. Answer honestly. We'll frame it correctly.
        </p>
      </div>

      {errorCount > 0 && (
        <div className="text-red-500 text-sm font-medium mb-4">
          Please complete {errorCount} required field{errorCount > 1 ? 's' : ''} before continuing
        </div>
      )}

      <div className="space-y-2" ref={refs.circumstanceTriggers}>
        <Label className="text-sm font-medium text-gray-700">What led you to home education? *</Label>
        <p className="text-xs text-gray-400">Select at least one</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {circumstanceOptions.map((opt) => (
            <div key={opt} className="flex items-start space-x-2">
              <Checkbox
                id={`circ-${opt}`}
                checked={formData.circumstanceTriggers.includes(opt)}
                onCheckedChange={(checked) => toggleTrigger(opt, !!checked)}
              />
              <Label htmlFor={`circ-${opt}`} className="text-sm cursor-pointer leading-tight">{opt}</Label>
            </div>
          ))}
        </div>
        {showOther && (
          <Input placeholder="Please specify" value={formData.circumstanceOther} onChange={(e) => onChange({ circumstanceOther: e.target.value })} className="mt-2" />
        )}
        {fieldErrors.circumstanceTriggers && <p className="text-red-400 text-xs mt-1">{fieldErrors.circumstanceTriggers}</p>}
      </div>

      <div className="space-y-1.5" ref={refs.circumstanceNarrative}>
        <Label className="text-sm font-medium text-gray-700">In your own words — what happened? * <span className="text-xs text-gray-400 font-normal">(min 50 characters)</span></Label>
        <Textarea
          className={cn(fieldErrors.circumstanceNarrative && 'border-red-500 focus-visible:ring-red-500')}
          placeholder="e.g. My son was being bullied and started refusing school. After three meetings with the principal with no resolution, I decided..."
          value={formData.circumstanceNarrative}
          onChange={(e) => handleNarrativeChange(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-gray-400 text-right">{formData.circumstanceNarrative.length}/600</p>
        {showNarrativeHint && !fieldErrors.circumstanceNarrative && (
          <p className="text-amber-500 text-xs mt-1">{narrativeRemaining} more character{narrativeRemaining !== 1 ? 's' : ''} to meet the minimum</p>
        )}
        {fieldErrors.circumstanceNarrative && <p className="text-red-400 text-xs mt-1">{fieldErrors.circumstanceNarrative}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">What does your child need that school wasn't providing?</Label>
        <Textarea
          value={formData.childNeeds}
          onChange={(e) => { if (e.target.value.length <= 400) onChange({ childNeeds: e.target.value }); }}
          rows={3}
        />
        <p className="text-xs text-gray-400 text-right">{formData.childNeeds.length}/400</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">What is your vision for your child's education over the next 12 months?</Label>
        <Textarea
          placeholder="e.g. I want her to regain confidence, catch up on reading, and learn at a pace that suits her..."
          value={formData.educationVision}
          onChange={(e) => { if (e.target.value.length <= 400) onChange({ educationVision: e.target.value }); }}
          rows={3}
        />
        <p className="text-xs text-gray-400 text-right">{formData.educationVision.length}/400</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
        Your answers stay private. They are only used to prepare your motivation letter in legally appropriate language.
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
        <button onClick={onBack} className="w-full sm:w-auto border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition">← Back</button>
        <button onClick={handleNext} className="w-full sm:w-auto bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition">Next →</button>
      </div>
    </div>
  );
}
