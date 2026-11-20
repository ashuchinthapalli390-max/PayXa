import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import Integrations from "@/components/home/Integrations";
import FinalCTA from "@/components/home/FinalCTA";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <>
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
