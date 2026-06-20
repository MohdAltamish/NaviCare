"use client";

import React from "react";

interface DocumentChecklistProps {
  documents: string[];
  programName: string;
}

export default function DocumentChecklist({
  documents,
  programName,
}: DocumentChecklistProps) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

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
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--nc-card-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--nc-navy)" }}
        >
          📄 Documents you&apos;ll need
        </h3>
        <span
          className="text-xs rounded-full px-2.5 py-0.5"
          style={{
            backgroundColor:
              checkedCount === documents.length
                ? "var(--nc-sage-light)"
                : "var(--nc-bg)",
            color:
              checkedCount === documents.length
                ? "var(--nc-green)"
                : "var(--nc-muted)",
            border: `1px solid ${
              checkedCount === documents.length
                ? "var(--nc-sage-border)"
                : "var(--nc-card-border)"
            }`,
          }}
        >
          {checkedCount}/{documents.length}
        </span>
      </div>
      <p
        className="text-xs mb-4"
        style={{ color: "var(--nc-muted)" }}
      >
        Gather these before you start. Most states accept photos taken with your
        phone.
      </p>

      {/* Checklist */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <label
            key={doc}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={!!checked[doc]}
              onChange={() => toggleDoc(doc)}
              className="mt-0.5 shrink-0"
              style={{
                accentColor: "var(--nc-green)",
                width: "16px",
                height: "16px",
              }}
            />
            <span
              className="text-sm leading-relaxed transition-colors"
              style={{
                color: checked[doc] ? "var(--nc-muted)" : "var(--nc-body)",
                textDecoration: checked[doc] ? "line-through" : "none",
              }}
            >
              {doc}
            </span>
          </label>
        ))}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopyList}
        className="mt-4 text-sm font-medium cursor-pointer transition-colors"
        style={{ color: "var(--nc-green)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--nc-green-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--nc-green)";
        }}
      >
        📋 Copy this list →
      </button>
    </div>
  );
}
