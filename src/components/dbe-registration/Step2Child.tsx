import { useRef, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  DBEFormData, populationOptions, gradeOptions, yearOptions,
  previousSchoolOptions, provinces, disabilityOptions,
} from '@/types/dbeRegistration';
import { step2Schema, zodIssuesToFieldErrors } from '@/schemas/dbeFormSchema';
import DocumentCallout from './DocumentCallout';

interface Step2Props {
  formData: DBEFormData;
  onChange: (updates: Partial<DBEFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  sessionId?: string;
}

const months = [
  ['01', 'January'], ['02', 'February'], ['03', 'March'], ['04', 'April'],
  ['05', 'May'], ['06', 'June'], ['07', 'July'], ['08', 'August'],
  ['09', 'September'], ['10', 'October'], ['11', 'November'], ['12', 'December'],
];

export default function Step2Child({ formData, onChange, onNext, onBack }: Step2Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    childFullName: useRef<HTMLDivElement>(null),
    childDOB: useRef<HTMLDivElement>(null),
    childGender: useRef<HTMLDivElement>(null),
    gradeApplying: useRef<HTMLDivElement>(null),
    previousSchool: useRef<HTMLDivElement>(null),
  };

  const showPrevSchool = formData.previousSchool === 'Yes, currently enrolled' || formData.previousSchool === 'Previously enrolled';
  const showOtherDisability = formData.disabilities.includes('Other');

  const dobParts = useMemo(() => {
    const parts = (formData.childDOB || '').split('-');
    return { year: parts[0] || '', month: parts[1] || '', day: parts[2] || '' };
  }, [formData.childDOB]);

