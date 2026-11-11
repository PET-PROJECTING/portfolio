type ExternalLinkProps = {
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
};

/** Visual link control — inert until real destinations are wired. */
export default function ExternalLink({
  children,
  className = "",
  underline = false,
}: ExternalLinkProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit transition-opacity hover:opacity-80 ${
        underline ? "underline decoration-accent decoration-2 underline-offset-6" : ""
      } ${className}`}
    >
      {children}
      <span aria-hidden="true" className="text-accent">
        ↗
      </span>
    </button>
  );
}
