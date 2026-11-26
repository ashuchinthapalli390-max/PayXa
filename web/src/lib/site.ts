export const site = {
  name: "PayXa",
  brandSpelling: "PayXa",
  legalName: "PayXa (CodeXa Agency)",
  tagline: "UPI Payment Automation for Indian Businesses",
  title: "PayXa — UPI Payment Automation for Indian Businesses",
  description:
    "PayXa helps Indian businesses manage UPI payment links, QR checkout, merchant payment notifications, developer integrations and automated payment reconciliation. Engineered by CodeXa Agency.",
  url: "https://payxa.in",
  locale: "en_IN",
  foundingLocation: "India",
  publisher: "CodeXa Agency",
  publisherUrl: "https://codexa.agency",
  supportEmail: "support@payxa.in",
  logoUrl: "https://payxa.in/brand/payxa-lockup.png",
  iconUrl: "https://payxa.in/brand/payxa-mark.png",
  ogImageUrl: "https://payxa.in/brand/payxa-og-card.png",
};

export type NavItem = { label: string; href: string; desc?: string };

export const productLinks: NavItem[] = [
  { label: "UPI Checkout", href: "/products/checkout", desc: "Hosted QR + UPI app launch with live state" },
  { label: "Payment Links", href: "/products/payment-links", desc: "Shareable checkout sessions in seconds" },
  { label: "QR Payments", href: "/products/qr-payments", desc: "Static and supported dynamic QR" },
  { label: "Instant Alerts", href: "/products/instant-alerts", desc: "Payment-started push to merchant phones" },
];

export const mainNav: (NavItem & { children?: NavItem[] })[] = [
  { label: "Products", href: "/products", children: productLinks },
  { label: "Solutions", href: "/solutions" },
  { label: "Developers", href: "/developers" },
  { label: "Pricing", href: "/pricing" },
  { label: "Download", href: "/download" },
  { label: "Docs", href: "/docs" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Products",
    links: [
      ...productLinks,
      { label: "How it works", href: "/how-it-works" },
      { label: "Merchant App", href: "/download" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Developer hub", href: "/developers" },
      { label: "Documentation", href: "/docs" },
      { label: "Integrations", href: "/integrations" },
      { label: "OpenAPI Spec", href: "/openapi.json" },
      { label: "System status", href: "/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About PayXa", href: "/about" },
      { label: "Brand Media Kit", href: "/brand" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/legal/terms" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Fee disclosures", href: "/legal/disclosures" },
      { label: "App permissions", href: "/legal/permissions" },
    ],
  },
];
