"use client"

import { ReactElement } from "react"

interface ProductIconProps {
    type: string
    className?: string
}

export default function ProductIcon({ type, className = "" }: ProductIconProps) {
    const baseClasses = "w-10 h-10 flex-shrink-0"

    const icons: Record<string, ReactElement> = {
        iterate: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-blue-600">
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-spin-slow"
                    />
                    <circle cx="20" cy="4" r="2" fill="currentColor" />
                </svg>
            </div>
        ),

        evaluate: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-purple-600">
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                    <path d="M 12 20 L 18 26 L 28 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        ),

        deploy: (
            <div className={`${baseClasses} ${className} relative`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-green-600">
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path d="M 20 10 L 20 30 M 14 24 L 20 30 L 26 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        ),

        monitor: (
            <div className={`${baseClasses} ${className} relative`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-orange-600">
                    <circle
                        cx="20"
                        cy="20"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-pulse"
                    />
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.6"
                    />
                </svg>
            </div>
        ),

        editor: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-indigo-600">
                    <rect x="8" y="8" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="8" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="11" r="1.5" fill="currentColor" />
                    <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="12" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </div>
        ),

        playground: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-pink-600">
                    <path d="M 10 20 L 20 10 L 30 20 L 20 30 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="20" cy="20" r="4" fill="currentColor" />
                </svg>
            </div>
        ),

        evaluations: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-teal-600">
                    <rect x="10" y="12" width="6" height="18" fill="currentColor" opacity="0.6" rx="1" />
                    <rect x="17" y="8" width="6" height="22" fill="currentColor" opacity="0.8" rx="1" />
                    <rect x="24" y="16" width="6" height="14" fill="currentColor" rx="1" />
                </svg>
            </div>
        ),

        datasets: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-cyan-600">
                    <rect x="8" y="10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" rx="1" />
                    <rect x="22" y="10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" rx="1" />
                    <rect x="8" y="24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" rx="1" />
                    <rect x="22" y="24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" rx="1" />
                </svg>
            </div>
        ),

        deployments: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-emerald-600">
                    <path d="M 12 28 L 20 10 L 28 28 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="15" y1="22" x2="25" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        ),

        logs: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-amber-600">
                    <rect x="10" y="10" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="14" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="14" y1="24" x2="22" y2="24" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </div>
        ),

        analytics: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-rose-600">
                    <path d="M 8 28 L 14 22 L 20 26 L 26 16 L 32 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="8" cy="28" r="2" fill="currentColor" />
                    <circle cx="14" cy="22" r="2" fill="currentColor" />
                    <circle cx="20" cy="26" r="2" fill="currentColor" />
                    <circle cx="26" cy="16" r="2" fill="currentColor" />
                    <circle cx="32" cy="20" r="2" fill="currentColor" />
                </svg>
            </div>
        ),

        gateway: (
            <div className={`${baseClasses} ${className}`}>
                <svg viewBox="0 0 40 40" className="w-full h-full text-violet-600">
                    <rect x="8" y="14" width="10" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="22" y="14" width="10" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="18" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 15 20 L 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 22 20 L 25 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        ),
    }

    return icons[type] || icons.iterate
}
