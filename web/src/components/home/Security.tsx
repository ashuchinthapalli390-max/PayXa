import { Eye, FileKey2, Fingerprint, KeyRound, Lock, Scale, ShieldCheck, Smartphone } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/Interactive";

export const securityItems = [
  { icon: Smartphone, title: "Device pairing", body: "Phones pair only via a short-lived dashboard QR. Each device has its own revocable credentials." },
  { icon: Eye, title: "Permission transparency", body: "Notification access is requested separately, explained in plain language, and only payment alerts are processed." },
  { icon: Lock, title: "Sensitive data handling", body: "We never ask for or store UPI PINs, OTPs or bank passwords. No SMS history or inbox scanning in V1." },
  { icon: ShieldCheck, title: "Trusted verification", body: "A notification alone can never mark a payment verified. Verified needs a trusted bank or PSP source." },
  { icon: FileKey2, title: "Signed webhooks", body: "HMAC-SHA256 signatures, timestamps, replay protection, retries with backoff and a dead-letter queue." },
  { icon: Fingerprint, title: "Account security", body: "Two-factor sign-in, biometric app lock, role-based team access and full audit logs." },
  { icon: KeyRound, title: "Key management", body: "Separate test and live keys, rotation without downtime, and secrets encrypted at rest." },
  { icon: Scale, title: "Disputes & reconciliation", body: "Every state change is traceable. Conflicts go to review instead of being auto-resolved." },
];

export default function Security({ index = "12" }: { index?: string }) {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-px relative">
        <div className="grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              index={index}
              eyebrow="Security & trust"
              title={"Detected is not\nverified."}
              accentWords={["verified."]}
              description="That one rule shapes everything we build. Here is how PayXa protects merchants, customers and their money."
            />
            <Reveal delay={0.2}>
              <div className="mt-10 rounded-2xl border border-white/[0.08] bg-surface/60 p-5 text-[13px] leading-relaxed text-muted">
                <span className="font-semibold text-paper">No badges until they are real.</span> Bank partnerships, certifications
                and regulatory approvals will be shown here only once they actually exist.
              </div>
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {securityItems.map((s, i) => (
              <Reveal key={s.title} delay={(i % 2) * 0.08}>
                <SpotlightCard className="h-full p-6">
                  <s.icon size={20} className="text-neon" />
                  <h3 className="mt-5 font-display text-[14px] font-semibold uppercase">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
