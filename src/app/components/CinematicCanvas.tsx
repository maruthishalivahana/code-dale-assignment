"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// CINEMATIC CANVAS BACKGROUND RENDERER
// ============================================
// Exact replica of AnimatedBackgroundSequence but with canvas rendering
// to eliminate flickering caused by background-image swapping
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
const MOBILE_FRAME_SEQUENCE: string[] = [
    "/3x5_281/graded_4K_100_gm_85_1080_3x5_3-001.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-009.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-018.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-027.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-036.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-044.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-053.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-062.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-071.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-079.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-088.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-097.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-106.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-114.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-123.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-132.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-141.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-149.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-158.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-176.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-193.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-211.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-228.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-246.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-263.jpg",
    "/3x5_281/graded_4K_100_gm_50_1080_3x5_3-281.jpg",
];

// Mobile phase mappings (26 frames total, indices 0-25)
const MOBILE_CONFIG = {
    PHASE1_FRAME_END: 17,
    PHASE2_FRAME_START: 18,
    PHASE2_FRAME_END: 19,
    PHASE3_FRAME_START: 20,
    PHASE3_FRAME_END: 25,
} as const;

// Mobile scroll distances
const MOBILE_SCROLL = {
    PHASE1_END: 900,
    PHASE2_END: 1200,
    PHASE3_START: 1200,
    PHASE3_END: 2600,
} as const;

const DESKTOP_FRAME_SEQUENCE = generateDesktopFrameSequence();

// Configuration - EXACT SAME AS AnimatedBackgroundSequence
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
    PHASE3_START: 1600,
    PHASE3_END: 4000,
    PHASE3_FRAME_START: 198,
    PHASE3_FRAME_END: 279,

    // Cinematic depth effects
    SCALE_MULTIPLIER: 0.00008,

    // Preloading
    PRELOAD_INITIAL: 15,
    PRELOAD_AHEAD: 8,

    MOBILE_BREAKPOINT: 640,
} as const;

// Helper: clamp value
const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

