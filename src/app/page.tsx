import Navbar from "./components/Navbar";
import CinematicCanvas from "./components/CinematicCanvas";
import HeroSection from "./components/HeroSection";
import ProductShowcase from "./components/ProductShowcase";

export default function Home() {
  return (
    <div className="bg-[#f2ebe1]">
      <div className="relative z-20 h-[6000px] origin-bottom md:-mb-[50vh]">
        <HeroSection />
        <div className="pointer-events-none">
          <CinematicCanvas />
        </div>
      </div>
      <Navbar />
      <ProductShowcase />
    </div>
  );
}
