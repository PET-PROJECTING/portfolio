import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import SectionLabel from "./SectionLabel";

const roles = [
  {
    company: "Magnoli",
    href: "https://magnoli.ai/",
    host: "magnoli.ai",
    image: "/og/magnoli.png",
    previewTitle: "The operating system for modern dry cleaning",
    duration: "4 Months · Full-Stack Developer · Remote",
    overview: "AI-Powered Dry-Cleaning Platform · Startup",
    features:
      "Route planning & delivery · Payments & subscriptions · AI admin chat · MCP servers",
    integrations:
      "Google Maps Platform · Stripe · OpenAI SDK · AWS · Grafana · Doppler",
    achievements:
      "Spec-driven development setup · CodeRabbit AI reviews",
    stack: "Next.js / NestJS / React / TypeScript / BullMQ / Turborepo",
  },
  {
    company: "Teladoc Health",
    href: "https://www.teladochealth.com/",
    host: "teladochealth.com",
    image: "/og/teladoc-home.png",
    previewTitle: "Connecting you to better health",
    duration: "Almost 4 Years · Full-Stack Developer · Remote",
    overview: "Global Telehealth Platform · Enterprise",
    features:
      "EHR referrals · Scheduling service · Calendars · UI libraries · Multi-tenant · Event-driven · Microservices · Real-time chat & video · Provider dashboards",
    integrations:
      "Kafka · VIM SDK · Nylas · Google Calendar · iCal · Twilio · Amplitude · New Relic",
    achievements:
      "Referral system (+170% referrals) · Amplitude integration (+15% feature engagement) · Scheduling service with Nylas API",
    stack: "React / TypeScript / Ruby on Rails / Node.js / GraphQL / RxJS",
  },
] as const;

const fields = [
  { key: "overview", label: "Overview", separator: " · " },
  { key: "features", label: "Features", separator: " · " },
  { key: "integrations", label: "Integrations", separator: " · " },
  { key: "achievements", label: "Achievements", separator: " · " },
  { key: "stack", label: "Stack", separator: " / " },
] as const;

function Phrases({ text, separator }: { text: string; separator: string }) {
  const parts = text.split(separator);
  const mark = separator.trim();

  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {index > 0 ? " " : null}
      <span className="inline-block whitespace-nowrap">
        {part}
        {index < parts.length - 1 ? (
          <span aria-hidden="true">{`\u00A0${mark}`}</span>
        ) : null}
      </span>
    </span>
  ));
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="border-b border-border"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <SectionLabel>01 / Commercial Experience</SectionLabel>
        <ScrambleText
          as="h2"
          id="experience-heading"
          text="Built in production."
          delayMs={60}
          durationMs={520}
          className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em]"
        />

        <ul className="mt-12 md:mt-16">
          {roles.map((role, index) => (
            <li
              key={role.company}
              className="border-t border-border py-8 md:py-10"
            >
              <Reveal delayMs={index * 100}>
                <div className="grid gap-6 md:grid-cols-[minmax(220px,340px)_1fr] md:items-start md:gap-10">
                  <div>
                    <ScrambleText
                      as="h3"
                      text={role.company}
                      delayMs={120 + index * 80}
                      durationMs={480}
                      className="font-serif text-3xl font-normal tracking-tight md:text-[2.15rem]"
                    />
                    <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                      {role.duration}
                    </p>
                    <a
                      href={role.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="open"
                      aria-label={`${role.company} — ${role.previewTitle}`}
                      className="group mt-5 block overflow-hidden border border-border transition-colors hover:border-foreground/35"
                    >
                      <div className="relative aspect-[1200/630] overflow-hidden bg-background">
                        <img
                          src={role.image}
                          alt=""
                          className="absolute inset-0 scale-[1.01] transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.035]"
                        />
                      </div>
                      <p className="flex items-center justify-between px-3 py-2.5 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                        {role.host}
                        <span aria-hidden="true" className="text-accent">
                          ↗
                        </span>
                      </p>
                    </a>
                  </div>

                  <dl
                    data-cursor-hide=""
                    className="grid gap-5 border-t border-border pt-5 md:border-t-0 md:border-l md:pt-1 md:pl-10"
                  >
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className="grid gap-1.5 sm:grid-cols-[7.75rem_1fr] sm:gap-6"
                      >
                        <dt className="pt-0.5 font-mono text-[11px] tracking-[0.14em] text-muted-dim uppercase">
                          {field.label}
                        </dt>
                        <dd
                          className={
                            field.key === "overview"
                              ? "font-mono text-[11px] leading-relaxed tracking-[0.12em] text-foreground/90 uppercase"
                              : field.key === "stack"
                                ? "font-mono text-[11px] leading-relaxed tracking-[0.04em] text-muted-dim"
                                : field.key === "achievements"
                                  ? "text-sm leading-relaxed text-accent md:text-[15px]"
                                  : "text-sm leading-relaxed text-muted md:text-[15px]"
                          }
                        >
                          {field.key === "achievements" ? (
                            <ul className="m-0 list-none space-y-1 p-0">
                              {role.achievements.split(" · ").map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <Phrases
                              text={role[field.key]}
                              separator={field.separator}
                            />
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
