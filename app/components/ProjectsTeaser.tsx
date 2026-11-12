import { Link as TransitionLink } from "next-transition-router";
import {
  projectGalleryHref,
  projects,
  type Project,
} from "../data/projects";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import SectionLabel from "./SectionLabel";
import styles from "./ProjectsTeaser.module.css";

const projectCount = projects.length;
const marqueeProjects = [...projects, ...projects];
const featuredHref = projectGalleryHref(projects[0].slug);

function projectNumber(index: number) {
  return String((index % projectCount) + 1).padStart(2, "0");
}

function ProjectCard({
  project,
  number,
  duplicate = false,
}: {
  project: Project;
  number: string;
  duplicate?: boolean;
}) {
  return (
    <TransitionLink
      href={projectGalleryHref(project.slug, {
        open: true,
        from: "teaser",
      })}
      data-cursor="view"
      className={styles.card}
      aria-label={`View ${project.title} in the gallery`}
      aria-hidden={duplicate ? true : undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <div className={styles.media}>
        <img src={project.image} alt="" />
      </div>
      <div className={styles.label}>
        <div className={styles.labelRow}>
          <span className={styles.index}>{number}</span>
          <span className={styles.viewCue} aria-hidden="true">
            View →
          </span>
        </div>
        <p className={styles.name}>{project.title}</p>
        <p className={styles.tag}>{project.category}</p>
      </div>
    </TransitionLink>
  );
}

export default function ProjectsTeaser() {
  return (
    <section
      id="projects"
      className="border-b border-border"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-16 md:px-10 md:pt-24">
        <SectionLabel>02 / Personal Projects</SectionLabel>
        <ScrambleText
          as="h2"
          id="projects-heading"
          text="Selected work."
          delayMs={60}
          durationMs={500}
          className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em]"
        />
        <Reveal>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/90 md:text-base">
            Side projects where I try new ideas, designs and tools. Better seen
            than described.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Magnetic strength={0.24}>
              <TransitionLink
                href={featuredHref}
                data-cursor="view"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold tracking-tight text-background transition-[filter] hover:brightness-110"
              >
                Explore the gallery
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  →
                </span>
              </TransitionLink>
            </Magnetic>
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              {projectCount} projects
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10 pb-10 md:mt-12 md:pb-14" delayMs={80}>
        <div className={styles.marquee} data-cursor-hide="">
          <div className={styles.track}>
            {marqueeProjects.map((project, index) => (
              <ProjectCard
                key={`${project.slug}-${index}`}
                project={project}
                number={projectNumber(index)}
                duplicate={index >= projectCount}
              />
            ))}
          </div>
        </div>
        <div className={styles.staticRow} data-cursor-hide="">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              number={projectNumber(index)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
