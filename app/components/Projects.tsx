"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type WheelEvent } from "react";
import styles from "./styles.module.css";
import gsap from "gsap";

const projects = [
  {
    title: "Ember & Oak",
    category: "Specialty coffee",
    year: "2026",
    role: "Design & front end",
    stack: "Next.js / React",
    type: "Commerce",
    overview:
      "A storefront for a small-batch roaster. The page opens with the roast story, then a product grid for the house coffees, with origin, roast level, and price on each cup.",
  },
  {
    title: "Lumetric",
    category: "Product analytics",
    year: "2026",
    role: "Design & front end",
    stack: "Next.js / React",
    type: "Dashboard",
    overview:
      "An analytics home for a product team. Active users, revenue, conversion, and churn sit up front, with traffic sources and a signup funnel underneath.",
  },
  {
    title: "Wanderlines",
    category: "Travel journal",
    year: "2026",
    role: "Design & front end",
    stack: "Next.js / React",
    type: "Editorial",
    overview:
      "A slow-travel magazine. A full-bleed destination opens the page, then the latest stories split into destinations, guides, and dispatches.",
  },
  {
    title: "Stride Lab",
    category: "Footwear",
    year: "2026",
    role: "Design & front end",
    stack: "Next.js / React",
    type: "Commerce",
    overview:
      "A sneaker shop built around one hero product. The drop leads, and a featured row keeps colorways, price, and add-to-cart within reach.",
  },
  {
    title: "Still Water",
    category: "Yoga & wellness",
    year: "2026",
    role: "Design & front end",
    stack: "Next.js / React",
    type: "Studio",
    overview:
      "A studio site that puts the week's classes first. Each day shows the practice, the time, and the teacher, with a straight path to booking.",
  },
] as const;

const config = {
  imageCount: projects.length,
  visibleSlidesRight: 5,
  visibleSlidesLeft: 5,
  offsetStep: 12,
  rotationStep: -4,
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

export default function Projects() {
  const slidesMap = useRef(new Map<number, HTMLElement>());
  const closeRef = useRef<HTMLButtonElement>(null);

  const currentPosition = useRef(0);
  const targetPosition = useRef(0);
  const scrollDirection = useRef<Directions>(1);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawerOpen = useRef(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [shownIndex, setShownIndex] = useState(0);

  const project = projects[shownIndex];

  const updateSlideImage = (slide: HTMLElement, position: number) => {
    const imageIndex = wrapImageIndex(Math.round(position));

    if (slide.dataset.image === String(imageIndex)) return;

    slide.dataset.image = String(imageIndex);
    const img = slide.querySelector("img");
    if (!img) return;
    img.src = `/img${imageIndex + 1}.jpg`;
    img.alt = projects[imageIndex].title;
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

      updateSlideImage(slide, currentPosition.current + offset);

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

    const tick = () => {
      currentPosition.current +=
        (targetPosition.current - currentPosition.current) * config.smoothing;
      renderSlides();
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, []);

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

  return (
    <main aria-label="Projects gallery">
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
                <img className={styles.slideImg} alt="" draggable={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

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
            <p className={styles.drawerMeta}>
              {project.category}
              <span aria-hidden="true"> · </span>
              {project.year}
            </p>

            <dl className={styles.drawerFacts}>
              {(
                [
                  ["Role", project.role],
                  ["Stack", project.stack],
                  ["Year", project.year],
                  ["Type", project.type],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className={styles.drawerLabel}>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.drawerOverview}>
            <h3 className={styles.drawerLabel}>
              <span aria-hidden="true" className={styles.drawerMark} />
              Overview
            </h3>
            <p>{project.overview}</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
