"use client";

import {
  Link as TransitionLink,
  useTransitionState,
} from "next-transition-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type WheelEvent } from "react";
import {
  findProjectIndexBySlug,
  projects,
  type ProjectLinkType,
} from "../data/projects";
import Magnetic from "./Magnetic";
import { useProjectsIntro } from "./TransitionProvider";
import styles from "./styles.module.css";
import gsap from "gsap";

const linkIcons: Record<ProjectLinkType, string> = {
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  npm: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>',
  demo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z"/></svg>',
  openvsx:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 2.5 7.5v9L12 22l9.5-5.5v-9L12 2zm0 2.2 7.2 4.17v7.26L12 19.8l-7.2-4.17V8.37L12 4.2zM8.2 9.1v5.8l3.8 2.2 3.8-2.2V9.1L12 6.9 8.2 9.1z"/></svg>',
  site: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.9 9h-3.17a15.4 15.4 0 0 0-1.3-5.02A8.03 8.03 0 0 1 19.9 11zM12 4c.9 0 2.4 1.9 3.1 5H8.9C9.6 5.9 11.1 4 12 4zM4.1 13h3.17c.2 1.8.66 3.5 1.3 5.02A8.03 8.03 0 0 1 4.1 13zm3.17-2H4.1a8.03 8.03 0 0 1 4.47-5.02A15.4 15.4 0 0 0 7.27 11zM12 20c-.9 0-2.4-1.9-3.1-5h6.2c-.7 3.1-2.2 5-3.1 5zm3.73-2.98A15.4 15.4 0 0 0 16.73 13h3.17a8.03 8.03 0 0 1-4.47 5.02zM16.73 11c-.2-1.8-.66-3.5-1.3-5.02A8.03 8.03 0 0 1 19.9 11h-3.17zM8.9 13c.2 1.8.66 3.5 1.3 5.02.4.1.8.18 1.2.25V13H8.9zm3.5 0v5.27c.4-.07.8-.15 1.2-.25.64-1.52 1.1-3.22 1.3-5.02H12.4z"/></svg>',
};

function stackTokens(stack: string) {
  return stack.split(/[/+,]/).map((token) => token.trim()).filter(Boolean);
}

// Play with those values to get the desired effect
const config = {
  imageCount: projects.length,
  visibleSlidesRight: 12,
  visibleSlidesLeft: 10,
  offsetStep: 10,
  rotationStep: -7,
  scaleStep: 0.05,
  blurStep: 0.25,
  brightnessStep: 0.1,
  minBrightness: 0.25,
  wheelSensitivity: 0.005,
  touchSensitivity: 0.0075,
  maxWheelDelta: 200,
  smoothing: 0.075,
  snapDelay: 250,
  swapThreshold: 0.5,
  frontThreshold: 0.45,
};

const slideCount = config.visibleSlidesLeft + config.visibleSlidesRight + 2;

type Directions = 1 | -1;

const wrapOffset = gsap.utils.wrap(
  -(config.visibleSlidesLeft + 1),
  slideCount - (config.visibleSlidesLeft + 1),
);

const wrapImageIndex = gsap.utils.wrap(0, config.imageCount);

type ProjectsProps = {
  initialProjectSlug?: string;
  openDrawer?: boolean;
  fromTeaser?: boolean;
};

