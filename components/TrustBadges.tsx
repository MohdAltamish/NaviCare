"use client";

import { motion } from "framer-motion";

export default function TrustBadges() {
  const badges = [
    { icon: "🔒", text: "Private & Secure" },
    { icon: "👤", text: "No account needed" },
    { icon: "✓", text: "100% Free" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {badges.map((badge, i) => (
        <motion.span
          key={badge.text}
          className="trust-badge flex items-center gap-1.5 text-xs"
          style={{ color: "var(--nc-muted)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 1.2 + i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <span aria-hidden="true">{badge.icon}</span>
          {badge.text}
        </motion.span>
      ))}
    </div>
  );
}
