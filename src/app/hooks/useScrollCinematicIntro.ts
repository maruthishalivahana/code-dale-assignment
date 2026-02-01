"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

// ============================================
// CINEMATIC SCROLL INTRO HOOK
// ============================================
// Centralized scroll state management for
// the Adaline.ai-style cinematic intro
// ============================================

interface CinematicIntroState {
    scrollY: number;
    navbarOpacity: number;
    heroOpacity: number;
    logosOpacity: number;
    frameIndex: number;
    scale: number;
    brightness: number;
    isAnimationComplete: boolean;
    isReducedMotion: boolean;
}

// Cubic ease-out function for premium, soft fades
// easeOut(t) = 1 - pow(1 - t, 3)
const easeOutCubic = (t: number): number => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 3);
};

// Configuration constants
const CONFIG = {
    // Total scroll range for animation
    SCROLL_RANGE: 1200,

    // Navbar fade: 0px → 420px
    NAVBAR_FADE_END: 420,

    // Hero text fade: 0px → 520px
    HERO_FADE_END: 520,

    // Logo fade: 180px → 720px (540px range)
    LOGOS_FADE_START: 180,
    LOGOS_FADE_END: 720,

    // Subtle cinematic depth effects
    SCALE_MULTIPLIER: 0.00012,
    BRIGHTNESS_MULTIPLIER: 0.00022,
} as const;

export function useScrollCinematicIntro(totalFrames: number): CinematicIntroState {
    const [scrollY, setScrollY] = useState(0);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const rafRef = useRef<number | null>(null);
    const lastScrollRef = useRef(0);

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

    // Scroll handler with RAF throttling for 60fps
    useEffect(() => {
        if (isReducedMotion) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const currentScroll = window.scrollY;

                    // Only update state if scroll changed significantly
                    if (Math.abs(currentScroll - lastScrollRef.current) > 0.5) {
                        lastScrollRef.current = currentScroll;
                        setScrollY(currentScroll);
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial call
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isReducedMotion]);

    // Memoized calculations for performance
    const cinematicState = useMemo((): CinematicIntroState => {
        const {
            SCROLL_RANGE,
            NAVBAR_FADE_END,
            HERO_FADE_END,
            LOGOS_FADE_START,
            LOGOS_FADE_END,
            SCALE_MULTIPLIER,
            BRIGHTNESS_MULTIPLIER
        } = CONFIG;

        // Handle reduced motion - skip to end state
        if (isReducedMotion) {
            return {
                scrollY: 0,
                navbarOpacity: 0,
                heroOpacity: 0,
                logosOpacity: 0,
                frameIndex: totalFrames - 1,
                scale: 1,
                brightness: 1,
                isAnimationComplete: true,
                isReducedMotion: true,
            };
        }

        const clampedScroll = Math.min(scrollY, SCROLL_RANGE);
        const isComplete = scrollY > SCROLL_RANGE;

        // Navbar opacity: 0px → 420px with easeOut
        const navbarProgress = scrollY / NAVBAR_FADE_END;
        const navbarOpacity = isComplete ? 0 : Math.max(0, 1 - easeOutCubic(navbarProgress));

        // Hero text opacity: 0px → 520px with easeOut
        const heroProgress = scrollY / HERO_FADE_END;
        const heroOpacity = isComplete ? 0 : Math.max(0, 1 - easeOutCubic(heroProgress));

        // Logos opacity: 180px → 720px with easeOut (delayed start)
        const logosRange = LOGOS_FADE_END - LOGOS_FADE_START;
        const logosProgress = scrollY <= LOGOS_FADE_START
            ? 0
            : (scrollY - LOGOS_FADE_START) / logosRange;
        const logosOpacity = isComplete ? 0 : Math.max(0, 1 - easeOutCubic(logosProgress));

        // Frame index calculation
        const frameProgress = clampedScroll / SCROLL_RANGE;
        const frameIndex = isComplete
            ? totalFrames - 1
            : Math.min(Math.floor(frameProgress * (totalFrames - 1)), totalFrames - 1);

        // Subtle cinematic depth effects (barely noticeable)
        const scale = 1 + clampedScroll * SCALE_MULTIPLIER;
        const brightness = Math.max(0.7, 1 - clampedScroll * BRIGHTNESS_MULTIPLIER);

        return {
            scrollY,
            navbarOpacity,
            heroOpacity,
            logosOpacity,
            frameIndex,
            scale,
            brightness,
            isAnimationComplete: isComplete,
            isReducedMotion,
        };
    }, [scrollY, totalFrames, isReducedMotion]);

    return cinematicState;
}

// Export configuration for external use
export const CINEMATIC_CONFIG = CONFIG;

export default useScrollCinematicIntro;
