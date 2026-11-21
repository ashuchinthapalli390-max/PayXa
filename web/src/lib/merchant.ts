/** The showcase merchant used across test-mode checkouts and the dashboard. */
export const MERCHANT = {
  name: "CodeXa Agency",
  domain: "codexa-agency.online",
  url: "https://codexa-agency.online",
  vpa: "codexa@payxatest",
  id: "merch_test_01",
  mark: "/brand/codexa-mark.png",
  logo: "/brand/codexa-logo.jpg",
  product: {
    title: "Strategy Call",
    subtitle: "30-min 1:1 website & app consult",
    category: "Web & app development",
    image: "/brand/codexa-logo.jpg",
    amount: 49900,
  },
} as const;
