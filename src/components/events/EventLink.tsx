type EventLinkProps = {
  href: string;
  className?: string;
};

export function EventLink({ href, className = "" }: EventLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-[12px] font-medium text-fare underline decoration-fare/30 hover:decoration-fare ${className}`}
    >
      Scopri di più
    </a>
  );
}
