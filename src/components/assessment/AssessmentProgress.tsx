import { motion } from "framer-motion";

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const AssessmentProgress = ({ currentQuestion, totalQuestions }: AssessmentProgressProps) => {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-primary">
          {percentage}% Complete
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default AssessmentProgress;
