"use client";

import React, { useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { CATEGORIES } from "@/lib/types";
import { programs } from "@/lib/programs-data";

interface CategoryGridProps {
  compact?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

function MagneticCard({
  children,
  className,
  style,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    gsap.to(cardRef.current, { x, y, duration: 0.4, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-card
    >
      {children}
    </Link>
  );
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
      {CATEGORIES.map((cat, index) => {
        const programCount = programs.filter(
          (p) => p.category === cat.id
        ).length;

        return (
          <motion.div
            key={cat.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <MagneticCard
              href={`/browse?category=${cat.id}`}
              className="group block rounded-xl bg-white will-change-transform"
              style={{
                border: "1px solid var(--nc-card-border)",
                padding: compact ? "16px" : "24px",
                transition:
                  "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              {/* Emoji circle */}
              <div
                className="flex items-center justify-center rounded-full mb-3 transition-transform"
                style={{
                  width: compact ? "40px" : "48px",
                  height: compact ? "40px" : "48px",
                  backgroundColor: `${cat.accentColor}10`,
                  fontSize: compact ? "22px" : "28px",
                  transition:
                    "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="group-hover:scale-110 group-hover:rotate-[10deg] inline-block transition-transform"
                  style={{
                    transition:
                      "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {cat.emoji}
                </span>
              </div>

              {/* Category name */}
              <h3
                className={`font-bold mb-1 ${
                  compact ? "text-sm" : "text-base"
                }`}
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
                  className="text-sm font-semibold inline-flex items-center gap-1"
                  style={{ color: cat.accentColor }}
                >
                  Browse{" "}
                  <span
                    className="inline-block transition-transform group-hover:translate-x-1"
                    style={{
                      transition:
                        "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    →
                  </span>
                </span>
              )}
            </MagneticCard>
          </motion.div>
        );
      })}
    </div>
  );
}
