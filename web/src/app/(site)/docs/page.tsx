import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Braces, Rocket, Smartphone, Webhook, Wrench } from "lucide-react";
import { Prose } from "@/components/ui/PageHero";
import { Reveal } from "@/components/fx/Reveal";
import { highlight } from "@/lib/code";

export const metadata: Metadata = { title: "Docs" };

const nav = [
  { id: "quickstart", label: "Quickstart", icon: Rocket },
  { id: "concepts", label: "Core concepts", icon: BookOpen },
  { id: "orders", label: "Create an order", icon: Braces },
  { id: "webhooks", label: "Handle webhooks", icon: Webhook },
  { id: "devices", label: "Pair a device", icon: Smartphone },
  { id: "testing", label: "Testing", icon: Wrench },
];

const createOrder = `curl https://api.payxa.in/v1/orders \\
  -H "Authorization: Bearer pxa_test_..." \\
  -H "Idempotency-Key: 7f9c..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_order_id": "ORDER-1001",
    "amount": 49900,
    "currency": "INR",
    "customer": { "reference": "customer_102" },
    "checkout": { "expires_in_seconds": 300 }
  }'`;

function Code({ code }: { code: string }) {
  return (
    <pre className="card overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.75] text-paper/90" data-lenis-prevent>
      <code>{highlight(code)}</code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <div className="container-px pt-[calc(var(--nav-h)+48px)] pb-28" data-scene="helix" data-side="right">
      <div className="grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="eyebrow">Documentation · API v1</div>
          <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:pb-0" data-lenis-prevent>
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-muted transition-colors hover:bg-white/[0.04] hover:text-paper"
              >
                <n.icon size={15} className="text-neon" /> {n.label}
              </a>
            ))}
          </nav>
        </aside>

        <Reveal>
          <article>
            <h1 className="display text-[clamp(36px,5vw,64px)]">
              PayXa <span className="text-gradient-red">Docs</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-muted">
              Reference for the PayXa v1 REST API at <code className="text-paper">api.payxa.in</code>. Build in Test mode with{" "}
              <code className="text-paper">pxa_test_</code> keys, then switch to live keys.
            </p>

            <div className="mt-14 space-y-20">
              <section id="quickstart" className="scroll-mt-28">
                <Prose>
                  <h2>Quickstart</h2>
                  <ul>
                    <li>Create a PayXa account and open the dashboard in <strong>Test mode</strong>.</li>
                    <li>Copy your <code className="text-paper">pxa_test_</code> secret key from Developers → API keys.</li>
                    <li>Create an order from your backend, then open checkout with the session token.</li>
                    <li>Register a webhook endpoint and fulfil only on <code className="text-neon">payment.verified</code>.</li>
                  </ul>
                </Prose>
              </section>

              <section id="concepts" className="scroll-mt-28">
                <Prose>
                  <h2>Core concepts</h2>
                  <p>
                    <strong>Amounts are in paise.</strong> <code className="text-paper">49900</code> means ₹499.00.
                  </p>
                  <p>
                    <strong>Detected is not bank-verified.</strong> When a merchant&apos;s paired phone sees a matching payment notification (or bank credit SMS), PayXa matches it to the order and completes customer checkout immediately as <code className="text-paper">COMPLETED_BY_OBSERVATION</code> (<code className="text-paper">checkout.observation_completed</code>) with <code className="text-paper">bank_verified: false</code>. Full financial settlement verification requires a trusted bank/PSP feed (<code className="text-paper">payment.verified</code>).
                  </p>
                  <p>
                    <strong>Frontend events are display-only.</strong> Callbacks from the checkout script update your UI. Fulfilment
                    happens on your backend, from a signed webhook or a status you fetched yourself.
                  </p>
                </Prose>
              </section>

              <section id="orders" className="scroll-mt-28 space-y-6">
                <Prose>
                  <h2>Create an order</h2>
                  <p>Always compute the price on your server. Send an Idempotency-Key so retries never create duplicates.</p>
                </Prose>
                <Code code={createOrder} />
              </section>

              <section id="webhooks" className="scroll-mt-28">
                <Prose>
                  <h2>Handle webhooks</h2>
                  <ul>
                    <li>Verify the HMAC-SHA256 signature over the timestamp and raw body.</li>
                    <li>Reject timestamps older than five minutes.</li>
                    <li>Store the event ID and ignore duplicates. Deliveries are at-least-once.</li>
                    <li>Return 2xx quickly; do slow work asynchronously.</li>
                  </ul>
                  <p>
                    See the full sample in the <Link className="text-neon underline" href="/developers#webhooks">developer hub</Link>.
                  </p>
                </Prose>
              </section>

              <section id="devices" className="scroll-mt-28">
                <Prose>
                  <h2>Pair a device</h2>
                  <ul>
                    <li>Install PayXa Merchant from the official download page.</li>
                    <li>In the dashboard, open Devices → Pair new device to show a short-lived QR.</li>
                    <li>Scan it in the app, then grant push and (optionally) notification access.</li>
                    <li>Run the device diagnostics check before going live.</li>
                  </ul>
                </Prose>
              </section>

              <section id="testing" className="scroll-mt-28">
                <Prose>
                  <h2>Testing</h2>
                  <p>
                    Test mode can trigger checkout started, detected, verified, late payment, same-amount conflict and device offline
                    events. Use the webhook tester to send any event to your endpoint.
                  </p>
                </Prose>
              </section>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  );
}
