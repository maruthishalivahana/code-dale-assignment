"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

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

const easeOutCubic = (t: number): number => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 3);
};

const CONFIG = {
    SCROLL_RANGE: 1200,
    NAVBAR_FADE_END: 420,
    HERO_FADE_END: 520,
    LOGOS_FADE_START: 180,
    LOGOS_FADE_END: 720,
    SCALE_MULTIPLIER: 0.00012,
    BRIGHTNESS_MULTIPLIER: 0.00022,
} as const;

export function useScrollCinematicIntro(totalFrames: number): CinematicIntroState {
    const [scrollY, setScrollY] = useState(0);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const rafRef = useRef<number | null>(null);
    const lastScrollRef = useRef(0);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (isReducedMotion) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const currentScroll = window.scrollY;

                    if (Math.abs(currentScroll - lastScrollRef.current) > 0.5) {
                        lastScrollRef.current = currentScroll;
                        setScrollY(currentScroll);
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
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isReducedMotion]);

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

        const navbarProgress = scrollY / NAVBAR_FADE_END;
        const navbarOpacity = isComplete ? 0 : Math.max(0, 1 - easeOutCubic(navbarProgress));

        const heroProgress = scrollY / HERO_FADE_END;
        const heroOpacity = isComplete ? 0 : Math.max(0, 1 - easeOutCubic(heroProgress));

        const logosRange = LOGOS_FADE_END - LOGOS_FADE_START;
        const logosProgress = scrollY <= LOGOS_FADE_START
            ? 0
            : (scrollY - LOGOS_FADE_START) / logosRange;
        const logosOpacity = isComplete ? 0 : Math.max(0, 1 - easeOutCubic(logosProgress));

        const frameProgress = clampedScroll / SCROLL_RANGE;
        const frameIndex = isComplete
            ? totalFrames - 1
            : Math.min(Math.floor(frameProgress * (totalFrames - 1)), totalFrames - 1);

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

export const CINEMATIC_CONFIG = CONFIG;

export default useScrollCinematicIntro;
