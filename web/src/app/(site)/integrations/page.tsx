import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import Integrations from "@/components/home/Integrations";
import FinalCTA from "@/components/home/FinalCTA";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "PayXa Integrations & Code Examples",
  description:
    "Explore PayXa integration building blocks: React hooks, Next.js components, Node.js server SDK, Python Flask/FastAPI, and PHP examples.",
  alternates: { canonical: `${site.url}/integrations` },
  openGraph: {
    title: "PayXa Integrations & SDK Examples",
    description: "SDKs, plugins and code examples for PayXa checkout integration.",
    url: `${site.url}/integrations`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "PayXa Integrations" }],
  },
};

export default function IntegrationsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Developers", url: "/developers" },
          { name: "Integrations", url: "/integrations" },
        ]}
      />
      <PageHero
        scene="torus"
        side="right"
        eyebrow="Integrations"
        title={"SDKs and plugins,\nhonestly labelled."}
        accentWords={["honestly"]}
        description="Core V1 building blocks are listed separately from roadmap plugins. Nothing is called ready-made before it ships."
      />
      <Scene shape="cube" side="center"><Integrations index="01" /></Scene>
      <FinalCTA />
    </>
  );
}
