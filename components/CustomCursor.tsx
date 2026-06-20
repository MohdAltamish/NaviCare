"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<
    "default" | "button" | "card" | "link"
  >("default");
  const [isClicking, setIsClicking] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setTimeout(() => {
      setIsDesktop(mq.matches);
    }, 0);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closest =
        target.closest("button") ||
        target.closest('a[href]') ||
        target.closest('[role="button"]');
      const card = target.closest("[data-cursor-card]");
      const link = target.closest("[data-cursor-link]");

      if (card) {
        setCursorState("card");
      } else if (link) {
        setCursorState("link");
      } else if (closest) {
        setCursorState("button");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDesktop, handleMouseMove, handleMouseDown, handleMouseUp]);

  // Lerp animation for ring
  useEffect(() => {
    if (!isDesktop) return;

    const animate = () => {
      ringPos.current.x += (mousePos.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.y - ringPos.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) ${
          isClicking ? "scale(0.8, 1.2)" : "scale(1)"
        }`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isDesktop, mousePos, isClicking]);

  if (!isDesktop) return null;

  const ringSize =
    cursorState === "button" ? 64 : cursorState === "card" ? 80 : cursorState === "link" ? 16 : 32;
  const ringBg =
    cursorState === "button"
      ? "rgba(22,101,52,0.9)"
      : "transparent";
  const ringBorder =
    cursorState === "card"
      ? "2px dashed rgba(22,101,52,0.5)"
      : cursorState === "link"
      ? "2px solid #166534"
      : cursorState === "button"
      ? "none"
      : "1.5px solid rgba(22,101,52,0.4)";

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: cursorState === "link" ? 0 : 6,
          height: cursorState === "link" ? 0 : 6,
          backgroundColor: "#166534",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "width 0.2s, height 0.2s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: ringBorder,
          backgroundColor: ringBg,
          pointerEvents: "none",
          zIndex: 99998,
          transition:
            "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), background-color 0.2s, border 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation:
            cursorState === "card" ? "cursor-rotate 4s linear infinite" : "none",
        }}
      >
        {cursorState === "button" && (
          <span
            style={{
              color: "white",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            Click
          </span>
        )}
      </div>
    </>
  );
}
