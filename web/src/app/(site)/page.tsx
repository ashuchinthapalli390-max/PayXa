import Hero from "@/components/home/Hero";
import TickerBand from "@/components/home/TickerBand";
import ZoomStatement from "@/components/home/ZoomStatement";
import CheckoutExperience from "@/components/home/CheckoutExperience";
import ScriptToSuccess from "@/components/home/ScriptToSuccess";
import WhyPayxa from "@/components/home/WhyPayxa";
import HowItWorks from "@/components/home/HowItWorks";
import Metrics from "@/components/home/Metrics";
import ProductShowcase from "@/components/home/ProductShowcase";
import AppPreview from "@/components/home/AppPreview";
import Developers from "@/components/home/Developers";
import Integrations from "@/components/home/Integrations";
import Pricing from "@/components/home/Pricing";
import Security from "@/components/home/Security";
import FAQ, { faqs } from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import Scene from "@/components/three/Scene";
import { FaqJsonLd } from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <>
      <FaqJsonLd items={faqs} />
      <Hero />
      <TickerBand />
      <ZoomStatement />
      <Scene shape="card" side="center">
        <CheckoutExperience />
      </Scene>
      <ScriptToSuccess />
      <WhyPayxa />
      <Scene shape="grid" side="center">
        <HowItWorks />
      </Scene>
      <Scene shape="bars" side="right" cinematic>
        <Metrics />
      </Scene>
      <Scene shape="qr" side="left">
        <ProductShowcase />
      </Scene>
      <Scene shape="phone" side="center">
        <AppPreview />
      </Scene>
      <Scene shape="helix" side="left" cinematic>
        <Developers />
      </Scene>
      <Scene shape="torus" side="center" cinematic>
        <Integrations />
      </Scene>
      <Scene shape="rupee" side="center" cinematic>
        <Pricing />
      </Scene>
      <Scene shape="shield" side="left" cinematic>
        <Security />
      </Scene>
      <Scene shape="coin" side="left" cinematic>
        <FAQ />
      </Scene>
      <FinalCTA />
    </>
  );
}
