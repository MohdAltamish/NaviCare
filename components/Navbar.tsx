"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoLetters = "NaviCare".split("");

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 w-full border-b border-nc-border"
      style={{
        backgroundColor: "var(--nc-bg)",
        transition: "padding 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div
        className="nc-container flex items-center justify-between"
        style={{
          paddingTop: scrolled ? "10px" : "16px",
          paddingBottom: scrolled ? "10px" : "16px",
          transition: "padding 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Logo with letter wave */}
        <Link
          href="/"
          className="font-bold tracking-tight"
          style={{
            color: "var(--nc-green)",
            fontSize: scrolled ? "18px" : "20px",
            transition: "font-size 0.3s ease",
          }}
          aria-label="NaviCare home"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          {logoLetters.map((letter, i) => (
            <motion.span
              key={i}
              style={{ display: "inline-block" }}
              animate={
                logoHovered
                  ? {
                      y: [0, -6, 0],
                      transition: {
                        duration: 0.4,
                        delay: i * 0.04,
                        ease: "easeOut",
                      },
                    }
                  : { y: 0 }
              }
            >
              {letter}
            </motion.span>
          ))}
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/browse"
            className="nav-link-animated text-sm font-medium transition-colors"
            style={{ color: "var(--nc-body)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--nc-green)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--nc-body)";
            }}
          >
            Browse Programs
          </Link>
          <Link
            href="/#how-it-works"
            className="nav-link-animated text-sm font-medium transition-colors"
            style={{ color: "var(--nc-body)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--nc-green)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--nc-body)";
            }}
          >
            How it works
          </Link>
          <Link
            href="/#responsible-ai"
            className="btn-fill-left inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: "var(--nc-green)",
              color: "var(--nc-green)",
            }}
          >
            Get Support
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
