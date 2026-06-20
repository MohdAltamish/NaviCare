"use client";

interface NumberStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function NumberStepper({
  value,
  min,
  max,
  onChange,
}: NumberStepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Minus button */}
      <button
        type="button"
        onClick={() => !atMin && onChange(value - 1)}
        disabled={atMin}
        className="flex items-center justify-center rounded-full cursor-pointer transition-colors"
        style={{
          width: "44px",
          height: "44px",
          border: atMin
            ? "1px solid var(--nc-card-border)"
            : "1px solid var(--nc-body)",
          color: atMin ? "var(--nc-card-border)" : "var(--nc-body)",
          backgroundColor: "transparent",
          opacity: atMin ? 0.5 : 1,
        }}
        aria-label="Decrease household size"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="8" x2="13" y2="8" />
        </svg>
      </button>

      {/* Number display */}
      <span
        className="text-2xl font-bold text-center"
        style={{
          width: "48px",
          color: "var(--nc-navy)",
        }}
      >
        {value}
      </span>

      {/* Plus button */}
      <button
        type="button"
        onClick={() => !atMax && onChange(value + 1)}
        disabled={atMax}
        className="flex items-center justify-center rounded-full cursor-pointer transition-colors"
        style={{
          width: "44px",
          height: "44px",
          border: atMax
            ? "1px solid var(--nc-card-border)"
            : "1px solid var(--nc-green)",
          color: atMax ? "var(--nc-card-border)" : "var(--nc-green)",
          backgroundColor: "transparent",
          opacity: atMax ? 0.5 : 1,
        }}
        aria-label="Increase household size"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="8" y1="3" x2="8" y2="13" />
          <line x1="3" y1="8" x2="13" y2="8" />
        </svg>
      </button>
    </div>
  );
}
