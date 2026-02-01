"use client";

import { useEffect, useState } from "react";

// ============================================
// TRUSTED BY SECTION - Logo Scroller
// ============================================
// Positioned in normal document flow below the hero
// No fixed positioning, no transforms on parent
// ============================================

// Company logos from adaline-ai folder
const logos = [
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

export default function TrustedBySection() {
    const [isMounted, setIsMounted] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

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

    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section className="relative z-20 bg-[#f2ebe1] pt-16 pb-20">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <p className="text-[14px] tracking-[0.15em] font-mono text-[#203b14]/50 uppercase mb-8">
                    Trusted by
                </p>

                {/* Logo Scroller Container - NO absolute positioning */}
                <div className="relative overflow-hidden w-full max-w-[700px] mx-auto">
                    {/* Left Gradient Fade */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, #f2ebe1, transparent)"
                        }}
                    />

                    {/* Right Gradient Fade */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
                        style={{
                            background: "linear-gradient(to left, #f2ebe1, transparent)"
                        }}
                    />

                    {/* Scrolling Logos */}
                    <div
                        className="flex items-center gap-12 py-2"
                        style={{
                            animation: isMounted && !isReducedMotion ? "scrollLogos 20s linear infinite" : "none",
                            width: "max-content",
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={`logo-${index}`}
                                className="flex-shrink-0 flex items-center justify-center h-6 sm:h-7 md:h-8"
                            >
                                <img
                                    src={logo}
                                    alt={`Company logo ${(index % logos.length) + 1}`}
                                    className="h-full w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[160px]"
                                    style={{
                                        filter: "brightness(0) saturate(100%) invert(8%) sepia(15%) saturate(2000%) hue-rotate(70deg) brightness(95%) contrast(95%)",
                                    }}
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
