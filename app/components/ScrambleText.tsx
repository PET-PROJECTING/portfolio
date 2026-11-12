"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { isProgrammaticScroll } from "../lib/programmaticScroll";

export const SECTION_ARRIVED_EVENT = "portfolio:section-arrived";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/\\|{}[]";

type ScrambleTag = "span" | "h1" | "h2" | "h3" | "p" | "dt";

type ScrambleTextProps = {
  text: string;
  as?: ScrambleTag;
  className?: string;
  /** Start immediately, or when the text enters the reading zone. */
  trigger?: "immediate" | "inView";
  /** Delay before the scramble run starts (ms), after it becomes visible. */
  delayMs?: number;
  /** Total resolve duration (ms). Fast default ~550ms. */
  durationMs?: number;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

function scrambleFrame(text: string, progress: number, seed: number): string {
  const resolved = Math.floor(progress * text.length);

  return Array.from(text)
    .map((char, index) => {
      if (char === " " || char === "\n" || char === "\u00A0") return char;
      if (index < resolved) return text[index];
      const glyphIndex =
        (seed + index * 17 + Math.floor(progress * 40)) % GLYPHS.length;
      return GLYPHS[glyphIndex] ?? char;
    })
    .join("");
}

function isInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom > 0 && rect.top < vh * 0.92;
}

export default function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  trigger = "inView",
  delayMs = 0,
  durationMs = 550,
  ...rest
}: ScrambleTextProps) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(trigger === "immediate");
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reducedMotion || trigger === "immediate") {
      setActive(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const landmark = node.closest("section, footer");
    const isTitle = node.matches("h1, h2");
    let armed = true;

    const activate = () => {
      if (!armed) return;
      armed = false;
      setActive(true);
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Ignore crossings that happen while Lenis is flying to a hash target —
        // those would finish the decode before the scroll settles.
        if (!entry.isIntersecting || isProgrammaticScroll()) return;
        activate();
      },
      {
        threshold: 0,
        rootMargin: isTitle ? "-8% 0px -50% 0px" : "-5% 0px -30% 0px",
      },
    );

    observer.observe(node);

    const onSectionArrived = (event: Event) => {
      if (event.target !== landmark) return;

      // Titles always decode on nav settle. Nested lines only if on-screen.
      if (isTitle || isInViewport(node)) {
        activate();
      }
    };

    landmark?.addEventListener(SECTION_ARRIVED_EVENT, onSectionArrived);

    return () => {
      armed = false;
      observer.disconnect();
      landmark?.removeEventListener(SECTION_ARRIVED_EVENT, onSectionArrived);
    };
  }, [reducedMotion, trigger]);

  useEffect(() => {
    if (!active) return;

    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    let cancelled = false;
    const seed = Math.floor(Math.random() * 1000);

    setDisplay(scrambleFrame(text, 0, seed));

    const tick = (now: number) => {
      if (cancelled) return;
      if (start === null) start = now + delayMs;
      const elapsed = now - start;

      if (elapsed < 0) {
        setDisplay(scrambleFrame(text, 0, seed));
        frame = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - (1 - progress) ** 2.2;
      setDisplay(scrambleFrame(text, eased, seed));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [active, delayMs, durationMs, reducedMotion, text]);

  return (
    <Tag ref={ref as never} className={`relative ${className}`} {...rest}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible whitespace-pre-line">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden whitespace-pre-line"
      >
        {display}
      </span>
    </Tag>
  );
}
