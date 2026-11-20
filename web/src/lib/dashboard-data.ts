/**
 * Deterministic test-mode workspace data. Nothing here touches real money or
 * real customers; the dashboard renders it under a visible Test mode banner.
 */

export type PayStatus = "verified" | "verifying" | "detected" | "started" | "review" | "expired" | "late";
export type Method = "QR" | "UPI app" | "Payment link";

export type Payment = {
  id: string;
  order: string;
  amount: number; // paise
  status: PayStatus;
  customer: string;
  customerRef: string;
  method: Method;
  device: string;
  createdAt: string; // ISO
  utrTail: string;
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Fixed reference "now" so server and client render identical data. */
export const NOW = new Date("2026-11-21T18:30:00+05:30").getTime();

const names = [
  "Aarav Sharma", "Diya Reddy", "Kabir Mehta", "Ananya Rao", "Vihaan Gupta", "Ishita Nair", "Arjun Varma", "Saanvi Iyer",
  "Reyansh Das", "Myra Kapoor", "Aditya Kulkarni", "Kiara Joshi", "Rohan Pillai", "Meera Chopra", "Dev Malhotra", "Tara Bose",
];
const amounts = [49900, 129900, 79900, 34900, 250000, 99900, 15000, 189900, 59900, 449900, 24900, 105000];
const devices = ["Counter phone", "Owner phone", "Backup phone"];

const statusPool: PayStatus[] = [
  "verified", "verified", "verified", "verified", "verified", "verified", "verified", "verified",
  "verifying", "detected", "started", "started", "review", "expired", "late",
];

function build(): Payment[] {
  const r = rng(2026);
  const out: Payment[] = [];
  let t = NOW - 4 * 60 * 1000;
  for (let i = 0; i < 64; i++) {
    const idx = Math.floor(r() * names.length);
    // Only the newest few can still be in flight; older sessions have resolved or expired.
    let status = i < 3 ? (["started", "detected", "verifying"] as PayStatus[])[i] : statusPool[Math.floor(r() * statusPool.length)];
    if (i >= 3 && (status === "started" || status === "detected" || status === "verifying")) status = i % 2 ? "verified" : "expired";
    out.push({
      id: `pay_test_${(9_481_000 - i * 37).toString(36)}`,
      order: `PXA-${20484 - i}`,
      amount: amounts[Math.floor(r() * amounts.length)],
      status,
      customer: names[idx],
      customerRef: `cus_${(1200 + idx * 7).toString()}`,
      method: (["QR", "UPI app", "Payment link"] as Method[])[Math.floor(r() * 3)],
      device: devices[Math.floor(r() * devices.length)],
      createdAt: new Date(t).toISOString(),
      utrTail: Math.floor(100000 + r() * 899999).toString(),
    });
    t -= Math.floor(4 + r() * 70) * 60 * 1000;
  }
  return out;
}

export const payments = build();

export const statusMeta: Record<PayStatus, { label: string; tone: "ok" | "warn" | "bad" | "info" | "muted" }> = {
  verified: { label: "Verified", tone: "ok" },
  verifying: { label: "Verifying", tone: "warn" },
  detected: { label: "Detected", tone: "warn" },
  started: { label: "Checkout started", tone: "info" },
  review: { label: "Needs review", tone: "bad" },
  expired: { label: "Expired", tone: "muted" },
  late: { label: "Late payment", tone: "bad" },
};

export const formatINR = (paise: number, decimals = true) =>
  `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: decimals ? 2 : 0, maximumFractionDigits: decimals ? 2 : 0 })}`;

export function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
}

