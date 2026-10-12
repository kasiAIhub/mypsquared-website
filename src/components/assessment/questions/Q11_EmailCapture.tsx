import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone } from "lucide-react";
import { AssessmentAnswers } from "@/types/assessment";

interface Q11Props {
  value: {
    email: AssessmentAnswers['email'];
    phone: AssessmentAnswers['phone'];
    firstName: AssessmentAnswers['firstName'];
    optInPriorityList: AssessmentAnswers['optInPriorityList'];
    optInGuide: AssessmentAnswers['optInGuide'];
    optInUpdates: AssessmentAnswers['optInUpdates'];
  };
  onChange: (data: {
    email: AssessmentAnswers['email'];
    phone: AssessmentAnswers['phone'];
    firstName: AssessmentAnswers['firstName'];
    optInPriorityList: AssessmentAnswers['optInPriorityList'];
    optInGuide: AssessmentAnswers['optInGuide'];
    optInUpdates: AssessmentAnswers['optInUpdates'];
  }) => void;
}

const Q11_EmailCapture = ({ value, onChange }: Q11Props) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
  const cleanPhone = (value.phone || '').replace(/\s+/g, '');

  const isEmailValid = !value.email || emailRegex.test(value.email);
  const isPhoneValid = !value.phone || phoneRegex.test(cleanPhone);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Just a few details to personalize your results and send you helpful resources.
      </p>

      {/* First Name Input */}
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-foreground font-medium flex items-center gap-2">
          <User className="w-4 h-4" />
          Your First Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          value={value.firstName}
          onChange={(e) => onChange({ ...value, firstName: e.target.value })}
          className="py-6 text-base"
          autoFocus
        />
        <p className="text-sm text-muted-foreground">
          We'll use this to personalize your results
        </p>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={value.email || ''}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className={`py-6 text-base ${!isEmailValid ? 'border-red-500' : ''}`}
        />
        {!isEmailValid && (
          <p className="text-xs text-red-500">
            Please enter a valid email address
          </p>
        )}
        {isEmailValid && (
          <p className="text-sm text-muted-foreground">
            We'll send your personalized guide and results here
          </p>
        )}
      </div>

      {/* Phone Input */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="082 555 1234"
          value={value.phone || ''}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          className={`py-6 text-base ${!isPhoneValid ? 'border-red-500' : ''}`}
        />
        {!isPhoneValid && (
          <p className="text-xs text-red-500">
            Please enter a valid South African phone number
          </p>
        )}
        {isPhoneValid && (
          <p className="text-sm text-muted-foreground">
            Format: 082 555 1234 or +27 82 555 1234
          </p>
        )}
      </div>
    </div>
  );
};

export default Q11_EmailCapture;
