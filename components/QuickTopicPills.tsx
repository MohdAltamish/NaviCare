"use client";

import { quickTopics } from "@/lib/types";

interface QuickTopicPillsProps {
  onSelect: (situation: string) => void;
}

export default function QuickTopicPills({ onSelect }: QuickTopicPillsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {quickTopics.map((topic) => (
        <button
          key={topic.label}
          type="button"
          onClick={() => onSelect(topic.situation)}
          className="rounded-full px-5 py-2.5 text-sm font-medium cursor-pointer transition-colors"
          style={{
            backgroundColor: "#FFFFFF",
            color: "var(--nc-body)",
            border: "1px solid var(--nc-card-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--nc-green)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "var(--nc-green)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
            e.currentTarget.style.color = "var(--nc-body)";
            e.currentTarget.style.borderColor = "var(--nc-card-border)";
          }}
        >
          {topic.label}
        </button>
      ))}
    </div>
  );
}