export function ago(iso: string) {
  const m = Math.round((NOW - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}

/** 14 days of verified volume (₹, not paise) for the trend chart. */
export const volumeSeries = (() => {
  const r = rng(77);
  const days: { date: string; value: number; count: number }[] = [];
  let base = 14000;
  for (let i = 13; i >= 0; i--) {
    const d = new Date(NOW - i * 86400000);
    base = Math.max(6000, base + (r() - 0.38) * 5200);
    const weekend = [0, 6].includes(d.getUTCDay()) ? 1.25 : 1;
    const value = Math.round(base * weekend);
    days.push({ date: d.toISOString(), value, count: Math.round(value / 420) });
  }
  return days;
})();

export const hourly = [2, 1, 0, 0, 1, 2, 4, 7, 11, 14, 16, 18, 21, 19, 17, 18, 22, 26, 29, 24, 18, 12, 7, 4];

export const kpis = (() => {
  const verified = payments.filter((p) => p.status === "verified");
  return {
    volume: verified.slice(0, 40).reduce((s, p) => s + p.amount, 0),
    verifiedCount: verified.length,
    active: payments.filter((p) => p.status === "started" || p.status === "detected" || p.status === "verifying").length,
    review: payments.filter((p) => p.status === "review" || p.status === "late").length,
  };
})();

export type Device = { id: string; name: string; model: string; status: "online" | "offline"; lastSync: string; queue: number; app: string; notif: boolean; battery: number };
export const deviceList: Device[] = [
  { id: "dev_01", name: "Counter phone", model: "Android 14 · Pixel 7a", status: "online", lastSync: new Date(NOW - 3000).toISOString(), queue: 0, app: "1.0.0-beta.3", notif: true, battery: 82 },
  { id: "dev_02", name: "Owner phone", model: "Android 13 · Galaxy A54", status: "online", lastSync: new Date(NOW - 60000).toISOString(), queue: 0, app: "1.0.0-beta.3", notif: true, battery: 64 },
  { id: "dev_03", name: "Backup phone", model: "Android 12 · Redmi Note 11", status: "offline", lastSync: new Date(NOW - 47 * 60000).toISOString(), queue: 2, app: "1.0.0-beta.2", notif: false, battery: 18 },
];

export type PaymentLink = { id: string; title: string; amount: number; url: string; status: "active" | "expired" | "archived"; views: number; started: number; paid: number; expires: string };
export const linkList: PaymentLink[] = [
  { id: "plink_ws2500", title: "Workshop seat — Dec batch", amount: 250000, url: "pay.payxa.example/l/ws-2500", status: "active", views: 182, started: 64, paid: 41, expires: "30 Nov" },
  { id: "plink_fee", title: "Monthly coaching fee", amount: 199900, url: "pay.payxa.example/l/coach-fee", status: "active", views: 96, started: 40, paid: 33, expires: "No expiry" },
  { id: "plink_inv1043", title: "Invoice #1043 · Design retainer", amount: 1800000, url: "pay.payxa.example/l/inv-1043", status: "active", views: 4, started: 1, paid: 0, expires: "25 Nov" },
  { id: "plink_diwali", title: "Diwali hamper pre-order", amount: 149900, url: "pay.payxa.example/l/hamper", status: "expired", views: 412, started: 151, paid: 118, expires: "Ended 3 Nov" },
  { id: "plink_old", title: "Event pass (old)", amount: 49900, url: "pay.payxa.example/l/pass", status: "archived", views: 58, started: 12, paid: 9, expires: "—" },
];

export const webhookDeliveries = [
  { id: "whd_1", event: "payment.verified", order: "PXA-20480", code: 200, ms: 142, at: new Date(NOW - 2 * 60000).toISOString() },
  { id: "whd_2", event: "payment.detected", order: "PXA-20482", code: 200, ms: 118, at: new Date(NOW - 3 * 60000).toISOString() },
  { id: "whd_3", event: "checkout.started", order: "PXA-20484", code: 200, ms: 96, at: new Date(NOW - 4 * 60000).toISOString() },
  { id: "whd_4", event: "payment.verified", order: "PXA-20476", code: 500, ms: 2011, at: new Date(NOW - 26 * 60000).toISOString() },
  { id: "whd_5", event: "payment.needs_review", order: "PXA-20470", code: 200, ms: 131, at: new Date(NOW - 41 * 60000).toISOString() },
  { id: "whd_6", event: "device.offline", order: "—", code: 200, ms: 104, at: new Date(NOW - 47 * 60000).toISOString() },
];

export const customers = (() => {
  const map = new Map<string, { name: string; ref: string; payments: number; total: number; last: string }>();
  for (const p of payments) {
    const c = map.get(p.customerRef) ?? { name: p.customer, ref: p.customerRef, payments: 0, total: 0, last: p.createdAt };
    c.payments += 1;
    if (p.status === "verified") c.total += p.amount;
    if (p.createdAt > c.last) c.last = p.createdAt;
    map.set(p.customerRef, c);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
})();

export const team = [
  { name: "Workspace owner", email: "you (signed in)", role: "Owner", last: "now" },
  { name: "Priya S.", email: "priya@aurora.store", role: "Admin", last: "2h ago" },
  { name: "Counter staff", email: "counter@aurora.store", role: "Viewer", last: "12m ago" },
];

export function timelineFor(p: Payment) {
  const t0 = new Date(p.createdAt).getTime();
  const at = (s: number) => new Date(t0 + s * 1000).toISOString();
  const steps: { label: string; detail: string; at: string; tone: "info" | "warn" | "ok" | "bad" | "muted" }[] = [
    { label: "Order created", detail: `POST /v1/orders · ${p.order}`, at: at(0), tone: "muted" },
    { label: "Checkout started", detail: "Push sent to 2 merchant devices", at: at(1), tone: "info" },
  ];
  if (["detected", "verifying", "verified", "review", "late"].includes(p.status))
    steps.push({ label: "Credit detected", detail: `${p.device} · UTR ••${p.utrTail.slice(-4)} · unique match`, at: at(38), tone: "warn" });
  if (["verifying", "verified"].includes(p.status)) steps.push({ label: "Verifying", detail: "Awaiting trusted bank/PSP confirmation", at: at(39), tone: "warn" });
  if (p.status === "verified") {
    steps.push({ label: "Payment verified", detail: "Source BANK_PSP", at: at(41), tone: "ok" });
    steps.push({ label: "Webhook delivered", detail: "payment.verified → 200 in 142 ms", at: at(42), tone: "ok" });
  }
  if (p.status === "review") steps.push({ label: "Needs review", detail: "Another open order has the same amount", at: at(40), tone: "bad" });
  if (p.status === "late") steps.push({ label: "Late payment", detail: "Credit arrived after the session expired", at: at(360), tone: "bad" });
  if (p.status === "expired") steps.push({ label: "Checkout expired", detail: "No verified payment within 5 minutes", at: at(300), tone: "muted" });
  return steps;
}
