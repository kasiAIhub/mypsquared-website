import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DBEFormData, supportingDocOptions } from '@/types/dbeRegistration';
import { step5Schema, zodIssuesToFieldErrors } from '@/schemas/dbeFormSchema';

interface Step5Props {
  formData: DBEFormData;
  onChange: (updates: Partial<DBEFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const performanceOptions = [
  { value: 'strong', label: 'Strong — performing above grade level' },
  { value: 'average', label: 'Average — performing at grade level' },
  { value: 'struggling', label: 'Struggling — performing below grade level' },
  { value: 'unassessed', label: 'Unassessed / never been in school' },
];

export default function Step5Motivation({ formData, onChange, onNext, onBack }: Step5Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    childLearnerProfile: useRef<HTMLDivElement>(null),
    academicPerformance: useRef<HTMLDivElement>(null),
  };
  const showAverage = formData.academicPerformance === 'strong' || formData.academicPerformance === 'average';

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev }; delete next[key]; return next;
    });
  };

  const toggleDoc = (opt: string, checked: boolean) => {
    let next = checked ? [...formData.supportingDocs, opt] : formData.supportingDocs.filter(d => d !== opt);
    if (opt === 'None yet' && checked) next = ['None yet'];
    else if (checked && opt !== 'None yet') next = next.filter(d => d !== 'None yet');
    onChange({ supportingDocs: next });
  };

  const handleProfileChange = (val: string) => {
    if (val.length <= 500) onChange({ childLearnerProfile: val });
    const trimmed = val.trim();
    if (trimmed.length >= 50) {
      clearError('childLearnerProfile');
    } else if (trimmed.length > 0 && fieldErrors.childLearnerProfile) {
      setFieldErrors((prev) => ({ ...prev, childLearnerProfile: `Please tell us a little more (minimum 50 characters) — ${50 - trimmed.length} characters remaining` }));
    }
  };

  const profileLen = formData.childLearnerProfile.trim().length;
  const profileRemaining = 50 - profileLen;
  const showProfileHint = profileLen > 0 && profileLen < 50;

  const handleNext = () => {
    const result = step5Schema.safeParse({
      childLearnerProfile: formData.childLearnerProfile.trim(),
      academicPerformance: formData.academicPerformance,
    });
    if (!result.success) {
      const zodErrors = zodIssuesToFieldErrors(result.error);
      const trimmed = formData.childLearnerProfile.trim();
      if (zodErrors.childLearnerProfile && trimmed.length < 50 && trimmed.length > 0) {
        zodErrors.childLearnerProfile =
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
        <h3 className="text-xl font-bold text-gray-900">Help us write your motivation letter</h3>
        <p className="text-sm text-gray-500 mt-1">The motivation letter is the heart of your application. It is the document most likely to get you approved or rejected. We write it for you — in legal language, specific to your province and circumstances. We just need your story.</p>
      </div>

      {errorCount > 0 && (
        <div className="text-red-500 text-sm font-medium mb-4">
          Please complete {errorCount} required field{errorCount > 1 ? 's' : ''} before continuing
        </div>
      )}

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
        Your answers from Steps 1–3 are already feeding into your letter. These final questions make it specific, credible, and compelling.
      </div>

      <div className="space-y-1.5" ref={refs.childLearnerProfile}>
        <Label className="text-sm font-medium text-gray-700">What is your child like as a learner? * <span className="text-xs text-gray-400 font-normal">(min 50 characters)</span></Label>
        <Textarea
          className={cn(fieldErrors.childLearnerProfile && 'border-red-500 focus-visible:ring-red-500')}
          placeholder="e.g. He picks things up quickly but loses interest if he has to repeat the same thing for too long. He's brilliant with science and loves asking why things work the way they do..."
          value={formData.childLearnerProfile}
          onChange={e => handleProfileChange(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-gray-400 text-right">{formData.childLearnerProfile.length}/500</p>
        {showProfileHint && !fieldErrors.childLearnerProfile && (
          <p className="text-amber-500 text-xs mt-1">{profileRemaining} more character{profileRemaining !== 1 ? 's' : ''} to meet the minimum</p>
        )}
        {fieldErrors.childLearnerProfile && <p className="text-red-400 text-xs mt-1">{fieldErrors.childLearnerProfile}</p>}
      </div>

      <div className="space-y-1.5" ref={refs.academicPerformance}>
        <Label className="text-sm font-medium text-gray-700">What has your child's academic performance been like? *</Label>
        <RadioGroup value={formData.academicPerformance} onValueChange={v => { onChange({ academicPerformance: v }); if (v) clearError('academicPerformance'); }} className="space-y-2 mt-1">
          {performanceOptions.map(o => (
            <div key={o.value} className="flex items-center space-x-2">
              <RadioGroupItem value={o.value} id={`perf-${o.value}`} />
              <Label htmlFor={`perf-${o.value}`} className="cursor-pointer text-sm">{o.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {fieldErrors.academicPerformance && <p className="text-red-400 text-xs mt-1">{fieldErrors.academicPerformance}</p>}
        {showAverage && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">If you have a recent report, include the overall average if you know it.</p>
            <Input type="number" placeholder="e.g. 72" value={formData.reportAverage} onChange={e => onChange({ reportAverage: e.target.value })} className="w-32" />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">Has anything specific happened at school that contributed to this decision?</Label>
        <Textarea
          placeholder="e.g. She was being bullied for two terms. We reported it three times. Nothing changed. She stopped eating lunch and started refusing to go on Mondays..."
          value={formData.schoolIncident}
          onChange={e => { if (e.target.value.length <= 500) onChange({ schoolIncident: e.target.value }); }}
          rows={4}
        />
        <p className="text-xs text-gray-400 text-right">{formData.schoolIncident.length}/500</p>
        <p className="text-sm text-gray-500">You do not have to include this. But specific incidents make stronger motivation letters.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">What are your qualifications and relevant experience?</Label>
        <Textarea
          placeholder="e.g. I have a Diploma in Early Childhood Development. I also worked as a teaching assistant for 3 years before my children were born..."
          value={formData.parentBackground}
          onChange={e => { if (e.target.value.length <= 400) onChange({ parentBackground: e.target.value }); }}
          rows={3}
        />
        <p className="text-xs text-gray-400 text-right">{formData.parentBackground.length}/400</p>
        <p className="text-sm text-gray-500">You do not need formal teaching qualifications. Any relevant experience counts — community work, tutoring, facilitation, care work.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Do you have any supporting documents you plan to attach?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {supportingDocOptions.map(opt => (
            <div key={opt} className="flex items-start space-x-2">
              <Checkbox id={`doc-${opt}`} checked={formData.supportingDocs.includes(opt)} onCheckedChange={c => toggleDoc(opt, !!c)} />
              <Label htmlFor={`doc-${opt}`} className="text-sm cursor-pointer leading-tight">{opt}</Label>
            </div>
          ))}
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 mt-2">
          Supporting documents are not always required, but they significantly strengthen applications — especially for Gauteng where the HOD expects 'empirical evidence'.
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
        <button onClick={onBack} className="w-full sm:w-auto border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition">← Back</button>
        <button onClick={handleNext} className="w-full sm:w-auto bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition">Next →</button>
      </div>
    </div>
  );
}
