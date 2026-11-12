"use client";

import { useLenis } from "lenis/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";
import useFinePointer from "../hooks/useFinePointer";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const SIZE = 88;
const STROKE = 1.25;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type CursorMode = "scroll" | "open" | "view" | "go";

function modeFromTarget(target: EventTarget | null): CursorMode | null {
  if (!(target instanceof Element)) return null;

  const interactive = target.closest(
    "a, button, [role='link'], [role='button'], [data-cursor]",
  );
  if (!interactive) return null;

  const explicit = interactive.getAttribute("data-cursor");
  if (explicit === "view" || explicit === "go" || explicit === "open") {
    return explicit;
  }

  if (
    interactive.tagName === "BUTTON" ||
    interactive.getAttribute("role") === "button"
  ) {
    return "go";
  }

  return "open";
}

function labelForMode(mode: CursorMode) {
  switch (mode) {
    case "view":
      return "View";
    case "go":
      return "Go";
    case "open":
      return "Open";
    default:
      return "Scroll";
  }
}

export default function ScrollCursor() {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("scroll");

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const progress = useMotionValue(0);
  const rawScale = useMotionValue(1);

  const x = useSpring(rawX, { stiffness: 220, damping: 28, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 220, damping: 28, mass: 0.6 });
  const scale = useSpring(rawScale, { stiffness: 280, damping: 26, mass: 0.5 });
  const dashOffset = useTransform(
    progress,
    (value) => CIRCUMFERENCE * (1 - value),
  );

  const lenis = useLenis((instance) => {
    progress.set(instance.progress);
  });

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    const onMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);

      const nextMode = modeFromTarget(event.target);
      if (
        !nextMode &&
        event.target instanceof Element &&
        event.target.closest("[data-cursor-hide]")
      ) {
        setVisible(false);
        return;
      }

      const mode = nextMode ?? "scroll";
      setMode(mode);
      rawScale.set(mode === "scroll" ? 1 : 0.72);
      setVisible(true);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);

    if (lenis) {
      progress.set(lenis.progress);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [finePointer, lenis, progress, rawScale, rawX, rawY, reducedMotion]);

  if (!finePointer || reducedMotion) {
    return null;
  }

  const interactive = mode !== "scroll";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80]"
      style={{
        x,
        y,
        scale,
        width: SIZE,
        height: SIZE,
        marginLeft: -SIZE / 2,
        marginTop: -SIZE / 2,
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill={interactive ? "rgba(212, 196, 90, 0.1)" : "none"}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeLinecap="butt"
          strokeDasharray={CIRCUMFERENCE}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-sans font-medium tracking-[0.22em] uppercase ${
          interactive ? "text-[8px] text-accent" : "text-[9px] text-white/75"
        }`}
      >
        {labelForMode(mode)}
      </span>
    </motion.div>
  );
}
