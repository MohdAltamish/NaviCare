"use client";

interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: "var(--nc-navy)" }}>
          Progress
        </span>
        <span className="text-sm" style={{ color: "var(--nc-muted)" }}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: "4px",
          backgroundColor: "var(--nc-card-border)",
        }}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: "var(--nc-green)",
          }}
        />
      </div>
    </div>
  );
}
