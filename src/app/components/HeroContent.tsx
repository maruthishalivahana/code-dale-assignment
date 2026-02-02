"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

// ============================================
// HERO CONTENT WITH CINEMATIC FADES + GSAP LOGO DEPTH
// ============================================
// Premium film-like fade effects:
// - Hero text: 0px → 520px with easeOut
// - Company logos: 180px → 720px with easeOut (layered timing)
// - Logos have GSAP depth effect (scale/opacity/brightness from center)
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

    const trackRef = useRef<HTMLDivElement>(null);
    const logoRefs = useRef<HTMLDivElement[]>([]);

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

    const allLogos = [...logos, ...logos]; // duplicate for seamless loop

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // Horizontal infinite scroll
        const scrollTween = gsap.to(track, {
            xPercent: -50,
            duration: 50,
            ease: "none",
            repeat: -1,
        });

        // Depth effect (scale + opacity + brightness)
        const updateDepth = () => {
            const centerX = window.innerWidth / 2;
            const maxDistance = window.innerWidth / 2;

            // Responsive scaling - reduce effect on mobile
            const maxScaleReduction = window.innerWidth < 768 ? 0.2 : 0.35;
            const maxOpacityReduction = 0.85;
            const maxBrightnessReduction = 0.5;

            logoRefs.current.forEach((logo) => {
                if (!logo) return;

                const rect = logo.getBoundingClientRect();
                const logoCenter = rect.left + rect.width / 2;
                const distance = Math.abs(centerX - logoCenter);
                const t = Math.min(distance / maxDistance, 1);

                // Calculate depth values
                const scale = 1 - t * maxScaleReduction;
                const opacity = 1 - t * maxOpacityReduction;
                const brightness = 1 - t * maxBrightnessReduction;

                gsap.set(logo, {
                    scale: Math.max(0.65, scale),
                    opacity: Math.max(0, opacity),
                    filter: `brightness(${Math.max(0.5, brightness)})`,
                });
            });
        };

        gsap.ticker.add(updateDepth);

        return () => {
            scrollTween.kill();
            gsap.ticker.remove(updateDepth);
        };
    }, []);

    return (
        <section className="logo-scroller">
            {/* Fade overlays - positioned absolutely, don't wrap content */}
            <div className="logo-scroller__fade logo-scroller__fade--left" />
            <div className="logo-scroller__fade logo-scroller__fade--right" />

            {/* Track container - no clipping */}
            <div className="logo-scroller__track-wrapper">
                <div ref={trackRef} className="logo-scroller__track">
                    {allLogos.map((logo, i) => (
                        <div
                            key={i}
                            ref={(el) => { logoRefs.current[i] = el!; }}
                            className="logo-item"
                        >
                            <img src={logo} alt="" draggable={false} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}