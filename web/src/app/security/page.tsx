import type { Metadata } from "next";
import PageHero, { Prose } from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import Security from "@/components/home/Security";
import FinalCTA from "@/components/home/FinalCTA";
import { Reveal } from "@/components/fx/Reveal";

export const metadata: Metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <>
      <PageHero
        scene="shield"
        side="right"
        eyebrow="Security & privacy"
        title={"Trust is the\nproduct."}
        accentWords={["product."]}
        description="How PayXa handles devices, permissions, data and verification, written in plain language."
      />
      <Scene shape="shield" side="left"><Security index="01" /></Scene>
      <section className="container-px pb-28" data-scene="cube" data-side="right">
        <Reveal>
          <Prose>
            <h2>What the merchant app can access</h2>
            <ul>
              <li><strong>Push notifications</strong> to show checkout and payment alerts.</li>
              <li><strong>Notification listener</strong>, approved separately, used only to read supported payment alerts. Everything else is ignored.</li>
              <li><strong>Camera</strong>, only while you scan the pairing QR.</li>
              <li><strong>Biometrics</strong>, where supported, to lock the app.</li>
              <li><strong>Internet and secure storage</strong> for syncing and an encrypted offline queue.</li>
            </ul>
            <h2>What PayXa never does</h2>
            <ul>
              <li>Ask for, read or store UPI PINs, OTPs or bank passwords.</li>
              <li>Scan your Gmail inbox or SMS history in V1.</li>
              <li>Mark a payment verified from a phone notification alone.</li>
              <li>Hold, pool or settle customer funds.</li>
            </ul>
            <h2>Regulatory position</h2>
            <p>
              PayXa is designed as a direct-to-merchant payment technology platform that does not handle funds. That design may reduce
              regulatory complexity, but it is not an automatic approval or exemption. Exact service classification, UPI acceptance
              permissions and acquiring-bank agreements are under professional review. We will publish certifications and partnerships
              here only once they actually exist.
            </p>
            <h2>Report a vulnerability</h2>
            <p>
              Found something? Please contact us through the <a className="text-neon underline" href="/contact">contact page</a> with the
              subject &quot;Security&quot;. Please do not test against real merchant accounts.
            </p>
          </Prose>
        </Reveal>
      </section>
      <FinalCTA />
    </>
  );
}
