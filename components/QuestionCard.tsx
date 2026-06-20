"use client";

import React from "react";
import { type QuestionCard as QuestionCardType } from "@/lib/types";
import { US_STATES } from "@/lib/types";
import NumberStepper from "@/components/NumberStepper";

interface QuestionCardProps {
  question: QuestionCardType;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  const [selectedMulti, setSelectedMulti] = React.useState<string[]>([]);
  const [numberValue, setNumberValue] = React.useState(1);
  const [dropdownValue, setDropdownValue] = React.useState("");

  const handlePillClick = (option: string) => {
    if (disabled) return;
    onAnswer(option);
  };

  const handleYesNo = (answer: string) => {
    if (disabled) return;
    onAnswer(answer);
  };

  const handleMultiToggle = (option: string) => {
    if (disabled) return;
    setSelectedMulti((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleMultiSubmit = () => {
    if (disabled || selectedMulti.length === 0) return;
    onAnswer(selectedMulti.join(", "));
  };

  const handleNumberConfirm = () => {
    if (disabled) return;
    onAnswer(String(numberValue));
  };

  const handleDropdownConfirm = () => {
    if (disabled || !dropdownValue) return;
    onAnswer(dropdownValue);
  };

  return (
    <div
      className="rounded-xl p-4 animate-fade-in-up"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--nc-card-border)",
        borderLeft: "4px solid var(--nc-green)",
      }}
    >
      {/* Question text */}
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: "var(--nc-navy)" }}
      >
        {question.question}
      </p>

      {/* ─── Yes/No ─── */}
      {question.type === "yesno" && (
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleYesNo(opt)}
              disabled={disabled}
              className="flex-1 rounded-lg py-3 text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--nc-sage-light)",
                border: "1px solid var(--nc-sage-border)",
                color: "var(--nc-green)",
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = "var(--nc-green)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = "var(--nc-sage-light)";
                  e.currentTarget.style.color = "var(--nc-green)";
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* ─── Pills (single select) ─── */}
      {question.type === "pills" && question.options && (
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handlePillClick(opt)}
              disabled={disabled}
              className="rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--nc-sage-light)",
                border: "1px solid var(--nc-sage-border)",
                color: "var(--nc-green)",
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = "var(--nc-green)";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = "var(--nc-sage-light)";
                  e.currentTarget.style.color = "var(--nc-green)";
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* ─── Multi-select ─── */}
      {question.type === "multiselect" && question.options && (
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {question.options.map((opt) => {
              const isSelected = selectedMulti.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => handleMultiToggle(opt)}
                  disabled={disabled}
                  className="rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--nc-green)"
                      : "var(--nc-sage-light)",
                    border: `1px solid ${
                      isSelected ? "var(--nc-green)" : "var(--nc-sage-border)"
                    }`,
                    color: isSelected ? "#FFFFFF" : "var(--nc-green)",
                  }}
                >
                  {isSelected ? "✓ " : ""}
                  {opt}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleMultiSubmit}
            disabled={disabled || selectedMulti.length === 0}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--nc-green)" }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ─── Number ─── */}
      {question.type === "number" && (
        <div className="flex items-center gap-4">
          <NumberStepper
            value={numberValue}
            min={1}
            max={10}
            onChange={setNumberValue}
          />
          <button
            onClick={handleNumberConfirm}
            disabled={disabled}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--nc-green)" }}
          >
            Confirm
          </button>
        </div>
      )}

      {/* ─── Dropdown ─── */}
      {question.type === "dropdown" && (
        <div className="flex items-center gap-3">
          <select
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
            disabled={disabled}
            className="flex-1 rounded-lg px-4 text-sm cursor-pointer"
            style={{
              height: "44px",
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--nc-card-border)",
              color: dropdownValue ? "var(--nc-navy)" : "var(--nc-muted)",
            }}
          >
            <option value="" disabled>
              {question.placeholder || "Select..."}
            </option>
            {question.topic === "location"
              ? US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              : question.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
          </select>
          <button
            onClick={handleDropdownConfirm}
            disabled={disabled || !dropdownValue}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--nc-green)" }}
          >
            Confirm
          </button>
        </div>
      )}

      {/* ─── Text (hint — actual input is in the main chat bar) ─── */}
      {question.type === "text" && (
        <p
          className="text-xs italic"
          style={{ color: "var(--nc-muted)" }}
        >
          Type your answer in the chat input below ↓
        </p>
      )}
    </div>
  );
}
