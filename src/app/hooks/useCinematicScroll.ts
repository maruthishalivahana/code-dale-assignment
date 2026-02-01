"use client";

import { useEffect, useState, useRef, useCallback } from "react";

// ============================================
// CINEMATIC SCROLL HOOK
// ============================================
// Centralized scroll state management for synced animations
// 
// THREE-PHASE animation structure:
// Phase 1 (0-1200px): Frames 002-191 - UI fades out
// Phase 2 (1200-1600px): Frames 192-199 - Clear immersive scene
// Phase 3 (1600-2400px): Frames 200-281 - Product zoom-out reveal
// ============================================

// Scroll configuration constants
export const SCROLL_CONFIG = {
    // Phase 1: Intro cinematic (UI fades out)
    PHASE1_START: 0,
    PHASE1_END: 1200,
    PHASE1_FRAME_START: 0,    // Frame 002 (index 0)
    PHASE1_FRAME_END: 189,    // Frame 191 (index 189)

    // Phase 2: Clear immersive scene (no UI)
    PHASE2_START: 1200,
    PHASE2_END: 1600,
    PHASE2_FRAME_START: 190,  // Frame 192 (index 190)
    PHASE2_FRAME_END: 197,    // Frame 199 (index 197)

    // Phase 3: Product zoom-out reveal (camera pull-back)
    PHASE3_START: 1600,
    PHASE3_END: 2400,
    PHASE3_FRAME_START: 198,  // Frame 200 (index 198)
    PHASE3_FRAME_END: 279,    // Frame 281 (index 279)

    // Total scroll range
    TOTAL_SCROLL: 2400,
} as const;

// Premium easing functions - no bounce, no spring, cinematic feel
export const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
};

export const easeInCubic = (t: number): number => {
    return t * t * t;
};

export const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Linear interpolation helper
export const lerp = (start: number, end: number, t: number): number => {
    return start + (end - start) * t;
};

// Clamp helper
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export interface CinematicScrollState {
    scrollY: number;
    phase: 1 | 2 | 3 | 4; // 4 = past cinematic mode
    phase1Progress: number; // 0-1 during phase 1
    phase2Progress: number; // 0-1 during phase 2
    phase3Progress: number; // 0-1 during phase 3
    frameIndex: number;
    isPastCinematic: boolean;
    isReducedMotion: boolean;
}

export function useCinematicScroll(): CinematicScrollState {
    const [state, setState] = useState<CinematicScrollState>({
        scrollY: 0,
        phase: 1,
        phase1Progress: 0,
        phase2Progress: 0,
        phase3Progress: 0,
        frameIndex: 0,
        isPastCinematic: false,
        isReducedMotion: false,
    });

    const rafRef = useRef<number | null>(null);
    const isReducedMotionRef = useRef(false);
    const lastScrollRef = useRef(0);

    // Calculate all scroll-derived values
    const calculateState = useCallback((scroll: number): CinematicScrollState => {
        const {
            PHASE1_END,
            PHASE1_FRAME_END,
            PHASE2_START,
            PHASE2_END,
            PHASE2_FRAME_START,
            PHASE2_FRAME_END,
            PHASE3_START,
            PHASE3_END,
            PHASE3_FRAME_START,
            PHASE3_FRAME_END,
        } = SCROLL_CONFIG;

        let phase: 1 | 2 | 3 | 4 = 1;
        let phase1Progress = 0;
        let phase2Progress = 0;
        let phase3Progress = 0;
        let frameIndex = 0;
        const isPastCinematic = scroll > PHASE3_END;

        if (isPastCinematic) {
            // Past cinematic mode - lock everything
            phase = 4;
            phase1Progress = 1;
            phase2Progress = 1;
            phase3Progress = 1;
            frameIndex = PHASE3_FRAME_END;
        } else if (scroll >= PHASE3_START) {
            // Phase 3: Product zoom-out (1600-2400px)
            phase = 3;
            phase1Progress = 1;
            phase2Progress = 1;
            phase3Progress = clamp((scroll - PHASE3_START) / (PHASE3_END - PHASE3_START), 0, 1);

            // Frame mapping: 199 + floor(progress * 82) for frames 200-281
            const phase3Range = PHASE3_FRAME_END - PHASE3_FRAME_START;
            frameIndex = PHASE3_FRAME_START + Math.floor(phase3Progress * phase3Range);
            frameIndex = clamp(frameIndex, PHASE3_FRAME_START, PHASE3_FRAME_END);
        } else if (scroll >= PHASE2_START) {
            // Phase 2: Clear scene (1200-1600px)
            phase = 2;
            phase1Progress = 1;
            phase2Progress = clamp((scroll - PHASE2_START) / (PHASE2_END - PHASE2_START), 0, 1);

            const phase2Range = PHASE2_FRAME_END - PHASE2_FRAME_START;
            frameIndex = PHASE2_FRAME_START + Math.floor(phase2Progress * phase2Range);
            frameIndex = clamp(frameIndex, PHASE2_FRAME_START, PHASE2_FRAME_END);
        } else {
            // Phase 1: Intro cinematic (0-1200px)
            phase = 1;
            phase1Progress = clamp(scroll / PHASE1_END, 0, 1);

            frameIndex = Math.floor(phase1Progress * PHASE1_FRAME_END);
            frameIndex = clamp(frameIndex, 0, PHASE1_FRAME_END);
        }

        return {
            scrollY: scroll,
            phase,
            phase1Progress,
            phase2Progress,
            phase3Progress,
            frameIndex,
            isPastCinematic,
            isReducedMotion: isReducedMotionRef.current,
        };
    }, []);

    useEffect(() => {
        // Check reduced motion preference
        isReducedMotionRef.current = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (isReducedMotionRef.current) {
            setState({
                scrollY: 0,
                phase: 4,
                phase1Progress: 1,
                phase2Progress: 1,
                phase3Progress: 1,
                frameIndex: SCROLL_CONFIG.PHASE3_FRAME_END,
                isPastCinematic: true,
                isReducedMotion: true,
            });
            return;
        }

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scroll = window.scrollY;

                    // Only update if scroll changed
                    if (scroll !== lastScrollRef.current) {
                        lastScrollRef.current = scroll;
                        setState(calculateState(scroll));
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial calculation
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [calculateState]);

    return state;
}

export default useCinematicScroll;
