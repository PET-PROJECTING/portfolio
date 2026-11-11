type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`font-mono text-[11px] tracking-[0.14em] uppercase text-muted ${className}`}
    >
      {children}
    </p>
  );
}
