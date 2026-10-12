import { Checkbox } from "@/components/ui/checkbox";
import { concernsOptions } from "@/lib/assessmentData";

interface Q7Props {
  value: string[];
  onChange: (concerns: string[]) => void;
}

const Q7_Concerns = ({ value, onChange }: Q7Props) => {
  const maxSelections = 3;
  
  const handleChange = (concern: string, checked: boolean) => {
    if (checked && value.length < maxSelections) {
      onChange([...value, concern]);
    } else if (!checked) {
      onChange(value.filter(c => c !== concern));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-2">
        Select up to 3 concerns that resonate most with you. This helps us understand 
        what matters to you and prioritize features.
      </p>

      {/* Selection Counter */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 mb-4">
        <span className="text-sm text-muted-foreground">Selected concerns</span>
        <span className={`font-semibold ${
          value.length === maxSelections ? 'text-primary' : 'text-foreground'
        }`}>
          {value.length}/{maxSelections}
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {concernsOptions.map((concern, index) => {
          const isSelected = value.includes(concern);
          const isDisabled = !isSelected && value.length >= maxSelections;
          
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-primary/5 border-primary' 
                  : isDisabled
                    ? 'bg-muted/30 border-border opacity-50 cursor-not-allowed'
                    : 'bg-card border-border hover:border-primary/50 cursor-pointer'
              }`}
              onClick={() => !isDisabled && handleChange(concern, !isSelected)}
            >
              <Checkbox
                id={`concern-${index}`}
                checked={isSelected}
                onCheckedChange={(checked) => handleChange(concern, checked as boolean)}
                disabled={isDisabled}
                className="w-5 h-5 border-2"
              />
              <label 
                htmlFor={`concern-${index}`}
                className={`flex-1 text-sm ${
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {concern}
              </label>
            </div>
          );
        })}
      </div>

      {value.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
          <p className="text-sm text-primary font-medium">
            ✨ Great! We're building KasiLearn to address exactly these concerns. 
            Your input helps us prioritize what matters most to parents like you.
          </p>
        </div>
      )}
    </div>
  );
};

export default Q7_Concerns;
