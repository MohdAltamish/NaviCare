"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export default function InitialLoader() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on first visit
    const hasLoaded = sessionStorage.getItem("navicare_loaded");
    if (hasLoaded) {
      setShow(false);
      return;
    }

    setShow(true);
    sessionStorage.setItem("navicare_loaded", "true");

    // Animate letters
    const tl = gsap.timeline({
      onComplete: () => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 400);
      },
    });

    tl.from(lettersRef.current, {
      opacity: 0,
      y: 20,
      stagger: 0.06,
      duration: 0.4,
      ease: "power3.out",
      delay: 0.2,
    });

    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.4, ease: "power2.out" },
        "-=0.1"
      );
    }

    tl.to({}, { duration: 0.3 }); // Brief pause before fade out
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "#0F172A",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              {"NaviCare".split("").map((letter, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) lettersRef.current[i] = el;
                  }}
                  style={{ display: "inline-block", opacity: 0 }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div
              ref={lineRef}
              style={{
                height: "2px",
                backgroundColor: "#166534",
                marginTop: "8px",
                transformOrigin: "left",
                transform: "scaleX(0)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
