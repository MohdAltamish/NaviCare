"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import CategoryGrid from "@/components/CategoryGrid";
import { CATEGORIES, categoryColors, type BenefitCategory } from "@/lib/types";
import { programs } from "@/lib/programs-data";

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const [selectedCategoryState, setSelectedCategoryState] =
    React.useState<string | null>(null);

  const selectedCategory =
    selectedCategoryState !== null ? selectedCategoryState : urlCategory;

  const setSelectedCategory = (cat: string | null) => {
    setSelectedCategoryState(cat);
  };

  const filteredPrograms = selectedCategory
    ? programs.filter((p) => p.category === selectedCategory)
    : programs;

  const currentCat = CATEGORIES.find((c) => c.id === selectedCategory);

  // No category selected — show full grid
  if (!selectedCategory) {
    return (
      <>
        <Navbar />
        <main className="nc-section">
          <div className="nc-container">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="nc-eyebrow mb-3">BROWSE PROGRAMS</p>
              <h1 className="mb-3">What do you need help with?</h1>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: "var(--nc-body)" }}
              >
                Select a category to see programs in that area, or{" "}
                <Link
                  href="/chat"
                  className="font-semibold"
                  style={{ color: "var(--nc-green)" }}
                >
                  describe your situation
                </Link>{" "}
                for personalized results.
              </p>
            </motion.div>
            <CategoryGrid />
          </div>
        </main>
      </>
    );
  }

  // Category selected — show filtered programs
  return (
    <>
      <Navbar />

      <main className="nc-section" style={{ paddingTop: "40px" }}>
        <div className="nc-container">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-sm mb-6 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="nav-link-animated transition-colors"
              style={{ color: "var(--nc-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--nc-green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--nc-muted)";
              }}
            >
              Home
            </Link>
            <span style={{ color: "var(--nc-muted)" }}>›</span>
            <Link
              href="/browse"
              className="nav-link-animated transition-colors"
              style={{ color: "var(--nc-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--nc-green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--nc-muted)";
              }}
            >
              Browse
            </Link>
            <span style={{ color: "var(--nc-muted)" }}>›</span>
            <span
              style={{ color: "var(--nc-navy)" }}
              className="font-medium"
            >
              {currentCat?.name}
            </span>
          </motion.nav>

          <div className="browse-layout">
            {/* ─── Sidebar ─── */}
            <motion.aside
              className="browse-sidebar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Category pills */}
              <div className="mb-6">
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "var(--nc-muted)" }}
                >
                  Filter by category
                </p>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = cat.id === selectedCategory;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="relative w-full text-left rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-all"
                        style={{
                          backgroundColor: "transparent",
                          color: isActive
                            ? "#FFFFFF"
                            : "var(--nc-body)",
                          zIndex: 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              "var(--nc-sage-light)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        {/* Animated active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="active-category"
                            className="absolute inset-0 rounded-lg"
                            style={{
                              backgroundColor: "var(--nc-green)",
                              zIndex: -1,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                        {cat.emoji} {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Describe situation link */}
              <motion.div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  border: "1px solid var(--nc-sage-border)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--nc-navy)" }}
                >
                  Not sure what you need?
                </p>
                <p
                  className="text-xs mb-3"
                  style={{ color: "var(--nc-body)" }}
                >
                  Describe your situation and let NaviCare find the right
                  programs for you.
                </p>
                <Link
                  href="/chat"
                  className="inline-flex items-center text-sm font-semibold"
                  style={{ color: "var(--nc-green)" }}
                >
                  Describe your situation →
                </Link>
              </motion.div>
            </motion.aside>

            {/* ─── Content ─── */}
            <div className="browse-content">
              {/* Header */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="mb-1">
                  {currentCat?.emoji} {currentCat?.name} Programs
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--nc-muted)" }}
                >
                  {filteredPrograms.length} program
                  {filteredPrograms.length !== 1 ? "s" : ""} available ·
                  Showing federal + state programs
                </p>
              </motion.div>

              {/* Program cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPrograms.map((program, index) => {
                    const cat =
                      categoryColors[
                        program.category as BenefitCategory
                      ];
                    return (
                      <motion.div
                        key={program.slug}
                        className="rounded-xl p-6 bg-white benefit-card-hover group"
                        style={{
                          border: "1px solid var(--nc-card-border)",
                          borderLeft: `4px solid ${
                            cat?.border || "var(--nc-green)"
                          }`,
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        data-cursor-card
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${
                                cat?.border || "var(--nc-green)"
                              }10`,
                              color:
                                cat?.border || "var(--nc-green)",
                            }}
                          >
                            {
                              categoryColors[
                                program.category as BenefitCategory
                              ]?.emoji
                            }{" "}
                            {cat?.label}
                          </span>
                          <span
                            className="text-xs rounded-full px-2.5 py-0.5"
                            style={{
                              backgroundColor: "var(--nc-bg)",
                              color: "var(--nc-muted)",
                              border:
                                "1px solid var(--nc-card-border)",
                            }}
                          >
                            {program.federal_or_state === "federal"
                              ? "Federal Program"
                              : program.federal_or_state === "state"
                              ? "State Program"
                              : "Federal + State"}
                          </span>
                        </div>

                        {/* Program name */}
                        <h3
                          className="text-lg font-bold mb-1"
                          style={{ color: "var(--nc-navy)" }}
                        >
                          {program.name} — {program.full_name}
                        </h3>

                        {/* Summary */}
                        <p
                          className="text-sm mb-3"
                          style={{ color: "var(--nc-body)" }}
                        >
                          {program.summary}
                        </p>

                        {/* Income threshold chip */}
                        {program.eligibility.income_limits.length >
                          0 && (
                          <div
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-4"
                            style={{
                              backgroundColor:
                                "var(--nc-sage-light)",
                              color: "var(--nc-green)",
                              border:
                                "1px solid var(--nc-sage-border)",
                            }}
                          >
                            💰 Up to $
                            {program.eligibility.income_limits[
                              Math.min(
                                2,
                                program.eligibility.income_limits
                                  .length - 1
                              )
                            ].gross_monthly.toLocaleString()}
                            /mo for family of{" "}
                            {
                              program.eligibility.income_limits[
                                Math.min(
                                  2,
                                  program.eligibility.income_limits
                                    .length - 1
                                )
                              ].household_size
                            }
                          </div>
                        )}

                        {/* Bottom row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <Link
                            href={`/program/${program.slug}`}
                            className="text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                            style={{ color: "var(--nc-green)" }}
                          >
                            📄 See full guide
                            <span className="inline-block transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                          <a
                            href={program.application.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-fill-left inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                            style={{
                              border: "1px solid var(--nc-green)",
                              color: "var(--nc-green)",
                            }}
                          >
                            Apply Now →
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Bottom CTA */}
              <motion.div
                className="mt-8 text-center rounded-xl p-6"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  border: "1px solid var(--nc-sage-border)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <p
                  className="text-sm mb-2"
                  style={{ color: "var(--nc-body)" }}
                >
                  Can&apos;t find what you need?
                </p>
                <Link
                  href="/chat"
                  className="text-sm font-semibold"
                  style={{ color: "var(--nc-green)" }}
                >
                  Describe your situation for personalized results →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main
            className="nc-container flex flex-col items-center justify-center text-center"
            style={{ minHeight: "60vh", paddingTop: "80px" }}
          >
            <svg
              className="nc-spinner h-8 w-8 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "var(--nc-green)" }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.3"
              />
              <path
                d="M12 2a10 10 0 019.95 9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p
              className="text-base font-medium"
              style={{ color: "var(--nc-body)" }}
            >
              Loading programs...
            </p>
          </main>
        </>
      }
    >
      <BrowsePageContent />
    </Suspense>
  );
}
