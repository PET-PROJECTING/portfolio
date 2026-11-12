import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import SectionLabel from "./SectionLabel";

const stack = [
  {
    label: "Frontend",
    value:
      "React / TypeScript / Next.js / Redux / Zustand / React Query / Tailwind / Storybook / RxJS",
  },
  {
    label: "Backend",
    value:
      "Node.js / NestJS / Express / Ruby on Rails / GraphQL / tRPC / REST / WebSockets",
  },
  {
    label: "Data & Messaging",
    value: "PostgreSQL / Prisma / Supabase / MongoDB / Redis / Kafka / BullMQ",
  },
  {
    label: "DevOps & Testing",
    value:
      "Docker / GitHub Actions / AWS / Vercel / New Relic / Sentry / Jest / React Testing Library / Playwright",
  },
  {
    label: "AI",
    value:
      "OpenAI SDK / MCP / AI agents / Spec-driven / Cursor / Claude Code / CodeRabbit",
  },
] as const;

const howIWork = [
  {
    title: "Own it end to end.",
    body: "I start with what the user needs, then take it from idea to release and beyond.",
  },
  {
    title: "Spec first, then code.",
    body: "A short spec keeps me, the team and the AI on the same page.",
  },
  {
    title: "AI-assisted, human-reviewed.",
    body: "AI writes a lot of the code, but I review and test every line that ships.",
  },
  {
    title: "Honest feedback.",
    body: "I value good code reviews and open feedback, in both directions.",
  },
] as const;

export default function About() {
  return (
    <section
      id="stack"
      className="border-b border-border"
      aria-labelledby="stack-heading"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <SectionLabel>03 / How I Work & Stack</SectionLabel>
        <ScrambleText
          as="h2"
          id="stack-heading"
          text="From idea to production."
          delayMs={60}
          durationMs={560}
          className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-[-0.03em]"
        />

        <Reveal delayMs={120} className="mt-12 md:mt-16">
          <div className="grid gap-10 md:grid-cols-2 md:gap-0">
            <div className="max-w-md md:pr-12">
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
                How I work:
              </p>

              <ul className="mt-5 space-y-5">
                {howIWork.map((item) => (
                  <li key={item.title} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.02em] text-foreground md:text-base">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted md:text-[15px]">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="border-t border-border pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              {stack.map((item, index) => (
                <div
                  key={item.label}
                  className="grid gap-2 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[120px_1fr] sm:items-baseline sm:gap-6"
                >
                  <ScrambleText
                    as="dt"
                    text={item.label}
                    delayMs={100 + index * 60}
                    durationMs={420}
                    className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted"
                  />
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
