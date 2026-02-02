"use client"

import { useState, useEffect } from "react"
import { ChevronRight, X } from "lucide-react"

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

const productItems = [
    {
        id: 'iterate',
        title: 'Iterate',
        subtitle: 'Sketch, test and refine',
        spinDuration: '18s',
    },
    {
        id: 'evaluate',
        title: 'Evaluate',
        subtitle: 'Reflect and measure',
        spinDuration: '22s',
    },
    {
        id: 'deploy',
        title: 'Deploy',
        subtitle: 'From draft to live',
        spinDuration: '16s',
    },
    {
        id: 'monitor',
        title: 'Monitor',
        subtitle: 'Insights in real time',
        spinDuration: '24s',
    }
]

const IterateGraphicMobile = ({ isAnimating }: { isAnimating: boolean }) => (
    <div
        className="w-12 h-12"
        style={{
            animation: isAnimating ? 'spin 18s linear infinite' : 'none',
        }}
    >
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
            <polygon
                points="50,3 83,18 97,50 82,83 50,97 17,82 3,50 18,17"
                stroke="#203b14"
                strokeWidth="2"
                fill="none"
            />
            <polygon
                points="50,8 78,22 91,50 77,78 50,92 22,77 9,50 23,23"
                stroke="#203b14"
                strokeWidth="1.2"
                fill="none"
            />
        </svg>
    </div>
)

const EvaluateGraphicMobile = ({ isAnimating }: { isAnimating: boolean }) => (
    <div
        className="w-12 h-12"
        style={{
            animation: isAnimating ? 'spin 22s linear infinite' : 'none',
        }}
    >
        <svg width="48" height="48" viewBox="0 0 100 100">
            <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#203b14"
                strokeWidth="1.6"
                strokeDasharray="6 6"
            />
        </svg>
    </div>
)

const DeployGraphicMobile = ({ isAnimating }: { isAnimating: boolean }) => (
    <div
        className="w-12 h-12"
        style={{
            animation: isAnimating ? 'spin 16s linear infinite' : 'none',
        }}
    >
        <svg width="48" height="48" viewBox="0 0 64 64">
            <path
                fill="none"
                stroke="#203b14"
                strokeWidth="1.4"
                d="M30.803 8.03c-7.956.39-14.893 4.654-18.965 10.946L19.53 24.8l-8.893-3.75A23.9 23.9 0 0 0 8 32c0 3.945.952 7.667 2.638 10.95l8.892-3.75-7.691 5.825c4.072 6.291 11.01 10.555 18.964 10.946L32 46.4l1.198 9.57c7.954-.392 14.89-4.656 18.963-10.947l-7.69-5.823 8.89 3.749A23.9 23.9 0 0 0 56 32c0-3.944-.951-7.666-2.637-10.948L44.472 24.8l7.69-5.824C48.092 12.685 41.155 8.42 33.2 8.029l-1.198 9.572z"
            />
        </svg>
    </div>
)

const MonitorGraphicMobile = ({ isAnimating }: { isAnimating: boolean }) => (
    <div
        className="w-12 h-12"
        style={{
            animation: isAnimating ? 'spin 24s linear infinite' : 'none',
        }}
    >
        <svg width="48" height="48" viewBox="0 0 100 100">
            <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#203b14"
                strokeWidth="1.6"
                strokeDasharray="6 6"
            />
            <circle
                cx="50"
                cy="50"
                r="34"
                fill="none"
                stroke="#203b14"
                strokeWidth="1.8"
            />
        </svg>
    </div>
)

const MobileGraphic = ({ type, isAnimating }: { type: string; isAnimating: boolean }) => {
    switch (type) {
        case 'iterate':
            return <IterateGraphicMobile isAnimating={isAnimating} />
        case 'evaluate':
            return <EvaluateGraphicMobile isAnimating={isAnimating} />
        case 'deploy':
            return <DeployGraphicMobile isAnimating={isAnimating} />
        case 'monitor':
            return <MonitorGraphicMobile isAnimating={isAnimating} />
        default:
            return null
    }
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [isClosing, setIsClosing] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true)
            setIsClosing(false)
        }
    }, [isOpen])

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setShouldRender(false)
            onClose()
        }, 400)
    }

    if (!shouldRender) return null

    return (
        <>
            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes mobileMenuSlideDown {
                    0% {
                        transform: translateY(-100%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
                @keyframes mobileMenuSlideUp {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-100%);
                    }
                }
                @keyframes contentFadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes contentFadeOut {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `}</style>

            <div
                className="fixed inset-0 bg-black/20 z-[199] xl:hidden"
                onClick={handleClose}
                style={{
                    animation: isClosing
                        ? 'fadeOut 350ms ease-out forwards'
                        : 'fadeIn 400ms ease-out',
                }}
            />

            <div
                className="fixed top-0 left-0 right-0 bg-[#f2ebe1] z-[200] xl:hidden shadow-xl"
                style={{
                    animation: isClosing
                        ? 'mobileMenuSlideUp 450ms cubic-bezier(0.4, 0, 0.2, 1) forwards'
                        : 'mobileMenuSlideDown 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <div className="h-[70px] border-b border-neutral-200/50 flex items-center justify-between px-5 md:px-8">
                    <div className="flex items-center">
                        <img
                            src="/adaline-ai/favicon-light-mode.png"
                            alt="Adaline"
                            className="h-7 md:h-8 w-auto"
                        />
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <button className="inline-flex items-center justify-center px-4 md:px-5 py-1.5 md:py-2 bg-[#203b14] text-[#FBFDF6] rounded-full text-xs md:text-sm font-mono tracking-wide whitespace-nowrap">
                            START FOR FREE
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg transition-all duration-200 hover:bg-[#203b14]/5"
                            aria-label="Close menu"
                        >
                            <X size={22} strokeWidth={1.5} className="md:w-6 md:h-6 text-[#203b14]" />
                        </button>
                    </div>
                </div>

                <div
                    className="px-4 md:px-6 lg:px-10 py-4 md:py-6 max-h-[calc(100vh-120px)] overflow-y-auto"
                    style={{
                        animation: isClosing
                            ? 'contentFadeOut 320ms cubic-bezier(0.4, 0, 0.2, 1) forwards'
                            : 'contentFadeIn 550ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both',
                    }}
                >
                    <div className="mb-4 md:mb-6 max-w-3xl mx-auto">
                        <h2 className="text-[22px] font-sans font-medium text-[#203b14] mb-0.5">
                            Products
                        </h2>
                        <p className="text-sm md:text-base font-sans text-[#203b14]/60 mb-3 md:mb-4">
                            Across your journey
                        </p>
                        <div className="space-y-0">
                            {productItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 md:py-3 rounded-lg px-2 md:px-3 -mx-2 md:-mx-3 cursor-pointer transition"
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="flex-shrink-0">
                                            <MobileGraphic type={item.id} isAnimating={isOpen && !isClosing} />
                                        </div>
                                        <div>
                                            <h3 className="text-[16px] font-sans font-medium text-[#203b14]">
                                                {item.title}
                                            </h3>
                                            <p className="text-[14px] font-sans text-[#203b14]/60">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-[#203b14]/40 flex-shrink-0 md:w-6 md:h-6" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <a href="#pricing" className="text-[18px] font-sans font-medium text-[#203b14] py-1 hover:text-[#203b14]/70 transition-colors">
                        Pricing
                    </a>
                    <a href="#blog" className="text-[18px] font-sans font-medium text-[#203b14] py-1 hover:text-[#203b14]/70 transition-colors">
                        Blog
                    </a>
                </div>
            </div>
        </>
    )
}