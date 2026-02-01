"use client";

import { useEffect, useState, useRef } from "react";

// ============================================
// HERO SECTION - Hero Text Only (Fixed Position)
// ============================================
// Premium film-like fade effect for hero text
// Logo scroller moved to TrustedBySection (normal flow)
// ============================================

// Cubic ease-out function: 1 - pow(1 - t, 3)
const easeOutCubic = (t: number): number => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 3);
};

// Configuration
const CONFIG = {
    HERO_FADE_END: 520,
} as const;

export default function HeroSection() {
    const [heroOpacity, setHeroOpacity] = useState(1);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const rafRef = useRef<number | null>(null);

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

    // Scroll handler with RAF throttling for 60fps cinematic fades
    useEffect(() => {
        if (isReducedMotion) {
            setHeroOpacity(1);
            return;
        }

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const { HERO_FADE_END } = CONFIG;

                    // Hero text opacity: 0px → 520px with easeOut
                    const heroProgress = scrollY / HERO_FADE_END;
                    const heroEased = easeOutCubic(heroProgress);
                    setHeroOpacity(Math.max(0, 1 - heroEased));

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
        <section
            className="fixed inset-0 z-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none"
        >
            {/* Hero Heading - fades with scroll, stays fixed in place */}
            <div
                className="text-center max-w-5xl mx-auto"
                style={{
                    opacity: heroOpacity,
                    pointerEvents: heroOpacity < 0.2 ? "none" : "auto",
                    willChange: "opacity",
                }}
            >
                <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[46px] xl:text-[46px] leading-[1.1] font-sans text-[#0a1d08] tracking-tight">
                    The single platform to <span className="font-sans">iterate</span>,
                    <br className="hidden sm:block" />
                    <span className="font-sans">evaluate</span>, <span className="font-sans">deploy</span>, and <span className="font-sans">monitor</span> AI agents
                </h1>
            </div>
        </section>
    );
}
