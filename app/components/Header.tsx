import ExternalLink from "./ExternalLink";

const navItems = [
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-5 md:px-10">
        <a
          href="/"
          className="font-sans text-sm font-semibold tracking-[0.12em] uppercase text-foreground"
        >
          Oleh Klym
        </a>

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
              <a
                href={item.href}
                className="text-foreground transition-opacity hover:opacity-70"
              >
                {item.label}
              </a>
            </span>
          ))}
          <span aria-hidden="true" className="text-muted-dim">
            /
          </span>
          <ExternalLink className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent">
            Résumé
          </ExternalLink>
        </nav>
      </div>
    </header>
  );
}
