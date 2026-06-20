"use client";

export default function TrustBadges() {
  const badges = [
    { icon: "🔒", text: "Private & Secure" },
    { icon: "👤", text: "No account needed" },
    { icon: "✓", text: "100% Free" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {badges.map((badge) => (
        <span
          key={badge.text}
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--nc-muted)" }}
        >
          <span aria-hidden="true">{badge.icon}</span>
          {badge.text}
        </span>
      ))}
    </div>
  );
}
