"use client";

import gsap from "gsap";
import { TransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { setLenisPaused } from "../lib/lenisControl";
import "./page-transition.css";

/** Larger tiles = fewer DOM nodes / GSAP tweens (was ~1k+ at 40px). */
const BLOCK_SIZE = 72;
const BLOCK_DURATION = 0.22;
const STAGGER_AMOUNT = 0.45;
const PHASE_DURATION = BLOCK_DURATION + STAGGER_AMOUNT;
/** Cover phase ends here; wait/enter keep the same linear rate so the bar never surges. */
const PROGRESS_AFTER_COVER = 0.5;
const PROGRESS_WAIT_CAP = 0.88;
const PROGRESS_RATE = PROGRESS_AFTER_COVER / PHASE_DURATION;
/** Refresh has no leave phase — stretch the reveal so it still feels like a full hop. */
const LOAD_REVEAL_SCALE = 2;

function normalizePath(path?: string) {
  if (!path) return "";
  const bare = path.split("?")[0].split("#")[0];
  if (bare.length > 1 && bare.endsWith("/")) return bare.slice(0, -1);
  return bare || "/";
}

function isHomeProjectsHop(from?: string, to?: string) {
  const a = normalizePath(from);
  const b = normalizePath(to);
  return (a === "/" && b === "/projects") || (a === "/projects" && b === "/");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ProjectsIntroContextValue = {
  /** True while the /projects hard-refresh cover is active. */
  loadCoverActive: boolean;
  notifyProjectsIntroReady: () => void;
};

const ProjectsIntroContext = createContext<ProjectsIntroContextValue>({
  loadCoverActive: false,
  notifyProjectsIntroReady: () => {},
});

export function useProjectsIntro() {
  return useContext(ProjectsIntroContext);
}

type TransitionProviderProps = {
  children: ReactNode;
};

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const pathname = usePathname();
  const gridRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const coveredRef = useRef(false);
  const gridReadyRef = useRef(false);
  const projectsReadyRef = useRef(false);
  const loadRevealStartedRef = useRef(false);
  const loadCoverActiveRef = useRef(false);

  const [loadCoverActive, setLoadCoverActive] = useState(
    () => normalizePath(pathname) === "/projects",
  );
  loadCoverActiveRef.current = loadCoverActive;

  const createTransitionGrid = useCallback((opaque = false) => {
    const grid = gridRef.current;
    if (!grid) return;

    grid.replaceChildren();
    blocksRef.current = [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    const columns = Math.ceil(width / BLOCK_SIZE);
    const rows = Math.ceil(height / BLOCK_SIZE) + 1;
    const offsetX = (width - columns * BLOCK_SIZE) / 2;
    const offsetY = (height - rows * BLOCK_SIZE) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const block = document.createElement("div");
        block.className = "page-transition-block";
        block.style.width = `${BLOCK_SIZE}px`;
        block.style.height = `${BLOCK_SIZE}px`;
        block.style.left = `${column * BLOCK_SIZE + offsetX}px`;
        block.style.top = `${row * BLOCK_SIZE + offsetY}px`;
        grid.appendChild(block);
        blocksRef.current.push(block);
      }
    }

    gsap.set(blocksRef.current, { opacity: opaque ? 1 : 0, force3D: true });
  }, []);

  const finishLoadCover = useCallback(() => {
    coveredRef.current = false;
    loadCoverActiveRef.current = false;
    setLoadCoverActive(false);
    if (shellRef.current) shellRef.current.dataset.active = "false";
    setLenisPaused(false);
  }, []);

  const runReveal = useCallback(
    (onComplete: () => void, durationScale = 1) => {
      const blocks = blocksRef.current;
      const progress = progressRef.current;
      if (!blocks.length) {
        onComplete();
        return () => {};
      }

      gsap.set(blocks, { opacity: 1 });
      if (shellRef.current) shellRef.current.dataset.active = "false";

      const rate = PROGRESS_RATE / durationScale;

      if (progress) {
        const current =
          Number(gsap.getProperty(progress, "scaleX")) || PROGRESS_AFTER_COVER;
        const remaining = Math.max(0.04, 1 - current);
        gsap.killTweensOf(progress);
        gsap.to(progress, {
          scaleX: 1,
          duration: remaining / rate,
          ease: "none",
        });
      }

      const tween = gsap.to(blocks, {
        opacity: 0,
        duration: BLOCK_DURATION * durationScale,
        delay: 0.05 * durationScale,
        ease: "power1.out",
        stagger: { amount: STAGGER_AMOUNT * durationScale, from: "random" },
        onComplete: () => {
          if (progress) {
            gsap.to(progress, {
              opacity: 0,
              duration: 0.15 * durationScale,
              ease: "power1.out",
              onComplete: () => {
                gsap.set(progress, { scaleX: 0 });
              },
            });
          }
          onComplete();
        },
      });

      return () => {
        tween.kill();
        if (progress) gsap.killTweensOf(progress);
      };
    },
    [],
  );

  const tryStartLoadReveal = useCallback(() => {
    if (!loadCoverActiveRef.current) return;
    if (!gridReadyRef.current || !projectsReadyRef.current) return;
    if (loadRevealStartedRef.current) return;
    if (prefersReducedMotion()) {
      finishLoadCover();
      return;
    }

    loadRevealStartedRef.current = true;
    runReveal(() => {
      finishLoadCover();
    }, LOAD_REVEAL_SCALE);
  }, [finishLoadCover, runReveal]);

  const notifyProjectsIntroReady = useCallback(() => {
    projectsReadyRef.current = true;
    tryStartLoadReveal();
  }, [tryStartLoadReveal]);

  const introContext = useMemo(
    () => ({ loadCoverActive, notifyProjectsIntroReady }),
    [loadCoverActive, notifyProjectsIntroReady],
  );

  useLayoutEffect(() => {
    if (!loadCoverActive) return;

    if (prefersReducedMotion()) {
      finishLoadCover();
      return;
    }

    // Keep coveredRef false so TransitionRouter's initial enter() does not
    // steal this load intro and reveal before the gallery is prepped.
    setLenisPaused(true);
    createTransitionGrid(true);
    gridReadyRef.current = true;

    if (shellRef.current) shellRef.current.dataset.active = "true";

    const progress = progressRef.current;
    if (progress) {
      gsap.killTweensOf(progress);
      gsap.set(progress, { scaleX: PROGRESS_AFTER_COVER, opacity: 1 });
      const remaining = PROGRESS_WAIT_CAP - PROGRESS_AFTER_COVER;
      gsap.to(progress, {
        scaleX: PROGRESS_WAIT_CAP,
        duration: remaining / PROGRESS_RATE,
        ease: "none",
      });
    }

    // Blocks now cover; shell can drop so the reveal is the block wipe.
    if (shellRef.current) shellRef.current.dataset.active = "false";

    tryStartLoadReveal();
  }, [createTransitionGrid, finishLoadCover, loadCoverActive, tryStartLoadReveal]);

  useEffect(() => {
    if (!gridReadyRef.current) {
      createTransitionGrid(false);
      gridReadyRef.current = true;
    }

    const onResize = () => {
      createTransitionGrid(coveredRef.current || loadCoverActiveRef.current);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(blocksRef.current);
      if (progressRef.current) gsap.killTweensOf(progressRef.current);
    };
  }, [createTransitionGrid]);

  return (
    <ProjectsIntroContext.Provider value={introContext}>
      <TransitionRouter
        leave={(next, from, to) => {
          if (!isHomeProjectsHop(from, to) || prefersReducedMotion()) {
            coveredRef.current = false;
            next();
            return;
          }

          const blocks = blocksRef.current;
          const progress = progressRef.current;
          if (!blocks.length) {
            coveredRef.current = false;
            next();
            return;
          }

          setLenisPaused(true);
          coveredRef.current = true;

          if (progress) {
            gsap.killTweensOf(progress);
            gsap.set(progress, { scaleX: 0, opacity: 1 });
            gsap.to(progress, {
              scaleX: PROGRESS_AFTER_COVER,
              duration: PHASE_DURATION,
              ease: "none",
            });
          }

          const tween = gsap.fromTo(
            blocks,
            { opacity: 0 },
            {
              opacity: 1,
              duration: BLOCK_DURATION,
              ease: "power2.out",
              stagger: { amount: STAGGER_AMOUNT, from: "random" },
              onComplete: () => {
                // Same linear rate while React swaps routes / mounts the next page.
                if (progress) {
                  const remaining = PROGRESS_WAIT_CAP - PROGRESS_AFTER_COVER;
                  gsap.to(progress, {
                    scaleX: PROGRESS_WAIT_CAP,
                    duration: remaining / PROGRESS_RATE,
                    ease: "none",
                  });
                }

                requestAnimationFrame(() => {
                  startTransition(() => {
                    next();
                  });
                });
              },
            },
          );

          return () => {
            tween.kill();
            if (progress) gsap.killTweensOf(progress);
          };
        }}
        enter={(next) => {
          if (!coveredRef.current || prefersReducedMotion()) {
            coveredRef.current = false;
            setLenisPaused(false);
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: 0, opacity: 0 });
            }
            next();
            return;
          }

          const blocks = blocksRef.current;
          if (!blocks.length) {
            coveredRef.current = false;
            setLenisPaused(false);
            next();
            return;
          }

          // Yield one frame so React's mount paint isn't on the same tick as reveal.
          return runReveal(() => {
            coveredRef.current = false;
            setLenisPaused(false);
            next();
          });
        }}
      >
        <div
          ref={shellRef}
          className="page-transition-shell"
          data-active={loadCoverActive ? "true" : "false"}
          aria-hidden="true"
        />
        <div ref={gridRef} className="page-transition-grid" aria-hidden="true" />
        <div
          ref={progressRef}
          className="page-transition-progress"
          aria-hidden="true"
        />
        {children}
      </TransitionRouter>
    </ProjectsIntroContext.Provider>
  );
}
