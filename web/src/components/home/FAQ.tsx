"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";

export const faqs: [string, string][] = [
  [
    "How exactly does PayXa work?",
    "Your site creates an order through PayXa. The customer pays with any UPI app straight to your receiving account. PayXa alerts your phone when checkout starts, matches incoming credit evidence to the order, and marks it verified only after a trusted bank or PSP confirmation.",
  ],
  [
    "Is the merchant app mandatory?",
    "It is strongly recommended. The Android app receives Payment Started alerts and, with your permission, detects supported credit notifications. Without it you still get dashboard and webhook updates from other available sources.",
  ],
  ["Does the customer need to install anything?", "No. Customers pay with the UPI app they already use. There is no PayXa customer app."],
  [
    "When does the Payment Started alert arrive?",
    "PayXa dispatches it the moment a new checkout session is created. Delivery to the phone usually takes seconds but depends on Android, the device and the network, so we cannot guarantee an exact time.",
  ],
  [
    "What does 'Payment Verified' mean?",
    "It means a trusted source, such as a bank or PSP integration, confirmed the payment. A phone notification alone only counts as 'detected'. Fulfil orders only on verified status.",
  ],
  [
    "What if the merchant phone is offline?",
    "Events are kept server-side. The app queues anything it detected and resyncs automatically when it is back online. Verification continues through other trusted sources where available.",
  ],
  ["What if the SMS or notification is late?", "PayXa keeps reconciling. Late evidence is matched when it arrives, and payments after expiry are flagged as late-payment exceptions."],
  [
    "What if two payments have the same amount?",
    "If two open orders share an amount and cannot be uniquely identified, PayXa sends them to review rather than guessing. Two equal payments must never complete the wrong order.",
  ],
  [
    "Does PayXa charge any fees?",
    "The Free Starter plan has a ₹0 PayXa platform fee. Bank or PSP charges, applicable taxes and provider fees may still apply and are separate.",
  ],
  [
    "How are refunds handled?",
    "Money goes directly to you, so PayXa does not hold funds or issue refunds itself. You refund from your own account and record it in PayXa. Integrated refunds may come later where a provider supports them.",
  ],
  ["How do I integrate the API?", "Create orders from your backend with your secret key, open checkout with the JavaScript SDK or a hosted link, and fulfil on the signed payment.verified webhook."],
  [
    "What if the customer pays after checkout expires?",
    "The payment is recorded as a late-payment exception and shown for review. You decide whether to fulfil or refund it.",
  ],
];

export default function FAQ({ index = "13", limit }: { index?: string; limit?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const list = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section className="section-y relative">
      <div className="container-px grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader index={index} eyebrow="FAQ" title={"Questions,\nanswered."} accentWords={["answered."]} />
        </div>
        <div className="border-t border-white/[0.08]">
          {list.map(([q, a], i) => (
            <Reveal key={q} delay={Math.min(i, 4) * 0.04}>
              <div className="border-b border-white/[0.08]">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="group flex w-full items-center gap-6 py-6 text-left"
                >
                  <span className="font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`flex-1 text-[16px] font-medium transition-colors sm:text-[18px] ${open === i ? "text-paper" : "text-paper/80 group-hover:text-paper"}`}>
                    {q}
                  </span>
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      open === i ? "rotate-45 border-crimson bg-crimson text-white" : "border-white/15 text-muted"
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pl-[calc(11px*2+24px)] text-[15px] leading-relaxed text-muted">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
