import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DBEFormData, curriculumOptions, subjectOptions, extramuralOptions } from '@/types/dbeRegistration';
import { step4Schema, zodIssuesToFieldErrors } from '@/schemas/dbeFormSchema';

interface Step4Props {
  formData: DBEFormData;
  onChange: (updates: Partial<DBEFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const learningSpaceOptions = [
  'A dedicated room or study',
  'A shared space (dining table, lounge)',
  'Multiple spaces in the home',
  'My home and other community spaces',
];

const resourceOptions = [
  'Books and workbooks', 'Internet access', 'A computer or tablet',
  'Library (local or school)', 'Educational apps or online platforms',
  'Physical learning materials (art supplies, science equipment, etc.)',
  'None of the above yet',
];

const hoursOptions = [
  { value: '1-2', label: '1–2 hours' },
  { value: '3-4', label: '3–4 hours (recommended minimum)' },
  { value: '4-6', label: '4–6 hours' },
  { value: 'flexible', label: 'Flexible / varies by day' },
];

const daysOptions = ['3 days', '4 days', '5 days', 'Flexible'];

const assessorOptions = [
  { value: 'have-someone', label: 'Yes — I have someone in mind' },
  { value: 'will-find', label: 'Yes — I will find someone' },
  { value: 'not-applicable', label: 'Not applicable yet (early grades)' },
];

export default function Step4LearningPlan({ formData, onChange, onNext, onBack }: Step4Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    learningSpace: useRef<HTMLDivElement>(null),
    chosenCurriculum: useRef<HTMLDivElement>(null),
    dailyHours: useRef<HTMLDivElement>(null),
    assessorCommitment: useRef<HTMLDivElement>(null),
  };

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev }; delete next[key]; return next;
    });
  };

  const toggleArray = (field: 'learningResources' | 'subjects' | 'extramurals', opt: string, checked: boolean) => {
    const current = formData[field] as string[];
    const next = checked ? [...current, opt] : current.filter(v => v !== opt);
    onChange({ [field]: next });
  };

  const handleNext = () => {
    const result = step4Schema.safeParse({
      learningSpace: formData.learningSpace,
      chosenCurriculum: formData.chosenCurriculum,
      dailyHours: formData.dailyHours,
      assessorCommitment: formData.assessorCommitment,
    });
    if (!result.success) {
      const zodErrors = zodIssuesToFieldErrors(result.error);
      setFieldErrors(zodErrors);
      const firstKey = Object.keys(zodErrors)[0];
      refs[firstKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFieldErrors({});
    onNext();
  };

  const errorCount = Object.keys(fieldErrors).length;
  const errCls = (k: string) => fieldErrors[k] ? 'border-red-500 focus-visible:ring-red-500' : '';

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Your learning plan</h3>
        <p className="text-sm text-gray-500 mt-1">28% of rejections happen because the educational programme is too vague. We use your answers here to build a complete, legally acceptable plan.</p>
      </div>

      {errorCount > 0 && (
        <div className="text-red-500 text-sm font-medium mb-4">
          Please complete {errorCount} required field{errorCount > 1 ? 's' : ''} before continuing
        </div>
      )}

      <div className="space-y-1.5" ref={refs.learningSpace}>
        <Label className="text-sm font-medium text-gray-700">Where will learning primarily happen? *</Label>
        <RadioGroup value={formData.learningSpace} onValueChange={v => { onChange({ learningSpace: v }); if (v) clearError('learningSpace'); }} className="space-y-2 mt-1">
          {learningSpaceOptions.map(o => (
            <div key={o} className="flex items-center space-x-2">
              <RadioGroupItem value={o} id={`ls-${o}`} />
              <Label htmlFor={`ls-${o}`} className="cursor-pointer text-sm">{o}</Label>
            </div>
          ))}
        </RadioGroup>
        {fieldErrors.learningSpace && <p className="text-red-400 text-xs mt-1">{fieldErrors.learningSpace}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">What learning resources do you have access to?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {resourceOptions.map(opt => (
            <div key={opt} className="flex items-start space-x-2">
              <Checkbox id={`res-${opt}`} checked={formData.learningResources.includes(opt)} onCheckedChange={c => toggleArray('learningResources', opt, !!c)} />
              <Label htmlFor={`res-${opt}`} className="text-sm cursor-pointer leading-tight">{opt}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5" ref={refs.chosenCurriculum}>
        <Label className="text-sm font-medium text-gray-700">Which curriculum or programme will you follow? *</Label>
        <Select value={formData.chosenCurriculum} onValueChange={v => { onChange({ chosenCurriculum: v }); if (v) clearError('chosenCurriculum'); }}>
          <SelectTrigger className={cn('w-full', errCls('chosenCurriculum'))}><SelectValue placeholder="Select curriculum" /></SelectTrigger>
          <SelectContent>
            {curriculumOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
        {fieldErrors.chosenCurriculum && <p className="text-red-400 text-xs mt-1">{fieldErrors.chosenCurriculum}</p>}
        {formData.chosenCurriculum === 'Online school programme' && formData.province === 'KwaZulu-Natal' && (
          <div className="bg-[#fefce8] border border-amber-300 rounded-lg p-3 text-sm text-amber-800 mt-2">
            ⚠️ KwaZulu-Natal has historically rejected applications mentioning 'online school'. We will frame your learning programme carefully to avoid triggering this.
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Which subjects will you cover?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {subjectOptions.map(opt => (
            <div key={opt} className="flex items-start space-x-2">
              <Checkbox id={`subj-${opt}`} checked={formData.subjects.includes(opt)} onCheckedChange={c => toggleArray('subjects', opt, !!c)} />
              <Label htmlFor={`subj-${opt}`} className="text-sm cursor-pointer leading-tight">{opt}</Label>
            </div>
          ))}
        </div>
        {formData.subjects.includes('Other') && (
          <Input placeholder="Please specify" value={formData.subjectsOther} onChange={e => onChange({ subjectsOther: e.target.value })} className="mt-2" />
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">What extramural activities will your child participate in?</Label>
        <p className="text-xs text-gray-400">The DBE educational programme must include extramural and enrichment activities. Select all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {extramuralOptions.map(opt => (
            <div key={opt} className="flex items-start space-x-2">
              <Checkbox id={`ex-${opt}`} checked={formData.extramurals.includes(opt)} onCheckedChange={c => toggleArray('extramurals', opt, !!c)} />
              <Label htmlFor={`ex-${opt}`} className="text-sm cursor-pointer leading-tight">{opt}</Label>
            </div>
          ))}
        </div>
        {formData.extramurals.includes('Sport') && (
          <Input placeholder="Which sport(s)?" value={formData.extramuralsSport} onChange={e => onChange({ extramuralsSport: e.target.value })} className="mt-2" />
        )}
        {formData.extramurals.includes('Language classes') && (
          <Input placeholder="Which language(s)?" value={formData.extramuralsLanguage} onChange={e => onChange({ extramuralsLanguage: e.target.value })} className="mt-2" />
        )}
        {formData.extramurals.includes('Other') && (
          <Input placeholder="Please specify" value={formData.extramuralsOther} onChange={e => onChange({ extramuralsOther: e.target.value })} className="mt-2" />
        )}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 mt-2">
          Extramurals are part of your educational programme and must be listed in your DBE application. They demonstrate your child is receiving a holistic education — not just academic subjects.
        </div>
      </div>

      <div className="space-y-1.5" ref={refs.dailyHours}>
        <Label className="text-sm font-medium text-gray-700">How many hours per day will be dedicated to learning? *</Label>
        <RadioGroup value={formData.dailyHours} onValueChange={v => { onChange({ dailyHours: v }); if (v) clearError('dailyHours'); }} className="space-y-2 mt-1">
          {hoursOptions.map(o => (
            <div key={o.value} className="flex items-center space-x-2">
              <RadioGroupItem value={o.value} id={`hrs-${o.value}`} />
              <Label htmlFor={`hrs-${o.value}`} className="cursor-pointer text-sm">{o.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {fieldErrors.dailyHours && <p className="text-red-400 text-xs mt-1">{fieldErrors.dailyHours}</p>}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800 mt-2">
          The DBE requires a minimum of 3 hours contact time per day. If you selected 1–2 hours, we will help you frame this correctly in your learning plan.
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">How many days per week?</Label>
        <RadioGroup value={formData.weeklyDays} onValueChange={v => onChange({ weeklyDays: v })} className="flex flex-wrap gap-4 mt-1">
          {daysOptions.map(o => (
            <div key={o} className="flex items-center space-x-2">
              <RadioGroupItem value={o} id={`days-${o}`} />
              <Label htmlFor={`days-${o}`} className="cursor-pointer text-sm">{o}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">Will you use a tutor for any subjects?</Label>
        <RadioGroup value={formData.usesTutor} onValueChange={v => onChange({ usesTutor: v })} className="flex gap-6 mt-1">
          {['Yes', 'No', 'Not sure yet'].map(o => (
            <div key={o} className="flex items-center space-x-2">
              <RadioGroupItem value={o} id={`tutor-${o}`} />
              <Label htmlFor={`tutor-${o}`} className="cursor-pointer text-sm">{o}</Label>
            </div>
          ))}
        </RadioGroup>
        {formData.usesTutor === 'Yes' && (
          <div className="space-y-2 mt-3 border-l-2 border-emerald-200 pl-4">
            <Input placeholder="Tutor's name (optional)" value={formData.tutorDetails.name} onChange={e => onChange({ tutorDetails: { ...formData.tutorDetails, name: e.target.value } })} />
            <Input placeholder="Tutor's qualifications (optional)" value={formData.tutorDetails.qualifications} onChange={e => onChange({ tutorDetails: { ...formData.tutorDetails, qualifications: e.target.value } })} />
            <div className="bg-[#fefce8] border border-amber-300 rounded-lg p-3 text-sm text-amber-800">
              ⚠️ Important: A tutor may not take over full curriculum delivery. You remain the primary educator. The tutor supports you. We frame this correctly in your documents.
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5" ref={refs.assessorCommitment}>
        <Label className="text-sm font-medium text-gray-700">Will you use any assessors for end-of-phase evaluations? *</Label>
        <p className="text-xs text-gray-400">The DBE requires assessment by a competent assessor at the end of Grades 3, 6, and 9.</p>
        <RadioGroup value={formData.assessorCommitment} onValueChange={v => { onChange({ assessorCommitment: v }); if (v) clearError('assessorCommitment'); }} className="space-y-2 mt-1">
          {assessorOptions.map(o => (
            <div key={o.value} className="flex items-center space-x-2">
              <RadioGroupItem value={o.value} id={`assess-${o.value}`} />
              <Label htmlFor={`assess-${o.value}`} className="cursor-pointer text-sm">{o.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {fieldErrors.assessorCommitment && <p className="text-red-400 text-xs mt-1">{fieldErrors.assessorCommitment}</p>}
        <p className="text-sm text-gray-500 mt-2">A competent assessor is a qualified educator or educational professional. We include an assessor commitment letter in your package.</p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
        <button onClick={onBack} className="w-full sm:w-auto border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition">← Back</button>
        <button onClick={handleNext} className="w-full sm:w-auto bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition">Next →</button>
      </div>
    </div>
  );
}
