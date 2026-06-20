"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
          </motion.div>
        </main>
      </>
    );
  }

  const cat = categoryColors[program.category as BenefitCategory];

  // Split headline into words
  const headlineWords = `${program.name} — ${program.full_name}`.split(" ");

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: "40px", paddingBottom: "80px" }}>
        <div className="nc-container" style={{ maxWidth: "1100px" }}>
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
              href={`/browse?category=${program.category}`}
              className="nav-link-animated transition-colors"
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
          </motion.nav>

          <div className="program-detail-layout">
            {/* ═══ Left Content ═══ */}
            <div className="program-detail-main">
              {/* ─── Section 1: Header ─── */}
              <section className="mb-8">
                {/* Category badge */}
                <motion.span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-3"
                  style={{
                    backgroundColor: `${cat?.border}10`,
                    color: cat?.border,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {cat?.emoji} {cat?.label}
                </motion.span>

                {/* H1 — word by word stagger */}
                <h1
                  className="mb-2"
                  style={{ fontSize: "32px", lineHeight: "1.2" }}
                >
                  {headlineWords.map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.3em]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1 + i * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>

                <motion.p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: "var(--nc-body)" }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {program.summary}
                </motion.p>

                {/* Key stats chips — stagger */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    program.application.expedited_available && {
                      text: `⏱ ${program.application.expedited_timeline || "Expedited available"}`,
                    },
                    {
                      text: `📅 Decision: ${program.application.decision_timeline}`,
                    },
                    {
                      text: `🇺🇸 ${
                        program.federal_or_state === "federal"
                          ? "Federal program"
                          : program.federal_or_state === "state"
                          ? "State program"
                          : "Available in all states"
                      }`,
                    },
                  ]
                    .filter((chip): chip is { text: string } => !!chip)
                    .map((chip, i) => (
                      <motion.span
                        key={i}
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs"
                        style={{
                          backgroundColor: "var(--nc-sage-light)",
                          color: "var(--nc-green)",
                          border: "1px solid var(--nc-sage-border)",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + i * 0.08,
                          duration: 0.3,
                        }}
                      >
                        {chip.text}
                      </motion.span>
                    ))}
                </div>

                {/* Disclaimer */}
                <motion.p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--nc-muted)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
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
                </motion.p>
              </section>

              {/* ─── Section 2: Eligibility ─── */}
              <motion.section
                className="mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
              >
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
                      <motion.div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg p-3"
                        style={{
                          backgroundColor: "var(--nc-sage-light)",
                          border: "1px solid var(--nc-sage-border)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* ─── Section 3: What You'll Receive ─── */}
              <motion.section
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
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
              </motion.section>

              {/* ─── Section 4: Step-by-Step Guide ─── */}
              <motion.section
                className="mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4">
                  How to apply for {program.name} — step by step
                </h2>
                <StepGuide steps={program.steps} />
              </motion.section>

              {/* ─── Section 5: Documents ─── */}
              <section className="mb-8">
                <DocumentChecklist
                  documents={program.documents_needed}
                  programName={program.name}
                />
              </section>

              {/* ─── Section 6: FAQs ─── */}
              {program.faqs.length > 0 && (
                <motion.section
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
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
                          <motion.span
                            className="shrink-0 text-sm"
                            style={{ color: "var(--nc-muted)" }}
                            animate={{
                              rotate: expandedFaq === index ? 180 : 0,
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            ▼
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {expandedFaq === index && (
                            <motion.div
                              className="px-5 pb-4"
                              style={{
                                borderTop: "1px solid var(--nc-card-border)",
                              }}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <p
                                className="text-sm leading-relaxed pt-3"
                                style={{ color: "var(--nc-body)" }}
                              >
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ─── Compatible Programs ─── */}
              {program.can_combine_with.length > 0 && (
                <motion.section
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="mb-4">Programs you can combine with {program.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.can_combine_with.map((s) => (
                      <motion.div key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href={`/program/${s}`}
                          className="rounded-full px-4 py-2 text-sm font-medium transition-colors inline-block btn-fill-left"
                          style={{
                            backgroundColor: "var(--nc-sage-light)",
                            color: "var(--nc-green)",
                            border: "1px solid var(--nc-sage-border)",
                          }}
                        >
                          {s.toUpperCase().replace(/-/g, " ")}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* ═══ Right Sidebar ═══ */}
            <motion.aside
              className="program-detail-sidebar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
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

                {/* Apply button with pulsing ring */}
                <motion.a
                  href={program.application.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-pulse mt-5 w-full flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--nc-green)" }}
                  whileHover={{
                    backgroundColor: "#14532D",
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply for {program.name} →
                </motion.a>

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
                    className="btn-fill-left w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      border: "1px solid var(--nc-green)",
                      color: "var(--nc-green)",
                    }}
                  >
                    Ask NaviCare →
                  </Link>
                </div>
              </div>

              {/* Caseworker Card */}
              <motion.div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  border: "1px solid var(--nc-sage-border)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
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
                <motion.a
                  href="https://www.findhelp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--nc-green)" }}
                  whileHover={{
                    backgroundColor: "#14532D",
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Find a Caseworker →
                </motion.a>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </main>
    </>
  );
}
