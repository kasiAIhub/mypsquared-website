const stepLabels = [
  'Your details',
  'Child',
  'Circumstances',
  'Learning Plan',
  'Motivation',
  'Review',
];

interface FormProgressProps {
  currentStep: number;
}

export default function FormProgress({ currentStep }: FormProgressProps) {
  const pct = (currentStep / 6) * 100;

  return (
    <div className="w-full mb-6">
      {/* Progress bar — always visible */}
      <div className="relative h-2 bg-gray-200 rounded-full w-full">
        <div
          className="absolute h-2 bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute right-0 -top-5"
          style={{ fontSize: 12, color: '#10B981', fontWeight: 700 }}
        >
          R999 once-off
        </span>
      </div>


      {/* Mobile: "Step X of 6" only */}
      <p className="block sm:hidden text-gray-500 text-sm text-center mt-2">
        Step {currentStep} of 6
      </p>

      {/* Desktop: all step labels */}
      <div className="hidden sm:flex justify-between mt-2">
        {stepLabels.map((label, i) => (
          <span
            key={label}
            className={`text-xs ${
              i + 1 === currentStep
                ? 'text-emerald-600 font-medium'
                : i + 1 < currentStep
                  ? 'text-emerald-500'
                  : 'text-gray-400'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
