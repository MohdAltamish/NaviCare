"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentChecklistProps {
  documents: string[];
  programName: string;
}

export default function DocumentChecklist({
  documents,
  programName,
}: DocumentChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copyText, setCopyText] = useState("📋 Copy this list →");

  const toggleDoc = (doc: string) => {
    setChecked((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const handleCopyList = () => {
    const text = documents
      .map((doc) => `${checked[doc] ? "✓" : "☐"} ${doc}`)
      .join("\n");
    navigator.clipboard.writeText(
      `${programName} — Documents Needed:\n${text}`
    );
    setCopyText("Copied! ✓");
    setTimeout(() => setCopyText("📋 Copy this list →"), 2000);
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === documents.length;
  const progressPercent =
    documents.length > 0 ? (checkedCount / documents.length) * 100 : 0;

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--nc-card-border)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--nc-navy)" }}
        >
          📄 Documents you&apos;ll need
        </h3>
        <motion.span
          className="text-xs rounded-full px-2.5 py-0.5"
          style={{
            backgroundColor: allChecked
              ? "var(--nc-sage-light)"
              : "var(--nc-bg)",
            color: allChecked ? "var(--nc-green)" : "var(--nc-muted)",
            border: `1px solid ${
              allChecked ? "var(--nc-sage-border)" : "var(--nc-card-border)"
            }`,
          }}
          key={checkedCount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {checkedCount}/{documents.length}
        </motion.span>
      </div>
      <p
        className="text-xs mb-3"
        style={{ color: "var(--nc-muted)" }}
      >
        Gather these before you start. Most states accept photos taken with your
        phone.
      </p>

      {/* Progress bar */}
      <div
        className="rounded-full mb-4 overflow-hidden"
        style={{
          height: "4px",
          backgroundColor: "var(--nc-border)",
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: "var(--nc-green)",
          }}
          animate={{
            width: `${progressPercent}%`,
            ...(allChecked
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(22,101,52,0)",
                    "0 0 8px 2px rgba(22,101,52,0.3)",
                    "0 0 0 0 rgba(22,101,52,0)",
                  ],
                }
              : {}),
          }}
          transition={{
            width: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
            boxShadow: { duration: 1, repeat: allChecked ? 1 : 0 },
          }}
        />
      </div>

      {/* Ready to apply message */}
      <AnimatePresence>
        {allChecked && (
          <motion.p
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--nc-green)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            ✨ Ready to apply!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Checklist */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <motion.label
            key={doc}
            className="flex items-start gap-3 cursor-pointer group"
            animate={
              checked[doc]
                ? { x: [0, 2, 0] }
                : {}
            }
            transition={{ duration: 0.2 }}
          >
            {/* Custom checkbox with SVG checkmark */}
            <div
              className="mt-0.5 shrink-0 flex items-center justify-center rounded"
              style={{
                width: "18px",
                height: "18px",
                border: checked[doc]
                  ? "none"
                  : "2px solid var(--nc-card-border)",
                backgroundColor: checked[doc]
                  ? "var(--nc-green)"
                  : "transparent",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onClick={() => toggleDoc(doc)}
            >
              <AnimatePresence>
                {checked[doc] && (
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                  >
                    <motion.path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
            <span
              className="text-sm leading-relaxed transition-all"
              style={{
                color: checked[doc] ? "var(--nc-muted)" : "var(--nc-body)",
                textDecoration: checked[doc] ? "line-through" : "none",
                opacity: checked[doc] ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
              onClick={() => toggleDoc(doc)}
            >
              {doc}
            </span>
          </motion.label>
        ))}
      </div>

      {/* Copy button with text morph */}
      <motion.button
        onClick={handleCopyList}
        className="mt-4 text-sm font-medium cursor-pointer"
        style={{ color: "var(--nc-green)" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={copyText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {copyText}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
