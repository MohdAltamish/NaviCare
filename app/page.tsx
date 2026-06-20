"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TrustBadges from "@/components/TrustBadges";
import QuickTopicPills from "@/components/QuickTopicPills";
import CategoryGrid from "@/components/CategoryGrid";

export default function LandingPage() {
  const router = useRouter();
  const [situation, setSituation] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleQuickTopic = (text: string) => {
    setSituation(text);
    textareaRef.current?.focus();
    // Scroll to hero
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;

    // Store in sessionStorage
    sessionStorage.setItem("navicare_situation", situation.trim());

    // Navigate to /chat
    router.push("/chat");
  };

  return (
    <>
      <Navbar />

      <main>
        {/* ─── Section 1: Hero ─── */}
        <section
          id="hero"
          className="nc-section"
          style={{ paddingTop: "100px", paddingBottom: "100px" }}
        >
          <div className="nc-container flex flex-col items-center text-center">
            {/* Eyebrow */}
            <p className="nc-eyebrow mb-4">FREE · NO SIGNUP · PRIVATE</p>

            {/* Headline */}
            <h1 className="mb-5 max-w-2xl">
              Find out what help you qualify for.
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg max-w-xl mx-auto mb-8 leading-relaxed"
              style={{ color: "var(--nc-body)" }}
            >
              Millions of Americans miss out on food, healthcare, and housing
              support every year — not because they don&apos;t need it, but because
              the system is too confusing. NaviCare fixes that.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <textarea
                ref={textareaRef}
                id="situation-input"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Describe your situation... e.g. I lost my job, I have 2 kids, and I can't pay rent"
                rows={5}
                className="w-full resize-none rounded-xl px-4 py-4 text-base"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--nc-card-border)",
                  color: "var(--nc-navy)",
                  minHeight: "120px",
                }}
              />

              <button
                id="submit-situation"
                type="submit"
                disabled={!situation.trim()}
                className="mt-4 w-full rounded-lg font-semibold text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--nc-green)",
                  height: "52px",
                  fontSize: "15px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--nc-green-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--nc-green)";
                }}
              >
                Find My Benefits →
              </button>
            </form>

            {/* Trust Badges */}
            <div className="mt-6">
              <TrustBadges />
            </div>

            {/* Disclaimer */}
            <p
              className="mt-6 text-xs text-center max-w-lg leading-relaxed"
              style={{ color: "var(--nc-muted)" }}
            >
              NaviCare is not affiliated with any government agency. Always
              verify eligibility at official sources.
            </p>
          </div>
        </section>

        {/* ─── Divider + Browse Section ─── */}
        <section className="py-12 bg-white">
          <div className="nc-container">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-[1px] bg-slate-200 flex-grow max-w-[120px]" />
              <span className="text-sm uppercase tracking-wider font-semibold" style={{ color: "var(--nc-muted)" }}>
                or browse by what you need
              </span>
              <div className="h-[1px] bg-slate-200 flex-grow max-w-[120px]" />
            </div>

            <div className="text-center mb-10">
              <h2 className="mb-3">What do you need help with?</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--nc-body)" }}>
                Select a category to see programs in that area.
              </p>
            </div>

            <CategoryGrid />
          </div>
        </section>

        {/* ─── Section 2: How It Works ─── */}
        <section
          id="how-it-works"
          className="nc-section"
          style={{ backgroundColor: "var(--nc-sage-light)" }}
        >
          <div className="nc-container">
            <div className="text-center mb-12">
              <p className="nc-eyebrow mb-3">HOW IT WORKS</p>
              <h2>Three ways to find your benefits</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div
                className="rounded-xl p-6 bg-white"
                style={{ border: "1px solid var(--nc-card-border)" }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-white font-bold text-lg mb-4"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "var(--nc-sage-light)",
                    fontSize: "24px",
                  }}
                >
                  💬
                </div>
                <h3 className="mb-2">Describe your situation</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--nc-body)" }}
                >
                  Tell NaviCare what&apos;s going on in plain English. The AI reads your situation and asks you exactly the right follow-up questions — not a generic form.
                </p>
              </div>

              {/* Step 2 */}
              <div
                className="rounded-xl p-6 bg-white"
                style={{ border: "1px solid var(--nc-card-border)" }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-white font-bold text-lg mb-4"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "var(--nc-sage-light)",
                    fontSize: "24px",
                  }}
                >
                  🔍
                </div>
                <h3 className="mb-2">Browse by need</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--nc-body)" }}
                >
                  Know what you need? Browse by category — food, housing, healthcare, education, and more. Filter to programs that fit.
                </p>
              </div>

              {/* Step 3 */}
              <div
                className="rounded-xl p-6 bg-white"
                style={{ border: "1px solid var(--nc-card-border)" }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-white font-bold text-lg mb-4"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "var(--nc-sage-light)",
                    fontSize: "24px",
                  }}
                >
                  📋
                </div>
                <h3 className="mb-2">Get the full picture</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--nc-body)" }}
                >
                  Every matched program comes with a complete guide: eligibility rules, required documents, step-by-step instructions, and what to expect after you apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 3: Programs We Cover ─── */}
        <section id="programs" className="nc-section bg-white">
          <div className="nc-container">
            <div className="text-center mb-12">
              <p className="nc-eyebrow mb-3">SUPPORTED PROGRAMS</p>
              <h2>We search across 8 major benefit categories</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  emoji: "🍎",
                  name: "Food & Nutrition",
                  programs: "SNAP, WIC, School Meals, Food Banks",
                },
                {
                  emoji: "🏠",
                  name: "Housing & Rent",
                  programs: "Section 8, Emergency Rental Assistance, HUD Housing",
                },
                {
                  emoji: "🏥",
                  name: "Healthcare",
                  programs: "Medicaid, CHIP, ACA Marketplace, Medicare Savings",
                },
                {
                  emoji: "🎓",
                  name: "Education & Training",
                  programs: "Pell Grant, WIOA Job Training, Head Start, Adult Education",
                },
                {
                  emoji: "🚌",
                  name: "Transportation",
                  programs: "Medicaid transport, reduced fare transit",
                },
                {
                  emoji: "👶",
                  name: "Child & Family",
                  programs: "TANF, childcare subsidies (CCAP), Head Start",
                },
                {
                  emoji: "💼",
                  name: "Unemployment & Jobs",
                  programs: "Unemployment Insurance, Job Corps, SNAP E&T",
                },
                {
                  emoji: "⚡",
                  name: "Utilities & Bills",
                  programs: "LIHEAP, Lifeline Phone, ACP Internet",
                },
              ].map((cat) => (
                <div
                  key={cat.name}
                  className="rounded-xl p-5 bg-white transition-colors cursor-default"
                  style={{ border: "1px solid var(--nc-card-border)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--nc-green)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--nc-card-border)";
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full mb-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "var(--nc-sage-light)",
                      fontSize: "28px",
                    }}
                  >
                    <span aria-hidden="true">{cat.emoji}</span>
                  </div>
                  <h3
                    className="text-base font-bold mb-1"
                    style={{ color: "var(--nc-navy)" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--nc-body)" }}>
                    {cat.programs}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 4: What NaviCare Can / Can't Do ─── */}
        <section className="nc-section">
          <div className="nc-container">
            <div className="text-center mb-12">
              <h2>What NaviCare can and can&apos;t do</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Can do */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  border: "1px solid var(--nc-sage-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs"
                    style={{ backgroundColor: "var(--nc-green)" }}
                  >
                    ✓
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--nc-green)" }}
                  >
                    What we help with
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Find programs that match your situation",
                    "Explain eligibility rules in plain English",
                    "Give direct links to official apply pages",
                    "Connect you to a free local caseworker",
                    "Work for any US state",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--nc-body)" }}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--nc-green)" }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Can't do */}
              <div
                className="rounded-xl p-6 bg-white"
                style={{ border: "1px solid var(--nc-card-border)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs"
                    style={{ backgroundColor: "var(--nc-muted)" }}
                  >
                    ✗
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--nc-muted)" }}
                  >
                    What we don&apos;t do
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Make final eligibility decisions",
                    "Submit applications for you",
                    "Store or share your personal data",
                    "Replace official government agencies",
                    "Guarantee benefit approval",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--nc-body)" }}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--nc-muted)" }}
                      >
                        ✗
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 5: Quick Topics ─── */}
        <section className="bg-white" style={{ padding: "60px 0" }}>
          <div className="nc-container text-center">
            <h2 className="mb-3">Common situations we help with</h2>
            <p
              className="text-base mb-8"
              style={{ color: "var(--nc-body)" }}
            >
              Click any situation below to get started instantly.
            </p>
            <QuickTopicPills onSelect={handleQuickTopic} />
          </div>
        </section>

        {/* ─── Section 6: Responsible AI / Trust ─── */}
        <section
          id="responsible-ai"
          className="nc-section"
          style={{ backgroundColor: "var(--nc-green)" }}
        >
          <div className="nc-container">
            <div className="text-center mb-12">
              <h2 className="text-white">
                Built responsibly, designed for humans
              </h2>
              <p
                className="mt-3 text-base"
                style={{ color: "#BBF7D0" }}
              >
                NaviCare is an AI-powered tool, not a government agency.
                Here&apos;s exactly how we protect you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🗣️",
                  title: "We never say 'you qualify'",
                  body: "NaviCare always uses careful language like 'may qualify' because only official government agencies make final eligibility decisions.",
                },
                {
                  icon: "👤",
                  title: "A human is always in the loop",
                  body: "Every result includes a free caseworker referral. The AI narrows your search — a human confirms your eligibility.",
                },
                {
                  icon: "🔒",
                  title: "Your data stays private",
                  body: "We don't store, log, or sell anything you type. Each session is temporary and anonymous.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: "var(--nc-green-hover)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <span
                    className="text-3xl mb-3 block"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </span>
                  <h3 className="text-white font-bold mb-2">
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(187,247,208,0.8)" }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 7: Footer ─── */}
        <footer style={{ backgroundColor: "var(--nc-navy)", padding: "48px 0" }}>
          <div className="nc-container">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
              {/* Left */}
              <div>
                <p className="text-white text-lg font-bold mb-1">NaviCare</p>
                <p className="text-sm" style={{ color: "var(--nc-muted)" }}>
                  Find the help you qualify for.
                </p>
              </div>

              {/* Center Links */}
              <div className="flex flex-wrap gap-6">
                {["How it works", "Programs", "Responsible AI", "Get Support"].map(
                  (link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                      className="text-sm transition-colors"
                      style={{ color: "var(--nc-muted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--nc-muted)";
                      }}
                    >
                      {link}
                    </a>
                  )
                )}
              </div>

              {/* Right */}
              <button
                onClick={() =>
                  document
                    .getElementById("hero")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white cursor-pointer transition-colors"
                style={{ backgroundColor: "var(--nc-green)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--nc-green-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--nc-green)";
                }}
              >
                Start Now →
              </button>
            </div>

            {/* Divider */}
            <div
              className="mb-6"
              style={{
                borderTop: "1px solid rgba(148,163,184,0.2)",
              }}
            />

            {/* Fine print */}
            <p
              className="text-xs leading-relaxed text-center"
              style={{ color: "var(--nc-muted)" }}
            >
              NaviCare is an independent tool. Not affiliated with any federal or
              state agency. All benefit information is sourced from public
              government websites. Always verify eligibility at official sources.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
