import type { Metadata } from "next";
import { BellRing, Camera, Cloud, Download, Fingerprint, HardDrive, Radar, RefreshCw, ShieldCheck, Wifi } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import FinalCTA from "@/components/home/FinalCTA";
import AppPreview from "@/components/home/AppPreview";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import CopyValue from "@/components/download/CopyValue";
import { merchantApp, merchantAppSizeMb } from "@/lib/merchant-app";

export const metadata: Metadata = { title: "Download PayXa Merchant" };

const permissions = [
  { icon: BellRing, name: "Push notifications", why: "Show Payment Started, Detected and Verified alerts." },
  { icon: Radar, name: "Notification listener", why: "Approved separately. Reads only supported payment alerts." },
  { icon: Wifi, name: "Internet", why: "Sync events with PayXa securely." },
  { icon: HardDrive, name: "Secure local storage", why: "Encrypted offline queue that retries automatically." },
  { icon: Camera, name: "Camera", why: "Only while scanning the dashboard pairing QR." },
  { icon: Fingerprint, name: "Biometrics", why: "Optional app lock where supported." },
  { icon: Cloud, name: "Background processing", why: "Android-supported mechanisms only." },
];

export default function DownloadPage() {
  return (
    <>
      <PageHero
        scene="phone"
        side="right"
        eyebrow="PayXa Merchant · Android"
        title={"Payments arrive.\nYour phone knows."}
        accentWords={["knows."]}
        description="The official PayXa Merchant app pairs with your dashboard, alerts you when checkout starts and, with your permission, detects supported incoming credit alerts."
      >
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="/download/android" download={merchantApp.fileName} className="btn btn-primary">
            <Download size={16} /> Download APK · v{merchantApp.version}
          </a>
          <span className="font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
            {merchantApp.minAndroid}+ · {merchantAppSizeMb} MB · Signed release
          </span>
        </div>
      </PageHero>

      <section className="container-px pb-24" data-scene="phone" data-side="right">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Version", v: `${merchantApp.version} (build ${merchantApp.build})`, d: `Released ${new Date(merchantApp.releasedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}. Requires ${merchantApp.minAndroid} or newer.` },
            { k: "Integrity", v: "SHA-256 published", d: "The checksum and signing certificate fingerprint are listed below." },
            { k: "Updates", v: "From this page", d: "Only official signed updates. Never install a PayXa APK from anywhere else." },
          ].map((x, i) => (
            <Reveal key={x.k} delay={i * 0.06}>
              <div className="card h-full p-7">
                <div className="eyebrow">{x.k}</div>
                <div className="mt-4 font-display text-xl font-semibold uppercase">{x.v}</div>
                <p className="mt-2 text-[14px] text-muted">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="card mt-4 grid gap-6 p-7 md:grid-cols-2">
            <CopyValue label="File SHA-256" value={merchantApp.sha256} />
            <CopyValue label="Signing certificate SHA-256" value={merchantApp.signingCertSha256} />
            <p className="text-[13px] text-muted md:col-span-2">
              Installing for the first time: allow your browser to install apps when Android asks, then open PayXa and pair it from
              dash.payxa.in → Devices. If an older test build of PayXa is on the phone, uninstall it first.{" "}
              <a href={merchantApp.releaseNotesUrl} className="text-neon hover:underline" rel="noopener">Release notes</a>
            </p>
          </div>
        </Reveal>
      </section>

      <Scene shape="phone" side="center"><AppPreview /></Scene>

      <section className="section-y border-t border-white/[0.06]" data-scene="shield" data-side="left">
        <div className="container-px grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Permissions"
            title={"Every permission,\nexplained."}
            accentWords={["explained."]}
            description="No SMS history access. No inbox scanning. Notification access is optional and requested separately."
          />
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {permissions.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.04}>
                <div className="flex items-start gap-5 py-5">
                  <p.icon size={20} className="mt-0.5 shrink-0 text-neon" />
                  <div>
                    <div className="font-semibold text-paper">{p.name}</div>
                    <div className="mt-1 text-[14px] text-muted">{p.why}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px pb-24" data-scene="phone" data-side="right">
        <Reveal>
          <div className="card grid gap-8 p-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Verify the checksum", d: "Compare the SHA-256 of your download with the value on this page before installing." },
              { icon: Fingerprint, t: "Check the signature", d: "Android will refuse updates signed with a different key. That is a feature." },
              { icon: RefreshCw, t: "Update safely", d: "Download updates only from this page. Ignore APKs shared on chats or other sites." },
            ].map((s) => (
              <div key={s.t}>
                <s.icon size={20} className="text-neon" />
                <div className="mt-4 font-display text-[14px] font-semibold uppercase">{s.t}</div>
                <p className="mt-2 text-[14px] text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <FinalCTA />
    </>
  );
}
