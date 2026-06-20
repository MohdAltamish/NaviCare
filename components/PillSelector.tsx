"use client";

interface PillSelectorProps {
  options: { label: string; value: string }[];
  selected: string | null;
  onChange: (value: string) => void;
}

export default function PillSelector({
  options,
  selected,
  onChange,
}: PillSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="rounded-lg px-4 font-medium text-sm transition-colors cursor-pointer"
            style={{
              height: "44px",
              backgroundColor: isSelected ? "var(--nc-green)" : "#FFFFFF",
              color: isSelected ? "#FFFFFF" : "var(--nc-body)",
              border: isSelected
                ? "1px solid var(--nc-green)"
                : "1px solid var(--nc-card-border)",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "var(--nc-sage-light)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }
            }}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
