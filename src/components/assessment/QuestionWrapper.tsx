import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssessmentProgress from "./AssessmentProgress";

interface QuestionWrapperProps {
  currentQuestion: number;
  totalQuestions: number;
  title: string;
  helpText?: string;
  tipText?: string;
  children: React.ReactNode;
  isValid: boolean;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
}

const QuestionWrapper = ({
  currentQuestion,
  totalQuestions,
  title,
  helpText,
  tipText,
  children,
  isValid,
  onBack,
  onNext,
  nextLabel = "Next"
}: QuestionWrapperProps) => {
  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <AssessmentProgress currentQuestion={currentQuestion} totalQuestions={totalQuestions} />

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            {title}
          </h2>

          {helpText && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">{helpText}</p>
            </div>
          )}

          <div className="mb-6">
            {children}
          </div>

          {tipText && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-primary font-medium">💡 Tip: {tipText}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-border">
            {onBack && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 py-6 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isValid}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold disabled:opacity-50"
            >
              {nextLabel}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionWrapper;
