"use client"

import ProductIcon from "./ProductIcon"


import { ChevronRight } from "lucide-react"

interface ProductMenuItemProps {
    title: string
    subtitle: string
    icon: string
    onClick?: () => void
}

export default function ProductMenuItem({ title, subtitle, icon, onClick }: ProductMenuItemProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-2 p-4 hover:bg-neutral-100 rounded-lg transition group"
        >
            <ProductIcon type={icon} />

            <div className="flex-1 text-left">
                <div className="font-sans   text-base text-[16px]">{title}</div>
                <div className="text-neutral-600 font-sans text-[14px]">{subtitle}</div>
            </div>

            <ChevronRight
                size={20}
                className="text-neutral-400 group-hover:text-neutral-600 transition"
            />
        </button>
    )
}