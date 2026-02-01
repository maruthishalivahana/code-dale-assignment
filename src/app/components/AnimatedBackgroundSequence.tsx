"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// CINEMATIC BACKGROUND IMAGE SEQUENCE
// ============================================
// THREE-PHASE scroll-controlled animation:
// Phase 1 (0-1200px): Frames 002-191 - UI fades out
// Phase 2 (1200-1600px): Frames 192-199 - Clear immersive scene
// Phase 3 (1600-4000px): Frames 200-281 - Product zoom-out reveal
// 
// Camera motion:
// Phase 1-2: Camera pushes forward into scene (scale increases)
// Phase 3: Camera pulls BACK to create depth (scale decreases)
// ============================================

// Generate full frame sequence (002-281) for desktop
const generateDesktopFrameSequence = (): string[] => {
    const frames: string[] = [];
    for (let i = 2; i <= 281; i++) {
        const frameNumber = i.toString().padStart(3, "0");
        frames.push(`/3dimages/graded_4K_100_gm_50_1080_3-${frameNumber}.jpg`);
    }
    return frames;
};

// Mobile frames (subset for performance) - 3x5 aspect ratio optimized
// 26 frames sampled from full sequence for smooth mobile experience
const MOBILE_FRAME_SEQUENCE: string[] = [
    "/3x5_281/graded_4K_100_gm_85_1080_3x5_3-001.jpg",  // Frame 001
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-009.jpg",  // Frame 009
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-018.jpg",  // Frame 018
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-027.jpg",  // Frame 027
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-036.jpg",  // Frame 036
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-044.jpg",  // Frame 044
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-053.jpg",  // Frame 053
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-062.jpg",  // Frame 062
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-071.jpg",  // Frame 071
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-079.jpg",  // Frame 079
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-088.jpg",  // Frame 088
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-097.jpg",  // Frame 097
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-106.jpg",  // Frame 106
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-114.jpg",  // Frame 114
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-123.jpg",  // Frame 123
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-132.jpg",  // Frame 132
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-141.jpg",  // Frame 141
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-149.jpg",  // Frame 149
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-158.jpg",  // Frame 158
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-176.jpg",  // Frame 176
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-193.jpg",  // Frame 193
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-211.jpg",  // Frame 211
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-228.jpg",  // Frame 228
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-246.jpg",  // Frame 246
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-263.jpg",  // Frame 263
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-281.jpg",  // Frame 281
];

// Mobile phase mappings (26 frames total, indices 0-25)
const MOBILE_CONFIG = {
    // Phase 1: Frames 001-149 (indices 0-17)
    PHASE1_FRAME_END: 17,
    // Phase 2: Frames 158-176 (indices 18-19)
    PHASE2_FRAME_START: 18,
    PHASE2_FRAME_END: 19,
    // Phase 3: Frames 193-281 (indices 20-25, 6 frames)
    PHASE3_FRAME_START: 20,
    PHASE3_FRAME_END: 25,
} as const;

// Mobile-specific scroll distances for cinematic pacing
// Extended Phase 3 for slower reveal of final frames
const MOBILE_SCROLL = {
    PHASE1_END: 900,
    PHASE2_END: 1200,
    PHASE3_START: 1200,
    PHASE3_END: 2600, // Extended reveal distance for final frames to linger
} as const;

const DESKTOP_FRAME_SEQUENCE = generateDesktopFrameSequence();

// Configuration for THREE-PHASE animation
// Desktop frames: 002-281 (280 frames, indices 0-279)
const CONFIG = {
    // Phase 1: Intro cinematic (UI fades out) - Frames 002-191 (indices 0-189)
    PHASE1_END: 1200,
    PHASE1_FRAME_END: 189,

    // Phase 2: Clear immersive scene (no UI) - Frames 192-199 (indices 190-197)
    PHASE2_START: 1200,
    PHASE2_END: 1600,
    PHASE2_FRAME_START: 190,
    PHASE2_FRAME_END: 197,

    // Phase 3: Product zoom-out reveal - Frames 200-281 (indices 198-279)
    // Extended scroll range: 1600px → 4000px (2400px total)
    // 82 frames over 2400px = ~29px per frame for smooth cinematic pace
    PHASE3_START: 1600,
    PHASE3_END: 4000,
    PHASE3_FRAME_START: 198, // Frame 200 (index 198)
    PHASE3_FRAME_END: 279,   // Frame 281 (index 279) - 82 frames total

    // Cinematic depth effects
    SCALE_MULTIPLIER: 0.00008,
    BRIGHTNESS_MULTIPLIER: 0.00015,

    // Preloading
    PRELOAD_INITIAL: 15,
    PRELOAD_AHEAD: 8,

    // Mobile
    MOBILE_BREAKPOINT: 768,
} as const;

