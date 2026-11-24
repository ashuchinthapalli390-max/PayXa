"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { MERCHANT } from "@/lib/merchant";
import { BellRing, Check, Loader2, Play, ShieldCheck, ShoppingBag } from "lucide-react";
import { highlight } from "@/lib/code";
import { PatternQR } from "@/components/checkout/CheckoutModal";
import { useCheckout } from "@/components/checkout/CheckoutProvider";

const ease = [0.16, 1, 0.3, 1] as const;

const code = `<!-- 1. Add the PayXa script -->
<script src="https://checkout.payxa.in/sdk/v1/payxa.js"></script>
<button id="pay">Pay with PayXa</button>

<script>
  pay.onclick = async () => {
    // 2. Your server creates the order + checkout session
    const { checkoutUrl } = await fetch("/api/create-checkout", {
      method: "POST",
    }).then((r) => r.json());

    // 3. PayXa opens checkout + alerts your phone
    new PayXa().open({
      checkoutUrl,
      onStatus: (e) => updateUI(e.state),
    });
  };
</script>

// 4. Fulfil only on the signed webhook (server)
app.post("/webhooks/payxa", express.raw({ type: "*/*" }), (req, res) => {
  if (!verifyPayXaSignature(req.headers["x-payxa-signature"], req.body)) return res.sendStatus(401);
  const event = JSON.parse(req.body);
  if (event.type === "payment.verified") fulfil(event.data.order_id);
  res.sendStatus(200);
});`;

const steps = [
  { title: "Add the script", body: "One tag and a button. No SDK build step.", lines: [0, 2] },
  { title: "Create the order", body: "Your server sets the price and gets a session token.", lines: [6, 9] },
  { title: "Open checkout", body: "Customer pays in any UPI app. Your phone gets Payment Started.", lines: [11, 15] },
  { title: "Fulfil on verified", body: "A signed payment.verified webhook is your only green light.", lines: [19, 23] },
];

