import { z, ZodError } from 'zod';

export function zodIssuesToFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !(field in out)) {
      out[field] = issue.message;
    }
  }
  return out;
}


export const step1Schema = z.object({
  parentFullName: z.string()
    .min(2, 'Full name is required')
    .max(100, 'Name is too long'),
  parentIdNumber: z.string()
    .min(13, 'ID number must be 13 digits')
    .max(13, 'ID number must be 13 digits')
    .regex(/^\d{13}$/, 'ID number must contain only digits'),
  parentEmail: z.string().email('Please enter a valid email address'),
  parentPhone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\s()-]{10,15}$/, 'Please enter a valid phone number'),
  parentRelationship: z.string().min(1, 'Please select your relationship'),
});

export const step2Schema = z.object({
  childFullName: z.string()
    .min(2, "Child's full name is required")
    .max(100, 'Name is too long'),
  childDOB: z.string()
    .min(10, 'Date of birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  childGender: z.string().refine(
    (v) => v === 'Male' || v === 'Female',
    { message: 'Please select gender' },
  ),
  gradeApplying: z.string().min(1, 'Please select a grade'),
  previousSchool: z.string().min(1, 'Please indicate previous school status'),
});

export const step3Schema = z.object({
  circumstanceTriggers: z.array(z.string())
    .min(1, 'Please select at least one reason'),
  circumstanceNarrative: z.string()
    .min(50, 'Please tell us a little more (minimum 50 characters)')
    .max(600, 'Maximum 600 characters'),
});

export const step4Schema = z.object({
  learningSpace: z.string().min(1, 'Please select where learning will happen'),
  chosenCurriculum: z.string().min(1, 'Please select a curriculum'),
  dailyHours: z.string().min(1, 'Please select daily learning hours'),
  assessorCommitment: z.string().min(1, 'Please indicate your assessor commitment'),
});

export const step5Schema = z.object({
  childLearnerProfile: z.string()
    .min(50, 'Please tell us a little more (minimum 50 characters)')
    .max(500, 'Maximum 500 characters'),
  academicPerformance: z.string().min(1, 'Please select academic performance level'),
});
