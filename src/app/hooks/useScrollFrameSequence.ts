"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ScrollFrameConfig {
    totalFrames: number;
    scrollRange: number;
    preloadAhead: number;
}

interface ScrollFrameState {
    currentFrame: number;
    scrollY: number;
    progress: number;
    isAnimationComplete: boolean;
}

export function useScrollFrameSequence(
    frames: string[],
    config: ScrollFrameConfig = { totalFrames: 25, scrollRange: 1200, preloadAhead: 3 }
): ScrollFrameState {
    const [state, setState] = useState<ScrollFrameState>({
        currentFrame: 0,
        scrollY: 0,
        progress: 0,
        isAnimationComplete: false,
    });

    const lastFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const preloadedFramesRef = useRef<Set<number>>(new Set());

    const preloadImage = useCallback((index: number) => {
        if (index < 0 || index >= frames.length) return;
        if (preloadedFramesRef.current.has(index)) return;

        const img = new Image();
        img.src = frames[index];
        preloadedFramesRef.current.add(index);
    }, [frames]);

    useEffect(() => {
        for (let i = 0; i < Math.min(5, frames.length); i++) {
            preloadImage(i);
        }
    }, [frames, preloadImage]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            setState({
                currentFrame: frames.length - 1,
                scrollY: 0,
                progress: 1,
                isAnimationComplete: true,
            });
            return;
        }

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const { scrollRange, preloadAhead } = config;
                    const totalFrames = frames.length;

                    const progress = Math.min(scrollY / scrollRange, 1);

                    const rawFrameIndex = (scrollY / scrollRange) * (totalFrames - 1);
                    const frameIndex = Math.min(
                        Math.max(Math.floor(rawFrameIndex), 0),
                        totalFrames - 1
                    );

                    if (frameIndex !== lastFrameRef.current) {
                        lastFrameRef.current = frameIndex;

                        for (let i = 1; i <= preloadAhead; i++) {
                            preloadImage(frameIndex + i);
                        }

                        setState({
                            currentFrame: frameIndex,
                            scrollY,
                            progress,
                            isAnimationComplete: scrollY >= scrollRange,
                        });
                    } else if (scrollY !== state.scrollY) {
                        setState(prev => ({
                            ...prev,
                            scrollY,
                            progress,
                            isAnimationComplete: scrollY >= scrollRange,
                        }));
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
    }, [frames, config, preloadImage, state.scrollY]);

    return state;
}

export function useNavbarFade(scrollY: number): { opacity: number; translateY: number } {
    const fadeDistance = 400;
    const opacity = Math.max(1 - scrollY / fadeDistance, 0);
    const translateY = Math.min(scrollY * 0.1, 40);

    return { opacity, translateY };
}

export function useLogosFade(scrollY: number): { opacity: number } {
    const fadeStart = 200;
    const fadeEnd = 700;
    const fadeRange = fadeEnd - fadeStart;

    if (scrollY < fadeStart) {
        return { opacity: 1 };
    }

    const opacity = 1 - (scrollY - fadeStart) / fadeRange;
    return { opacity: Math.max(opacity, 0) };
}
