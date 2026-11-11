import Link from "next/link";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

export default function ProjectsTeaser() {
  return (
    <section
      id="projects"
      className="border-b border-border"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <SectionLabel>02 / Personal Projects</SectionLabel>
          <h2
            id="projects-heading"
            className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em]"
          >
            Selected work.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/90 md:text-base">
            A few personal builds — open the gallery to browse them.
          </p>
          <Link
            href="/projects"
            className="mt-8 inline-block text-sm font-semibold tracking-tight text-accent transition-opacity hover:opacity-70"
          >
            View projects →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
