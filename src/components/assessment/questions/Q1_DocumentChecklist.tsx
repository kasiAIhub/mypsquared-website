import { useState } from "react";
import { Info, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import InfoPopup from "../InfoPopup";
import { documentPopupData, PopupContent } from "@/lib/assessmentData";
import { AssessmentAnswers } from "@/types/assessment";

interface Q1Props {
  value: AssessmentAnswers['documents'];
  onChange: (documents: AssessmentAnswers['documents']) => void;
}

const documentItems = [
  { key: 'birthCertificate' as const, label: 'Unabridged Birth Certificate', popupKey: 'birthCert' },
  { key: 'parentId' as const, label: 'Parent ID Document (certified copy)', popupKey: 'parentId' },
  { key: 'schoolReport' as const, label: 'Child\'s Most Recent School Report', popupKey: 'schoolReport' },
  { key: 'transferCertificate' as const, label: 'Transfer Certificate (from current school)', popupKey: 'transferCert' },
  { key: 'proofOfResidence' as const, label: 'Proof of Residence (less than 3 months old)', popupKey: 'proofResidence' },
];

const Q1_DocumentChecklist = ({ value, onChange }: Q1Props) => {
  const [activePopup, setActivePopup] = useState<PopupContent | null>(null);

  const handleDocumentChange = (key: keyof Omit<AssessmentAnswers['documents'], 'noneOfThese'>, checked: boolean) => {
    if (checked) {
      onChange({
        ...value,
        [key]: checked,
        noneOfThese: false
      });
    } else {
      onChange({
        ...value,
        [key]: checked
      });
    }
  };

  const handleNoneChange = (checked: boolean) => {
    if (checked) {
      onChange({
        birthCertificate: false,
        parentId: false,
        schoolReport: false,
        transferCertificate: false,
        proofOfResidence: false,
        noneOfThese: true
      });
    } else {
      onChange({
        ...value,
        noneOfThese: false
      });
    }
  };

  const checkedCount = documentItems.filter(item => value[item.key]).length;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        Select all the documents you currently have ready or can easily obtain. 
        Click the info icon for details on each document.
      </p>

      {/* Document Score Badge */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Documents Ready</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{checkedCount}/5</span>
          </div>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Document Checkboxes */}
      <div className="space-y-3">
        {documentItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              value[item.key] 
                ? 'bg-primary/5 border-primary' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <Checkbox
              id={item.key}
              checked={value[item.key]}
              onCheckedChange={(checked) => handleDocumentChange(item.key, checked as boolean)}
              className="w-5 h-5 border-2"
            />
            <label 
              htmlFor={item.key}
              className="flex-1 cursor-pointer text-foreground font-medium"
            >
              {item.label}
            </label>
            <button
              type="button"
              onClick={() => setActivePopup(documentPopupData[item.popupKey])}
              className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
            >
              <Info className="w-4 h-4 text-primary" />
            </button>
            {value[item.key] && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </div>
        ))}

        {/* None of These Option */}
        <div className="pt-4 border-t border-border mt-4">
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              value.noneOfThese 
                ? 'bg-amber-500/10 border-amber-500' 
                : 'bg-card border-border hover:border-amber-500/50'
            }`}
          >
            <Checkbox
              id="noneOfThese"
              checked={value.noneOfThese}
              onCheckedChange={(checked) => handleNoneChange(checked as boolean)}
              className="w-5 h-5 border-2"
            />
            <label 
              htmlFor="noneOfThese"
              className="flex-1 cursor-pointer text-foreground font-medium"
            >
              I don't have any of these documents yet
            </label>
          </div>
        </div>
      </div>

      {/* Info Popup */}
      {activePopup && (
        <InfoPopup
          isOpen={true}
          onClose={() => setActivePopup(null)}
          data={activePopup}
        />
      )}
    </div>
  );
};

export default Q1_DocumentChecklist;
