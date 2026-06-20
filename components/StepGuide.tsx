"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProgramStep } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface StepGuideProps {
  steps: ProgramStep[];
}

export default function StepGuide({ steps }: StepGuideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    const lineLength = lineRef.current.getTotalLength();
    gsap.set(lineRef.current, {
      strokeDasharray: lineLength,
      strokeDashoffset: lineLength,
    });

    const trigger = gsap.to(lineRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, [steps]);

  return (
    <div ref={containerRef} className="relative space-y-0">
      {/* SVG connecting line */}
      <svg
        className="absolute left-[17px] top-0"
        style={{
          width: "2px",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <line
          ref={lineRef}
          x1="1"
          y1="0"
          x2="1"
          y2="100%"
          stroke="#166534"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>

      {steps.map((step, index) => (
        <motion.div
          key={step.step_number}
          className="relative flex gap-4"
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Timeline: Step circle with SVG ring draw */}
          <div className="flex flex-col items-center z-10">
            <motion.div
              className="relative flex items-center justify-center shrink-0"
              style={{ width: "36px", height: "36px" }}
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* SVG ring that draws on scroll */}
              <svg
                viewBox="0 0 36 36"
                className="absolute inset-0"
                style={{ transform: "rotate(-90deg)" }}
              >
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#166534"
                  strokeWidth="2"
                  strokeDasharray="100.53"
                  initial={{ strokeDashoffset: 100.53 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                />
              </svg>
              <div
                className="flex items-center justify-center rounded-full text-white text-sm font-bold"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "var(--nc-green)",
                }}
              >
                {step.step_number}
              </div>
            </motion.div>
            {/* Spacer for visual connection — actual line is SVG overlay */}
            {index < steps.length - 1 && (
              <div
                className="flex-1"
                style={{
                  width: "2px",
                  minHeight: "24px",
                }}
              />
            )}
          </div>

          {/* Step content */}
          <motion.div
            className="pb-8 flex-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Title + time estimate */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h4
                className="font-semibold text-base"
                style={{ color: "var(--nc-navy)" }}
              >
                {step.title}
              </h4>
              <motion.span
                className="text-xs rounded-full px-2.5 py-0.5"
                style={{
                  backgroundColor: "var(--nc-sage-light)",
                  color: "var(--nc-green)",
                  border: "1px solid var(--nc-sage-border)",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                ⏱ {step.time_estimate}
              </motion.span>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--nc-body)" }}
            >
              {step.description}
            </p>

            {/* Tips */}
            {step.tips && step.tips.length > 0 && (
              <div
                className="rounded-lg p-3 mb-3"
                style={{
                  backgroundColor: "var(--nc-blue-tint)",
                  border: "1px solid var(--nc-blue-border)",
                }}
              >
                {step.tips.map((tip, i) => (
                  <p
                    key={i}
                    className="text-xs leading-relaxed"
                    style={{ color: "#1D4ED8" }}
                  >
                    💡 {tip}
                  </p>
                ))}
              </div>
            )}

            {/* Action button with bouncing arrow on hover */}
            {step.action_url && step.action_label && (
              <motion.a
                href={step.action_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--nc-green)" }}
                whileHover={{ backgroundColor: "#14532D", scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {step.action_label}
                <motion.span
                  className="inline-block"
                  whileHover={{
                    x: [0, 4, 0],
                    transition: {
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  →
                </motion.span>
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