function replaceProjectUrl(slug: string, fromTeaser: boolean) {
  const params = new URLSearchParams();
  params.set("project", slug);
  if (fromTeaser) params.set("from", "teaser");
  const next = `/projects?${params.toString()}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === next) return;
  window.history.replaceState(window.history.state, "", next);
}

export default function Projects({
  initialProjectSlug,
  openDrawer = false,
  fromTeaser = false,
}: ProjectsProps) {
  const { stage } = useTransitionState();
  const { loadCoverActive, notifyProjectsIntroReady } = useProjectsIntro();
  const slidesMap = useRef(new Map<number, HTMLElement>());
  const closeRef = useRef<HTMLButtonElement>(null);
  const mediaReadyRef = useRef(false);
  const introReadySentRef = useRef(false);
  const appliedEntryKeyRef = useRef<string | null>(null);
  const fromTeaserRef = useRef(fromTeaser);
  fromTeaserRef.current = fromTeaser;

  const initialIndex = useMemo(
    () => findProjectIndexBySlug(initialProjectSlug),
    [initialProjectSlug],
  );
  const startIndex = initialIndex ?? 0;
  const entryKey = `${initialProjectSlug ?? ""}:${openDrawer ? "1" : "0"}:${fromTeaser ? "teaser" : ""}`;
  const urlIndexRef = useRef(startIndex);
  const backHref = fromTeaser ? "/#projects" : "/";

  const currentPosition = useRef(startIndex);
  const targetPosition = useRef(startIndex);
  const scrollDirection = useRef<Directions>(1);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawerOpen = useRef(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [shownIndex, setShownIndex] = useState(startIndex);

  const project = projects[shownIndex];
  const nextProject = projects[wrapImageIndex(shownIndex + 1)];
  // Load intro: assign src under the cover. Client nav: wait until enter finishes.
  mediaReadyRef.current = stage === "none" || loadCoverActive;

  const goToNextProject = () => {
    const next = wrapImageIndex(shownIndex + 1);
    currentPosition.current = next;
    targetPosition.current = next;
    urlIndexRef.current = next;
    setShownIndex(next);
    setActiveIndex(next);
    replaceProjectUrl(projects[next].slug, fromTeaserRef.current);
    renderSlides();
  };

  const updateSlide = (slide: HTMLElement, position: number) => {
    const projectIndex = wrapImageIndex(Math.round(position));
    const changed = slide.dataset.project !== String(projectIndex);
    const project = projects[projectIndex];

    if (changed) {
      slide.dataset.project = String(projectIndex);
      const name = slide.querySelector("[data-name]");
      const stack = slide.querySelector("[data-stack]");
      if (name) name.textContent = project.title;
      if (stack) stack.textContent = project.stack;
    }

    const image = slide.querySelector("img");
    if (image) {
      image.alt = "";
      // Defer image decode until the page transition has finished revealing.
      if (mediaReadyRef.current) {
        const nextSrc = project.image;
        if (image.getAttribute("src") !== nextSrc) {
          image.src = nextSrc;
        }
      }
    }

  };

  const getSlideZIndex = (offset: number) => {
    const travelOffset = offset * scrollDirection.current;

    if (travelOffset >= 0) return Math.round(1000 - travelOffset * 10);
    if (travelOffset > -config.swapThreshold) return 1001;

    return Math.round(500 + travelOffset * 10);
  };

  const getSlideOpacity = (offset: number) => {
    const opacity =
      offset < 0
        ? config.visibleSlidesLeft + 1 + offset
        : config.visibleSlidesRight + 1 - offset;
    return gsap.utils.clamp(0, 1, opacity);
  };

  const renderSlides = () => {
    Array.from(slidesMap.current.entries()).forEach(([index, slide]) => {
      const offset = wrapOffset(index - currentPosition.current);
      const distance = Math.abs(offset);
      const isFront = distance < config.frontThreshold;
      const imageIndex = wrapImageIndex(Math.round(currentPosition.current + offset));

      const blur = distance * config.blurStep;
      const brightness = Math.max(
        config.minBrightness,
        1 - distance * config.brightnessStep,
      );

      updateSlide(slide, currentPosition.current + offset);

      const card = slide.querySelector<HTMLElement>("[data-card]");
      if (card && !isFront) card.removeAttribute("data-hover");

      if (isFront) {
        slide.tabIndex = 0;
        slide.setAttribute("role", "button");
        slide.setAttribute("aria-label", `Open ${projects[imageIndex].title}`);
        slide.setAttribute("aria-expanded", drawerOpen.current ? "true" : "false");
      } else {
        slide.tabIndex = -1;
        slide.removeAttribute("role");
        slide.removeAttribute("aria-label");
        slide.removeAttribute("aria-expanded");
      }
      slide.style.cursor = isFront ? "pointer" : "default";

      gsap.set(slide, {
        xPercent: offset * config.offsetStep,
        rotation: offset * config.rotationStep,
        scale: 1 - distance * config.scaleStep,
        filter: `blur(${blur}px) brightness(${brightness})`,
        opacity: getSlideOpacity(offset),
        zIndex: getSlideZIndex(offset),
      });
    });
  };

  const snapToSlide = () => {
    const outgoingPosition =
      scrollDirection.current > 0
        ? Math.floor(targetPosition.current)
        : Math.ceil(targetPosition.current);

    const distanceMoved = Math.abs(targetPosition.current - outgoingPosition);

    targetPosition.current =
      distanceMoved < config.swapThreshold
        ? outgoingPosition
        : outgoingPosition + scrollDirection.current;
  };

  const moveSlider = (amount: number) => {
    if (amount === 0 || drawerOpen.current) return;

    scrollDirection.current = Math.sign(amount) as Directions;
    targetPosition.current += amount;

    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(snapToSlide, config.snapDelay);
  };

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    event.preventDefault();
    if (drawerOpen.current) return;

    const delta = gsap.utils.clamp(
      -config.maxWheelDelta,
      config.maxWheelDelta,
      event.deltaY,
    );
    moveSlider(delta * config.wheelSensitivity);
  };

  const isFrontSlide = (index: number) =>
    Math.abs(wrapOffset(index - currentPosition.current)) < config.frontThreshold;

  const toggleDrawer = (index: number) => {
    if (!isFrontSlide(index)) return;

    if (drawerOpen.current) {
      drawerOpen.current = false;
      setActiveIndex(null);
      return;
    }

    const imageIndex = wrapImageIndex(Math.round(currentPosition.current));
    drawerOpen.current = true;
    setShownIndex(imageIndex);
    setActiveIndex(imageIndex);
  };

  const setCardHover = (slide: HTMLElement, hovered: boolean) => {
    const card = slide.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    if (hovered) card.setAttribute("data-hover", "true");
    else card.removeAttribute("data-hover");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleDrawer(index);
  };

  useLayoutEffect(() => {
    renderSlides();

    if (loadCoverActive && !introReadySentRef.current) {
      introReadySentRef.current = true;
      notifyProjectsIntroReady();
    }

    // Avoid fighting the enter wipe with the gallery ticker + image loads.
    // Under the load cover we still prep (renderSlides + src) but hold the ticker
    // until the reveal completes so motion starts with the open wipe.
    if (stage !== "none" || loadCoverActive) return;

    const tick = () => {
      currentPosition.current +=
        (targetPosition.current - currentPosition.current) * config.smoothing;
      renderSlides();

      const frontIndex = wrapImageIndex(Math.round(currentPosition.current));
      if (frontIndex === urlIndexRef.current) return;
      urlIndexRef.current = frontIndex;
      replaceProjectUrl(projects[frontIndex].slug, fromTeaserRef.current);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [stage, loadCoverActive, notifyProjectsIntroReady]);

  useEffect(() => {
    drawerOpen.current = activeIndex !== null;
    renderSlides();

    if (activeIndex === null) return;

    closeRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (stage !== "none" || loadCoverActive) return;
    if (appliedEntryKeyRef.current === entryKey) return;
    appliedEntryKeyRef.current = entryKey;

    // Keep the fan on a small index range so slide offsets stay stable.
    currentPosition.current = startIndex;
    targetPosition.current = startIndex;
    urlIndexRef.current = startIndex;
    setShownIndex(startIndex);
    replaceProjectUrl(projects[startIndex].slug, fromTeaser);
    renderSlides();

    if (openDrawer && initialIndex !== null) {
      drawerOpen.current = true;
      setActiveIndex(initialIndex);
    } else {
      drawerOpen.current = false;
      setActiveIndex(null);
    }
  }, [
    entryKey,
    initialIndex,
    openDrawer,
    fromTeaser,
    stage,
    loadCoverActive,
    startIndex,
  ]);

  return (
    <main aria-label="Projects gallery">
      <Magnetic strength={0.24} className={styles.back}>
        <TransitionLink
          href={backHref}
          data-cursor="go"
          className={styles.backLink}
        >
          <span aria-hidden="true" className={styles.backArrow}>
            ←
          </span>
          Back
        </TransitionLink>
      </Magnetic>
      <p className={`${styles.explore} ${activeIndex !== null ? styles.exploreHidden : ""}`}>
        Scroll to explore
      </p>
      <section className={styles.slider} onWheel={handleWheel}>
        <div className={`${styles.slides} ${activeIndex !== null ? styles.slidesOpen : ""}`}>
          {Array.from({ length: slideCount }, (_, index) => (
            <div
              key={index}
              className={styles.slide}
              ref={(node) => {
                if (node) slidesMap.current.set(index, node);
                else slidesMap.current.delete(index);
              }}
              onMouseEnter={(event) => {
                if (isFrontSlide(index)) setCardHover(event.currentTarget, true);
              }}
              onMouseLeave={(event) => setCardHover(event.currentTarget, false)}
              onClick={() => toggleDrawer(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <div className={styles.card} data-card="">
                <div className={styles.face}>
                  <p className={styles.faceName} data-name="" />
                  <img className={styles.faceImg} alt="" draggable={false} />
                  <div className={styles.faceFooter}>
                    <p className={styles.faceStack} data-stack="" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeIndex !== null ? (
        <button
          type="button"
          className={styles.drawerBackdrop}
          aria-label="Close project details"
          onClick={() => {
            drawerOpen.current = false;
            setActiveIndex(null);
          }}
        />
      ) : null}

      <aside
        className={`${styles.drawer} ${activeIndex !== null ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={activeIndex === null}
        aria-labelledby="project-drawer-title"
        inert={activeIndex === null}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.drawerClose}
          onClick={() => {
            drawerOpen.current = false;
            setActiveIndex(null);
          }}
        >
          Close
        </button>

        <div className={styles.drawerBody}>
          <div className={styles.drawerIntro}>
            <h2 id="project-drawer-title" className={styles.drawerTitle}>
              {project.title}
            </h2>
            <p className={styles.drawerMeta}>{project.category}</p>
          </div>

          <div className={styles.drawerSection}>
            <h3 className={styles.drawerLabel}>
              <span aria-hidden="true" className={styles.drawerMark} />
              Overview
            </h3>
            <p className={styles.drawerCopy}>{project.overview}</p>
          </div>

          <div className={styles.drawerSection}>
            <h3 className={styles.drawerLabel}>
              <span aria-hidden="true" className={styles.drawerMark} />
              Links
            </h3>
            <ul className={styles.drawerLinks}>
              {project.links.map((link) => (
                <li key={`${link.type}-${link.href}`}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="open"
                    data-link-type={link.type}
                    className={styles.drawerLink}
                  >
                    <span
                      className={styles.drawerLinkIcon}
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: linkIcons[link.type],
                      }}
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.drawerSection}>
            <h3 className={styles.drawerLabel}>
              <span aria-hidden="true" className={styles.drawerMark} />
              Stack
            </h3>
            <ul className={styles.drawerChips}>
              {stackTokens(project.stack).map((token) => (
                <li key={token} className={styles.drawerChip}>
                  {token}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.drawerFooter}>
            <button
              type="button"
              className={styles.drawerNext}
              onClick={goToNextProject}
              data-cursor="go"
            >
              Next project →
              <span className={styles.drawerNextName}>{nextProject.title}</span>
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
