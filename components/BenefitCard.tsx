"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);

  if (!qualifies) {
    // ─── May Not Qualify Card ───
    return (
      <motion.div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--nc-red-tint)",
          border: "1px solid var(--nc-red-border)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
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
      </motion.div>
    );
  }

  // ─── Qualifying Card ───
  return (
    <motion.div
      className="rounded-xl p-6 bg-white benefit-card-hover group"
      style={{
        border: "1px solid var(--nc-card-border)",
        borderLeft: `4px solid ${cat.border}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      data-cursor-card
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

      {/* AI reasoning — truncate to 1 line, expand on hover */}
      <p
        className="text-sm italic leading-relaxed mb-4"
        style={{
          color: "var(--nc-body)",
          display: "-webkit-box",
          WebkitLineClamp: isHovered ? 999 : 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        {reasoning}
      </p>

      {/* Bottom row: chip + apply link */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Confidence badge with pulse */}
        <motion.span
          className="text-xs rounded-full px-2.5 py-1 font-medium"
          style={{
            backgroundColor:
              confidence === "likely"
                ? "var(--nc-sage-light)"
                : confidence === "possible"
                ? "#FFFBEB"
                : "#FEF3C7",
            color:
              confidence === "likely"
                ? "var(--nc-green)"
                : confidence === "possible"
                ? "#B45309"
                : "#92400E",
            border: `1px solid ${
              confidence === "likely"
                ? "var(--nc-sage-border)"
                : confidence === "possible"
                ? "#FDE68A"
                : "#FCD34D"
            }`,
          }}
          initial={{ scale: 1 }}
          whileInView={{
            animation:
              confidence === "likely"
                ? "badge-pulse-green 1s ease-in-out 1"
                : confidence === "borderline"
                ? "badge-pulse-amber 1s ease-in-out 1"
                : "none",
          }}
          viewport={{ once: true }}
        >
          {confidence === "likely"
            ? "✓ Likely qualifies"
            : confidence === "possible"
            ? "Possibly qualifies"
            : "⚠ Borderline — check eligibility"}
        </motion.span>

        <div className="flex items-center gap-4">
          {slug && (
            <Link
              href={`/program/${slug}`}
              className="text-sm font-semibold inline-flex items-center gap-1 transition-colors"
              style={{ color: "var(--nc-green)" }}
            >
              📄 See full guide
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                style={{
                  transition:
                    "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                →
              </span>
            </Link>
          )}
          <a
            href={apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fill-left inline-flex items-center text-sm font-bold rounded-lg px-3 py-1.5"
            style={{
              color: "var(--nc-green)",
              border: "1px solid var(--nc-green)",
            }}
          >
            Apply Now →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
