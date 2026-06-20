"use client";

import React from "react";
import type { ProgramStep } from "@/lib/types";

interface StepGuideProps {
  steps: ProgramStep[];
}

export default function StepGuide({ steps }: StepGuideProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.step_number} className="relative flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            {/* Step circle */}
            <div
              className="flex items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "var(--nc-green)",
              }}
            >
              {step.step_number}
            </div>
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className="flex-1"
                style={{
                  width: "2px",
                  backgroundColor: "var(--nc-sage-border)",
                  minHeight: "24px",
                }}
              />
            )}
          </div>

          {/* Step content */}
          <div className="pb-8 flex-1">
            {/* Title + time estimate */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h4
                className="font-semibold text-base"
                style={{ color: "var(--nc-navy)" }}
              >
                {step.title}
              </h4>
              <span
                className="text-xs rounded-full px-2.5 py-0.5"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  color: "var(--nc-green)",
                  border: "1px solid var(--nc-sage-border)",
                }}
              >
                ⏱ {step.time_estimate}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--nc-body)" }}
            >
              {step.description}
            </p>

            {/* Tips */}
            {step.tips && step.tips.length > 0 && (
              <div
                className="rounded-lg p-3 mb-3"
                style={{
                  backgroundColor: "var(--nc-blue-tint)",
                  border: "1px solid var(--nc-blue-border)",
                }}
              >
                {step.tips.map((tip, i) => (
                  <p
                    key={i}
                    className="text-xs leading-relaxed"
                    style={{ color: "#1D4ED8" }}
                  >
                    💡 {tip}
                  </p>
                ))}
              </div>
            )}

            {/* Action button */}
            {step.action_url && step.action_label && (
              <a
                href={step.action_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "var(--nc-green)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--nc-green-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--nc-green)";
                }}
              >
                {step.action_label}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
