"use client";

import { useEffect, useState, useRef } from "react";
import { Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CONFIG = {
    ZOOM_START: 800,
    ZOOM_END: 4000,
    SCALE_START: 1.8,
    SCALE_END: 0.5,
    TRANSLATE_START: 200,
    TRANSLATE_END: 0,
    VIDEO_LOAD_OFFSET: 300
} as const;

export default function ProductShowcase() {
    const handleScrollTriggerRefresh = () => ScrollTrigger.refresh();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const showcaseRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isReducedMotionRef = useRef(false);

    useEffect(() => {
        isReducedMotionRef.current = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }, []);

    useEffect(() => {
        if (!showcaseRef.current || !containerRef.current) return;

        const { ZOOM_START, ZOOM_END, SCALE_START, SCALE_END, TRANSLATE_START, TRANSLATE_END } = CONFIG;

        showcaseRef.current.classList.remove('opacity-0', 'translate-y-full', 'pointer-events-none');

        gsap.set(showcaseRef.current, {
            yPercent: 100,
            opacity: 0,
            pointerEvents: "none"
        });
        gsap.set(containerRef.current, { scale: SCALE_START });

        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: `${ZOOM_START}px top`,
                    end: `${ZOOM_END}px top`,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        if (self.progress > 0.05 && showcaseRef.current) {
                            showcaseRef.current.style.pointerEvents = "auto";
                        }
                    }
                }
            })
                .to(showcaseRef.current, {
                    yPercent: 0,
                    opacity: 1,
                    ease: "power2.out",
                }, 0)
                .to(containerRef.current, {
                    scale: SCALE_END,
                    ease: "power2.out",
                }, 0);

            setTimeout(() => {
                ScrollTrigger.refresh();
                ScrollTrigger.update();
            }, 0);
        });

        window.addEventListener('load', handleScrollTriggerRefresh);

        return () => {
            ctx.revert();
            window.removeEventListener('load', handleScrollTriggerRefresh);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= CONFIG.ZOOM_START - CONFIG.VIDEO_LOAD_OFFSET) {
                setIsVisible(true);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section
            ref={showcaseRef}
            className="product-showcase fixed inset-0 z-20 opacity-0 translate-y-full pointer-events-none pt-16 sm:pt-0"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "opacity, transform",
            }}
        >
            <div
                ref={containerRef}
                className="w-[100vw] sm:w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] px-2 sm:px-0"
                style={{
                    maxWidth: "1400px",
                    transformOrigin: "center center",
                    willChange: "transform",
                }}
            >
                <div className="relative w-full h-[200px] sm:h-auto sm:aspect-video overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-black shadow-[0_15px_50px_rgba(0,0,0,0.3)] sm:shadow-[0_25px_80px_rgba(0,0,0,0.4)]">
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls={isPlaying}
                        playsInline
                        preload="metadata"
                    >
                        <source src="https://www.adaline.ai/videos/product-demo.mp4" type="video/mp4" />
                    </video>

                    <div
                        className={`absolute inset-0 z-10 flex items-center justify-center cursor-pointer transition-opacity duration-500 ease-out ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                        onClick={() => {
                            setIsPlaying(true);
                            setTimeout(() => videoRef.current?.play(), 100);
                        }}
                    >
                        <img
                            src="/3x5_281/hero-product-shot.webp"
                            alt="Product demo preview"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                                <Play size={28} className="text-[#203b14] ml-1" fill="#203b14" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
