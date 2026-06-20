"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-nc-border"
      style={{ backgroundColor: "var(--nc-bg)" }}
    >
      <div className="nc-container flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--nc-green)" }}
          aria-label="NaviCare home"
        >
          NaviCare
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/browse"
            className="text-sm font-medium hover:text-nc-green transition-colors"
            style={{ color: "var(--nc-body)" }}
          >
            Browse Programs
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium hover:text-nc-green transition-colors"
            style={{ color: "var(--nc-body)" }}
          >
            How it works
          </Link>
          <Link
            href="/#responsible-ai"
            className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-nc-green hover:text-white"
            style={{
              borderColor: "var(--nc-green)",
              color: "var(--nc-green)",
            }}
          >
            Get Support
          </Link>
        </div>
      </div>
    </nav>
  );
}
