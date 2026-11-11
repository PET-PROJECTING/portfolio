import ExternalLink from "./ExternalLink";
import HeroDiagram from "./HeroDiagram";

export default function Hero() {
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
          </p>
          <p className="flex items-center gap-2 text-right">
            Based in Ukraine
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
          </p>
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(240px,420px)] lg:gap-10">
          <div>
            <h1
              id="hero-heading"
              className="reveal text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground"
              style={{ animationDelay: "0.08s" }}
            >
              Building products.
              <br />
              Connecting systems.
            </h1>

            <div
              className="reveal mt-12 grid gap-8 sm:grid-cols-[auto_1fr] sm:gap-10 md:mt-16"
              style={{ animationDelay: "0.18s" }}
            >
              <div className="sm:pr-2">
                <p className="text-3xl font-semibold tracking-tight md:text-4xl">
                  4+ Years
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
                  Startup + Enterprise
                </p>
              </div>

              <div className="border-t border-border pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
                <p className="max-w-md text-[15px] leading-relaxed text-foreground/90 md:text-base">
                  I&apos;m Oleh Klym. I build full-stack applications, from the
                  interface to the systems behind it.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <ExternalLink
                    underline
                    className="text-foreground decoration-accent"
                  >
                    Download résumé
                  </ExternalLink>
                  <ExternalLink
                    underline
                    className="text-foreground decoration-accent"
                  >
                    Get in touch
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>

          <div
            className="reveal flex justify-center lg:justify-end"
            style={{ animationDelay: "0.28s" }}
          >
            <HeroDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
