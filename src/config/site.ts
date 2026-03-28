export const siteConfig = {
  title: "Oggi a Ortona",
  description: "Mangiare e fare a Ortona. La tua guida quotidiana.",
  url: "https://oggiortona.com",
  locale: "it",
} as const;

export const navItems = [
  { label: "Mangiare", href: "/mangiare", icon: "mangiare" },
  { label: "Fare", href: "/fare", icon: "fare" },
] as const;
