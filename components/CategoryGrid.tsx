"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import { programs } from "@/lib/programs-data";

interface CategoryGridProps {
  compact?: boolean;
}

export default function CategoryGrid({ compact = false }: CategoryGridProps) {
  return (
    <div
      className={`grid gap-4 ${
        compact
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {CATEGORIES.map((cat) => {
        const programCount = programs.filter(
          (p) => p.category === cat.id
        ).length;

        return (
          <Link
            key={cat.id}
            href={`/browse?category=${cat.id}`}
            className="group block rounded-xl bg-white transition-all"
            style={{
              border: "1px solid var(--nc-card-border)",
              padding: compact ? "16px" : "24px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cat.accentColor;
              e.currentTarget.style.backgroundColor = "var(--nc-sage-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--nc-card-border)";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            }}
          >
            {/* Emoji circle */}
            <div
              className="flex items-center justify-center rounded-full mb-3"
              style={{
                width: compact ? "40px" : "48px",
                height: compact ? "40px" : "48px",
                backgroundColor: `${cat.accentColor}10`,
                fontSize: compact ? "22px" : "28px",
              }}
            >
              <span aria-hidden="true">{cat.emoji}</span>
            </div>

            {/* Category name */}
            <h3
              className={`font-bold mb-1 ${compact ? "text-sm" : "text-base"}`}
              style={{ color: "var(--nc-navy)" }}
            >
              {cat.name}
            </h3>

            {/* Program count */}
            <p
              className="text-xs mb-2"
              style={{ color: "var(--nc-muted)" }}
            >
              {programCount} program{programCount !== 1 ? "s" : ""}
            </p>

            {/* Browse link */}
            {!compact && (
              <span
                className="text-sm font-semibold transition-colors"
                style={{ color: cat.accentColor }}
              >
                Browse →
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
