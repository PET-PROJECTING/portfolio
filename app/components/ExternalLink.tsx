type ExternalLinkProps = {
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
  href?: string;
  target?: "_blank" | "_self";
  "data-cursor"?: "open" | "view" | "go";
};

export default function ExternalLink({
  children,
  className = "",
  underline = false,
  href,
  target,
  "data-cursor": dataCursor,
}: ExternalLinkProps) {
  const classes = `inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit transition-opacity hover:opacity-80 ${
    underline ? "underline decoration-accent decoration-2 underline-offset-6" : ""
  } ${className}`;

  const content = (
    <>
      {children}
      <span aria-hidden="true" className="text-accent">
        ↗
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        data-cursor={dataCursor}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} data-cursor={dataCursor ?? "go"}>
      {content}
    </button>
  );
}
