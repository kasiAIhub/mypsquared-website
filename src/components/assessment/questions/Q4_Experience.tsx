import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AssessmentAnswers } from "@/types/assessment";

interface Q4Props {
  value: {
    experience: AssessmentAnswers['experience'];
    experienceField: AssessmentAnswers['experienceField'];
  };
  onChange: (data: { experience: AssessmentAnswers['experience']; experienceField: AssessmentAnswers['experienceField'] }) => void;
}

const experienceOptions = [
  { value: 'formalEmployment', label: 'Formal employment', description: 'Currently or recently employed', showField: true },
  { value: 'selfEmployed', label: 'Self-employed / Business owner', description: 'Running my own business', showField: true },
  { value: 'volunteer', label: 'Volunteer work / Community involvement', description: 'Active in community organizations', showField: true },
  { value: 'stayAtHome', label: 'Stay-at-home parent', description: 'Full-time parenting and home management', showField: false },
  { value: 'betweenOpportunities', label: 'Between opportunities', description: 'Currently seeking employment', showField: false },
  { value: 'retired', label: 'Retired', description: 'Previously worked, now retired', showField: true },
];

const Q4_Experience = ({ value, onChange }: Q4Props) => {
  const selectedOption = experienceOptions.find(opt => opt.value === value.experience);
  const showField = selectedOption?.showField;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        Your work experience helps demonstrate organizational skills and the ability to guide learning.
      </p>

      <RadioGroup
        value={value.experience}
        onValueChange={(val) => onChange({ 
          experience: val as AssessmentAnswers['experience'], 
          experienceField: value.experienceField 
        })}
        className="space-y-3"
      >
        {experienceOptions.map((option) => (
          <div
            key={option.value}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              value.experience === option.value 
                ? 'bg-primary/5 border-primary' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => onChange({ 
              experience: option.value as AssessmentAnswers['experience'], 
              experienceField: value.experienceField 
            })}
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

      {showField && value.experience && (
        <div className="mt-4">
          <Label htmlFor="experienceField" className="text-foreground font-medium mb-2 block">
            What field or industry? (Optional)
          </Label>
          <Input
            id="experienceField"
            placeholder="e.g., Healthcare, Retail, Engineering, Education..."
            value={value.experienceField}
            onChange={(e) => onChange({ 
              experience: value.experience, 
              experienceField: e.target.value 
            })}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Example: "10 years in retail = organizational skills, patience, breaking complex tasks into simple steps"
          </p>
        </div>
      )}
    </div>
  );
};

export default Q4_Experience;
