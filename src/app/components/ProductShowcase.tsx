"use client";

import { useEffect, useState, useRef } from "react";
import { Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// PRODUCT SHOWCASE - CINEMATIC SCALE-DOWN REVEAL
// ============================================
// Comes from bottom, scales down from full-width to centered:
// - Scroll range: 1600px → 4000px
// - Scale: 2.5 → 1.0 (starts full-width, shrinks to center)
// - Opacity: 0 → 1
// - TranslateY: 200px → 0px (rises from bottom)
// 
// IMPORTANT: Fixed positioning, centered in viewport
// ============================================

// Configuration - synced with Phase 3 frame playback
const CONFIG = {
    // Phase 3 extended scroll range: 800px → 4000px (3200px total)
    ZOOM_START: 800,
    ZOOM_END: 4000,

    // Scale: starts large, shrinks to small centered laptop-like size
    SCALE_START: 1.8,
    SCALE_END: 0.5,

    // Vertical motion: rises from bottom
    TRANSLATE_START: 200,
    TRANSLATE_END: 0,

    // Preload video early for smooth reveal
    VIDEO_LOAD_OFFSET: 300
} as const;

export default function ProductShowcase() {
    // Handler for ScrollTrigger refresh on window load
    const handleScrollTriggerRefresh = () => ScrollTrigger.refresh();
    // Always scroll to top on reload to start at navbar
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

    // Check for reduced motion preference
    useEffect(() => {
        isReducedMotionRef.current = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }, []);

    // GSAP ScrollTrigger for cinematic slide-up animation
    useEffect(() => {
        if (!showcaseRef.current || !containerRef.current) return;

        const { ZOOM_START, ZOOM_END, SCALE_START, SCALE_END, TRANSLATE_START, TRANSLATE_END } = CONFIG;

        // Clear Tailwind classes and set initial GSAP state
        showcaseRef.current.classList.remove('opacity-0', 'translate-y-full', 'pointer-events-none');

        // Set initial state (hidden, off-screen at bottom, scaled up)
        gsap.set(showcaseRef.current, {
            yPercent: 100, // Start completely below viewport
            opacity: 0, // Completely invisible initially
            pointerEvents: "none"
        });
        gsap.set(containerRef.current, { scale: SCALE_START });

        const ctx = gsap.context(() => {
            // Slide-up + scale-down animation synced with scroll
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: `${ZOOM_START}px top`,
                    end: `${ZOOM_END}px top`,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        // Enable pointer events when animation starts
                        if (self.progress > 0.05 && showcaseRef.current) {
                            showcaseRef.current.style.pointerEvents = "auto";
                        }
                    }
                }
            })
                // Fade in and slide up from bottom to center
                .to(showcaseRef.current, {
                    yPercent: 0,
                    opacity: 1,
                    ease: "power2.out",
                }, 0)
                // Scale down from full-width to centered size
                .to(containerRef.current, {
                    scale: SCALE_END,
                    ease: "power2.out",
                }, 0);
            // Force ScrollTrigger to update immediately on mount
            setTimeout(() => {
                ScrollTrigger.refresh();
                ScrollTrigger.update();
            }, 0);
        });

        // Also refresh on window load (for hard reloads/bookmarks)
        window.addEventListener('load', handleScrollTriggerRefresh);

        return () => {
            ctx.revert();
            window.removeEventListener('load', handleScrollTriggerRefresh);
        };
    }, []);

    // Preload video based on scroll position
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
                {/* Product Showcase Container */}
                <div className="relative w-full h-[200px] sm:h-auto sm:aspect-video overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-black shadow-[0_15px_50px_rgba(0,0,0,0.3)] sm:shadow-[0_25px_80px_rgba(0,0,0,0.4)]">
                    {/* Video - always visible underneath, controls show when playing */}
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls={isPlaying}
                        playsInline
                        preload="metadata"
                    >
                        <source src="https://www.adaline.ai/videos/product-demo.mp4" type="video/mp4" />
                    </video>

                    {/* Thumbnail + Play Button - fades out on click */}
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
