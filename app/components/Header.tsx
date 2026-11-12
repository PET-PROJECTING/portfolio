import { Link as TransitionLink } from "next-transition-router";
import ExternalLink from "./ExternalLink";
import Magnetic from "./Magnetic";

const navItems: {
  label: string;
  href: string;
  cursor?: "open" | "view" | "go";
  transition?: boolean;
}[] = [
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/projects", cursor: "view", transition: true },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Magnetic strength={0.18}>
          <TransitionLink
            href="/"
            data-cursor="go"
            className="inline-flex items-center gap-2.5 font-sans text-sm font-semibold tracking-[0.12em] uppercase text-foreground"
          >
            <span
              aria-hidden="true"
              className="relative size-7 shrink-0 overflow-hidden"
            >
              <img src="/favicon-32x32.png" alt="" draggable={false} />
            </span>
            Oleh Klym
          </TransitionLink>
        </Magnetic>

        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[11px] font-medium tracking-[0.14em] uppercase sm:gap-x-4"
        >
          {navItems.map((item, index) => (
            <span key={item.href} className="flex items-center gap-x-3 sm:gap-x-4">
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted-dim">
                  /
                </span>
              ) : null}
              <Magnetic strength={0.35}>
                {item.transition ? (
                  <TransitionLink
                    href={item.href}
                    data-cursor={item.cursor ?? "open"}
                    className="text-foreground transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </TransitionLink>
                ) : (
                  <a
                    href={item.href}
                    data-cursor={item.cursor ?? "open"}
                    className="text-foreground transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </a>
                )}
              </Magnetic>
            </span>
          ))}
          <span aria-hidden="true" className="text-muted-dim">
            /
          </span>
          <Magnetic strength={0.35}>
            <ExternalLink
              href="/resume"
              target="_blank"
              data-cursor="open"
              className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent"
            >
              Resume
            </ExternalLink>
          </Magnetic>
        </nav>
      </div>
    </header>
  );
}
