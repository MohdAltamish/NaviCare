"use client";

import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  children?: React.ReactNode; // For question cards
}

export default function ChatMessage({ role, content, children }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4 animate-fade-in-up">
        <div
          className="rounded-xl px-4 py-3 max-w-[80%]"
          style={{
            backgroundColor: "var(--nc-green)",
            color: "#FFFFFF",
          }}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in-up">
      {/* Avatar */}
      <div
        className="shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: "var(--nc-green)",
        }}
      >
        N
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-[85%]">
        <div
          className="rounded-xl px-4 py-3"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid var(--nc-card-border)",
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--nc-body)" }}
          >
            {content}
          </p>
        </div>

        {/* Question card (rendered below the message bubble) */}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
