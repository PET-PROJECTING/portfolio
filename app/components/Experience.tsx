import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const roles = [
  {
    company: "Magnoli",
    meta: "4 Months · AI-Powered Dry-Cleaning Platform",
    highlights:
      "Route planning & delivery · Stripe payments · AI admin chat & MCP servers",
    stack: "Next.js / NestJS / React / BullMQ / Turborepo",
  },
  {
    company: "Teladoc Health",
    meta: "Almost 4 Years · Telemedicine Enterprise",
    highlights:
      "EHR referrals · Multi-tenant scheduling · Real-time chat & video · Provider dashboards",
    stack: "Kafka / WebSockets / GraphQL / RxJS / Ruby on Rails",
  },
] as const;

export default function Experience() {
  return (
    <section
      id="experience"
      className="border-b border-border"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <SectionLabel>01 / Commercial Experience</SectionLabel>
          <h2
            id="experience-heading"
            className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em]"
          >
            Built in production.
          </h2>
        </Reveal>

        <ul className="mt-12 md:mt-16">
          {roles.map((role, index) => (
            <li
              key={role.company}
              className="border-t border-border py-8 last:pb-0 md:py-10"
            >
              <Reveal delayMs={index * 100}>
                <div className="grid gap-6 md:grid-cols-[minmax(160px,280px)_1fr] md:gap-10">
                  <h3 className="font-serif text-3xl font-normal tracking-tight md:text-[2.15rem]">
                    {role.company}
                  </h3>
                  <div className="border-t border-border pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-10">
                    <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-foreground/90">
                      {role.meta}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
                      {role.highlights}
                    </p>
                    <p className="mt-3 font-mono text-[11px] tracking-[0.04em] text-muted-dim">
                      {role.stack}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
