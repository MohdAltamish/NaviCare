"use client";

import Link from "next/link";
import { type BenefitCategory, categoryColors } from "@/lib/types";

interface BenefitCardProps {
  program: string;
  category: BenefitCategory;
  reasoning: string;
  confidence: "likely" | "possible" | "borderline";
  apply_url: string;
  source: string;
  qualifies: boolean;
  slug?: string;
}

export default function BenefitCard({
  program,
  category,
  reasoning,
  confidence,
  apply_url,
  source,
  qualifies,
  slug,
}: BenefitCardProps) {
  const cat = categoryColors[category] || categoryColors.food;

  if (!qualifies) {
    // ─── May Not Qualify Card ───
    return (
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--nc-red-tint)",
          border: "1px solid var(--nc-red-border)",
        }}
      >
        {/* Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--nc-red-tint)",
              color: "var(--nc-red-text)",
              border: "1px solid var(--nc-red-border)",
            }}
          >
            May Not Qualify
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--nc-muted)" }}
          >
            via {source} ↗
          </span>
        </div>

        {/* Program Name */}
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--nc-muted)" }}
        >
          {program}
        </h3>

        {/* Reasoning */}
        <p
          className="text-sm italic leading-relaxed"
          style={{ color: "var(--nc-red-text)", opacity: 0.8 }}
        >
          {reasoning}
        </p>
      </div>
    );
  }

  // ─── Qualifying Card ───
  return (
    <div
      className="rounded-xl p-6 bg-white transition-colors group"
      style={{
        border: "1px solid var(--nc-card-border)",
        borderLeft: `4px solid ${cat.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = cat.border;
        e.currentTarget.style.borderLeftColor = cat.border;
        e.currentTarget.style.backgroundColor = "var(--nc-sage-light)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--nc-card-border)";
        e.currentTarget.style.borderLeftColor = cat.border;
        e.currentTarget.style.backgroundColor = "#FFFFFF";
      }}
    >
      {/* Top row: category + source */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: cat.dot }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--nc-muted)" }}
          >
            {cat.label}
          </span>
        </div>
        <a
          href={apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: "var(--nc-blue-tint)",
            color: "#1D4ED8",
          }}
        >
          via {source} ↗
        </a>
      </div>

      {/* Program name */}
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--nc-navy)" }}
      >
        {program}
      </h3>

      {/* AI reasoning */}
      <p
        className="text-sm italic leading-relaxed mb-4"
        style={{ color: "var(--nc-body)" }}
      >
        {reasoning}
      </p>

      {/* Bottom row: chip + apply link */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span
          className="text-xs"
          style={{ color: "var(--nc-muted)" }}
        >
          {confidence === "likely"
            ? "Likely qualifies"
            : confidence === "possible"
            ? "Possibly qualifies"
            : "Borderline — check eligibility"}
        </span>
        <div className="flex items-center gap-4">
          {slug && (
            <Link
              href={`/program/${slug}`}
              className="text-sm font-semibold transition-colors"
              style={{ color: "var(--nc-green)" }}
            >
              📄 See full guide →
            </Link>
          )}
          <a
            href={apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-bold hover:underline"
            style={{ color: "var(--nc-green)" }}
          >
            Apply Now →
          </a>
        </div>
      </div>
    </div>
  );
}
