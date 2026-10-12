import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IntakeData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: string;
  currentGrade: string;
  currentSchooling: string;
}

interface AssessmentIntakeProps {
  onComplete: (data: IntakeData) => void;
}

export default function AssessmentIntake({ onComplete }: AssessmentIntakeProps) {
  const [formData, setFormData] = useState<IntakeData>({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    currentGrade: '',
    currentSchooling: ''
  });

  const [errors, setErrors] = useState<Partial<IntakeData>>({});

  const validateForm = () => {
    const newErrors: Partial<IntakeData> = {};

    if (!formData.parentName.trim()) newErrors.parentName = 'Required';
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Invalid email';
    }
    if (!formData.childName.trim()) newErrors.childName = 'Required';
    if (!formData.childAge) newErrors.childAge = 'Required';
    if (!formData.currentGrade) newErrors.currentGrade = 'Required';
    if (!formData.currentSchooling) newErrors.currentSchooling = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const updateField = (field: keyof IntakeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6 text-center">
        <span className="inline-block bg-[#10B981] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
          FREE · 5 MINUTES · 14 QUESTIONS
        </span>
        <h2 className="text-3xl font-bold text-[#0F172A] mb-3">
          Build your child's learner profile
        </h2>
        <p className="text-[#64748B]">
          5 minutes. No sign-up required. Discover who your child is as a learner — so you can find the right fit for them.
        </p>
      </div>

      <div className="bg-[#F5F0E8] border border-amber-200 rounded-lg p-4 mt-4 mb-6">
        <p className="text-sm text-amber-800 leading-relaxed">
          P-Squared's learner profile is an educational insight tool — not a psychological assessment or clinical diagnosis. It gives you a starting point for understanding how your child learns so you can choose the right curriculum and approach. If you have concerns about your child's learning, development, or behaviour, please consult a registered educational psychologist.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="border-b pb-6">
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Parent Information</h3>
          <p style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 8 }}>
            Your information is private and never shared.
          </p>



          <div className="space-y-4">
            <div>
              <Label htmlFor="parentName">Your Full Name *</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => updateField('parentName', e.target.value)}
                className={errors.parentName ? 'border-red-500' : ''}
                placeholder="Full name"
              />
              {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
            </div>

            <div>
              <Label htmlFor="parentEmail">Email Address *</Label>
              <Input
                id="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={(e) => updateField('parentEmail', e.target.value)}
                className={errors.parentEmail ? 'border-red-500' : ''}
                placeholder="name@example.com"
              />
              {errors.parentEmail && <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>}
            </div>

            <div>
              <Label htmlFor="parentPhone">Phone Number (Optional)</Label>
              <Input
                id="parentPhone"
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value)}
                placeholder="082 123 4567"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Child Information</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="childName">Child's Full Name *</Label>
              <Input
                id="childName"
                value={formData.childName}
                onChange={(e) => updateField('childName', e.target.value)}
                className={errors.childName ? 'border-red-500' : ''}
                placeholder="Kagiso"
              />
              {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
            </div>

            <div>
              <Label htmlFor="childAge">Child's Age *</Label>
              <Select
                value={formData.childAge}
                onValueChange={(value) => updateField('childAge', value)}
              >
                <SelectTrigger className={errors.childAge ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => i + 5).map(age => (
                    <SelectItem key={age} value={age.toString()}>{age} years old</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.childAge && <p className="text-red-500 text-sm mt-1">{errors.childAge}</p>}
            </div>

            <div>
              <Label htmlFor="currentGrade">Current Grade *</Label>
              <Select
                value={formData.currentGrade}
                onValueChange={(value) => updateField('currentGrade', value)}
              >
                <SelectTrigger className={errors.currentGrade ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-r">Grade R</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                    <SelectItem key={grade} value={`grade-${grade}`}>Grade {grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currentGrade && <p className="text-red-500 text-sm mt-1">{errors.currentGrade}</p>}
            </div>

            <div>
              <Label htmlFor="currentSchooling">Current Schooling Situation *</Label>
              <Select
                value={formData.currentSchooling}
                onValueChange={(value) => updateField('currentSchooling', value)}
              >
                <SelectTrigger className={errors.currentSchooling ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select current situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">Traditional School</SelectItem>
                  <SelectItem value="homeschool">Currently Homeschooling</SelectItem>
                  <SelectItem value="online">Online School</SelectItem>
                  <SelectItem value="not-enrolled">Not Currently Enrolled</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.currentSchooling && <p className="text-red-500 text-sm mt-1">{errors.currentSchooling}</p>}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" size="lg" className="w-full bg-[#10B981] hover:bg-[#059669]">
            Next →
          </Button>
          <p className="text-center text-sm text-[#64748B] mt-3">
            Takes about 5 minutes • All information confidential
          </p>
        </div>
      </form>
    </div>
  );
}
