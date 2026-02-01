import Navbar from "./components/Navbar";
import CinematicCanvas from "./components/CinematicCanvas";
import HeroSection from "./components/HeroSection";
import TrustedBySection from "./components/TrustedBySection";
import ProductShowcase from "./components/ProductShowcase";

export default function Home() {
  return (
    <>
      {/* ============================================ */}
      {/* CINEMATIC SCROLL-DRIVEN LANDING PAGE */}
      {/* ============================================ */}
      {/* Phase 1 (0-1200px): Frames 002-191 - UI fades out */}
      {/* Phase 2 (1200-1600px): Frames 192-199 - Clear immersive scene */}
      {/* Phase 3 (1600-4000px): Frames 200-281 - Product zoom-out reveal */}
      {/* ============================================ */}

      {/* GPU-optimized canvas background renderer */}
      <CinematicCanvas />

      {/* Navbar - premium fog-like dissolve (0px → 420px) */}
      <Navbar />

      {/* Hero Section - Hero text only (fixed position, fades on scroll) */}
      <HeroSection />

      {/* Scroll spacer - allows full THREE-PHASE animation */}
      {/* Height = animation end (4000px) + viewport buffer for large screens */}
      <div className="h-[5500px] 2xl:h-[6500px]" aria-hidden="true" />

      {/* Trusted By Section - Logo scroller in normal document flow */}
      {/* Positioned below hero, always in white background area */}
      <TrustedBySection />

      {/* Product Showcase - cinematic zoom-out reveal during Phase 3 */}
      {/* Camera pull-back illusion: scale 1.18→1.0, translateY -60→0 */}
      <ProductShowcase />
    </>
  );
}
