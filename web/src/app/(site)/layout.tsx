import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/fx/SmoothScroll";
import SceneLayer from "@/components/three/SceneLayer";
import IntroLoader from "@/components/fx/IntroLoader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntroLoader />
      <SmoothScroll />
      <SceneLayer />
      <Navbar />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
