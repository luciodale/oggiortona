type IconBubbleProps = {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
};

export function IconBubble({ href, label, external = false, children }: IconBubbleProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary/40 no-underline transition-all hover:bg-primary hover:text-white"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}
