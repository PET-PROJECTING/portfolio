"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { subscribeLenisPause } from "../lib/lenisControl";
import { setProgrammaticScroll } from "../lib/programmaticScroll";
import { SECTION_ARRIVED_EVENT } from "./ScrambleText";
import "lenis/dist/lenis.css";
import "./smooth-scroll.css";

function LenisPauseBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    return subscribeLenisPause((paused) => {
      if (paused) lenis.stop();
      else lenis.start();
    });
  }, [lenis]);

  return null;
}

function getHashTarget(href: string | null): string | null {
  if (!href) return null;

  if (href.startsWith("#") && href.length > 1) {
    return href;
  }

  if (href.startsWith("/#") && href.length > 2) {
    return href.slice(1);
  }

  try {
    const url = new URL(href, window.location.origin);
    if (
      url.origin === window.location.origin &&
      url.pathname === "/" &&
      url.hash.length > 1
    ) {
      return url.hash;
    }
  } catch {
    return null;
  }

  return null;
}

function HashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let releaseTimer: ReturnType<typeof setTimeout> | undefined;

    const releaseProgrammatic = () => {
      clearTimeout(releaseTimer);
      requestAnimationFrame(() => setProgrammaticScroll(false));
    };

    const scrollToHash = (hash: string, updateHistory: boolean) => {
      const target = document.querySelector(hash);
      if (!target) return;

      // Block IntersectionObserver arming while the camera is in transit.
      setProgrammaticScroll(true);
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(releaseProgrammatic, 4000);

      lenis.scrollTo(target, {
        offset: -24,
        onComplete: () => {
          target.dispatchEvent(
            new CustomEvent(SECTION_ARRIVED_EVENT, { bubbles: false }),
          );
          // Keep the gate up one frame so late IO callbacks can't burn the decode.
          releaseProgrammatic();
        },
      });
      if (updateHistory) {
        window.history.pushState(null, "", `/${hash}`);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const hash = getHashTarget(anchor.getAttribute("href"));
      if (!hash) return;

      event.preventDefault();
      scrollToHash(hash, true);
    };

    document.addEventListener("click", onClick);

    if (window.location.pathname === "/" && window.location.hash.length > 1) {
      requestAnimationFrame(() => {
        scrollToHash(window.location.hash, false);
      });
    }

    return () => {
      clearTimeout(releaseTimer);
      setProgrammaticScroll(false);
      document.removeEventListener("click", onClick);
    };
  }, [lenis]);

  return null;
}

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const enabled = mounted && !reducedMotion;

  return (
    <>
      {enabled ? (
        <ReactLenis
          root
          options={{
            autoRaf: true,
            lerp: 0.09,
            smoothWheel: true,
          }}
        >
          <HashScroll />
          <LenisPauseBridge />
        </ReactLenis>
      ) : null}
      {children}
    </>
  );
}
