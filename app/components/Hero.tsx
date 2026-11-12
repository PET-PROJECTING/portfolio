import type { ReactNode } from "react";
import ExternalLink from "./ExternalLink";
import HeroDiagram from "./HeroDiagram";
import Magnetic from "./Magnetic";
import ScrambleText from "./ScrambleText";

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.92em] text-accent">
      {children}
    </code>
  );
}

export default function Hero() {
  const contactEmail = process.env.CONTACT_EMAIL?.trim();
  if (!contactEmail) {
    throw new Error(
      "CONTACT_EMAIL is not set. Set it to the inbox for the Get in touch link.",
    );
  }

  return (
    <section
      id="top"
      className="border-b border-border"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <div className="reveal mb-10 flex items-start justify-between gap-4 font-mono text-[11px] tracking-[0.16em] uppercase text-muted md:mb-14">
          <p className="flex items-center gap-2">
            Full-Stack Developer
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
            Open to work
          </p>
          <p className="flex items-center gap-2 text-right">
            Based in Ukraine
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
            Remote
          </p>
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(240px,420px)] lg:gap-10">
          <div>
            <h1
              id="hero-heading"
              className="reveal text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground"
              style={{ animationDelay: "0.08s" }}
            >
              <ScrambleText
                as="span"
                text={"Building products.\nConnecting systems."}
                trigger="immediate"
                delayMs={120}
                durationMs={620}
                className="block"
              />
            </h1>

            <div
              className="reveal mt-12 grid gap-8 sm:grid-cols-[auto_1fr] sm:gap-10 md:mt-16"
              style={{ animationDelay: "0.18s" }}
            >
              <div className="sm:pr-2">
                <p className="text-4xl font-semibold leading-none tracking-tight md:text-5xl">
                  4+ years
                </p>
                <p className="mt-3 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
                  Startup + Enterprise
                </p>
              </div>

              <div className="border-t border-border pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
                <div className="max-w-md space-y-3 text-[15px] leading-relaxed text-foreground/90 md:text-base">
                  <p>
                    I&apos;m Oleh Klym, a <strong>full-stack developer</strong>{" "}
                    working with <Code>TypeScript</Code>, <Code>React</Code>,{" "}
                    <Code>Next.js</Code>, and{" "}
                    <Code>Node.js</Code> (<Code>Express</Code>/<Code>NestJS</Code>).
                  </p>
                  <p>
                    I turn product ideas into working features, from the first
                    sketch to production, with AI as part of my daily workflow.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <Magnetic strength={0.22}>
                    <ExternalLink
                      href="/resume/download"
                      underline
                      className="text-foreground decoration-accent"
                      data-cursor="go"
                    >
                      Download resume
                    </ExternalLink>
                  </Magnetic>
                  <Magnetic strength={0.22}>
                    <ExternalLink
                      href={`mailto:${contactEmail}?subject=Work%20proposal`}
                      underline
                      className="text-foreground decoration-accent"
                      data-cursor="go"
                    >
                      Get in touch
                    </ExternalLink>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>

          <div
            className="reveal flex justify-center self-center"
            style={{ animationDelay: "0.28s" }}
          >
            <HeroDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
