"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/ChatWindow";
import BenefitCard from "@/components/BenefitCard";
import CaseworkerBanner from "@/components/CaseworkerBanner";
import type { UserSummary, ProgramsApiResponse, BenefitCategory } from "@/lib/types";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const [situation, setSituation] = React.useState("");
  const [results, setResults] = React.useState<ProgramsApiResponse | null>(null);
  const [isLoadingResults, setIsLoadingResults] = React.useState(false);
  const [summary, setSummary] = React.useState<UserSummary | null>(null);
  const [showNotQualifying, setShowNotQualifying] = React.useState(false);

  React.useEffect(() => {
    // Get situation from URL params or sessionStorage
    const urlSituation = searchParams.get("situation");
    const storedSituation = sessionStorage.getItem("navicare_situation");

    if (urlSituation) {
      setTimeout(() => {
        setSituation(urlSituation);
      }, 0);
      sessionStorage.setItem("navicare_situation", urlSituation);
    } else if (storedSituation) {
      setTimeout(() => {
        setSituation(storedSituation);
      }, 0);
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
      // Show error in results area
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
        {(isLoadingResults || results) && (
          <div
            className="w-full"
            style={{
              backgroundColor: "var(--nc-sage-light)",
              borderTop: "1px solid var(--nc-sage-border)",
            }}
          >
            <div
              className="nc-container py-10"
              style={{ maxWidth: "720px" }}
            >
              {isLoadingResults ? (
                <div className="flex flex-col items-center justify-center py-12">
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
                    Finding your matching programs...
                  </p>
                </div>
              ) : results && (
                <>
                  {/* Results Header */}
                  <div className="mb-6">
                    <h2 className="mb-2">
                      You may qualify for {results.qualifying.length} program
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
                        {summary.household_size === 1 ? "person" : "people"}
                        {summary.has_children ? " · has children" : ""}
                      </p>
                    )}
                    <p
                      className="text-sm"
                      style={{ color: "var(--nc-muted)" }}
                    >
                      Eligibility must be confirmed at official sources.
                    </p>
                  </div>

                  {/* Qualifying cards */}
                  <div className="space-y-4 mb-8" aria-live="polite">
                    {results.qualifying.map((benefit, index) => (
                      <div
                        key={`q-${index}`}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <BenefitCard
                          program={benefit.program_name}
                          slug={benefit.slug}
                          category={benefit.category as BenefitCategory}
                          reasoning={benefit.reasoning}
                          confidence={benefit.confidence}
                          apply_url={benefit.apply_url}
                          source={benefit.source}
                          qualifies={true}
                        />
                      </div>
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
                          <span
                            style={{
                              transform: showNotQualifying
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                              display: "inline-block",
                            }}
                          >
                            ▶
                          </span>
                          Programs that may not fit your situation (
                          {results.not_qualifying.length})
                        </button>

                        {showNotQualifying && (
                          <div className="space-y-3 animate-slide-down">
                            {results.not_qualifying.map((benefit, index) => (
                              <div
                                key={`nq-${index}`}
                                className="rounded-xl p-4"
                                style={{
                                  backgroundColor: "var(--nc-red-tint)",
                                  border: "1px solid var(--nc-red-border)",
                                }}
                              >
                                <p
                                  className="text-sm font-semibold mb-1"
                                  style={{ color: "var(--nc-muted)" }}
                                >
                                  {benefit.program_name}
                                </p>
                                <p
                                  className="text-xs italic"
                                  style={{ color: "var(--nc-red-text)", opacity: 0.8 }}
                                >
                                  {benefit.reasoning}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  {/* Caseworker banner */}
                  <CaseworkerBanner />

                  {/* Start over */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleStartOver}
                      className="text-sm font-medium cursor-pointer transition-colors"
                      style={{ color: "var(--nc-body)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--nc-green)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--nc-body)";
                      }}
                    >
                      Start a new search
                    </button>
                    <p
                      className="mt-4 text-xs leading-relaxed max-w-lg mx-auto"
                      style={{ color: "var(--nc-muted)" }}
                    >
                      NaviCare uses AI to reason about your situation, but is not
                      a government tool and cannot guarantee eligibility. Always
                      verify with official sources before applying.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="nc-container flex flex-col items-center justify-center text-center" style={{ minHeight: "60vh", paddingTop: "80px" }}>
          <svg className="nc-spinner h-8 w-8 mb-4 animate-spin" viewBox="0 0 24 24" fill="none" style={{ color: "var(--nc-green)" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-base font-medium" style={{ color: "var(--nc-body)" }}>Loading chat navigator...</p>
        </main>
      </>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
