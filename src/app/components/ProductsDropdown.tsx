"use client"

import { pillarsWithProducts } from "./MenuData"
import { useState } from "react"

interface ProductsDropdownProps {
    isOpen: boolean
    onClose: () => void
}

export default function ProductsDropdown({ isOpen, onClose }: ProductsDropdownProps) {
    const [hoveredPillar, setHoveredPillar] = useState<string | null>(null)

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-30 bg-black/5 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dropdown Menu */}
            <div className="fixed left-0 right-0 top-16 z-40 animate-dropdown-in">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="bg-[#f2ebe1] border-t border-neutral-200/50 py-16">

                        {/* Circle decorations with badges - positioned above text */}
                        <div className="grid grid-cols-4 gap-12 mb-16">
                            {pillarsWithProducts.map((item, index) => (
                                <div
                                    key={item.pillar.id}
                                    className="flex justify-start pl-0"
                                    onMouseEnter={() => setHoveredPillar(item.pillar.id)}
                                    onMouseLeave={() => setHoveredPillar(null)}
                                >
                                    <div className="relative w-40 h-24">
                                        {/* Number badge - positioned top right of decoration area */}
                                        <div className={`absolute -top-2 right-0 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors duration-200 ${hoveredPillar === item.pillar.id ? 'bg-[#203b14]' : 'bg-[#c8d5a0]'}`}>
                                            <span className={`text-sm font-bold transition-colors duration-200 ${hoveredPillar === item.pillar.id ? 'text-white' : 'text-[#203b14]'}`}>{index + 1}</span>
                                        </div>

                                        {/* Custom circle arrangements per pillar */}
                                        {item.pillar.id === 'iterate' && (
                                            <div className="absolute inset-0">
                                                {/* Large circle bottom left */}
                                                <div className={`absolute bottom-0 left-0 w-20 h-20 rounded-full border-2 border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'iterate' ? 'rotate-[360deg]' : ''}`} />
                                                {/* Medium circle top left with plus */}
                                                <div className={`absolute top-0 left-4 w-12 h-12 rounded-full border-2 border-[#203b14] flex items-center justify-center transition-transform duration-700 ${hoveredPillar === 'iterate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'iterate' ? '100ms' : '0ms' }}>
                                                    <span className="text-2xl text-[#203b14] leading-none">+</span>
                                                </div>
                                                {/* Small circle top right */}
                                                <div className={`absolute top-2 right-12 w-8 h-8 rounded-full border-2 border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'iterate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'iterate' ? '150ms' : '0ms' }} />
                                                {/* Small plus bottom left of large circle */}
                                                <div className={`absolute bottom-2 left-2 text-xl text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'iterate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'iterate' ? '200ms' : '0ms' }}>+</div>
                                                {/* Medium plus center */}
                                                <div className={`absolute bottom-6 left-16 text-2xl text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'iterate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'iterate' ? '250ms' : '0ms' }}>+</div>
                                            </div>
                                        )}

                                        {item.pillar.id === 'evaluate' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {/* Large dashed circle */}
                                                <div className={`absolute w-20 h-20 rounded-full border-2 border-dashed border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'evaluate' ? 'rotate-[360deg]' : ''}`} />
                                                {/* Medium dashed circle bottom right */}
                                                <div className={`absolute bottom-0 right-4 w-14 h-14 rounded-full border-2 border-dashed border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'evaluate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'evaluate' ? '100ms' : '0ms' }} />
                                                {/* Plus in center */}
                                                <div className={`absolute text-2xl text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'evaluate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'evaluate' ? '150ms' : '0ms' }}>+</div>
                                                {/* Small plus bottom right circle */}
                                                <div className={`absolute bottom-4 right-8 text-lg text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'evaluate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'evaluate' ? '200ms' : '0ms' }}>+</div>
                                                {/* Tiny plus top */}
                                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 text-sm text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'evaluate' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'evaluate' ? '250ms' : '0ms' }}>+</div>
                                            </div>
                                        )}

                                        {item.pillar.id === 'deploy' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {/* Large circle with radiating lines (clock-like) */}
                                                <div className={`absolute w-24 h-24 rounded-full border-2 border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'deploy' ? 'rotate-[360deg]' : ''}`}>
                                                    {/* 12 radiating lines */}
                                                    {[...Array(12)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-[#203b14] origin-top"
                                                            style={{
                                                                transform: `translate(-50%, -100%) rotate(${i * 30}deg) translateY(-9px)`
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                {/* Small circle top left */}
                                                <div className={`absolute top-2 left-4 w-8 h-8 rounded-full border-2 border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'deploy' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'deploy' ? '100ms' : '0ms' }} />
                                                {/* Plus center */}
                                                <div className={`absolute text-2xl text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'deploy' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'deploy' ? '150ms' : '0ms' }}>+</div>
                                                {/* Small dashed circle bottom right */}
                                                <div className={`absolute bottom-0 right-4 w-6 h-6 rounded-full border border-dashed border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'deploy' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'deploy' ? '200ms' : '0ms' }} />
                                            </div>
                                        )}

                                        {item.pillar.id === 'monitor' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {/* Large dashed circle */}
                                                <div className={`absolute w-24 h-24 rounded-full border-2 border-dashed border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'monitor' ? 'rotate-[360deg]' : ''}`} />
                                                {/* Medium circle bottom right */}
                                                <div className={`absolute bottom-0 right-0 w-16 h-16 rounded-full border-2 border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'monitor' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'monitor' ? '100ms' : '0ms' }} />
                                                {/* Small circle top right */}
                                                <div className={`absolute top-0 right-2 w-10 h-10 rounded-full border-2 border-[#203b14] transition-transform duration-700 ${hoveredPillar === 'monitor' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'monitor' ? '150ms' : '0ms' }} />
                                                {/* Plus in large circle */}
                                                <div className={`absolute text-2xl text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'monitor' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'monitor' ? '200ms' : '0ms' }}>+</div>
                                                {/* Small plus in bottom right circle */}
                                                <div className={`absolute bottom-4 right-4 text-lg text-[#203b14] transition-transform duration-700 ${hoveredPillar === 'monitor' ? 'rotate-[360deg]' : ''}`} style={{ transitionDelay: hoveredPillar === 'monitor' ? '250ms' : '0ms' }}>+</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pillars and Products */}
                        <div className="grid grid-cols-4 gap-12">
                            {pillarsWithProducts.map((item, pillarIndex) => (
                                <div key={item.pillar.id}>
                                    {/* Pillar name - small uppercase */}
                                    <div className="mb-3">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#203b14]/70 mb-2">
                                            {item.pillar.title}
                                        </h3>
                                        {/* Main heading */}
                                        <p className="text-3xl font-bold leading-tight text-[#203b14] mb-1">
                                            {item.pillar.subtitle?.split(' ').slice(0, -1).join(' ') ?? ''}
                                        </p>
                                        <p className="text-3xl font-bold leading-tight text-[#203b14]">
                                            {item.pillar.subtitle?.split(' ').slice(-1) ?? ''}
                                        </p>
                                    </div>

                                    {/* Products List */}
                                    <div className="space-y-3 mt-6">
                                        {item.products.map((product) => (
                                            <a
                                                key={product.id}
                                                href={`#${product.id}`}
                                                className="block text-base text-[#203b14] hover:underline transition-all duration-200"
                                            >
                                                {product.title}
                                                {product.title === "Gateway" && " ↗"}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
