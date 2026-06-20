"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/ChatWindow";
import BenefitCard from "@/components/BenefitCard";
import CaseworkerBanner from "@/components/CaseworkerBanner";
import type { UserSummary, ProgramsApiResponse, BenefitCategory } from "@/lib/types";

// Skeleton card for loading
function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        border: "1px solid var(--nc-card-border)",
        borderLeft: "4px solid var(--nc-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton" style={{ width: 100, height: 16 }} />
        <div className="skeleton" style={{ width: 80, height: 20 }} />
      </div>
      <div className="skeleton mb-2" style={{ width: "70%", height: 22 }} />
      <div className="skeleton mb-4" style={{ width: "100%", height: 40 }} />
      <div className="flex items-center justify-between">
        <div className="skeleton" style={{ width: 100, height: 16 }} />
        <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 8 }} />
      </div>
    </div>
  );
}

// CountUp for results number
function CountUp({ target }: { target: number }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = target / (600 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

function ChatPageContent() {
  const searchParams = useSearchParams();
  const [situation, setSituation] = React.useState("");
  const [results, setResults] = React.useState<ProgramsApiResponse | null>(null);
  const [isLoadingResults, setIsLoadingResults] = React.useState(false);
  const [summary, setSummary] = React.useState<UserSummary | null>(null);
  const [showNotQualifying, setShowNotQualifying] = React.useState(false);

  React.useEffect(() => {
    const urlSituation = searchParams.get("situation");
    const storedSituation = sessionStorage.getItem("navicare_situation");

    if (urlSituation) {
      setTimeout(() => setSituation(urlSituation), 0);
      sessionStorage.setItem("navicare_situation", urlSituation);
    } else if (storedSituation) {
      setTimeout(() => setSituation(storedSituation), 0);
    }
  }, [searchParams]);

  const handleResultsReady = async (userSummary: UserSummary) => {
    setSummary(userSummary);
    setIsLoadingResults(true);

    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: userSummary }),
      });

      if (!response.ok) throw new Error("Failed to fetch programs");

      const data = await response.json();
      setResults(data);
    } catch {
      setResults({ qualifying: [], not_qualifying: [] });
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleStartOver = () => {
    sessionStorage.removeItem("navicare_situation");
    window.location.href = "/";
  };

  if (!situation) {
    return (
      <>
        <Navbar />
        <main
          className="nc-container flex flex-col items-center justify-center text-center"
          style={{ minHeight: "60vh", paddingTop: "80px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4">Tell us your situation first</h2>
            <p className="text-base mb-6" style={{ color: "var(--nc-body)" }}>
              Go back to the home page and describe your situation to get started.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--nc-green)" }}
            >
              ← Go to Home
            </Link>
          </motion.div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: "16px" }}>
        {/* Chat Window */}
        <ChatWindow situation={situation} onResultsReady={handleResultsReady} />

        {/* ─── Results Section (appears when ready) ─── */}
        <AnimatePresence>
          {(isLoadingResults || results) && (
            <motion.div
              className="w-full"
              style={{
                backgroundColor: "var(--nc-sage-light)",
                borderTop: "1px solid var(--nc-sage-border)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                className="nc-container py-10"
                style={{ maxWidth: "720px" }}
              >
                {isLoadingResults ? (
                  <div className="space-y-4">
                    <motion.p
                      className="text-base font-medium mb-6"
                      style={{ color: "var(--nc-body)" }}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      Based on our conversation, here&apos;s what we found:
                    </motion.p>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                      >
                        <SkeletonCard />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  results && (
                    <>
                      {/* Results Header */}
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h2 className="mb-2">
                          You may qualify for{" "}
                          <CountUp target={results.qualifying.length} />{" "}
                          program
                          {results.qualifying.length !== 1 ? "s" : ""}
                        </h2>
                        {summary && (
                          <p
                            className="text-sm mb-1"
                            style={{ color: "var(--nc-body)" }}
                          >
                            Based on:{" "}
                            <strong style={{ color: "var(--nc-navy)" }}>
                              {summary.state}
                            </strong>{" "}
                            · {summary.income_range} · {summary.household_size}{" "}
                            {summary.household_size === 1
                              ? "person"
                              : "people"}
                            {summary.has_children ? " · has children" : ""}
                          </p>
                        )}
                        <p
                          className="text-sm"
                          style={{ color: "var(--nc-muted)" }}
                        >
                          Eligibility must be confirmed at official sources.
                        </p>
                      </motion.div>

                      {/* Qualifying cards */}
                      <div className="space-y-4 mb-8" aria-live="polite">
                        {results.qualifying.map((benefit, index) => (
                          <motion.div
                            key={`q-${index}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.3 + index * 0.12,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                          >
                            <BenefitCard
                              program={benefit.program_name}
                              slug={benefit.slug}
                              category={
                                benefit.category as BenefitCategory
                              }
                              reasoning={benefit.reasoning}
                              confidence={benefit.confidence}
                              apply_url={benefit.apply_url}
                              source={benefit.source}
                              qualifies={true}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Not qualifying section */}
                      {results.not_qualifying &&
                        results.not_qualifying.length > 0 && (
                          <div className="mb-8">
                            <button
                              onClick={() =>
                                setShowNotQualifying(!showNotQualifying)
                              }
                              className="flex items-center gap-2 text-sm font-semibold cursor-pointer mb-3"
                              style={{ color: "var(--nc-muted)" }}
                            >
                              <motion.span
                                animate={{
                                  rotate: showNotQualifying ? 90 : 0,
                                }}
                                transition={{ duration: 0.25 }}
                                style={{ display: "inline-block" }}
                              >
                                ▶
                              </motion.span>
                              Programs that may not fit your situation (
                              {results.not_qualifying.length})
                            </button>

                            <AnimatePresence>
                              {showNotQualifying && (
                                <motion.div
                                  className="space-y-3"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {results.not_qualifying.map(
                                    (benefit, index) => (
                                      <motion.div
                                        key={`nq-${index}`}
                                        className="rounded-xl p-4"
                                        style={{
                                          backgroundColor:
                                            "var(--nc-red-tint)",
                                          border:
                                            "1px solid var(--nc-red-border)",
                                        }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: index * 0.05,
                                          duration: 0.3,
                                        }}
                                      >
                                        <p
                                          className="text-sm font-semibold mb-1"
                                          style={{
                                            color: "var(--nc-muted)",
                                          }}
                                        >
                                          {benefit.program_name}
                                        </p>
                                        <p
                                          className="text-xs italic"
                                          style={{
                                            color: "var(--nc-red-text)",
                                            opacity: 0.8,
                                          }}
                                        >
                                          {benefit.reasoning}
                                        </p>
                                      </motion.div>
                                    )
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                      {/* Caseworker banner */}
                      <CaseworkerBanner />

                      {/* Start over */}
                      <div className="mt-8 text-center">
                        <motion.button
                          onClick={handleStartOver}
                          className="text-sm font-medium cursor-pointer"
                          style={{ color: "var(--nc-body)" }}
                          whileHover={{ color: "#166534" }}
                        >
                          Start a new search
                        </motion.button>
                        <p
                          className="mt-4 text-xs leading-relaxed max-w-lg mx-auto"
                          style={{ color: "var(--nc-muted)" }}
                        >
                          NaviCare uses AI to reason about your situation, but
                          is not a government tool and cannot guarantee
                          eligibility. Always verify with official sources
                          before applying.
                        </p>
                      </div>
                    </>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default function ChatPage() {
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
              Loading chat navigator...
            </p>
          </main>
        </>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
