import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AssessmentAnswers } from "@/types/assessment";

interface Q5Props {
  value: AssessmentAnswers['reasons'];
  onChange: (reasons: string[]) => void;
}

const reasonOptions = [
  { value: 'religious', label: 'Religious/values alignment', description: 'Faith-based or philosophical education preferences' },
  { value: 'learningNeeds', label: 'Special learning needs', description: 'Neurodivergence, learning disabilities, or giftedness' },
  { value: 'academicExcellence', label: 'Better academic outcomes', description: 'Advanced learning or specialized instruction' },
  { value: 'safety', label: 'Safety/bullying concerns', description: 'School environment safety or social issues' },
  { value: 'flexibility', label: 'Flexible scheduling', description: 'Travel, family commitments, or lifestyle needs' },
  { value: 'distance', label: 'Distance/rural location', description: 'Geographic challenges accessing suitable schools' },
  { value: 'schoolDissatisfaction', label: 'Dissatisfaction with school system', description: 'Teaching methods or curriculum concerns' },
  { value: 'medical', label: 'Medical/health reasons', description: 'Chronic illness, therapy needs, or health conditions' },
];

const Q5_Reason = ({ value, onChange }: Q5Props) => {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      if (value.length < 3) {
        onChange([...value, optionValue]);
      }
    }
  };

  const selectedCount = value.length;
  const maxSelections = 3;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-4">
        Your reasons help us craft a compelling motivation letter that resonates with DBE requirements.
      </p>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-6">
        <p className="text-sm text-primary font-medium">
          Select up to 3 reasons ({selectedCount} selected)
        </p>
      </div>

      <div className="space-y-3">
        {reasonOptions.map((option) => {
          const isSelected = value.includes(option.value);
          const isDisabled = !isSelected && selectedCount >= maxSelections;

          return (
            <div
              key={option.value}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } ${
                isSelected
                  ? 'bg-primary/5 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => !isDisabled && handleToggle(option.value)}
            >
              <Checkbox
                id={`reason-${option.value}`}
                checked={isSelected}
                onCheckedChange={() => !isDisabled && handleToggle(option.value)}
                disabled={isDisabled}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`reason-${option.value}`}
                  className={`text-foreground font-medium ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {value.length > 0 && (
        <div className="bg-muted/50 rounded-xl p-4 mt-6 border border-border">
          <h4 className="font-semibold text-foreground mb-3">✨ How We Transform Your Reasons:</h4>
          <div className="space-y-3">
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-medium">❌ What parents often write:</span><br/>
                "My child learns differently and I want to homeschool."
              </p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <p className="text-sm text-primary">
                <span className="font-medium">✅ What we help you write:</span><br/>
                "Following a comprehensive evaluation of [Child's] learning profile, we have determined that
                an individualized educational approach better serves their developmental needs. This decision
                is supported by [specific evidence] and aligns with the provisions of the BELA Act..."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Q5_Reason;
