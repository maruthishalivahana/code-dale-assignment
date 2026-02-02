import Navbar from "./components/Navbar";
import CinematicCanvas from "./components/CinematicCanvas";
import HeroSection from "./components/HeroSection";
import ProductShowcase from "./components/ProductShowcase";

export default function Home() {
  return (
    <div className="bg-[#f2ebe1]">
      {/* ============================================ */}
      {/* CINEMATIC SCROLL-DRIVEN LANDING PAGE */}
      {/* ============================================ */}
      {/* Phase 1 (0-1200px): Frames 002-191 - UI fades out */}
      {/* Phase 2 (1200-1600px): Frames 192-199 - Clear immersive scene */}
      {/* Phase 3 (1600-4000px): Frames 200-281 - Product zoom-out reveal */}
      {/* ============================================ */}

      {/* Main scroll container with relative positioning */}
      <div className="relative z-20 h-[6000px] origin-bottom md:-mb-[50vh]">

        {/* Hero Section - Combined Hero Content + Logo Scroller */}
        {/* Positioned absolutely to overlay on canvas */}
        <HeroSection />

        {/* GPU-optimized canvas background renderer */}
        <div className="pointer-events-none">
          <CinematicCanvas />
        </div>
      </div>

      {/* Navbar - premium fog-like dissolve (0px → 420px) */}
      <Navbar />

      {/* Product Showcase - cinematic zoom-out reveal during Phase 3 */}
      {/* Camera pull-back illusion: scale 1.18→1.0, translateY -60→0 */}
      <ProductShowcase />
    </div>
  );
}
