export type ProductDetail = {
  slug: string;
  eyebrow: string;
  title: string;
  accent: string[];
  description: string;
  features: { title: string; body: string }[];
  flow: string[];
  note?: string;
};

export const productDetails: ProductDetail[] = [
  {
    slug: "checkout",
    eyebrow: "Product · UPI Checkout",
    title: "Checkout that\nshows every step.",
    accent: ["every", "step."],
    description:
      "A hosted UPI checkout with a validated session QR, installed UPI app options and live payment progress. Customers never install anything.",
    features: [
      { title: "Validated session QR", body: "Generated only from a validated payment session and routed only to your authorised receiving account." },
      { title: "UPI app launch", body: "On mobile, customers jump straight into the UPI app they already use, and return to the checkout where supported." },
      { title: "Live status", body: "Awaiting, detected, verifying and successful states update in realtime without the customer refreshing." },
      { title: "Countdown and expiry", body: "Sessions expire on your schedule. Payments that arrive late are flagged, never silently accepted." },
      { title: "Retry protection", body: "Idempotent session creation means double-clicks and network retries never create duplicate orders." },
      { title: "Readable by design", body: "No glow over amounts or QR codes. Checkout is calm, high-contrast and accessible." },
    ],
    flow: ["Order created by your backend", "Checkout session opened", "Customer pays in UPI app", "Payment detected", "Trusted verification", "Success screen + webhook"],
  },
  {
    slug: "payment-links",
    eyebrow: "Product · Payment Links",
    title: "Get paid from\na single link.",
    accent: ["single", "link."],
    description:
      "Create a shareable checkout in seconds and send it over WhatsApp, SMS, email or social. No website or code required.",
    features: [
      { title: "Create in seconds", body: "Amount, description, optional customer reference and expiry. That is it." },
      { title: "Single or multi-use", body: "One-time invoices or reusable links for workshops, fees and events." },
      { title: "Live tracking", body: "See views, started checkouts and verified payments per link." },
      { title: "Same alerts", body: "Every link checkout triggers the same Payment Started push to your phone." },
      { title: "Archive anytime", body: "Disable a link instantly. Customers see a clear expired screen." },
      { title: "API available", body: "Create links programmatically with POST /v1/payment-links." },
    ],
    flow: ["Create link", "Share anywhere", "Customer opens checkout", "Payment detected", "Verified", "Link stats update"],
  },
  {
    slug: "qr-payments",
    eyebrow: "Product · QR Payments",
    title: "QR for the\ncounter and beyond.",
    accent: ["counter"],
    description:
      "Static QR for your shop counter and supported dynamic QR for per-order checkout, all tied to your validated receiving account.",
    features: [
      { title: "Static merchant QR", body: "Print once for walk-in customers. Payments are surfaced for matching and review." },
      { title: "Supported dynamic QR", body: "Per-order QR with the amount and reference embedded where your acceptance method supports it." },
      { title: "Validated routing", body: "QR codes only ever point to receiving accounts that passed ownership checks." },
      { title: "Counter alerts", body: "Pair a counter phone so staff see payments arrive without opening a bank app." },
      { title: "Printable kits", body: "Download high-resolution QR standees in PayXa or your own branding." },
      { title: "Reconciliation", body: "Static QR payments without an order go to an unmatched queue for review." },
    ],
    flow: ["Generate QR", "Customer scans", "Pays in UPI app", "Credit detected", "Matched or queued", "Verified"],
    note: "Dynamic QR availability depends on your UPI acceptance method and partner support.",
  },
  {
    slug: "instant-alerts",
    eyebrow: "Product · Instant Alerts",
    title: "Know the moment\ncheckout starts.",
    accent: ["moment"],
    description:
      "PayXa dispatches a Payment Started push to every registered merchant phone the instant a new checkout session is created.",
    features: [
      { title: "Once per session", body: "A push fires once for each genuinely new checkout. Repeat sessions never spam you." },
      { title: "Tap to open", body: "Tapping the alert opens that exact order with its live timeline." },
      { title: "Multi-device", body: "Owner, counter and backup phones can all receive alerts at the same time." },
      { title: "Offline safe", body: "Events stay server-side. Phones resync authoritative state as soon as they reconnect." },
      { title: "Token hygiene", body: "Push tokens are rotated and revoked automatically when devices change." },
      { title: "Quiet hours", body: "Choose sounds, alert types and per-device preferences." },
    ],
    flow: ["checkout.started event", "Push job enqueued", "FCM high-priority dispatch", "Phone shows alert", "Tap opens order", "Live list updates"],
    note: "Dispatch is immediate on our side. Delivery time to the phone depends on Android, the device and the network and cannot be guaranteed.",
  },
];
