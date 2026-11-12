import ExternalLink from "./ExternalLink";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import SectionLabel from "./SectionLabel";

export default function Footer() {
  const contactEmail = process.env.CONTACT_EMAIL?.trim();
  if (!contactEmail) {
    throw new Error(
      "CONTACT_EMAIL is not set. Set it to the inbox for the Contact link.",
    );
  }

  const secondaryLinks = [
    {
      label: "LinkedIn",
      href: process.env.LINKEDIN_URL?.trim(),
      external: true,
    },
    {
      label: "GitHub",
      href: process.env.GITHUB_URL?.trim(),
      external: true,
    },
    { label: "Download resume", href: "/resume/download", external: false },
  ];

  return (
    <footer id="contact" aria-labelledby="footer-heading">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <SectionLabel>04 / Contact</SectionLabel>
        <div className="mt-8 flex flex-col gap-12 md:mt-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <ScrambleText
            as="h2"
            id="footer-heading"
            text="Let's build what's next."
            delayMs={60}
            durationMs={560}
            className="max-w-md text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]"
          />

          <Reveal className="md:pt-2 md:text-right">
            <Magnetic strength={0.2}>
              <ExternalLink
                href={`mailto:${contactEmail}?subject=Work%20proposal`}
                underline
                data-cursor="go"
                className="text-2xl font-semibold tracking-tight text-foreground decoration-accent md:text-3xl"
              >
                Contact
              </ExternalLink>
            </Magnetic>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground md:justify-end">
              {secondaryLinks.map((link, index) => (
                <span key={link.label} className="flex items-center gap-x-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-muted-dim">
                      /
                    </span>
                  ) : null}
                  <Magnetic strength={0.3}>
                    <ExternalLink
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      data-cursor={link.external ? "open" : "go"}
                      className="text-sm"
                    >
                      {link.label}
                    </ExternalLink>
                  </Magnetic>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
