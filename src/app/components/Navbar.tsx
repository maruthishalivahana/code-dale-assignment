"use client";

import { Menu, Play, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import MegaMenu from './MegaMenu'
import MobileMenu from './MobileMenu'

// ============================================
// NAVBAR WITH CINEMATIC FADE
// ============================================
// Premium fog-like dissolve effect
// Fade range: 0px → 420px with easeOut
// ============================================

// Cubic ease-out function: 1 - pow(1 - t, 3)
const easeOutCubic = (t: number): number => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 3);
};

// Configuration
const NAVBAR_FADE_END = 420;

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const rafRef = useRef<number | null>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle Products menu open with delay cancel
    const handleProductsOpen = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsProductsOpen(true);
    };

    // Handle Products menu close with 120ms delay
    const handleProductsClose = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsProductsOpen(false);
        }, 120);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Scroll handler with RAF throttling for 60fps cinematic fade
    useEffect(() => {
        if (isReducedMotion) {
            setOpacity(1);
            return;
        }

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    // Calculate fade with easeOut: opacity = 1 - easeOut(scrollY / 420)
                    const progress = scrollY / NAVBAR_FADE_END;
                    const easedProgress = easeOutCubic(progress);
                    const newOpacity = Math.max(0, 1 - easedProgress);

                    setOpacity(newOpacity);
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial call
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isReducedMotion]);

    return (
        <div
            onMouseLeave={handleProductsClose}
            className="fixed top-0 left-0 right-0 z-[999]"
            style={{
                opacity,
                pointerEvents: opacity < 0.1 ? "none" : "auto",
                willChange: "opacity",
                isolation: "isolate",
            }}
        >
            <header className={`w-full h-[56px] backdrop-blur-sm transition-colors duration-300 ${isProductsOpen ? 'bg-white' : 'bg-transparent'}`}>
                <div className="max-w-[2560px] mx-auto h-full flex items-center justify-between px-5 sm:px-6 md:px-8 lg:px-10 xl:px-14 gap-2">
                    {/* LEFT - Menu Items (Desktop Only - Large screens) */}
                    <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-wide">
                        <button
                            onMouseEnter={handleProductsOpen}
                            aria-expanded={isProductsOpen}
                            aria-haspopup="true"
                            className="flex items-center gap-1.5 hover:opacity-60 transition-opacity duration-200"
                        >
                            PRODUCTS
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <a href="#pricing" className="hover:opacity-60 transition-opacity duration-200">
                            PRICING
                        </a>
                        <a href="#blog" className="hover:opacity-60 transition-opacity duration-200">
                            BLOG
                        </a>
                    </nav>

                    {/* LEFT - Logo (Mobile & Tablet) */}
                    <div className="lg:hidden flex items-center flex-shrink-0">
                        <img
                            src="/adaline-ai/svgexport-2.svg"
                            alt="Adaline"
                            className="h-4 sm:h-5 md:h-6"
                        />
                    </div>

                    {/* CENTER - Company Logo (Desktop Only) */}
                    <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
                        <img
                            src="/adaline-ai/svgexport-2.svg"
                            alt="Adaline"
                            className="h-6 xl:h-7"
                        />
                    </div>

                    {/* RIGHT - Buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
                        <button className="hidden lg:inline-flex items-center justify-center gap-3 px-5 py-2 border border-neutral-200 rounded-[20px] bg-[#fafcf5] text-[#203b14] hover:bg-neutral-100 transition-colors duration-200 text-sm font-mono whitespace-nowrap">
                            WATCH DEMO
                            <Play size={14} fill="currentColor" />
                        </button>
                        <button className="hidden lg:inline-flex items-center justify-center gap-3 px-6 py-2 bg-[#203b14] text-[#FBFDF6] rounded-[20px] hover:bg-[#2a4d1a] transition-colors duration-200 text-sm font-mono whitespace-nowrap">
                            START FOR FREE
                        </button>

                        {/* Mobile & Tablet - Start for Free Button */}
                        <button className="lg:hidden inline-flex items-center justify-center px-3 sm:px-4 md:px-5 py-1.5 md:py-2 bg-[#203b14] text-[#FBFDF6] rounded-full text-[10px] sm:text-xs md:text-sm font-mono whitespace-nowrap">
                            START FOR FREE
                        </button>

                        {/* Mobile & Tablet menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-1.5 sm:p-2"
                        >
                            <Menu size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mega Menu */}
            <div onMouseEnter={handleProductsOpen}>
                <MegaMenu isOpen={isProductsOpen} onClose={() => setIsProductsOpen(false)} />
            </div>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </div>
    );
}