import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AssessmentAnswers } from "@/types/assessment";

interface Q2Props {
  value: AssessmentAnswers['timeline'];
  onChange: (timeline: AssessmentAnswers['timeline']) => void;
}

const timelineOptions = [
  { value: 'urgent', label: 'Within the next 2-4 weeks', description: 'Urgent - I need to move fast' },
  { value: '1-3months', label: 'Within 1-3 months', description: 'Planning ahead carefully' },
  { value: '3-6months', label: 'Within 3-6 months', description: 'Preparing for next year' },
  { value: '6plus', label: 'More than 6 months from now', description: 'Just researching options' },
  { value: 'noTimeline', label: 'I don\'t have a specific timeline', description: 'Exploring the possibility' },
];

const Q2_Timeline = ({ value, onChange }: Q2Props) => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        Understanding your timeline helps us prioritize your application and provide relevant guidance.
      </p>

      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as AssessmentAnswers['timeline'])}
        className="space-y-3"
      >
        {timelineOptions.map((option) => (
          <div
            key={option.value}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              value === option.value 
                ? 'bg-primary/5 border-primary' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => onChange(option.value as AssessmentAnswers['timeline'])}
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
    </div>
  );
};

export default Q2_Timeline;
