import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { idealPackageOptions } from "@/lib/assessmentData";

interface Q8Props {
  value: string[];
  onChange: (idealPackage: string[]) => void;
}

const Q8_IdealPackage = ({ value, onChange }: Q8Props) => {
  const handleChange = (item: string, checked: boolean) => {
    // If "All of the above" is selected, select everything
    if (item.includes("All of the above") && checked) {
      onChange([...idealPackageOptions]);
    } 
    // If deselecting "All of the above", deselect everything
    else if (item.includes("All of the above") && !checked) {
      onChange([]);
    }
    // Normal selection logic
    else if (checked) {
      const newValue = [...value, item];
      // If all items except "All of the above" are selected, add "All of the above" too
      const allOthers = idealPackageOptions.filter(o => !o.includes("All of the above"));
      if (allOthers.every(o => newValue.includes(o))) {
        onChange([...idealPackageOptions]);
      } else {
        onChange(newValue.filter(v => !v.includes("All of the above")));
      }
    } else {
      // Deselecting an item also deselects "All of the above"
      onChange(value.filter(v => v !== item && !v.includes("All of the above")));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        What would your ideal DBE application package include? Select all that would be valuable to you.
      </p>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {idealPackageOptions.map((item, index) => {
          const isSelected = value.includes(item);
          const isAllOption = item.includes("All of the above");
          
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected 
                  ? isAllOption 
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20' 
                    : 'bg-primary/5 border-primary' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => handleChange(item, !isSelected)}
            >
              <Checkbox
                id={`package-${index}`}
                checked={isSelected}
                onCheckedChange={(checked) => handleChange(item, checked as boolean)}
                className="w-5 h-5 border-2"
              />
              <label 
                htmlFor={`package-${index}`}
                className={`flex-1 text-sm cursor-pointer ${
                  isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
                } ${isAllOption ? 'font-semibold' : ''}`}
              >
                {item}
              </label>
              {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Package summary */}
      {value.length > 0 && (
        <div className="bg-muted/50 rounded-xl p-4 mt-4 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Items selected</span>
            <span className="font-semibold text-primary">
              {value.includes("All of the above (complete peace of mind!)") 
                ? "Complete Package" 
                : `${value.length} items`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Q8_IdealPackage;
