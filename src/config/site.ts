export const siteConfig = {
  title: "Oggi a Ortona",
  description: "Mangiare e fare a Ortona. La tua guida quotidiana.",
  url: "https://oggiortona.com",
  locale: "it",
} as const;

export const navItems = [
  { label: "Mangiare", href: "/restaurants", icon: "mangiare" },
  { label: "Eventi", href: "/events", icon: "fare" },
] as const;
