import type { ReactNode } from "react";

const re =
  /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|\b(\d+)\b|\b(const|let|var|await|async|import|from|export|default|function|return|if|else|new|require|def|class|use|echo|true|false|null|None|True|False|try|catch|with|as|print|fn|for|in|of|public|private|throw)\b|(<\/?[A-Za-z][\w.]*|\/?>)/g;

/** Tiny, dependency-free highlighter good enough for marketing snippets. */
export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  re.lastIndex = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? "tok-c" : m[2] ? "tok-s" : m[3] ? "tok-n" : m[4] ? "tok-k" : "tok-k";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export const snippets: { id: string; label: string; file: string; code: string }[] = [
  {
    id: "js",
    label: "JavaScript",
    file: "checkout.html",
    code: `<script src="https://checkout.payxa.in/sdk/v1/payxa.js"></script>
<button id="pay-button">Pay with PayXa</button>

<script>
  document.getElementById("pay-button").addEventListener("click", async () => {
    // Your backend prices the order and creates the PayXa checkout session
    const res = await fetch("/api/create-checkout", { method: "POST" });
    if (!res.ok) return alert("Checkout unavailable");
    const { checkoutUrl } = await res.json();

    new PayXa().open({
      checkoutUrl, // redirect on phones (UPI apps open), popup on desktop
      onStatus: (e) => console.log(e.state), // display only — never fulfil from the browser
    });
  });
</script>`,
  },
  {
    id: "node",
    label: "Node.js",
    file: "server.js",
    code: `import express from "express";
const app = express();
const PAYXA = "https://api.payxa.in/v1";
const auth = { Authorization: \`Bearer \${process.env.PAYXA_SECRET_KEY}\`, "Content-Type": "application/json" };

app.post("/api/create-checkout", async (req, res) => {
  const merchantOrderId = "ORDER-" + crypto.randomUUID();

  // 1. Order — integer paise, idempotent on retries
  const order = await fetch(\`\${PAYXA}/orders\`, {
    method: "POST",
    headers: { ...auth, "Idempotency-Key": merchantOrderId },
    body: JSON.stringify({ merchant_order_id: merchantOrderId, amount_paise: 49900 }), // ₹499.00
  }).then((r) => r.json());

  // 2. Checkout session for that order
  const session = await fetch(\`\${PAYXA}/checkout-sessions\`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ order_id: order.data.public_id, expires_in_seconds: 900 }),
  }).then((r) => r.json());

  res.json({ checkoutUrl: session.data.checkout_url });
});`,
  },
  {
    id: "react",
    label: "React",
    file: "PayButton.tsx",
    code: `"use client";
import Script from "next/script";

declare global {
  interface Window { PayXa?: new () => { open(o: { checkoutUrl: string; onStatus?: (e: { state: string }) => void }): boolean } }
}

export function PayButton() {
  async function pay() {
    const res = await fetch("/api/create-checkout", { method: "POST" });
    const { checkoutUrl } = await res.json();
    new window.PayXa!().open({ checkoutUrl });
  }

  return (
    <>
      <Script src="https://checkout.payxa.in/sdk/v1/payxa.js" strategy="afterInteractive" />
      <button onClick={pay}>Pay with PayXa</button>
    </>
  );
}`,
  },
  {
    id: "php",
    label: "PHP",
    file: "create-checkout.php",
    code: `<?php
function payxa(string $path, array $body, array $headers = []): array {
  $ch = curl_init("https://api.payxa.in/v1" . $path);
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => array_merge([
      "Authorization: Bearer " . getenv("PAYXA_SECRET_KEY"),
      "Content-Type: application/json",
    ], $headers),
    CURLOPT_POSTFIELDS => json_encode($body),
  ]);
  return json_decode(curl_exec($ch), true)["data"];
}

$ref = "ORDER-" . bin2hex(random_bytes(6));
$order = payxa("/orders", ["merchant_order_id" => $ref, "amount_paise" => 49900], ["Idempotency-Key: $ref"]);
$session = payxa("/checkout-sessions", ["order_id" => $order["public_id"]]);
echo json_encode(["checkoutUrl" => $session["checkout_url"]]);`,
  },
  {
    id: "python",
    label: "Python",
    file: "webhook.py",
    code: `import hmac, hashlib, time
from flask import Flask, request, abort

app = Flask(__name__)
SECRET = b"your_endpoint_signing_secret"

@app.post("/webhooks/payxa")
def payxa_webhook():
    # Header: X-PayXa-Signature: t=<unix seconds>,v1=<hex hmac>
    parts = dict(p.split("=", 1) for p in request.headers["X-PayXa-Signature"].split(","))
    ts, sig = parts["t"], parts["v1"]
    if abs(time.time() - int(ts)) > 300:
        abort(400)  # replay protection
    expected = hmac.new(SECRET, f"{ts}.".encode() + request.get_data(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, sig):
        abort(401)

    event = request.get_json()
    if event["type"] == "payment.verified":
        fulfil_once(event["data"]["order_id"], event["id"])  # idempotent on event id
    return "", 200`,
  },
];

export const webhookSample = `{
  "id": "pevt_example_1001",
  "type": "payment.verified",
  "created_at": "2026-11-20T14:00:00Z",
  "data": {
    "order_id": "ord_example_1001",
    "merchant_order_id": "ORDER-1001",
    "amount_paise": 49900,
    "currency": "INR"
  }
}`;

export const endpoints: [string, string, string][] = [
  ["POST", "/v1/orders", "Create an order"],
  ["GET", "/v1/orders/{id}", "Fetch an order"],
  ["POST", "/v1/checkout-sessions", "Start a checkout session"],
  ["GET", "/v1/checkout-sessions/{id}", "Session status"],
  ["GET", "/v1/payments/{id}", "Payment with evidence timeline"],
  ["GET", "/v1/transactions", "List transactions"],
  ["POST", "/v1/payment-links", "Create a payment link"],
  ["POST", "/v1/webhook-endpoints", "Register a webhook endpoint"],
  ["GET", "/v1/webhook-deliveries", "Delivery log"],
  ["GET", "/v1/devices", "Paired merchant devices"],
  ["POST", "/v1/devices/pair", "Pair a device"],
  ["GET", "/v1/reconciliation", "Review queue"],
];

export const webhookEvents: [string, string][] = [
  ["checkout.started", "A customer opened a new checkout session"],
  ["checkout.observation_completed", "Checkout completed from matched payment notification (unverified by bank)"],
  ["checkout.expired", "The session expired without verified payment"],
  ["payment.detected", "Credit evidence arrived and matched an order"],
  ["payment.verifying", "Waiting on trusted bank/PSP confirmation"],
  ["payment.verified", "Trusted confirmation received. Safe to fulfil"],
  ["payment.needs_review", "Conflict or ambiguity needs a human"],
  ["payment.late_detected", "Payment arrived after the session expired"],
  ["payment.reconciliation_updated", "A review case changed state"],
  ["device.offline", "A paired merchant device stopped syncing"],
];
