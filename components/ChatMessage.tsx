"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  children?: React.ReactNode; // For question cards
}

export default function ChatMessage({ role, content, children }: ChatMessageProps) {
  if (role === "user") {
    return (
      <motion.div
        className="flex justify-end mb-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.25,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        style={{ transformOrigin: "bottom right" }}
      >
        <div
          className="rounded-xl px-4 py-3 max-w-[80%]"
          style={{
            backgroundColor: "var(--nc-green)",
            color: "#FFFFFF",
          }}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-start gap-3 mb-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      style={{ transformOrigin: "bottom left" }}
    >
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
        {children && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
