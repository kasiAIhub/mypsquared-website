import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AssessmentAnswers } from "@/types/assessment";

interface Q3Props {
  value: AssessmentAnswers['qualification'];
  onChange: (qualification: AssessmentAnswers['qualification']) => void;
}

const qualificationOptions = [
  { value: 'postgraduate', label: 'Postgraduate degree or diploma', description: 'Honours, Masters, PhD, Postgrad Diploma' },
  { value: 'undergraduate', label: 'Undergraduate degree or diploma', description: 'Bachelor\'s degree, National Diploma, BTech' },
  { value: 'matric', label: 'Matric / Grade 12 certificate', description: 'Completed secondary education' },
  { value: 'someHighSchool', label: 'Some high school education', description: 'Did not complete matric' },
  { value: 'noFormal', label: 'No formal qualifications', description: 'Life experience and skills' },
];

const Q3_Qualifications = ({ value, onChange }: Q3Props) => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        Your highest educational qualification helps us frame your teaching capability.
      </p>

      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as AssessmentAnswers['qualification'])}
        className="space-y-3"
      >
        {qualificationOptions.map((option) => (
          <div
            key={option.value}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              value === option.value 
                ? 'bg-primary/5 border-primary' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => onChange(option.value as AssessmentAnswers['qualification'])}
          >
            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
            <div className="flex-1">
              <Label htmlFor={option.value} className="text-foreground font-medium cursor-pointer">
                {option.label}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>

      {value === 'noFormal' && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
          <p className="text-sm text-primary font-medium">
            ✨ Don't worry! Even "No formal qualification" gets approved. We'll frame your life experience,
            parenting skills, and dedication as teaching capability. Recent DBE Clarifications specifically
            state that teaching qualifications are NOT required.
          </p>
        </div>
      )}
    </div>
  );
};

export default Q3_Qualifications;
