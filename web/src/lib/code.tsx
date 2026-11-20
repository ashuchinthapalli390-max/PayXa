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
    code: `<script src="https://cdn.payxa.example/v1/checkout.js"></script>
<button id="pay-button">Pay with PayXa</button>

<script>
  document.getElementById("pay-button").addEventListener("click", async () => {
    // Your backend verifies the price and creates the session
    const res = await fetch("/api/create-checkout", { method: "POST" });
    if (!res.ok) return alert("Checkout unavailable");
    const { sessionToken } = await res.json();

    PayXaCheckout.open({
      sessionToken,
      onEvent: (event) => {
        // Display updates only. Never fulfil from the browser.
        console.log(event.type);
      },
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

app.post("/api/create-checkout", async (req, res) => {
  const order = await fetch("https://api.payxa.example/v1/orders", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.PAYXA_SECRET_KEY}\`,
      "Idempotency-Key": crypto.randomUUID(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_order_id: "ORDER-1001",
      amount: 49900, // paise → ₹499.00
      currency: "INR",
      checkout: { expires_in_seconds: 300 },
    }),
  }).then((r) => r.json());

  res.json({ sessionToken: order.checkout.session_token });
});`,
  },
  {
    id: "react",
    label: "React",
    file: "PayButton.tsx",
    code: `import { usePayXaCheckout } from "@payxa/react";

export function PayButton({ orderId }: { orderId: string }) {
  const { open, status } = usePayXaCheckout();

  async function pay() {
    const res = await fetch(\`/api/checkout/\${orderId}\`, { method: "POST" });
    const { sessionToken } = await res.json();
    open({ sessionToken });
  }

  return (
    <button onClick={pay} disabled={status === "verifying"}>
      {status === "verified" ? "Paid ✓" : "Pay with PayXa"}
    </button>
  );
}`,
  },
  {
    id: "php",
    label: "PHP",
    file: "create-order.php",
    code: `<?php
$ch = curl_init("https://api.payxa.example/v1/orders");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer " . getenv("PAYXA_SECRET_KEY"),
    "Content-Type: application/json",
  ],
  CURLOPT_POSTFIELDS => json_encode([
    "merchant_order_id" => "ORDER-1001",
    "amount" => 49900,
    "currency" => "INR",
  ]),
]);
$order = json_decode(curl_exec($ch), true);
echo $order["checkout"]["session_token"];`,
  },
  {
    id: "python",
    label: "Python",
    file: "webhook.py",
    code: `import hmac, hashlib, time
from flask import Flask, request, abort

app = Flask(__name__)
SECRET = b"whsec_test_..."

@app.post("/webhooks/payxa")
def payxa_webhook():
    ts = request.headers["PayXa-Timestamp"]
    sig = request.headers["PayXa-Signature"]
    if abs(time.time() - int(ts)) > 300:
        abort(400)  # replay protection
    expected = hmac.new(SECRET, f"{ts}.".encode() + request.data, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, sig):
        abort(401)

    event = request.get_json()
    if event["type"] == "payment.verified":
        fulfil_once(event["data"]["order_id"], event["id"])  # idempotent
    return "", 200`,
  },
];

export const webhookSample = `{
  "id": "evt_example_1001",
  "type": "payment.verified",
  "created_at": "2026-11-20T14:00:00Z",
  "data": {
    "merchant_id": "merch_example_01",
    "order_id": "ORDER-1001",
    "payment_id": "pay_example_01",
    "amount": 49900,
    "currency": "INR",
    "status": "PAYMENT_VERIFIED",
    "verification_source": "BANK_PSP"
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
  ["checkout.expired", "The session expired without verified payment"],
  ["payment.detected", "Credit evidence arrived and matched an order"],
  ["payment.verifying", "Waiting on trusted bank/PSP confirmation"],
  ["payment.verified", "Trusted confirmation received. Safe to fulfil"],
  ["payment.needs_review", "Conflict or ambiguity needs a human"],
  ["payment.late_detected", "Payment arrived after the session expired"],
  ["payment.reconciliation_updated", "A review case changed state"],
  ["device.offline", "A paired merchant device stopped syncing"],
];
