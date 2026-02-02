"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LogoScroller() {
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
            duration: 25,
            ease: "none",
            repeat: -1,
        });

        // Depth effect - each logo zooms in when entering, zooms out when leaving
        // Small at edges → Large at center → Small at edges
        const updateDepth = () => {
            const centerX = window.innerWidth / 2;
            const maxDistance = window.innerWidth / 2;

            // Settings - increased zoom effect
            const minScale = 0.5;  // Scale at edges (smaller)
            const maxScale = 1.15; // Scale at center (larger)
            const minOpacity = 0.1; // Opacity at edges

            logoRefs.current.forEach((logo) => {
                if (!logo) return;

                const rect = logo.getBoundingClientRect();
                const logoCenter = rect.left + rect.width / 2;
                const distance = Math.abs(centerX - logoCenter);

                // t = 0 at center, t = 1 at edges
                const t = Math.min(distance / maxDistance, 1);

                // Smooth easing for natural zoom effect
                const easedT = t * t;

                // Scale: 1.15 at center → 0.5 at edges (bigger zoom effect)
                const scale = maxScale - easedT * (maxScale - minScale);

                // Opacity: 1.0 at center → 0.1 at edges
                const opacity = 1 - easedT * (1 - minOpacity);

                gsap.to(logo, {
                    scale,
                    opacity,
                    duration: 0.2,
                    ease: "power1.out",
                    overwrite: "auto",
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
