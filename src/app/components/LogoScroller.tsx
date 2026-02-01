"use client";

import { useEffect, useState, useRef } from "react";

export default function LogoScroller() {
    const [isMounted, setIsMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Scroll handler with RAF throttling for fade effect
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    // Only track scroll between 200-700px for logo fade
                    const scroll = window.scrollY;
                    if (scroll <= 700) {
                        setScrollY(scroll);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Calculate fade opacity: 1 at 0-200px, fades to 0 between 200-700px
    const fadeStart = 200;
    const fadeEnd = 700;
    const fadeRange = fadeEnd - fadeStart;

    let opacity = 1;
    if (scrollY > fadeStart) {
        opacity = Math.max(1 - (scrollY - fadeStart) / fadeRange, 0);
    }

    // Company logos from adaline-ai folder - all available SVGs
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
        "/adaline-ai/svgexport-22.svg",
        "/adaline-ai/svgexport-23.svg",
        "/adaline-ai/svgexport-24.svg",
        "/adaline-ai/svgexport-25.svg",
        "/adaline-ai/svgexport-26.svg",
        "/adaline-ai/svgexport-27.svg",
        "/adaline-ai/svgexport-28.svg",
        "/adaline-ai/svgexport-29.svg",
        "/adaline-ai/svgexport-30.svg",
        "/adaline-ai/svgexport-31.svg",
        "/adaline-ai/svgexport-32.svg",
        "/adaline-ai/svgexport-33.svg",
        "/adaline-ai/svgexport-34.svg",
        "/adaline-ai/svgexport-35.svg",
        "/adaline-ai/svgexport-36.svg",
        "/adaline-ai/svgexport-37.svg",
        "/adaline-ai/svgexport-38.svg",
        "/adaline-ai/svgexport-39.svg",
        "/adaline-ai/svgexport-40.svg",
        "/adaline-ai/svgexport-41.svg",
        "/adaline-ai/svgexport-42.svg",
        "/adaline-ai/svgexport-43.svg",
        "/adaline-ai/svgexport-44.svg",
        "/adaline-ai/svgexport-45.svg",
        "/adaline-ai/svgexport-46.svg",
        "/adaline-ai/svgexport-47.svg",
        "/adaline-ai/svgexport-48.svg",
        "/adaline-ai/svgexport-49.svg",
        "/adaline-ai/svgexport-50.svg",
        "/adaline-ai/svgexport-51.svg",
        "/adaline-ai/svgexport-52.svg",
        "/adaline-ai/svgexport-53.svg",
        "/adaline-ai/svgexport-54.svg",
        "/adaline-ai/svgexport-55.svg",
        "/adaline-ai/svgexport-56.svg",
        "/adaline-ai/svgexport-57.svg",
        "/adaline-ai/svgexport-58.svg",
        "/adaline-ai/svgexport-59.svg",
        "/adaline-ai/svgexport-60.svg",
        "/adaline-ai/svgexport-61.svg",
        "/adaline-ai/svgexport-62.svg",
    ];

    // Duplicate logos array for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section
            className="w-full bg-white pt-8 pb-12 md:pt-10 md:pb-16 overflow-hidden"
            style={{
                opacity,
                pointerEvents: opacity < 0.1 ? "none" : "auto",
                willChange: "opacity",
            }}
        >
            {/* Trusted By Label */}
            <p className="text-xs tracking-[0.25em] text-[#203b14]/60 text-center mb-3 uppercase">
                Trusted By
            </p>

            <div className="w-full px-8 md:px-16 lg:px-24">
                {/* Logo Scroller Container */}
                <div className="relative w-full overflow-hidden">
                    {/* Left Fog/Smoke Overlay */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 z-30 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)",
                            filter: "blur(1px)",
                            maskImage: "linear-gradient(to right, black 0%, black 40%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to right, black 0%, black 40%, transparent 100%)"
                        }}
                    ></div>

                    {/* Right Fog/Smoke Overlay */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-40 z-30 pointer-events-none"
                        style={{
                            background: "linear-gradient(to left, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)",
                            filter: "blur(1px)",
                            maskImage: "linear-gradient(to left, black 0%, black 40%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to left, black 0%, black 40%, transparent 100%)"
                        }}
                    ></div>

                    {/* Scrolling Logos Container */}
                    <div
                        className="flex gap-10 sm:gap-12 md:gap-14 lg:gap-16 items-center py-2"
                        style={{
                            animation: isMounted ? "scrollLogos 30s linear infinite" : "none",
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={`logo-${index}`}
                                className="flex-shrink-0 flex items-center justify-center h-5 sm:h-6 md:h-7 lg:h-8"
                            >
                                <img
                                    src={logo}
                                    alt={`Company logo ${(index % logos.length) + 1}`}
                                    className="h-full w-auto object-contain max-w-[110px] sm:max-w-[130px] md:max-w-[150px]"
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
                        transform: translateX(calc(-50% - 16px));
                    }
                }

                /* Mobile optimization */
                @media (max-width: 640px) {
                    @keyframes scrollLogos {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(calc(-50% - 12px));
                        }
                    }
                }

                /* Tablet optimization */
                @media (min-width: 641px) and (max-width: 1024px) {
                    @keyframes scrollLogos {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(calc(-50% - 14px));
                        }
                    }
                }

                /* Reduce motion for accessibility */
                @media (prefers-reduced-motion: reduce) {
                    div[style*="animation: scrollLogos"] {
                        animation: none !important;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </section>
    );
}
