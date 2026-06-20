"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import QuestionCardComponent from "@/components/QuestionCard";
import type { ChatMessage as ChatMessageType, TopicKey, UserSummary } from "@/lib/types";

interface ChatWindowProps {
  situation: string;
  onResultsReady: (summary: UserSummary) => void;
}

const TOPIC_LABELS: Record<TopicKey, string> = {
  income: "Income & employment",
  family: "Household & family",
  housing: "Housing situation",
  health: "Health & disability",
  location: "Location (state)",
  other: "Additional details",
};

export default function ChatWindow({ situation, onResultsReady }: ChatWindowProps) {
  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [topicsCovered, setTopicsCovered] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSituation, setShowSituation] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendToAI = async (messageHistory: ChatMessageType[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messageHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          situation,
          topics_covered: topicsCovered,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      // Add AI message
      const aiMessage: ChatMessageType = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message,
        question: data.question || undefined,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.topics_covered) {
        setTopicsCovered(data.topics_covered);
      }

      if (data.ready_for_results && data.summary) {
        onResultsReady(data.summary);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Sorry, I had trouble processing that. Could you try again?";
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: errMsg,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial AI message
  React.useEffect(() => {
    if (situation && messages.length === 0) {
      const timer = setTimeout(() => {
        sendToAI([]);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [situation]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");

    sendToAI(newMessages);
  };

  const handleQuestionAnswer = (answer: string) => {
    handleSendMessage(answer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="chat-layout">
      {/* ─── Sidebar ─── */}
      <motion.aside
        className="chat-sidebar"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Back to home */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors nav-link-animated"
          style={{ color: "var(--nc-body)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--nc-green)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--nc-body)";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="8" x2="4" y2="8" />
            <polyline points="8 4 4 8 8 12" />
          </svg>
          Back to Home
        </Link>

        {/* Situation summary */}
        <motion.div
          className="rounded-xl p-4 mb-6"
          style={{
            backgroundColor: "var(--nc-sage-light)",
            border: "1px solid var(--nc-sage-border)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--nc-muted)" }}
          >
            YOUR SITUATION
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--nc-body)",
              display: "-webkit-box",
              WebkitLineClamp: showSituation ? 999 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {situation}
          </p>
          {situation.length > 100 && (
            <button
              onClick={() => setShowSituation(!showSituation)}
              className="text-xs font-medium mt-1 cursor-pointer"
              style={{ color: "var(--nc-green)" }}
            >
              {showSituation ? "Show less" : "Show more"}
            </button>
          )}
        </motion.div>

        {/* Progress indicator */}
        <div className="mb-6">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--nc-muted)" }}
          >
            TOPICS COVERED
          </p>
          <div className="space-y-2">
            {(Object.keys(TOPIC_LABELS) as TopicKey[])
              .filter((k) => k !== "other")
              .map((key) => {
                const isCovered = topicsCovered.includes(key);
                return (
                  <div key={key} className="flex items-center gap-2.5">
                    <motion.div
                      className="rounded-full shrink-0"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: isCovered
                          ? "var(--nc-green)"
                          : "var(--nc-card-border)",
                      }}
                      animate={
                        isCovered
                          ? {
                              scale: [1, 1.3, 1],
                              backgroundColor: "var(--nc-green)",
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: isCovered
                          ? "var(--nc-navy)"
                          : "var(--nc-muted)",
                        fontWeight: isCovered ? 500 : 400,
                        transition: "color 0.3s, font-weight 0.3s",
                      }}
                    >
                      {TOPIC_LABELS[key]}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Responsible AI note */}
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--nc-muted)" }}
        >
          NaviCare uses your answers only to find matching programs. Nothing is
          stored after your session ends.
        </p>
      </motion.aside>

      {/* ─── Chat Area ─── */}
      <motion.div
        className="chat-main"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content}>
              {msg.role === "assistant" && msg.question && (
                <QuestionCardComponent
                  question={msg.question}
                  onAnswer={handleQuestionAnswer}
                  disabled={
                    isLoading || msg.id !== messages[messages.length - 1]?.id
                  }
                />
              )}
            </ChatMessage>
          ))}

          {/* Loading indicator — bouncing dots */}
          {isLoading && (
            <motion.div
              className="flex items-start gap-3 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
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
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--nc-card-border)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <form onSubmit={handleSubmit} className="chat-input-bar">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your answer..."
            disabled={isLoading}
            maxLength={500}
            className="flex-1 rounded-lg px-4 text-sm"
            style={{
              height: "44px",
              backgroundColor: "#FFFFFF",
              border: "1px solid var(--nc-card-border)",
              color: "var(--nc-navy)",
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
          />
          <motion.button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="shrink-0 flex items-center justify-center rounded-full text-white cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "var(--nc-green)",
            }}
            whileHover={
              !isLoading && inputValue.trim()
                ? { scale: 1.05, backgroundColor: "#14532D" }
                : {}
            }
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <svg
                className="nc-spinner"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.3"
                />
                <path
                  d="M12 2a10 10 0 019.95 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
