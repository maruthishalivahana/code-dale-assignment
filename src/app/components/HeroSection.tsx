"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import LogoScroller from "./LogoScroller";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 40,
        restDelta: 0.001
    });

    const contentOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
    const contentScale = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);

    return (
        <div ref={containerRef} className="absolute top-0 bottom-0 w-full pointer-events-none">
            <motion.div
                className="sticky top-[25vh] z-20 flex w-full -translate-y-1/4 flex-col items-center gap-6 text-center text-balance md:top-[22vh] md:gap-10 pointer-events-auto"
                style={{
                    opacity: contentOpacity,
                    scale: contentScale,
                }}
            >
                <h1 className="font-sans text-black text-[34px] leading-[1.12] tracking-tighter text-center mx-4 max-w-[32ch] md:text-[min(53px,min(calc(2.5vh+25px),calc(1.5vw+25px)))] md:leading-[calc(52/53)] md:tracking-[-0.04em]">
                    <span>
                        The single platform to iterate, evaluate, deploy, and monitor AI agents
                    </span>
                </h1>

                <div className="max-w-full md:w-full">
                    <div className="flex flex-col items-center overflow-clip">
                        <p className="text-[#e1eae4] mb-2 text-[14px] leading-none uppercase tracking-wider">
                            TRUSTED BY
                        </p>
                        <LogoScroller />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
