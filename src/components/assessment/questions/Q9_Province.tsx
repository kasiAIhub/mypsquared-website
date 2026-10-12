import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { provinceOptions, provinceNotes } from "@/lib/assessmentData";
import { AssessmentAnswers } from "@/types/assessment";

interface Q9Props {
  value: AssessmentAnswers['province'];
  onChange: (province: AssessmentAnswers['province']) => void;
}

const Q9_Province = ({ value, onChange }: Q9Props) => {
  const selectedNote = value ? provinceNotes[value] : null;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        We've researched all 9 provincial processes to ensure your application meets your specific DBE office requirements.
      </p>

      <div className="space-y-2">
        <Label htmlFor="province" className="text-foreground font-medium">
          Select your province
        </Label>
        <Select 
          value={value} 
          onValueChange={(val) => onChange(val as AssessmentAnswers['province'])}
        >
          <SelectTrigger className="w-full py-6 text-base">
            <SelectValue placeholder="Choose your province..." />
          </SelectTrigger>
          <SelectContent>
            {provinceOptions.map((province) => (
              <SelectItem 
                key={province.value} 
                value={province.value}
                className="py-3"
              >
                {province.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedNote && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
          <p className="text-sm text-primary font-medium">{selectedNote}</p>
        </div>
      )}

      <div className="bg-muted/50 rounded-xl p-4 mt-4 border border-border">
        <h4 className="font-medium text-foreground mb-2">🔬 Our Research Coverage:</h4>
        <p className="text-sm text-muted-foreground">
          We've analyzed applications across all 9 provinces and customize our templates to meet each provincial DBE office's specific requirements.
        </p>
      </div>
    </div>
  );
};

export default Q9_Province;