  const [day, setDay] = useState(dobParts.day);
  const [month, setMonth] = useState(dobParts.month);
  const [year, setYear] = useState(dobParts.year);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 19 }, (_, i) => String(currentYear - i));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev }; delete next[key]; return next;
    });
  };

  const updateDOB = (d: string, m: string, y: string) => {
    setDay(d); setMonth(m); setYear(y);
    if (d && m && y) {
      onChange({ childDOB: `${y}-${m}-${d}` });
      clearError('childDOB');
    } else {
      onChange({ childDOB: '' });
    }
  };

  const handleDisabilityToggle = (opt: string, checked: boolean) => {
    let next = checked
      ? [...formData.disabilities, opt]
      : formData.disabilities.filter((d) => d !== opt);
    if (opt === 'No diagnosed conditions' && checked) next = ['No diagnosed conditions'];
    else if (checked && opt !== 'No diagnosed conditions') next = next.filter((d) => d !== 'No diagnosed conditions');
    onChange({ disabilities: next });
  };

  const handleNext = () => {
    const result = step2Schema.safeParse({
      childFullName: formData.childFullName,
      childDOB: formData.childDOB,
      childGender: formData.childGender,
      gradeApplying: formData.gradeApplying,
      previousSchool: formData.previousSchool,
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
      <h3 className="text-xl font-bold text-gray-900">Tell us about your child</h3>

      {errorCount > 0 && (
        <div className="text-red-500 text-sm font-medium mb-4">
          Please complete {errorCount} required field{errorCount > 1 ? 's' : ''} before continuing
        </div>
      )}

      <Field label="Child's full name *" error={fieldErrors.childFullName} fieldRef={refs.childFullName}>
        <Input className={errCls('childFullName')} placeholder="As it appears on birth certificate" value={formData.childFullName} onChange={(e) => { onChange({ childFullName: e.target.value }); if (e.target.value) clearError('childFullName'); }} />
      </Field>

      <Field label="Date of birth *" error={fieldErrors.childDOB} fieldRef={refs.childDOB}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select value={day} onValueChange={(v) => updateDOB(v, month, year)}>
            <SelectTrigger className={cn('w-full', fieldErrors.childDOB && 'border-red-500')}><SelectValue placeholder="Day" /></SelectTrigger>
            <SelectContent className="max-h-60">{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={month} onValueChange={(v) => updateDOB(day, v, year)}>
            <SelectTrigger className={cn('w-full', fieldErrors.childDOB && 'border-red-500')}><SelectValue placeholder="Month" /></SelectTrigger>
            <SelectContent>{months.map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={year} onValueChange={(v) => updateDOB(day, month, v)}>
            <SelectTrigger className={cn('w-full', fieldErrors.childDOB && 'border-red-500')}><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent className="max-h-60">{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Field>

      <Field label="South African ID number">
        <Input placeholder="Optional but strengthens application" value={formData.childIdNumber} onChange={(e) => onChange({ childIdNumber: e.target.value })} />
        <p className="text-xs text-gray-400 mt-0.5">Optional. Include if available.</p>
      </Field>

      <Field label="Gender *" error={fieldErrors.childGender} fieldRef={refs.childGender}>
        <div className={cn('rounded-lg', fieldErrors.childGender && 'border border-red-500 p-2')}>
          <RadioGroup value={formData.childGender} onValueChange={(v) => { onChange({ childGender: v }); if (v) clearError('childGender'); }} className="flex gap-6 mt-1">
            {['Male', 'Female'].map((g) => (
              <div key={g} className="flex items-center space-x-2">
                <RadioGroupItem value={g} id={`gender-${g}`} />
                <Label htmlFor={`gender-${g}`} className="cursor-pointer text-sm">{g}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Field>

      <Field label="Population group">
        {formData.province === 'Gauteng' && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mb-1">⚠️ Gauteng requires this field. Leaving it blank may delay your application. This is a GDE requirement, not ours.</p>
        )}
        <SelectField value={formData.childPopulationGroup} onChange={(v) => onChange({ childPopulationGroup: v })} options={populationOptions} placeholder="Select" />
      </Field>

      <Field label="Grade applying for *" error={fieldErrors.gradeApplying} fieldRef={refs.gradeApplying}>
        <SelectField value={formData.gradeApplying} onChange={(v) => { onChange({ gradeApplying: v }); if (v) clearError('gradeApplying'); }} options={gradeOptions} placeholder="Select grade" className={errCls('gradeApplying')} />
      </Field>

      <Field label="Year of application">
        <SelectField value={formData.applicationYear} onChange={(v) => onChange({ applicationYear: v })} options={yearOptions} placeholder="Select year" />
      </Field>

      <Field label="Is your child currently or previously enrolled in school? *" error={fieldErrors.previousSchool} fieldRef={refs.previousSchool}>
        <div className={cn('rounded-lg', fieldErrors.previousSchool && 'border border-red-500 p-2')}>
          <RadioGroup value={formData.previousSchool} onValueChange={(v) => { onChange({ previousSchool: v }); if (v) clearError('previousSchool'); }} className="space-y-2 mt-1">
            {previousSchoolOptions.map((o) => (
              <div key={o} className="flex items-center space-x-2">
                <RadioGroupItem value={o} id={`prev-${o}`} />
                <Label htmlFor={`prev-${o}`} className="cursor-pointer text-sm">{o}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Field>

      {showPrevSchool && (
        <div className="space-y-3 border-l-2 border-emerald-200 pl-4">
          <Input placeholder="Name of previous school" value={formData.previousSchoolDetails.schoolName} onChange={(e) => onChange({ previousSchoolDetails: { ...formData.previousSchoolDetails, schoolName: e.target.value } })} />
          <SelectField value={formData.previousSchoolDetails.province} onChange={(v) => onChange({ previousSchoolDetails: { ...formData.previousSchoolDetails, province: v } })} options={provinces} placeholder="Province of school" />
          <SelectField value={formData.previousSchoolDetails.gradeCompleted} onChange={(v) => onChange({ previousSchoolDetails: { ...formData.previousSchoolDetails, gradeCompleted: v } })} options={gradeOptions} placeholder="Grade completed" />
          <Input placeholder="School contact number (optional)" value={formData.previousSchoolDetails.contactNumber} onChange={(e) => onChange({ previousSchoolDetails: { ...formData.previousSchoolDetails, contactNumber: e.target.value } })} />
          <Input placeholder="Physical address of school (optional)" value={formData.previousSchoolDetails.physicalAddress} onChange={(e) => onChange({ previousSchoolDetails: { ...formData.previousSchoolDetails, physicalAddress: e.target.value } })} />

          <div className="bg-[#fefce8] border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            You will need a transfer certificate and last school report. Don't have them yet? That's okay. We include a request letter template in your package.
          </div>
        </div>
      )}

      <DocumentCallout
        items={[
          "Certified copy of your child's birth certificate",
          ...(formData.previousSchool && formData.previousSchool !== 'Never been enrolled'
            ? [
                'Certified copy of last school report — must be signed by the principal',
                'Certified copy of transfer certificate from previous school',
              ]
            : []),
          ...(formData.disabilities.some((d) => d !== 'No diagnosed conditions')
            ? ['Certified copy of assessment document or referral letter from a medical practitioner']
            : []),
          ...(formData.parentMaritalStatus === 'Divorced' ||
          formData.parentMaritalStatus === 'Co-parenting / Separated'
            ? ['Certified copy of court order granting guardianship or custody']
            : []),
        ]}
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Does your child have any diagnosed condition?</Label>
        <p className="text-xs text-gray-400 mb-1">Tick all that apply</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {disabilityOptions.map((opt) => (
            <div key={opt} className="flex items-start space-x-2">
              <Checkbox id={`dis-${opt}`} checked={formData.disabilities.includes(opt)} onCheckedChange={(checked) => handleDisabilityToggle(opt, !!checked)} />
              <Label htmlFor={`dis-${opt}`} className="text-sm cursor-pointer leading-tight">{opt}</Label>
            </div>
          ))}
        </div>
        {showOtherDisability && (
          <Input placeholder="Please specify" value={formData.disabilityOther} onChange={(e) => onChange({ disabilityOther: e.target.value })} className="mt-2" />
        )}
        <p className="text-sm text-gray-500 mt-2">
          If a diagnosis is cited in your application, a letter or report from a medical practitioner strengthens your case. We'll remind you.
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6">
        <button onClick={onBack} className="w-full sm:w-auto border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition">← Back</button>
        <button onClick={handleNext} className="w-full sm:w-auto bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-600 transition">Next →</button>
      </div>
    </div>
  );
}

function Field({ label, children, error, fieldRef }: { label: string; children: React.ReactNode; error?: string; fieldRef?: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="space-y-1.5" ref={fieldRef}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder, className }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string; className?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
