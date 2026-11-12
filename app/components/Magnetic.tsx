"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import useFinePointer from "../hooks/useFinePointer";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Pull strength as a fraction of the pointer offset (0–1). */
  strength?: number;
};

export default function Magnetic({
  children,
  className = "",
  strength = 0.28,
}: MagneticProps) {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;
  const ref = useRef<HTMLSpanElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 22, mass: 0.45 });
  const y = useSpring(rawY, { stiffness: 260, damping: 22, mass: 0.45 });

  if (!enabled) {
    return (
      <span className={`inline-flex items-center leading-none ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-flex items-center leading-none will-change-transform ${className}`}
      style={{ x, y }}
      onMouseMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);
        rawX.set(offsetX * strength);
        rawY.set(offsetY * strength);
      }}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