function Screen({ step }: { step: number }) {
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-[#0f0d12] to-ink">
      {/* store page always underneath */}
      <div className={`absolute inset-0 p-6 transition-all duration-700 ${step >= 2 ? "scale-95 opacity-30 blur-[2px]" : ""}`}>
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="flex items-center gap-2 font-display font-semibold text-paper uppercase">
            <Image src={MERCHANT.mark} alt="" width={20} height={20} className="size-5 rounded" /> CodeXa Agency
          </span>
          <span>Cart · 1</span>
        </div>
        <div className="mt-6 grid grid-cols-[110px_1fr] gap-4">
          <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src={MERCHANT.product.image} alt="CodeXa Agency" fill sizes="110px" className="object-cover" />
          </div>
          <div>
            <div className="text-[11px] text-muted">Web & app development</div>
            <div className="font-display text-[15px] font-semibold uppercase">Strategy Call</div>
            <div className="mt-3 font-display text-xl font-semibold">₹499.00</div>
          </div>
        </div>
        <motion.div
          animate={step === 0 ? { scale: [1, 1.04, 1], boxShadow: ["0 0 0 0 rgba(255,66,101,0.3)", "0 0 0 10px rgba(255,66,101,0)", "0 0 0 0 rgba(255,66,101,0)"] } : {}}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-full bg-crimson text-[12px] font-semibold tracking-wider text-white uppercase"
        >
          <ShoppingBag size={14} /> Pay with PayXa
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="srv"
            initial={{ opacity: 0, y: 20, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-black/85 p-4 font-mono text-[11px] leading-relaxed backdrop-blur"
          >
            <div className="text-dim">your-server → api.payxa</div>
            <div>
              <span className="text-neon">POST</span> /v1/orders <span className="text-ok">201</span>
            </div>
            <div className="mt-2 text-muted">
              {"{"} <span className="tok-s">&quot;amount&quot;</span>: <span className="tok-n">49900</span>,{" "}
              <span className="tok-s">&quot;session_token&quot;</span>: <span className="tok-s">&quot;cs_9Xa2…&quot;</span> {"}"}
            </div>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, rotateX: 25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            style={{ transformPerspective: 900 }}
            className="absolute inset-x-6 top-6 bottom-6 rounded-2xl border border-white/10 bg-[#0c0b0f] p-5 shadow-[0_30px_80px_-20px_rgba(217,4,41,0.3)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold">CodeXa Agency</span>
              <span className="font-mono text-[10px] text-dim">PXA-20481</span>
            </div>
            <div className="mt-2 font-display text-2xl font-semibold">₹499.00</div>
            {step === 2 ? (
              <div className="mt-4 grid grid-cols-[96px_1fr] items-center gap-4">
                <PatternQR className="w-[96px] !p-1.5" />
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-paper">
                    <Loader2 size={12} className="animate-spin text-neon" /> Awaiting payment
                  </div>
                  <div className="text-dim">Payment detected</div>
                  <div className="text-dim">Verified</div>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-4">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-ok text-ink shadow-[0_0_40px_rgba(43,214,123,0.5)]"
                >
                  <Check size={26} strokeWidth={3} />
                </motion.span>
                <div>
                  <div className="font-display text-[13px] font-semibold uppercase">Payment verified</div>
                  <div className="font-mono text-[10px] text-ok">payment.verified → 200</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* phone alert flying in */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            key={step === 3 ? "v" : "s"}
            initial={{ opacity: 0, x: 60, rotateY: -30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6, ease, delay: 0.25 }}
            style={{ transformPerspective: 800 }}
            className={`absolute right-3 bottom-3 w-[210px] rounded-2xl border bg-[#141217]/95 p-3 backdrop-blur ${step === 3 ? "border-ok/40" : "border-crimson/40"}`}
          >
            <div className="text-[9px] text-dim">PayXa · Live Alerts · now</div>
            <div className={`mt-1 flex items-center gap-1.5 text-[12px] font-semibold ${step === 3 ? "text-ok" : "text-neon"}`}>
              {step === 3 ? <ShieldCheck size={12} /> : <BellRing size={12} />}
              {step === 3 ? "Payment Verified" : "Payment Started"}
            </div>
            <div className="text-[12px] text-paper">₹499.00 · PXA-20481</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ScriptToSuccess() {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const { openCheckout } = useCheckout();
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => setStep(Math.min(3, Math.max(0, Math.floor(v * 4.2)))));
  const rotY = useTransform(p, [0, 0.5, 1], [-22, -6, 8]);
  const rotX = useTransform(p, [0, 1], [10, -4]);
  const bar = useTransform(p, [0, 1], [0, 1]);
  const lines = code.split("\n");
  const [a, b] = steps[step].lines;

  return (
    <section ref={wrap} className={`relative ${reduce ? "" : "h-[420vh]"}`} data-scene="helix" data-side="center">
      <div className={`${reduce ? "py-24" : "sticky top-0 flex h-[100svh] items-center"} overflow-x-clip`}>
        <div className="container-px grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-12 [&>*]:min-w-0">
          <div>
            <div className="eyebrow flex items-center gap-3">
              <span className="text-neon">04</span>
              <span className="h-px w-8 bg-crimson/70" />
              The checkout script
            </div>
            <h2 className="display mt-4 text-[clamp(28px,4.2vw,56px)]">
              Script to <span className="text-gradient-red">success.</span>
            </h2>

            <div className="mt-6 flex gap-2">
              {steps.map((s, i) => (
                <div key={s.title} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full bg-crimson shadow-[0_0_10px_rgba(255,66,101,0.3)]" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4, ease }} className="mt-5">
                <div className="font-mono text-[11px] text-neon">STEP 0{step + 1}</div>
                <div className="mt-1 font-display text-lg font-semibold uppercase sm:text-xl">{steps[step].title}</div>
                <p className="mt-1 text-[14px] text-muted">{steps[step].body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="card mt-5 hidden max-h-[46svh] overflow-hidden md:block">
              <pre className="p-4 font-mono text-[11.5px] leading-[1.65]">
                <code>
                  {lines.map((line, i) => {
                    const on = i >= a && i <= b;
                    return (
                      <div
                        key={i}
                        className={`-mx-4 px-4 transition-all duration-500 ${on ? "bg-crimson/10 opacity-100 shadow-[inset_2px_0_0_rgba(255,66,101,0.3)]" : "opacity-30"}`}
                      >
                        <span className="whitespace-pre">{highlight(line) }</span>
                        {"​"}
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>

            <button onClick={() => openCheckout()} className="btn btn-ghost btn-sm mt-5">
              <Play size={13} /> Run this script
            </button>
          </div>

          <motion.div style={reduce ? undefined : { rotateY: rotY, rotateX: rotX, transformPerspective: 1600 }} className="relative">
            <div className="absolute -inset-10 -z-10 rounded-full bg-crimson/10 blur-[90px]" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_50px_140px_-30px_rgba(217,4,41,0.28)]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-crimson" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[10px] text-dim">https://codexa-agency.online/checkout</span>
              </div>
              <div className="aspect-[4/3.4] sm:aspect-[4/3]">
                <Screen step={step} />
              </div>
            </div>
            <motion.div style={{ scaleX: bar }} className="mt-4 h-px origin-left bg-gradient-to-r from-crimson to-neon" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
