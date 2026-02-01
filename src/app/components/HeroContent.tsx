"use client";

import { useEffect, useState, useRef } from "react";

// ============================================
// HERO CONTENT WITH CINEMATIC FADES
// ============================================
// Premium film-like fade effects:
// - Hero text: 0px → 520px with easeOut
// - Company logos: 180px → 720px with easeOut (layered timing)
// ============================================

// Cubic ease-out function: 1 - pow(1 - t, 3)
const easeOutCubic = (t: number): number => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 3);
};

// Configuration
const CONFIG = {
    HERO_FADE_END: 520,
    LOGOS_FADE_START: 80,
    LOGOS_FADE_END: 450,
} as const;

// Company logos from adaline-ai folder
const logos = [
    "/adaline-ai/svgexport-10.svg",
    "/adaline-ai/svgexport-11.svg",
    "/adaline-ai/svgexport-12.svg",
    "/adaline-ai/svgexport-13.svg",
    "/adaline-ai/svgexport-14.svg",
    "/adaline-ai/svgexport-15.svg",
    "/adaline-ai/svgexport-16.svg",
    "/adaline-ai/svgexport-17.svg",
    "/adaline-ai/svgexport-18.svg",
    "/adaline-ai/svgexport-19.svg",
    "/adaline-ai/svgexport-20.svg",
    "/adaline-ai/svgexport-21.svg",
];

export default function HeroContent() {
    const [heroOpacity, setHeroOpacity] = useState(1);
    const [logosOpacity, setLogosOpacity] = useState(1);
    const [isMounted, setIsMounted] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
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

    // Scroll handler with RAF throttling for 60fps cinematic fades
    useEffect(() => {
        if (isReducedMotion) {
            setHeroOpacity(1);
            setLogosOpacity(1);
            return;
        }

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const { HERO_FADE_END, LOGOS_FADE_START, LOGOS_FADE_END } = CONFIG;

                    // Hero text opacity: 0px → 520px with easeOut
                    const heroProgress = scrollY / HERO_FADE_END;
                    const heroEased = easeOutCubic(heroProgress);
                    setHeroOpacity(Math.max(0, 1 - heroEased));

                    // Logos opacity: 180px → 720px with easeOut (delayed start for layered timing)
                    const logosRange = LOGOS_FADE_END - LOGOS_FADE_START;
                    const logosProgress = scrollY <= LOGOS_FADE_START
                        ? 0
                        : (scrollY - LOGOS_FADE_START) / logosRange;
                    const logosEased = easeOutCubic(logosProgress);
                    setLogosOpacity(Math.max(0, 1 - logosEased));

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

    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section
            className="fixed inset-0 z-0 pt-0  pb-8 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{
                pointerEvents: heroOpacity < 0.2 && logosOpacity < 0.2 ? "none" : "auto",
            }}
        >
            {/* Hero Heading - fades with hero timing, stays fixed in place */}
            <div
                className="text-center max-w-5xl mx-auto"
                style={{
                    opacity: heroOpacity,
                    pointerEvents: heroOpacity < 0.2 ? "none" : "auto",
                    willChange: "opacity",
                }}
            >
                <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[42px] xl:text-[46px] leading-[1.1] font-sans text-[#203b14] tracking-tight">
                    The single platform to <span className="font-sans">iterate</span>,
                    <br className="hidden sm:block" />
                    <span className="font-sans">evaluate</span>, <span className="font-sans">deploy</span>, and <span className='font-sans'>monitor</span> AI agents
                </h1>
            </div>

            {/* Trusted By Section with Horizontal Scroll - fades with logo timing, stays fixed */}
            <div
                className="mt-8 md:mt-10 lg:mt-12 text-center w-full"
                style={{
                    opacity: logosOpacity,
                    pointerEvents: logosOpacity < 0.2 ? "none" : "auto",
                    willChange: "opacity",
                }}
            >
                <p className="text-xs sm:text-sm tracking-[0.25em] font-mono text-[#203b14]/50 uppercase mb-6 md:mb-8">
                    Trusted by
                </p>

                {/* Logo Scroller Container */}
                <div className="relative w-full overflow-hidden bg-transparent">
                    {/* Left Gradient Fade - matches cinematic background */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, rgba(180, 170, 150, 0.6), transparent)"
                        }}
                    />

                    {/* Right Gradient Fade - matches cinematic background */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none"
                        style={{
                            background: "linear-gradient(to left, rgba(180, 170, 150, 0.6), transparent)"
                        }}
                    />

                    {/* Scrolling Logos */}
                    <div
                        className="flex gap-10 sm:gap-14 md:gap-16 items-center py-2"
                        style={{
                            animation: isMounted && !isReducedMotion ? "scrollLogos 15s linear infinite" : "none",
                            width: "max-content",
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={`logo-${index}`}
                                className="flex-shrink-0 flex items-center justify-center h-5 sm:h-6 md:h-7"
                            >
                                <img
                                    src={logo}
                                    alt={`Company logo ${(index % logos.length) + 1}`}
                                    className="h-full w-auto object-contain max-w-[100px] sm:max-w-[120px] md:max-w-[140px] opacity-70"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scrollLogos {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </section>
    );
}
