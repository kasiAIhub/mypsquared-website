import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gradeOptions } from "@/lib/assessmentData";
import { AssessmentAnswers } from "@/types/assessment";

interface Q10Props {
  value: {
    grade: AssessmentAnswers['grade'];
    childName: AssessmentAnswers['childName'];
    currentSituation: AssessmentAnswers['currentSituation'];
  };
  onChange: (data: { grade: AssessmentAnswers['grade']; childName: AssessmentAnswers['childName']; currentSituation: AssessmentAnswers['currentSituation'] }) => void;
}

const situationOptions = [
  { value: 'publicPrivateSchool', label: 'Currently in public or private school', description: 'Will be withdrawing to homeschool' },
  { value: 'onlineSchool', label: 'Currently enrolled in online school', description: 'Already doing remote learning' },
  { value: 'informalHomeschool', label: 'Already homeschooling (not registered)', description: 'Teaching at home without DBE approval' },
  { value: 'alreadyHomeschoolingRegistered', label: 'Already homeschooling and registered', description: 'Currently registered with DBE but need to re-register for a higher grade or want to update registration under the new BELA Act 32 of 2024 (launched 2025)' },
  { value: 'atHome', label: 'Child is at home (not in school)', description: 'Recently left or taking a break from school' },
  { value: 'neverAttended', label: 'Child has never attended formal school', description: 'Starting education at home' },
  { value: 'transitioning', label: 'Transitioning between options', description: 'Exploring alternatives' },
];

const Q10_ChildInfo = ({ value, onChange }: Q10Props) => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Understanding your child's current situation helps us customize the application 
        and educational plan.
      </p>

      {/* Child's Name Input */}
      <div className="space-y-2">
        <Label htmlFor="childName" className="text-foreground font-medium">
          Child's First Name *
        </Label>
        <Input
          id="childName"
          placeholder="Enter your child's first name"
          value={value.childName || ''}
          onChange={(e) => onChange({ ...value, childName: e.target.value })}
          className="py-6 text-base"
        />
        <p className="text-sm text-muted-foreground">
          This will be used in your personalized documents
        </p>
      </div>

      {/* Grade Selection */}
      <div className="space-y-2">
        <Label htmlFor="grade" className="text-foreground font-medium">
          What grade will your child be in?
        </Label>
        <Select 
          value={value.grade} 
          onValueChange={(val) => onChange({ ...value, grade: val })}
        >
          <SelectTrigger className="w-full py-6 text-base">
            <SelectValue placeholder="Select grade..." />
          </SelectTrigger>
          <SelectContent>
            {gradeOptions.map((grade) => (
              <SelectItem 
                key={grade.value} 
                value={grade.value}
                className="py-3"
              >
                {grade.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current Situation */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">
          What is your child's current educational situation?
        </Label>
        
        <RadioGroup
          value={value.currentSituation}
          onValueChange={(val) => onChange({ 
            ...value, 
            currentSituation: val as AssessmentAnswers['currentSituation'] 
          })}
          className="space-y-2"
        >
          {situationOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                value.currentSituation === option.value 
                  ? 'bg-primary/5 border-primary' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => onChange({ 
                ...value, 
                currentSituation: option.value as AssessmentAnswers['currentSituation'] 
              })}
            >
              <RadioGroupItem value={option.value} id={`situation-${option.value}`} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={`situation-${option.value}`} className="text-foreground font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Positive message for registered homeschoolers */}
      {value.currentSituation === 'alreadyHomeschoolingRegistered' && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-primary font-medium">
            ✅ <strong>Great news!</strong> You're already familiar with the process - re-registration
            under BELA Act is often smoother for experienced home educators. Re-registration is
            typically faster than first-time applications.
          </p>
        </div>
      )}

      {/* Urgent situation warning */}
      {(value.currentSituation === 'informalHomeschool' ||
        value.currentSituation === 'atHome' ||
        value.currentSituation === 'neverAttended') && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            ⚠️ <strong>Important:</strong> South African law requires children to be registered for
            education. Don't worry - we'll help you navigate this sensitively. Many parents in
            similar situations have successfully registered through P-Squared.
          </p>
        </div>
      )}
    </div>
  );
};

export default Q10_ChildInfo;
