import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const stack = [
  {
    label: "Frontend",
    value: "React / TypeScript / Next.js",
  },
  {
    label: "Backend",
    value: "Node.js / Express / NestJS / Ruby on Rails",
  },
] as const;

export default function About() {
  return (
    <section
      id="about"
      className="border-b border-border"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <SectionLabel>03 / About & Stack</SectionLabel>
          <h2
            id="about-heading"
            className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em]"
          >
            Across the whole stack.
          </h2>
        </Reveal>

        <Reveal delayMs={120} className="mt-12 md:mt-16">
          <div className="grid gap-10 md:grid-cols-2 md:gap-0">
            <p className="max-w-md text-[15px] leading-relaxed text-foreground/90 md:pr-12 md:text-base">
              4+ years across enterprise and startup teams. Comfortable with
              monoliths, microservices, event-driven systems and monorepos.
            </p>

            <dl className="border-t border-border pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              {stack.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[120px_1fr] sm:items-baseline sm:gap-6"
                >
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-foreground md:text-[15px]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
