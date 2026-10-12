import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AssessmentAnswers } from "@/types/assessment";

interface Q6Props {
  value: AssessmentAnswers['evidenceTypes'];
  onChange: (evidenceTypes: string[]) => void;
}

const evidenceOptions = [
  {
    value: 'doctorReports',
    label: 'Doctor/specialist reports',
    description: 'Medical practitioners, therapists, or health professionals',
    strength: 'Strongest evidence'
  },
  {
    value: 'psychologistAssessment',
    label: 'Psychologist assessment',
    description: 'Educational or clinical psychologist evaluation',
    strength: 'Strongest evidence'
  },
  {
    value: 'schoolReports',
    label: 'School reports showing struggles',
    description: 'Academic reports indicating challenges or needs',
    strength: 'Strong evidence'
  },
  {
    value: 'religiousDocs',
    label: 'Religious/community affiliation docs',
    description: 'Church, mosque, temple, or community leader letters',
    strength: 'Valid evidence'
  },
  {
    value: 'noneYet',
    label: 'None yet (will gather)',
    description: 'Planning to obtain supporting documentation',
    strength: 'We\'ll help identify'
  },
  {
    value: 'other',
    label: 'Other supporting documents',
    description: 'Additional evidence relevant to your situation',
    strength: 'Can be valuable'
  },
];

const Q6_Evidence = ({ value, onChange }: Q6Props) => {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedCount = value.length;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-4">
        Gauteng specifically asks for "empirical evidence" supporting your motivation.
        What documentation do you have or could obtain?
      </p>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-6">
        <p className="text-sm text-primary font-medium">
          Select all that apply ({selectedCount} selected)
        </p>
      </div>

      <div className="space-y-3">
        {evidenceOptions.map((option) => {
          const isSelected = value.includes(option.value);

          return (
            <div
              key={option.value}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary/5 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                id={`evidence-${option.value}`}
                checked={isSelected}
                onCheckedChange={() => handleToggle(option.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Label
                    htmlFor={`evidence-${option.value}`}
                    className="text-foreground font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    option.value === 'doctorReports' || option.value === 'psychologistAssessment'
                      ? 'bg-primary/10 text-primary' :
                    option.value === 'noneYet'
                      ? 'bg-amber-500/10 text-amber-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {option.strength}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {value.includes('noneYet') && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            🔍 Don't worry! Based on your earlier answers, we'll identify what evidence could strengthen
            your application. Often, parents have more supporting documentation than they realize—
            school reports, performance data, even your own career achievements count.
          </p>
        </div>
      )}

      {(value.includes('doctorReports') || value.includes('psychologistAssessment')) && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
          <p className="text-sm text-primary font-medium">
            ✅ Excellent! Professional assessments provide strong empirical evidence that DBE values.
            We'll help you integrate these documents effectively into your application narrative.
          </p>
        </div>
      )}

      {value.length === 0 && (
        <div className="bg-muted/50 border border-border rounded-xl p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            💡 Select at least one option to continue. If you're unsure, choose "None yet (will gather)"
            and we'll guide you on what evidence would strengthen your specific situation.
          </p>
        </div>
      )}
    </div>
  );
};

export default Q6_Evidence;
