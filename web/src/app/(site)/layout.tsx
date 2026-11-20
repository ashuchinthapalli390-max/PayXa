import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/fx/SmoothScroll";
import SceneLayer from "@/components/three/SceneLayer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
