"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Navbar from "@/components/Navbar";
import TrustBadges from "@/components/TrustBadges";
import QuickTopicPills from "@/components/QuickTopicPills";
import CategoryGrid from "@/components/CategoryGrid";

// CountUp component for animated numbers
function CountUp({
  target,
  duration = 800,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let start = 0;
    const increment = target / (duration / 16);
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
  }, [target, duration]);

  return <span>{count}</span>;
}

// Reveal section wrapper
const SectionReveal = ({
  children,
  className,
  style,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) => (
  <motion.section
    id={id}
    className={className}
    style={style}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.section>
);

export default function LandingPage() {
  const router = useRouter();
  const [situation, setSituation] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    setTimeout(() => {
      setIsMobile(window.innerWidth < 768);
    }, 0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP hero timeline
  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".hero-word",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.8 }
    )
      .fromTo(
        ".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        ".hero-input",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      )
      .fromTo(
        ".hero-btn",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4 },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (userInteracted) return;

    const example = "I lost my job and have 2 kids...";
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < example.length) {
        setTypedText(example.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
        setTimeout(() => {
          setTypedText("");
          setShowPlaceholder(true);
        }, 1000);
      }
    }, 40);

    return () => clearInterval(typeTimer);
  }, [userInteracted]);

  const handleQuickTopic = (text: string) => {
    setSituation(text);
    setUserInteracted(true);
    textareaRef.current?.focus();
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    sessionStorage.setItem("navicare_situation", situation.trim());
    router.push("/chat");
  };

  const handleFocus = () => {
    setUserInteracted(true);
    setTypedText("");
    setShowPlaceholder(true);
  };

  // Split headline into words for GSAP animation
  const headlineWords = "Find out what help you qualify for.".split(" ");

  return (
    <>
      <Navbar />

      <main>
        {/* ─── Section 1: Hero ─── */}
        <section
          id="hero"
          className="hero-section nc-section"
          style={{ paddingTop: "100px", paddingBottom: "100px" }}
        >
          {/* Hero orb */}
          <div className="hero-orb" />

          <div
            ref={heroRef}
            className="nc-container flex flex-col items-center text-center relative z-10"
          >
            {/* Eyebrow */}
            <motion.p
              className="nc-eyebrow mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              FREE · NO SIGNUP · PRIVATE
            </motion.p>

            {/* Headline — word by word */}
            <h1 className="mb-5 max-w-2xl">
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="hero-word inline-block mr-[0.3em]"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              className="hero-sub text-lg max-w-xl mx-auto mb-8 leading-relaxed"
              style={{ color: "var(--nc-body)", opacity: 0 }}
            >
              Millions of Americans miss out on food, healthcare, and housing
              support every year — not because they don&apos;t need it, but because
              the system is too confusing. NaviCare fixes that.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="hero-input w-full max-w-xl"
              style={{ opacity: 0 }}
            >
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="situation-input"
                  value={situation}
                  onChange={(e) => {
                    setSituation(e.target.value);
                    setUserInteracted(true);
                  }}
                  onFocus={handleFocus}
                  placeholder={
                    showPlaceholder || userInteracted
                      ? "Describe your situation... e.g. I lost my job, I have 2 kids, and I can't pay rent"
                      : ""
                  }
                  rows={5}
                  className="w-full resize-none rounded-xl px-4 py-4 text-base"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--nc-card-border)",
                    color: "var(--nc-navy)",
                    minHeight: "120px",
                    transition:
                      "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
                {/* Typewriter overlay */}
                {!userInteracted && typedText && (
                  <div
                    className="absolute top-4 left-4 text-base pointer-events-none"
                    style={{ color: "var(--nc-muted)" }}
                  >
                    {typedText}
                    <span
                      className="inline-block w-[2px] h-[1.2em] ml-[1px] align-middle"
                      style={{
                        backgroundColor: "var(--nc-green)",
                        animation: "fadeIn 0.5s ease-in-out infinite alternate",
                      }}
                    />
                  </div>
                )}
              </div>

              <motion.button
                id="submit-situation"
                type="submit"
                disabled={!situation.trim()}
                className="hero-btn mt-4 w-full rounded-lg font-semibold text-white cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--nc-green)",
                  height: "52px",
                  fontSize: "15px",
                  opacity: 0,
                }}
                whileHover={
                  situation.trim()
                    ? {
                        backgroundColor: "#14532D",
                        translateY: -1,
                        scale: 1.01,
                      }
                    : {}
                }
                whileTap={
                  situation.trim() ? { scale: 0.97, translateY: 0 } : {}
                }
              >
                <span className="inline-flex items-center gap-2">
                  Find My Benefits
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </form>

            {/* Trust Badges */}
            <div className="mt-6">
              <TrustBadges />
            </div>

            {/* Disclaimer */}
            <motion.p
              className="mt-6 text-xs text-center max-w-lg leading-relaxed"
              style={{ color: "var(--nc-muted)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            >
              NaviCare is not affiliated with any government agency. Always
              verify eligibility at official sources.
            </motion.p>
          </div>
        </section>

        {/* ─── Divider + Browse Section ─── */}
        <SectionReveal className="py-12 bg-white">
          <div className="nc-container">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-[1px] bg-slate-200 flex-grow max-w-[120px]" />
              <span
                className="text-sm uppercase tracking-wider font-semibold"
                style={{ color: "var(--nc-muted)" }}
              >
                or browse by what you need
              </span>
              <div className="h-[1px] bg-slate-200 flex-grow max-w-[120px]" />
            </div>

            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-3">What do you need help with?</h2>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: "var(--nc-body)" }}
              >
                Select a category to see programs in that area.
              </p>
            </motion.div>

            <CategoryGrid />
          </div>
        </SectionReveal>

        {/* ─── Section 2: How It Works ─── */}
        <SectionReveal
          id="how-it-works"
          className="nc-section"
          style={{ backgroundColor: "var(--nc-sage-light)" }}
        >
          <div className="nc-container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="nc-eyebrow mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                HOW IT WORKS
              </motion.p>
              <h2>Three ways to find your benefits</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  emoji: "💬",
                  title: "Describe your situation",
                  body: "Tell NaviCare what's going on in plain English. The AI reads your situation and asks you exactly the right follow-up questions — not a generic form.",
                  direction: -60,
                },
                {
                  emoji: "🔍",
                  title: "Browse by need",
                  body: "Know what you need? Browse by category — food, housing, healthcare, education, and more. Filter to programs that fit.",
                  direction: 60,
                },
                {
                  emoji: "📋",
                  title: "Get the full picture",
                  body: "Every matched program comes with a complete guide: eligibility rules, required documents, step-by-step instructions, and what to expect after you apply.",
                  direction: -60,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  className="rounded-xl p-6 bg-white"
                  style={{ border: "1px solid var(--nc-card-border)" }}
                  initial={{
                    opacity: 0,
                    x: isMobile ? 0 : step.direction,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <motion.div
                    className="flex items-center justify-center rounded-full text-white font-bold text-lg mb-4"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "var(--nc-sage-light)",
                      fontSize: "24px",
                    }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.1,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    {step.emoji}
                  </motion.div>
                  <h3 className="mb-2">{step.title}</h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--nc-body)" }}
                  >
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ─── Section 3: Programs We Cover ─── */}
        <SectionReveal id="programs" className="nc-section bg-white">
          <div className="nc-container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="nc-eyebrow mb-3">SUPPORTED PROGRAMS</p>
              <h2>
                We search across{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <CountUp target={8} />
                </motion.span>{" "}
                major benefit categories
              </h2>
            </motion.div>

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
                  programs:
                    "Section 8, Emergency Rental Assistance, HUD Housing",
                },
                {
                  emoji: "🏥",
                  name: "Healthcare",
                  programs:
                    "Medicaid, CHIP, ACA Marketplace, Medicare Savings",
                },
                {
                  emoji: "🎓",
                  name: "Education & Training",
                  programs:
                    "Pell Grant, WIOA Job Training, Head Start, Adult Education",
                },
                {
                  emoji: "🚌",
                  name: "Transportation",
                  programs: "Medicaid transport, reduced fare transit",
                },
                {
                  emoji: "👶",
                  name: "Child & Family",
                  programs:
                    "TANF, childcare subsidies (CCAP), Head Start",
                },
                {
                  emoji: "💼",
                  name: "Unemployment & Jobs",
                  programs:
                    "Unemployment Insurance, Job Corps, SNAP E&T",
                },
                {
                  emoji: "⚡",
                  name: "Utilities & Bills",
                  programs: "LIHEAP, Lifeline Phone, ACP Internet",
                },
              ].map((cat, index) => (
                <motion.div
                  key={cat.name}
                  className="rounded-xl p-5 bg-white benefit-card-hover"
                  style={{ border: "1px solid var(--nc-card-border)" }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                    ease: [0.25, 0.46, 0.45, 0.94],
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
                  <p
                    className="text-xs"
                    style={{ color: "var(--nc-body)" }}
                  >
                    {cat.programs}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ─── Section 4: What NaviCare Can / Can't Do ─── */}
        <SectionReveal className="nc-section">
          <div className="nc-container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2>What NaviCare can and can&apos;t do</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Can do */}
              <motion.div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  border: "1px solid var(--nc-sage-border)",
                }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
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
                  ].map((item, i) => (
                    <motion.li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--nc-body)" }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--nc-green)" }}
                      >
                        ✓
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Can't do */}
              <motion.div
                className="rounded-xl p-6 bg-white"
                style={{ border: "1px solid var(--nc-card-border)" }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
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
                  ].map((item, i) => (
                    <motion.li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--nc-body)" }}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--nc-muted)" }}
                      >
                        ✗
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </SectionReveal>

        {/* ─── Section 5: Quick Topics ─── */}
        <SectionReveal className="bg-white" style={{ padding: "60px 0" }}>
          <div className="nc-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-3">Common situations we help with</h2>
              <p
                className="text-base mb-8"
                style={{ color: "var(--nc-body)" }}
              >
                Click any situation below to get started instantly.
              </p>
            </motion.div>
            <QuickTopicPills onSelect={handleQuickTopic} />
          </div>
        </SectionReveal>

        {/* ─── Section 6: Responsible AI / Trust ─── */}
        <SectionReveal
          id="responsible-ai"
          className="nc-section"
          style={{ backgroundColor: "var(--nc-green)" }}
        >
          <div className="nc-container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>

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
              ].map((card, index) => (
                <motion.div
                  key={card.title}
                  className="rounded-xl p-6"
                  style={{
                    backgroundColor: "var(--nc-green-hover)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    translateY: -4,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.span
                    className="text-3xl mb-3 block"
                    aria-hidden="true"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.1,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    {card.icon}
                  </motion.span>
                  <h3 className="text-white font-bold mb-2">
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(187,247,208,0.8)" }}
                  >
                    {card.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ─── Section 7: Footer ─── */}
        <footer
          style={{ backgroundColor: "var(--nc-navy)", padding: "48px 0" }}
        >
          <div className="nc-container">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
              {/* Left */}
              <div>
                <p className="text-white text-lg font-bold mb-1">
                  NaviCare
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--nc-muted)" }}
                >
                  Find the help you qualify for.
                </p>
              </div>

              {/* Center Links */}
              <div className="flex flex-wrap gap-6">
                {[
                  "How it works",
                  "Programs",
                  "Responsible AI",
                  "Get Support",
                ].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                    className="nav-link-animated text-sm transition-colors"
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
                ))}
              </div>

              {/* Right */}
              <motion.button
                onClick={() =>
                  document
                    .getElementById("hero")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "var(--nc-green)" }}
                whileHover={{
                  backgroundColor: "#14532D",
                  translateY: -1,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start Now →
              </motion.button>
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
