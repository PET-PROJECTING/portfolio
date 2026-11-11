import ExternalLink from "./ExternalLink";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const secondaryLinks = ["LinkedIn", "GitHub", "Download résumé"] as const;

export default function Footer() {
  return (
    <footer id="contact" aria-labelledby="footer-heading">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <SectionLabel>04 / Contact</SectionLabel>
        </Reveal>

        <Reveal
          delayMs={100}
          className="mt-8 flex flex-col gap-12 md:mt-10 md:flex-row md:items-start md:justify-between md:gap-16"
        >
          <div className="flex min-h-[160px] flex-col justify-between md:min-h-[200px]">
            <h2
              id="footer-heading"
              className="max-w-md text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]"
            >
              Let&apos;s build what&apos;s next.
            </h2>
            <p className="mt-10 font-mono text-[11px] tracking-[0.08em] text-muted md:mt-0">
              Oleh Klym · Ukraine
            </p>
          </div>

          <div className="md:pt-2 md:text-right">
            <ExternalLink
              underline
              className="text-2xl font-semibold tracking-tight text-foreground decoration-accent md:text-3xl"
            >
              Contact
            </ExternalLink>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground md:justify-end">
              {secondaryLinks.map((label, index) => (
                <span key={label} className="flex items-center gap-x-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-muted-dim">
                      /
                    </span>
                  ) : null}
                  <ExternalLink className="text-sm">{label}</ExternalLink>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
