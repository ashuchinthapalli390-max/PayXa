import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import FAQ from "@/components/home/FAQ";
import HelpTopics from "@/components/help/HelpTopics";

export const metadata: Metadata = { title: "Help center" };

export default function HelpPage() {
  return (
    <>
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