// Helper: clamp value between min and max
const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export default function AnimatedBackgroundSequence() {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const bgLayerRef = useRef<HTMLDivElement>(null);

    const lastFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const preloadedRef = useRef<Set<string>>(new Set());
    const isReducedMotionRef = useRef(false);

    // Get the appropriate frame sequence based on device
    const frameSequence = isMobile ? MOBILE_FRAME_SEQUENCE : DESKTOP_FRAME_SEQUENCE;
    const totalFrames = frameSequence.length;

    // Preload image helper
    const preloadImage = useCallback((url: string) => {
        if (preloadedRef.current.has(url)) return;
        const img = new Image();
        img.src = url;
        preloadedRef.current.add(url);
    }, []);

    // Preload frames by index
    const preloadFrameByIndex = useCallback(
        (index: number) => {
            if (index >= 0 && index < frameSequence.length) {
                preloadImage(frameSequence[index]);
            }
        },
        [preloadImage, frameSequence]
    );

    // Detect mobile and reduced motion on mount
    useEffect(() => {
        isReducedMotionRef.current = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < CONFIG.MOBILE_BREAKPOINT);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile, { passive: true });

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // Initial preload
    useEffect(() => {
        if (isReducedMotionRef.current) {
            setCurrentFrame(totalFrames - 1);
            setIsReady(true);
            return;
        }

        // Preload first batch of frames
        for (let i = 0; i < Math.min(CONFIG.PRELOAD_INITIAL, totalFrames); i++) {
            preloadFrameByIndex(i);
        }

        // Also preload frames around phase transitions
        for (let i = CONFIG.PHASE2_FRAME_START - 3; i <= CONFIG.PHASE2_FRAME_START + 5; i++) {
            preloadFrameByIndex(i);
        }
        for (let i = CONFIG.PHASE3_FRAME_START - 3; i <= CONFIG.PHASE3_FRAME_START + 5; i++) {
            preloadFrameByIndex(i);
        }

        // Mark ready after first frame loads
        const firstImg = new Image();
        firstImg.onload = () => setIsReady(true);
        firstImg.onerror = () => setIsReady(true);
        firstImg.src = frameSequence[0];
    }, [frameSequence, totalFrames, preloadFrameByIndex]);

    // THREE-PHASE scroll handler with RAF throttling
    useEffect(() => {
        if (isReducedMotionRef.current) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scroll = window.scrollY;
                    const {
                        PHASE1_END,
                        PHASE2_START,
                        PHASE2_END,
                        PHASE3_START,
                        PHASE3_END,
                        SCALE_MULTIPLIER,
                        BRIGHTNESS_MULTIPLIER,
                        PRELOAD_AHEAD
                    } = CONFIG;

                    // Use mobile or desktop frame mappings
                    const frameConfig = isMobile ? {
                        PHASE1_FRAME_END: MOBILE_CONFIG.PHASE1_FRAME_END,
                        PHASE2_FRAME_START: MOBILE_CONFIG.PHASE2_FRAME_START,
                        PHASE2_FRAME_END: MOBILE_CONFIG.PHASE2_FRAME_END,
                        PHASE3_FRAME_START: MOBILE_CONFIG.PHASE3_FRAME_START,
                        PHASE3_FRAME_END: MOBILE_CONFIG.PHASE3_FRAME_END,
                    } : {
                        PHASE1_FRAME_END: CONFIG.PHASE1_FRAME_END,
                        PHASE2_FRAME_START: CONFIG.PHASE2_FRAME_START,
                        PHASE2_FRAME_END: CONFIG.PHASE2_FRAME_END,
                        PHASE3_FRAME_START: CONFIG.PHASE3_FRAME_START,
                        PHASE3_FRAME_END: CONFIG.PHASE3_FRAME_END,
                    };

                    const {
                        PHASE1_FRAME_END,
                        PHASE2_FRAME_START,
                        PHASE2_FRAME_END,
                        PHASE3_FRAME_START,
                        PHASE3_FRAME_END
                    } = frameConfig;

                    let frameIndex = 0;

                    // ==========================================
                    // MOBILE: Cinematic Adaline-style timing
                    // ==========================================
                    if (isMobile) {
                        const {
                            PHASE1_END: M_PHASE1_END,
                            PHASE2_END: M_PHASE2_END,
                            PHASE3_START: M_PHASE3_START,
                            PHASE3_END: M_PHASE3_END,
                        } = MOBILE_SCROLL;

                        // Phase 3 complete - stick on final frame
                        if (scroll > M_PHASE3_END) {
                            frameIndex = PHASE3_FRAME_END;
                        }
                        // Phase 3: Cinematic reveal with ease-out (1200px - 2600px)
                        // Final frames (211, 228, 246, 263, 281) linger longer
                        else if (scroll >= M_PHASE3_START) {
                            const progress3 = clamp(
                                (scroll - M_PHASE3_START) / (M_PHASE3_END - M_PHASE3_START),
                                0,
                                1
                            );
                            // Ease-out curve: 1 - (1 - t)^2
                            // Early frames play faster, final frames stay longer
                            const eased = 1 - Math.pow(1 - progress3, 2);
                            const frameCount = PHASE3_FRAME_END - PHASE3_FRAME_START + 1;
                            frameIndex = PHASE3_FRAME_START + Math.round(
                                eased * (frameCount - 1)
                            );
                        }
                        // Phase 2: Clear immersive scene (900px - 1200px)
                        else if (scroll >= M_PHASE1_END) {
                            const progress2 = (scroll - M_PHASE1_END) / (M_PHASE2_END - M_PHASE1_END);
                            const phase2Range = PHASE2_FRAME_END - PHASE2_FRAME_START;
                            frameIndex = clamp(
                                PHASE2_FRAME_START + Math.floor(progress2 * phase2Range),
                                PHASE2_FRAME_START,
                                PHASE2_FRAME_END
                            );
                        }
                        // Phase 1: Intro cinematic (0px - 900px)
                        else {
                            const progress1 = scroll / M_PHASE1_END;
                            frameIndex = clamp(
                                Math.floor(progress1 * PHASE1_FRAME_END),
                                0,
                                PHASE1_FRAME_END
                            );
                        }
                    }
                    // ==========================================
                    // DESKTOP: Original timing (unchanged)
                    // ==========================================
                    else {
                        // Stop updates only after Phase 3 ends (scrollY > 4000px)
                        // Background continues animating during ProductShowcase zoom-out
                        if (scroll > PHASE3_END) {
                            frameIndex = PHASE3_FRAME_END;
                        }
                        // Phase 3: Product zoom-out (1600px - 4000px) - Frames 200-281
                        // Background frames MUST continue playing while product zooms out
                        else if (scroll >= PHASE3_START) {
                            // progress = clamp((scrollY - 1600) / 2400, 0, 1)
                            const progress3 = clamp(
                                (scroll - PHASE3_START) / (PHASE3_END - PHASE3_START),
                                0,
                                1
                            );
                            // Maps progress 0→1 to frame range (198 to 279 = 82 frames)
                            // Use exact frame count to ensure frame 281 is reached
                            const frameCount = PHASE3_FRAME_END - PHASE3_FRAME_START + 1; // 82 frames
                            frameIndex = clamp(
                                PHASE3_FRAME_START + Math.round(progress3 * (frameCount - 1)),
                                PHASE3_FRAME_START,
                                PHASE3_FRAME_END
                            );
                        }
                        // Phase 2: Clear immersive scene (1200px - 1600px)
                        else if (scroll >= PHASE2_START) {
                            const progress2 = (scroll - PHASE2_START) / (PHASE2_END - PHASE2_START);
                            const phase2Range = PHASE2_FRAME_END - PHASE2_FRAME_START;
                            frameIndex = clamp(
                                PHASE2_FRAME_START + Math.floor(progress2 * phase2Range),
                                PHASE2_FRAME_START,
                                PHASE2_FRAME_END
                            );
                        }
                        // Phase 1: Intro cinematic (0px - 1200px) - Frames 002-191
                        else {
                            const progress1 = scroll / PHASE1_END;
                            frameIndex = clamp(
                                Math.floor(progress1 * PHASE1_FRAME_END),
                                0,
                                PHASE1_FRAME_END
                            );
                        }
                    }

                    // Only update if frame changed (performance optimization)
                    if (frameIndex !== lastFrameRef.current) {
                        lastFrameRef.current = frameIndex;
                        setCurrentFrame(frameIndex);

                        // Preload upcoming frames dynamically
                        for (let i = 1; i <= PRELOAD_AHEAD; i++) {
                            preloadFrameByIndex(frameIndex + i);
                        }
                    }

                    // Camera motion is now handled by GSAP ScrollTrigger
                    // RAF only handles frame switching for performance

                    ticking = false;
                });
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [totalFrames, preloadFrameByIndex, isMobile]);

    // GSAP ScrollTrigger for smooth camera motion
    // Handles scale and brightness transforms while RAF handles frame switching
    useEffect(() => {
        if (!bgLayerRef.current || isReducedMotionRef.current) return;

        const bgLayer = bgLayerRef.current;
        const { PHASE2_END, PHASE3_START, PHASE3_END, SCALE_MULTIPLIER } = CONFIG;

        // Calculate scale values
        const scaleAtPhase2End = 1 + PHASE2_END * SCALE_MULTIPLIER; // ~1.128
        const finalScale = scaleAtPhase2End - 0.12; // ~1.008 (pulled back)

        // Brightness and contrast values - increased for better visibility
        // Phase 1-2: Bright and crisp
        const initialBrightness = 1.15;
        const initialContrast = 1.1;
        // Phase 2 end: Slightly reduced but still bright
        const phase2Brightness = 1.0;
        const phase2Contrast = 1.05;
        // Phase 3 end: Subtle dimming for depth
        const finalBrightness = 0.95;
        const finalContrast = 1.0;

        const ctx = gsap.context(() => {
            // Phase 1-2: Camera pushes forward (0 → 1600px)
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: `${PHASE2_END}px top`,
                    scrub: 0.5,
                }
            })
                .fromTo(bgLayer,
                    { scale: 1, filter: `brightness(${initialBrightness}) contrast(${initialContrast})` },
                    { scale: scaleAtPhase2End, filter: `brightness(${phase2Brightness}) contrast(${phase2Contrast})`, ease: "none" }
                );

            // Phase 3: Camera pulls back (1600px → 4000px)
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: `${PHASE3_START}px top`,
                    end: `${PHASE3_END}px top`,
                    scrub: 0.5,
                }
            })
                .fromTo(bgLayer,
                    { scale: scaleAtPhase2End, filter: `brightness(${phase2Brightness}) contrast(${phase2Contrast})` },
                    { scale: finalScale, filter: `brightness(${finalBrightness}) contrast(${finalContrast})`, ease: "power2.out" }
                );
        });

        return () => ctx.revert();
    }, []);

    // Current frame URL
    const currentFrameUrl = frameSequence[currentFrame] || frameSequence[0];

    return (
        <div
            className="fixed inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
        >
            {/* Background layer with frame sequence - GSAP controls transforms */}
            <div
                ref={bgLayerRef}
                className="bg-layer absolute inset-0"
                style={{
                    backgroundImage: isReady ? `url(${currentFrameUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    willChange: "transform, filter",
                }}
            />

            {/* Soft gradient fade at top for seamless navbar blending */}
            <div
                className="absolute inset-0 pointer-events-none"
            //                 style={{
            //                     background: `linear-gradient(
            //     to bottom,
            //     rgba(242, 235, 225, 0.85) 0%,
            //     rgba(242, 235, 225, 0.55) 6%,
            //     rgba(242, 235, 225, 0.25) 12%,
            //     rgba(242, 235, 225, 0.08) 18%,
            //     rgba(242, 235, 225, 0.0) 26%,
            //     transparent 60%,
            //     rgba(0,0,0,0.08) 100%
            //   )`,
            //                 }}

            />

            {/* Initial loading state - cream background */}
            {!isReady && <div className="absolute inset-0 bg-[#F2EBE1]" />}
        </div>
    );
}

// Export configuration for other components
export const ANIMATION_CONFIG = CONFIG;
