"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StepGuide from "@/components/StepGuide";
import DocumentChecklist from "@/components/DocumentChecklist";
import { getProgramBySlug } from "@/lib/programs-data";
import { categoryColors, type BenefitCategory } from "@/lib/types";

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const program = getProgramBySlug(slug);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  if (!program) {
    return (
      <>
        <Navbar />
        <main
          className="nc-container flex flex-col items-center justify-center text-center"
          style={{ minHeight: "60vh", paddingTop: "80px" }}
        >
          <h2 className="mb-4">Program not found</h2>
          <p className="text-base mb-6" style={{ color: "var(--nc-body)" }}>
            The program &ldquo;{slug}&rdquo; doesn&apos;t exist in our database.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--nc-green)" }}
          >
            Browse All Programs →
          </Link>
        </main>
      </>
    );
  }

  const cat = categoryColors[program.category as BenefitCategory];

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: "40px", paddingBottom: "80px" }}>
        <div className="nc-container" style={{ maxWidth: "1100px" }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <Link
              href="/"
              className="transition-colors"
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
              href={`/browse?category=${program.category}`}
              className="transition-colors"
              style={{ color: "var(--nc-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--nc-green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--nc-muted)";
              }}
            >
              {cat?.label}
            </Link>
            <span style={{ color: "var(--nc-muted)" }}>›</span>
            <span style={{ color: "var(--nc-navy)" }} className="font-medium">
              {program.name}
            </span>
          </nav>

          <div className="program-detail-layout">
            {/* ═══ Left Content ═══ */}
            <div className="program-detail-main">
              {/* ─── Section 1: Header ─── */}
              <section className="mb-8">
                {/* Category badge */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-3"
                  style={{
                    backgroundColor: `${cat?.border}10`,
                    color: cat?.border,
                  }}
                >
                  {cat?.emoji} {cat?.label}
                </span>

                <h1
                  className="mb-2"
                  style={{ fontSize: "32px", lineHeight: "1.2" }}
                >
                  {program.name} — {program.full_name}
                </h1>

                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: "var(--nc-body)" }}
                >
                  {program.summary}
                </p>

                {/* Key stats */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.application.expedited_available && (
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs"
                      style={{
                        backgroundColor: "var(--nc-sage-light)",
                        color: "var(--nc-green)",
                        border: "1px solid var(--nc-sage-border)",
                      }}
                    >
                      ⏱ {program.application.expedited_timeline || "Expedited available"}
                    </span>
                  )}
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: "var(--nc-sage-light)",
                      color: "var(--nc-green)",
                      border: "1px solid var(--nc-sage-border)",
                    }}
                  >
                    📅 Decision: {program.application.decision_timeline}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: "var(--nc-sage-light)",
                      color: "var(--nc-green)",
                      border: "1px solid var(--nc-sage-border)",
                    }}
                  >
                    🇺🇸{" "}
                    {program.federal_or_state === "federal"
                      ? "Federal program"
                      : program.federal_or_state === "state"
                      ? "State program"
                      : "Available in all states"}
                  </span>
                </div>

                {/* Disclaimer */}
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--nc-muted)" }}
                >
                  NaviCare summarizes public program information. Rules may vary
                  by state and change over time. Always verify at the{" "}
                  <a
                    href={program.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--nc-green)" }}
                  >
                    official source
                  </a>
                  . Last updated: {program.last_updated}
                </p>
              </section>

              {/* ─── Section 2: Eligibility ─── */}
              <section className="mb-8">
                <h2 className="mb-4">Who qualifies for {program.name}?</h2>

                {/* Income limits table */}
                {program.eligibility.income_limits.length > 0 && (
                  <div
                    className="rounded-xl overflow-hidden mb-6"
                    style={{ border: "1px solid var(--nc-card-border)" }}
                  >
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: "var(--nc-sage-light)" }}>
                          <th
                            className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--nc-muted)" }}
                          >
                            Household Size
                          </th>
                          <th
                            className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--nc-muted)" }}
                          >
                            Gross Monthly Income Limit
                          </th>
                          <th
                            className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--nc-muted)" }}
                          >
                            Net Monthly Income Limit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {program.eligibility.income_limits.map((limit) => (
                          <tr
                            key={limit.household_size}
                            className="border-t"
                            style={{ borderColor: "var(--nc-card-border)" }}
                          >
                            <td
                              className="px-4 py-3 text-sm font-medium"
                              style={{ color: "var(--nc-navy)" }}
                            >
                              {limit.household_size}{" "}
                              {limit.household_size === 1
                                ? "person"
                                : "people"}
                            </td>
                            <td
                              className="px-4 py-3 text-sm"
                              style={{ color: "var(--nc-body)" }}
                            >
                              ${limit.gross_monthly.toLocaleString()}/mo
                            </td>
                            <td
                              className="px-4 py-3 text-sm"
                              style={{ color: "var(--nc-body)" }}
                            >
                              ${limit.net_monthly.toLocaleString()}/mo
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      className="px-4 py-2 text-xs"
                      style={{
                        backgroundColor: "var(--nc-bg)",
                        color: "var(--nc-muted)",
                      }}
                    >
                      Source:{" "}
                      <a
                        href={program.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--nc-green)" }}
                      >
                        {program.source_url.replace("https://www.", "").split("/")[0]}
                      </a>
                    </div>
                  </div>
                )}

                {/* Special notes */}
                {program.eligibility.special_notes.length > 0 && (
                  <div className="space-y-3">
                    {program.eligibility.special_notes.map((note, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg p-3"
                        style={{
                          backgroundColor: "var(--nc-sage-light)",
                          border: "1px solid var(--nc-sage-border)",
                        }}
                      >
                        <span
                          className="shrink-0 mt-0.5"
                          style={{ color: "var(--nc-green)" }}
                        >
                          ✓
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--nc-body)" }}
                        >
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ─── Section 3: What You'll Receive ─── */}
              <section className="mb-8">
                <h2 className="mb-4">What {program.name} provides</h2>
                <div
                  className="rounded-xl p-5"
                  style={{
                    backgroundColor: "var(--nc-sage-light)",
                    border: "1px solid var(--nc-sage-border)",
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--nc-navy)" }}>
                        Benefit type:
                      </span>
                      <span className="text-sm" style={{ color: "var(--nc-body)" }}>
                        {program.benefit.type}
                      </span>
                    </div>
                    {program.benefit.average_amount && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: "var(--nc-navy)" }}>
                          Average amount:
                        </span>
                        <span className="text-sm" style={{ color: "var(--nc-body)" }}>
                          {program.benefit.average_amount}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--nc-navy)" }}>
                        Duration:
                      </span>
                      <span className="text-sm" style={{ color: "var(--nc-body)" }}>
                        {program.benefit.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ─── Section 4: Step-by-Step Guide ─── */}
              <section className="mb-8">
                <h2 className="mb-4">
                  How to apply for {program.name} — step by step
                </h2>
                <StepGuide steps={program.steps} />
              </section>

              {/* ─── Section 5: Documents ─── */}
              <section className="mb-8">
                <DocumentChecklist
                  documents={program.documents_needed}
                  programName={program.name}
                />
              </section>

              {/* ─── Section 6: FAQs ─── */}
              {program.faqs.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4">Frequently asked questions</h2>
                  <div className="space-y-2">
                    {program.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="rounded-xl overflow-hidden"
                        style={{
                          border: "1px solid var(--nc-card-border)",
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(
                              expandedFaq === index ? null : index
                            )
                          }
                          className="w-full text-left px-5 py-4 flex items-center justify-between cursor-pointer"
                          aria-expanded={expandedFaq === index}
                        >
                          <span
                            className="text-sm font-semibold pr-4"
                            style={{ color: "var(--nc-navy)" }}
                          >
                            {faq.question}
                          </span>
                          <span
                            className="shrink-0 text-sm transition-transform"
                            style={{
                              color: "var(--nc-muted)",
                              transform:
                                expandedFaq === index
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                            }}
                          >
                            ▼
                          </span>
                        </button>
                        {expandedFaq === index && (
                          <div
                            className="px-5 pb-4 animate-slide-down"
                            style={{
                              borderTop: "1px solid var(--nc-card-border)",
                            }}
                          >
                            <p
                              className="text-sm leading-relaxed pt-3"
                              style={{ color: "var(--nc-body)" }}
                            >
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ─── Compatible Programs ─── */}
              {program.can_combine_with.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4">Programs you can combine with {program.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.can_combine_with.map((slug) => (
                      <Link
                        key={slug}
                        href={`/program/${slug}`}
                        className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: "var(--nc-sage-light)",
                          color: "var(--nc-green)",
                          border: "1px solid var(--nc-sage-border)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--nc-green)";
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--nc-sage-light)";
                          e.currentTarget.style.color = "var(--nc-green)";
                        }}
                      >
                        {slug.toUpperCase().replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ═══ Right Sidebar ═══ */}
            <aside className="program-detail-sidebar">
              {/* Quick Facts Card */}
              <div
                className="rounded-xl p-5 mb-4 sticky-sidebar-card"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--nc-card-border)",
                }}
              >
                <h3
                  className="text-base font-bold mb-4"
                  style={{ color: "var(--nc-navy)" }}
                >
                  Quick Facts
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Program type",
                      value:
                        program.federal_or_state === "federal"
                          ? "Federal"
                          : program.federal_or_state === "state"
                          ? "State"
                          : "Federal + State",
                    },
                    { label: "Benefit type", value: program.benefit.type },
                    {
                      label: "Avg. benefit",
                      value: program.benefit.average_amount || "Varies",
                    },
                    {
                      label: "Decision time",
                      value: program.application.decision_timeline,
                    },
                    { label: "Duration", value: program.benefit.duration },
                    {
                      label: "Apply online",
                      value: program.application.can_apply_online
                        ? "Yes"
                        : "In person",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-2"
                    >
                      <span
                        className="text-xs"
                        style={{ color: "var(--nc-muted)" }}
                      >
                        {row.label}
                      </span>
                      <span
                        className="text-xs font-medium text-right"
                        style={{ color: "var(--nc-navy)" }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Apply button */}
                <a
                  href={program.application.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "var(--nc-green)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--nc-green-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--nc-green)";
                  }}
                >
                  Apply for {program.name} →
                </a>

                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: "1px solid var(--nc-card-border)" }}
                >
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--nc-muted)" }}
                  >
                    Not sure if you qualify?
                  </p>
                  <Link
                    href={`/chat?situation=I want to know if I qualify for ${program.name}`}
                    className="w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      border: "1px solid var(--nc-green)",
                      color: "var(--nc-green)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--nc-green)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--nc-green)";
                    }}
                  >
                    Ask NaviCare →
                  </Link>
                </div>
              </div>

              {/* Caseworker Card */}
              <div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  border: "1px solid var(--nc-sage-border)",
                }}
              >
                <h3
                  className="text-base font-bold mb-1"
                  style={{ color: "var(--nc-navy)" }}
                >
                  Get help applying
                </h3>
                <p
                  className="text-xs mb-3 leading-relaxed"
                  style={{ color: "var(--nc-body)" }}
                >
                  A local caseworker can help you apply for free — and can tell
                  you if you qualify before you submit.
                </p>
                <a
                  href="https://www.findhelp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "var(--nc-green)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--nc-green-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--nc-green)";
                  }}
                >
                  Find a Caseworker →
                </a>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
