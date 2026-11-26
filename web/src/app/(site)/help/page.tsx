import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import FAQ, { faqs } from "@/components/home/FAQ";
import HelpTopics from "@/components/help/HelpTopics";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "PayXa Help Center — FAQ, Setup & Merchant Support",
  description:
    "Find answers on PayXa accounts, merchant app pairing, direct UPI payments, payment detection vs verification, and developer integrations.",
  alternates: { canonical: `${site.url}/help` },
  openGraph: {
    title: "PayXa Help Center — FAQ & Merchant Support",
    description: "Find answers on PayXa accounts, merchant app pairing, direct UPI payments, and integrations.",
    url: `${site.url}/help`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "PayXa Help Center" }],
  },
};

export default function HelpPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Help Center", url: "/help" },
        ]}
      />
      <FaqJsonLd items={faqs} />
      <PageHero
        scene="torus"
        side="right"
        eyebrow="Help center"
        title={"How can we\nhelp?"}
        accentWords={["help?"]}
        description="Find answers on accounts, the merchant app, payments and integrations, or contact the team."
      />
      <section className="container-px -mt-10 pb-10" data-scene="cube" data-side="center">
        <HelpTopics />
      </section>
      <Scene shape="rings" side="left"><FAQ index="" /></Scene>
    </>
  );
}
