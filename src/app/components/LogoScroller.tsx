"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LogoScroller() {
    const trackRef = useRef<HTMLDivElement>(null);
    const logoRefs = useRef<HTMLDivElement[]>([]);

    const logos = [
        "/adaline-ai/svgexport-50.svg",
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

    ];

    const allLogos = [...logos, ...logos];

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const scrollTween = gsap.to(track, {
            xPercent: -50,
            duration: 25,
            ease: "none",
            repeat: -1,
        });

        const updateDepth = () => {
            const centerX = window.innerWidth / 2;
            const maxDistance = window.innerWidth / 2;

            const minScale = 0.5;
            const maxScale = 1.15;
            const minOpacity = 0.1;

            logoRefs.current.forEach((logo) => {
                if (!logo) return;

                const rect = logo.getBoundingClientRect();
                const logoCenter = rect.left + rect.width / 2;
                const distance = Math.abs(centerX - logoCenter);

                const t = Math.min(distance / maxDistance, 1);

                const easedT = t * t;

                const scale = maxScale - easedT * (maxScale - minScale);

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
            <div className="logo-scroller__fade logo-scroller__fade--left" />
            <div className="logo-scroller__fade logo-scroller__fade--right" />

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
