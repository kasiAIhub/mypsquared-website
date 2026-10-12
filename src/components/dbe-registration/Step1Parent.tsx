import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DBEFormData, titleOptions, relationshipOptions, qualificationOptions, employmentOptions, maritalOptions, populationOptions, provinces } from '@/types/dbeRegistration';
import { step1Schema, zodIssuesToFieldErrors } from '@/schemas/dbeFormSchema';
import DocumentCallout from './DocumentCallout';

interface Step1Props {
  formData: DBEFormData;
  onChange: (updates: Partial<DBEFormData>) => void;
  onNext: () => void;
  sessionId?: string;
}

export default function Step1Parent({ formData, onChange, onNext }: Step1Props) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const refs: Record<string, React.RefObject<HTMLDivElement>> = {
    parentFullName: useRef<HTMLDivElement>(null),
    parentIdNumber: useRef<HTMLDivElement>(null),
    parentEmail: useRef<HTMLDivElement>(null),
    parentPhone: useRef<HTMLDivElement>(null),
    parentRelationship: useRef<HTMLDivElement>(null),
  };

  const showParent2 = formData.parentMaritalStatus && formData.parentMaritalStatus !== 'Single' && !formData.soleParent;

  const clearError = (key: string) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev }; delete next[key]; return next;
    });
  };

  const handleChange = (key: keyof DBEFormData, value: string) => {
    onChange({ [key]: value } as Partial<DBEFormData>);
    if (value) clearError(key);
  };

  const handleNext = () => {
    const result = step1Schema.safeParse({
      parentFullName: formData.parentFullName,
      parentIdNumber: formData.parentIdNumber,
      parentEmail: formData.parentEmail,
      parentPhone: formData.parentPhone,
      parentRelationship: formData.parentRelationship,
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
      <h3 className="text-xl font-bold text-gray-900">Tell us about yourself</h3>

      {errorCount > 0 && (
        <div className="text-red-500 text-sm font-medium mb-4">
          Please complete {errorCount} required field{errorCount > 1 ? 's' : ''} before continuing
        </div>
      )}

      <Field label="Full name *" error={fieldErrors.parentFullName} fieldRef={refs.parentFullName}>
        <Input className={errCls('parentFullName')} placeholder="e.g. Tsholo Monyausi" value={formData.parentFullName} onChange={(e) => handleChange('parentFullName', e.target.value)} />
      </Field>

      <Field label="ID number *" error={fieldErrors.parentIdNumber} fieldRef={refs.parentIdNumber}>
        <Input className={errCls('parentIdNumber')} placeholder="13-digit South African ID number" value={formData.parentIdNumber} onChange={(e) => handleChange('parentIdNumber', e.target.value)} />
      </Field>

      <Field label="Email address *" error={fieldErrors.parentEmail} fieldRef={refs.parentEmail}>
        <Input className={errCls('parentEmail')} type="email" value={formData.parentEmail} onChange={(e) => handleChange('parentEmail', e.target.value)} />
      </Field>

      <Field label="WhatsApp / Cell number *" error={fieldErrors.parentPhone} fieldRef={refs.parentPhone}>
        <Input className={errCls('parentPhone')} type="tel" placeholder="e.g. 0818905861" value={formData.parentPhone} onChange={(e) => handleChange('parentPhone', e.target.value)} />
      </Field>

      <Field label="Title">
        <SelectField value={formData.parentTitle} onChange={(v) => onChange({ parentTitle: v })} options={titleOptions} placeholder="Select title" />
      </Field>

      <Field label="Relationship to child *" error={fieldErrors.parentRelationship} fieldRef={refs.parentRelationship}>
        <SelectField value={formData.parentRelationship} onChange={(v) => handleChange('parentRelationship', v)} options={relationshipOptions} placeholder="Select relationship" className={errCls('parentRelationship')} />
      </Field>

      <Field label="Highest qualification">
        <SelectField value={formData.parentQualification} onChange={(v) => onChange({ parentQualification: v })} options={qualificationOptions} placeholder="Select qualification" />
      </Field>

      <Field label="Employment status">
        <RadioGroup value={formData.parentEmployment} onValueChange={(v) => onChange({ parentEmployment: v })} className="flex flex-wrap gap-4 mt-1">
          {employmentOptions.map((opt) => (
            <div key={opt} className="flex items-center space-x-2">
              <RadioGroupItem value={opt} id={`emp-${opt}`} />
              <Label htmlFor={`emp-${opt}`} className="text-sm cursor-pointer">{opt}</Label>
            </div>
          ))}
        </RadioGroup>
      </Field>

      <Field label="Population group">
        <SelectField value={formData.parentPopulationGroup} onChange={(v) => onChange({ parentPopulationGroup: v })} options={populationOptions} placeholder="Select population group" />
      </Field>

      <Field label="Marital status">
        <SelectField value={formData.parentMaritalStatus} onChange={(v) => onChange({ parentMaritalStatus: v })} options={maritalOptions} placeholder="Select marital status" />
      </Field>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Residential address</p>
        <Input placeholder="Street address" value={formData.address.street} onChange={(e) => onChange({ address: { ...formData.address, street: e.target.value } })} />
        <Input placeholder="Suburb" value={formData.address.suburb} onChange={(e) => onChange({ address: { ...formData.address, suburb: e.target.value } })} />
        <Input placeholder="City / Town" value={formData.address.city} onChange={(e) => onChange({ address: { ...formData.address, city: e.target.value } })} />
        <SelectField value={formData.address.province || formData.province} onChange={(v) => onChange({ address: { ...formData.address, province: v } })} options={provinces} placeholder="Province" />
        <Input placeholder="Postal code" value={formData.address.postalCode} onChange={(e) => onChange({ address: { ...formData.address, postalCode: e.target.value } })} />
      </div>

      <DocumentCallout
        intro="You will need certified copies of these documents — not older than 3 months — when you submit your application to the DBE:"
        items={[
          'Certified copy of YOUR South African ID',
          'Proof of residence (utility bill or lease agreement, not older than 3 months)',
          ...(formData.province === 'Gauteng'
            ? ["If your child has a diagnosed condition: certified copy of medical or educational psychologist's report"]
            : []),
        ]}
      />

      {showParent2 && (
        <div className="border-t pt-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Second Parent / Guardian (optional)</p>
          <Input placeholder="Full name" value={formData.parent2.fullName} onChange={(e) => onChange({ parent2: { ...formData.parent2, fullName: e.target.value } })} />
          <Input placeholder="ID number" value={formData.parent2.idNumber} onChange={(e) => onChange({ parent2: { ...formData.parent2, idNumber: e.target.value } })} />
          <Input placeholder="Email" type="email" value={formData.parent2.email} onChange={(e) => onChange({ parent2: { ...formData.parent2, email: e.target.value } })} />
          <Input placeholder="Phone" type="tel" value={formData.parent2.phone} onChange={(e) => onChange({ parent2: { ...formData.parent2, phone: e.target.value } })} />
          <SelectField value={formData.parent2.title} onChange={(v) => onChange({ parent2: { ...formData.parent2, title: v } })} options={titleOptions} placeholder="Title" />
          <SelectField value={formData.parent2.relationship} onChange={(v) => onChange({ parent2: { ...formData.parent2, relationship: v } })} options={relationshipOptions} placeholder="Relationship" />
          <SelectField value={formData.parent2.qualification} onChange={(v) => onChange({ parent2: { ...formData.parent2, qualification: v } })} options={qualificationOptions} placeholder="Qualification" />
          <SelectField value={formData.parent2.populationGroup} onChange={(v) => onChange({ parent2: { ...formData.parent2, populationGroup: v } })} options={populationOptions} placeholder="Population group" />
          <RadioGroup value={formData.parent2.employment} onValueChange={(v) => onChange({ parent2: { ...formData.parent2, employment: v } })} className="flex flex-wrap gap-4">
            {employmentOptions.map((opt) => (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`p2emp-${opt}`} />
                <Label htmlFor={`p2emp-${opt}`} className="text-sm cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {formData.parentMaritalStatus && formData.parentMaritalStatus !== 'Single' && (
        <div className="flex items-start space-x-2">
          <Checkbox id="sole-parent" checked={formData.soleParent} onCheckedChange={(v) => onChange({ soleParent: !!v })} />
          <Label htmlFor="sole-parent" className="text-sm text-gray-600 cursor-pointer leading-tight">
            I am the sole parent / guardian and there is no second parent to list
          </Label>
        </div>
      )}

      <button onClick={handleNext} className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition">
        Next →
      </button>
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