export default function CinematicCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const isReadyRef = useRef(false);
    const rafRef = useRef<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isReducedMotionRef = useRef(false);

    // Get frame sequence based on device
    const frameSequence = isMobile ? MOBILE_FRAME_SEQUENCE : DESKTOP_FRAME_SEQUENCE;
    const totalFrames = frameSequence.length;

    // Render frame to canvas with cover-fit scaling
    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        const img = imagesRef.current[index];

        if (!ctx || !img || !img.complete || !img.naturalWidth) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Fill with background color first
        ctx.fillStyle = "#f2ebe1";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Calculate cover-fit dimensions (like background-size: cover)
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > canvasRatio) {
            // Image is wider - fit to height
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgRatio;
            drawX = (canvasWidth - drawWidth) / 2;
            drawY = 0;
        } else {
            // Image is taller - fit to width
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            drawX = 0;
            drawY = (canvasHeight - drawHeight) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }, []);

    // Resize canvas
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size to window size (no DPR for simpler alignment)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Re-render current frame
        if (isReadyRef.current) {
            renderFrame(currentFrameRef.current);
        }
    }, [renderFrame]);

    // Detect mobile and reduced motion
    useEffect(() => {
        isReducedMotionRef.current = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < CONFIG.MOBILE_BREAKPOINT);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile, { passive: true });
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Preload all frames into memory
    useEffect(() => {
        if (isReducedMotionRef.current) {
            currentFrameRef.current = totalFrames - 1;
            isReadyRef.current = true;
            setIsLoading(false);
            return;
        }

        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        const onLoad = () => {
            loadedCount++;

            // Mark ready when first few frames are loaded
            if (loadedCount >= 5 && !isReadyRef.current) {
                isReadyRef.current = true;
                resizeCanvas();
                renderFrame(0);
                setIsLoading(false);
            }
        };

        // Create Image objects and start loading
        frameSequence.forEach((src, index) => {
            const img = new Image();
            img.onload = onLoad;
            img.onerror = onLoad;
            img.src = src;
            images[index] = img;
        });

        imagesRef.current = images;

        return () => {
            images.forEach((img) => {
                img.onload = null;
                img.onerror = null;
            });
        };
    }, [frameSequence, totalFrames, resizeCanvas, renderFrame]);

    // Handle window resize
    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas, { passive: true });
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    // Scroll handler - EXACT SAME LOGIC AS AnimatedBackgroundSequence
    useEffect(() => {
        if (isReducedMotionRef.current) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scroll = window.scrollY;

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

                    // MOBILE timing
                    if (isMobile) {
                        const { PHASE1_END, PHASE2_END, PHASE3_START, PHASE3_END } = MOBILE_SCROLL;

                        if (scroll > PHASE3_END) {
                            frameIndex = PHASE3_FRAME_END;
                        } else if (scroll >= PHASE3_START) {
                            const progress3 = clamp((scroll - PHASE3_START) / (PHASE3_END - PHASE3_START), 0, 1);
                            const eased = 1 - Math.pow(1 - progress3, 2);
                            const frameCount = PHASE3_FRAME_END - PHASE3_FRAME_START + 1;
                            frameIndex = PHASE3_FRAME_START + Math.round(eased * (frameCount - 1));
                        } else if (scroll >= PHASE1_END) {
                            const progress2 = (scroll - PHASE1_END) / (PHASE2_END - PHASE1_END);
                            const phase2Range = PHASE2_FRAME_END - PHASE2_FRAME_START;
                            frameIndex = clamp(
                                PHASE2_FRAME_START + Math.floor(progress2 * phase2Range),
                                PHASE2_FRAME_START,
                                PHASE2_FRAME_END
                            );
                        } else {
                            const progress1 = scroll / PHASE1_END;
                            frameIndex = clamp(Math.floor(progress1 * PHASE1_FRAME_END), 0, PHASE1_FRAME_END);
                        }
                    }
                    // DESKTOP timing
                    else {
                        const { PHASE1_END, PHASE2_START, PHASE2_END, PHASE3_START, PHASE3_END } = CONFIG;

                        if (scroll > PHASE3_END) {
                            frameIndex = PHASE3_FRAME_END;
                        } else if (scroll >= PHASE3_START) {
                            const progress3 = clamp((scroll - PHASE3_START) / (PHASE3_END - PHASE3_START), 0, 1);
                            const frameCount = PHASE3_FRAME_END - PHASE3_FRAME_START + 1;
                            frameIndex = clamp(
                                PHASE3_FRAME_START + Math.round(progress3 * (frameCount - 1)),
                                PHASE3_FRAME_START,
                                PHASE3_FRAME_END
                            );
                        } else if (scroll >= PHASE2_START) {
                            const progress2 = (scroll - PHASE2_START) / (PHASE2_END - PHASE2_START);
                            const phase2Range = PHASE2_FRAME_END - PHASE2_FRAME_START;
                            frameIndex = clamp(
                                PHASE2_FRAME_START + Math.floor(progress2 * phase2Range),
                                PHASE2_FRAME_START,
                                PHASE2_FRAME_END
                            );
                        } else {
                            const progress1 = scroll / PHASE1_END;
                            frameIndex = clamp(Math.floor(progress1 * PHASE1_FRAME_END), 0, PHASE1_FRAME_END);
                        }
                    }

                    // Only render if frame changed
                    if (frameIndex !== currentFrameRef.current) {
                        currentFrameRef.current = frameIndex;
                        if (isReadyRef.current) {
                            renderFrame(frameIndex);
                        }
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
    }, [isMobile, renderFrame]);

    // GSAP ScrollTrigger for camera motion (scale transforms)
    useEffect(() => {
        if (!containerRef.current || isReducedMotionRef.current) return;

        const container = containerRef.current;
        const { PHASE2_END, PHASE3_START, PHASE3_END, SCALE_MULTIPLIER } = CONFIG;

        const scaleAtPhase2End = 1 + PHASE2_END * SCALE_MULTIPLIER;
        const finalScale = scaleAtPhase2End - 0.12;

        const ctx = gsap.context(() => {
            // Phase 1-2: Camera pushes forward
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: `${PHASE2_END}px top`,
                    scrub: 0.5,
                }
            }).fromTo(container,
                { scale: 1 },
                { scale: scaleAtPhase2End, ease: "none" }
            );

            // Phase 3: Camera pulls back
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: `${PHASE3_START}px top`,
                    end: `${PHASE3_END}px top`,
                    scrub: 0.5,
                }
            }).fromTo(container,
                { scale: scaleAtPhase2End },
                { scale: finalScale, ease: "power2.out" }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* Container for GSAP scale transforms */}
            <div
                ref={containerRef}
                className="absolute inset-0"
                style={{
                    willChange: "transform",
                    transformOrigin: "center center",
                }}
            >
                {/* Canvas for flicker-free frame rendering */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "block",
                    }}
                />
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="absolute inset-0 bg-[#f2ebe1]" />
            )}
        </div>
    );
}

// Export configuration for other components
export const ANIMATION_CONFIG = CONFIG;
