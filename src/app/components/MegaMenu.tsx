"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface MegaMenuProps {
    isOpen: boolean;
    onClose?: () => void;
}

const menuData = [
    {
        id: 1,
        label: "ITERATE",
        heading: "Sketch, test and refine",
        links: [
            { name: "Editor", href: "#editor" },
            { name: "Playground", href: "#playground" },
            { name: "Datasets", href: "#datasets" },
        ],
        svgPath: "/adaline-ai/svgexport-29.svg",
    },
    {
        id: 2,
        label: "EVALUATE",
        heading: "Reflect and measure",
        links: [
            { name: "Evaluations", href: "#evaluations" },
            { name: "Datasets", href: "#datasets" },
        ],
        svgPath: "/adaline-ai/svgexport-30.svg",
    },
    {
        id: 3,
        label: "DEPLOY",
        heading: "From draft to live",
        links: [
            { name: "Deployments", href: "#deployments" },
            { name: "Analytics", href: "#analytics" },
            { name: "Gateway", href: "#gateway", hasArrow: true },
        ],
        svgPath: "/adaline-ai/svgexport-31.svg",
    },
    {
        id: 4,
        label: "MONITOR",
        heading: "Insights in real time",
        links: [
            { name: "Logs", href: "#logs" },
            { name: "Analytics", href: "#analytics" },
        ],
        svgPath: "/adaline-ai/svgexport-32.svg",
    }
];

const SIZES = {
    small: 22,
    medium: 28,
    large: 44,
    xl: 72,
};

const CircleWithPlus = ({
    size,
    dashed = false,
    stroke = "#203b14",
    opacity = 0.35,
    plusScale = 0.42,
    className = "",
}: {
    size: number;
    dashed?: boolean;
    stroke?: string;
    opacity?: number;
    plusScale?: number;
    className?: string;
}) => (
    <div
        className={`absolute flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
    >
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="w-full h-full"
        >
            <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke={stroke}
                strokeOpacity={opacity}
                strokeWidth="1.4"
                strokeDasharray={dashed ? "4 4" : "0"}
            />
            <line
                x1="50"
                y1={50 - 50 * plusScale}
                x2="50"
                y2={50 + 50 * plusScale}
                stroke={stroke}
                strokeOpacity={opacity}
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <line
                x1={50 - 50 * plusScale}
                y1="50"
                x2={50 + 50 * plusScale}
                y2="50"
                stroke={stroke}
                strokeOpacity={opacity}
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    </div>
);

const DoublePolygonWithPlus = ({
    size,
    className = "",
    baseRotationDuration = 800,
    innerOffset = { x: 0, y: 0 },
    innerSize = 0.3,
    style,
    isActive = false,
}: {
    size: number;
    className?: string;
    baseRotationDuration?: number;
    innerOffset?: { x: number; y: number };
    innerSize?: number;
    style?: React.CSSProperties;
    isActive?: boolean;
}) => {
    const [speed, setSpeed] = useState(`${baseRotationDuration}ms`);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            setSpeed(`${baseRotationDuration * 0.6}ms`);
            setRotation(prev => prev + 360);
            timer = setTimeout(() => {
                setSpeed(`${baseRotationDuration * 2.5}ms`);
            }, baseRotationDuration * 0.6);
        }
        return () => clearTimeout(timer);
    }, [isActive, baseRotationDuration]);

    return (
        <div
            className={`absolute transition-transform ease-in-out ${className}`}
            style={{
                width: size,
                height: size,
                transitionDuration: speed,
                transform: `${style?.transform || ''} rotate(${rotation}deg)`.trim(),
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                className="absolute inset-0"
            >
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
                <line x1="50" y1="38" x2="50" y2="62" stroke="#203b14" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="38" y1="50" x2="62" y2="50" stroke="#203b14" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const DashedCircleWithPlus = ({
    size,
    strokeOpacity = 0.7,
    plusScale = 0.28,
    className = "",
    baseRotationDuration = 800,
    style,
    isActive = false,
}: {
    size: number;
    strokeOpacity?: number;
    plusScale?: number;
    className?: string;
    baseRotationDuration?: number;
    style?: React.CSSProperties;
    isActive?: boolean;
}) => {
    const [speed, setSpeed] = useState(`${baseRotationDuration}ms`);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            setSpeed(`${baseRotationDuration * 0.6}ms`);
            setRotation(prev => prev + 360);
            timer = setTimeout(() => {
                setSpeed(`${baseRotationDuration * 2.5}ms`);
            }, baseRotationDuration * 0.6);
        }
        return () => clearTimeout(timer);
    }, [isActive, baseRotationDuration]);

    return (
        <div
            className={`absolute transition-transform ease-in-out ${className}`}
            style={{ width: size, height: size, transitionDuration: speed, transform: `${style?.transform || ''} rotate(${rotation}deg)`.trim() }}
        >
            <svg width={size} height={size} viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#203b14"
                    strokeWidth="1.6"
                    strokeDasharray="6 6"
                    strokeOpacity={strokeOpacity}
                />
                <line
                    x1="50"
                    y1={50 - 50 * plusScale}
                    x2="50"
                    y2={50 + 50 * plusScale}
                    stroke="#203b14"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <line
                    x1={50 - 50 * plusScale}
                    y1="50"
                    x2={50 + 50 * plusScale}
                    y2="50"
                    stroke="#203b14"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

const IterateGraphics = ({ isActive = false }: { isActive?: boolean }) => (
    <div className="relative w-[180px] h-[160px] mx-auto">
        <DoublePolygonWithPlus
            size={110}
            className="left-[78px] top-[62px] z-10"
            baseRotationDuration={1400}
            innerOffset={{ x: -15, y: 10 }}
            innerSize={0.28}
            style={{ transform: "rotate(-6deg)" }}
            isActive={isActive}
        />

        <DoublePolygonWithPlus
            size={92}
            className="left-[16px] top-[10px] z-20"
            baseRotationDuration={1100}
            innerOffset={{ x: 12, y: -8 }}
            innerSize={0.32}
            style={{ transform: "rotate(5deg)" }}
            isActive={isActive}
        />

        <DoublePolygonWithPlus
            size={76}
            className="left-[0px] top-[78px] z-30"
            baseRotationDuration={900}
            innerOffset={{ x: -10, y: -12 }}
            innerSize={0.35}
            style={{ transform: "rotate(-4deg)" }}
            isActive={isActive}
        />

        <DoublePolygonWithPlus
            size={46}
            className="left-[122px] top-[2px] z-40"
            baseRotationDuration={700}
            innerOffset={{ x: 8, y: 15 }}
            innerSize={0.4}
            style={{ transform: "rotate(8deg)" }}
            isActive={isActive}
        />
    </div>
);

const EvaluateGraphics = ({ isActive = false }: { isActive?: boolean }) => (
    <div className="relative w-[170px] h-[150px] mx-auto">
        <DashedCircleWithPlus
            size={92}
            className="left-[38px] top-[0px]"
            baseRotationDuration={1300}
            style={{ transform: "rotate(-3deg)" }}
            isActive={isActive}
        />

        <DashedCircleWithPlus
            size={78}
            className="left-[0px] top-[70px]"
            baseRotationDuration={1000}
            style={{ transform: "rotate(4deg)" }}
            isActive={isActive}
        />

        <DashedCircleWithPlus
            size={82}
            className="left-[80px] top-[75px]"
            baseRotationDuration={1100}
            style={{ transform: "rotate(-5deg)" }}
            isActive={isActive}
        />

        <DashedCircleWithPlus
            size={46}
            className="left-[120px] top-[18px]"
            baseRotationDuration={700}
            style={{ transform: "rotate(6deg)" }}
            isActive={isActive}
        />
    </div>
);

const StarBurstWithPlus = ({
    size,
    className = "",
    baseRotationDuration = 1200,
    isActive = false,
}: {
    size: number;
    className?: string;
    baseRotationDuration?: number;
    isActive?: boolean;
}) => {
    const [speed, setSpeed] = useState(`${baseRotationDuration}ms`);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            setSpeed(`${baseRotationDuration * 0.6}ms`);
            setRotation(prev => prev + 360);
            timer = setTimeout(() => {
                setSpeed(`${baseRotationDuration * 2.5}ms`);
            }, baseRotationDuration * 0.6);
        }
        return () => clearTimeout(timer);
    }, [isActive, baseRotationDuration]);

    return (
        <div
            className={`absolute transition-transform ease-in-out ${className}`}
            style={{ width: size, height: size, transitionDuration: speed, transform: `rotate(${rotation}deg)` }}
        >
            <svg width={size} height={size} viewBox="0 0 64 64">
                <path
                    fill="none"
                    stroke="#203b14"
                    strokeOpacity="0.7"
                    strokeWidth="1.2"
                    d="M30.803 8.03c-7.956.39-14.893 4.654-18.965 10.946L19.53 24.8l-8.893-3.75A23.9 23.9 0 0 0 8 32c0 3.945.952 7.667 2.638 10.95l8.892-3.75-7.691 5.825c4.072 6.291 11.01 10.555 18.964 10.946L32 46.4l1.198 9.57c7.954-.392 14.89-4.656 18.963-10.947l-7.69-5.823 8.89 3.749A23.9 23.9 0 0 0 56 32c0-3.944-.951-7.666-2.637-10.948L44.472 24.8l7.69-5.824C48.092 12.685 41.155 8.42 33.2 8.029l-1.198 9.572z"
                />
                <line x1="32" y1="26" x2="32" y2="38" stroke="#203b14" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="26" y1="32" x2="38" y2="32" stroke="#203b14" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const DeployGraphics = ({ isActive = false }: { isActive?: boolean }) => (
    <div className="relative w-[170px] h-[150px] mx-auto">
        <StarBurstWithPlus size={110} className="left-[0px] top-[55px]" baseRotationDuration={1600} isActive={isActive} />
        <StarBurstWithPlus size={88} className="left-[85px] top-[10px]" baseRotationDuration={1200} isActive={isActive} />
        <StarBurstWithPlus size={46} className="left-[110px] top-[95px]" baseRotationDuration={800} isActive={isActive} />
        <StarBurstWithPlus size={42} className="left-[50px] top-[0px]" baseRotationDuration={900} isActive={isActive} />
    </div>
);

const ConcentricCircle = ({
    size,
    dashed = true,
    className = "",
    baseRotationDuration = 1200,
    isActive = false,
}: {
    size: number;
    dashed?: boolean;
    className?: string;
    baseRotationDuration?: number;
    isActive?: boolean;
}) => {
    const [speed, setSpeed] = useState(`${baseRotationDuration}ms`);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            setSpeed(`${baseRotationDuration * 0.6}ms`);
            setRotation(prev => prev + 360);
            timer = setTimeout(() => {
                setSpeed(`${baseRotationDuration * 2.5}ms`);
            }, baseRotationDuration * 0.6);
        }
        return () => clearTimeout(timer);
    }, [isActive, baseRotationDuration]);

    return (
        <div
            className={`absolute transition-transform ease-in-out ${className}`}
            style={{ width: size, height: size, transitionDuration: speed, transform: `rotate(${rotation}deg)` }}
        >
            <svg width={size} height={size} viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#203b14"
                    strokeWidth="1.6"
                    strokeDasharray={dashed ? "6 6" : "0"}
                />
                <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="#203b14"
                    strokeWidth="1.8"
                />
                <line x1="50" y1="40" x2="50" y2="60" stroke="#203b14" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="40" y1="50" x2="60" y2="50" stroke="#203b14" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        </div>
    );
};

const MonitorGraphics = ({ isActive = false }: { isActive?: boolean }) => (
    <div className="relative w-[200px] h-[150px] mx-auto">
        <ConcentricCircle size={100} className="left-[0px] top-[25px]" baseRotationDuration={1800} isActive={isActive} />
        <ConcentricCircle size={70} className="left-[115px] top-[40px]" baseRotationDuration={1300} isActive={isActive} />
        <ConcentricCircle size={50} className="left-[75px] top-[100px]" baseRotationDuration={900} isActive={isActive} />
        <ConcentricCircle size={45} className="left-[105px] top-[0px]" baseRotationDuration={1000} isActive={isActive} />
    </div>
);

const DecorativeGraphics = ({ columnId, isActive = false }: { columnId: number; isActive?: boolean }) => {
    switch (columnId) {
        case 1: return <IterateGraphics isActive={isActive} />;
        case 2: return <EvaluateGraphics isActive={isActive} />;
        case 3: return <DeployGraphics isActive={isActive} />;
        case 4: return <MonitorGraphics isActive={isActive} />;
        default: return null;
    }
};

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 220);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && onClose) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isVisible) return null;

    return (
        <div
            ref={menuRef}
            role="menu"
            aria-expanded={isOpen}
            className="absolute top-[56px] left-0 right-0 z-[100] overflow-hidden"
            style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen
                    ? 'translateY(0)'
                    : 'translateY(-20px)',
                transition: 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), transform 350ms cubic-bezier(0.22, 1, 0.36, 1)',
                pointerEvents: isOpen ? 'auto' : 'none',
            }}
        >
            <div
                className="bg-white"
                style={{
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
                }}
            >
                <div className="w-full px-16 xl:px-24 py-10">
                    <div className="grid grid-cols-4 gap-x-16">
                        {menuData.map((column, columnIndex) => (
                            <div
                                key={`graphics-${column.id}`}
                                className="relative cursor-pointer"
                                onMouseEnter={() => setHoveredColumn(column.id)}
                                onMouseLeave={() => setHoveredColumn(null)}
                                style={{
                                    opacity: isOpen
                                        ? hoveredColumn === null
                                            ? 1
                                            : hoveredColumn === column.id
                                                ? 1
                                                : 0.25
                                        : 0,
                                    transform: isOpen ? 'translateY(0)' : 'translateY(-30px)',
                                    transition: `opacity 400ms ease ${columnIndex * 80 + 100}ms, transform 450ms cubic-bezier(0.22, 1, 0.36, 1) ${columnIndex * 80 + 100}ms`,
                                }}
                            >
                                <div className="flex items-end gap-3">
                                    <div className="relative h-32 lg:h-36 flex-1">
                                        <div className="relative w-full h-full">
                                            <DecorativeGraphics columnId={column.id} isActive={hoveredColumn === column.id} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pb-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${hoveredColumn === column.id ? 'bg-[#203b14]' : 'bg-[#c8d5a0]'}`}>
                                            <span className={`text-xs font-bold transition-colors duration-200 ${hoveredColumn === column.id ? 'text-white' : 'text-[#203b14]'}`}>{column.id}</span>
                                        </div>
                                        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#203b14]/70">
                                            {column.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-[#203b14]/20 my-8" />

                    <div className="grid grid-cols-4 gap-x-16">
                        {menuData.map((column, columnIndex) => (
                            <div
                                key={`content-${column.id}`}
                                role="menuitem"
                                className="relative cursor-pointer"
                                onMouseEnter={() => setHoveredColumn(column.id)}
                                onMouseLeave={() => setHoveredColumn(null)}
                                style={{
                                    opacity: isOpen
                                        ? hoveredColumn === null
                                            ? 1
                                            : hoveredColumn === column.id
                                                ? 1
                                                : 0.25
                                        : 0,
                                    transform: isOpen ? 'translateY(0)' : 'translateY(-25px)',
                                    transition: `opacity 400ms ease ${columnIndex * 80 + 200}ms, transform 450ms cubic-bezier(0.22, 1, 0.36, 1) ${columnIndex * 80 + 200}ms`,
                                }}
                            >
                                <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#203b14]/70 mb-3">
                                    {column.label}
                                </div>

                                <h3
                                    className="text-xl lg:text-2xl xl:text-[26px] font-medium text-[#203b14] leading-[1.2] mb-5 font-sans transition-colors duration-200"
                                    style={{
                                        color: hoveredColumn === column.id ? '#203b14' : 'rgba(32, 59, 20, 0.9)',
                                    }}
                                >
                                    {column.heading.split(' ').slice(0, 2).join(' ')}
                                    <br />
                                    {column.heading.split(' ').slice(2).join(' ')}
                                </h3>

                                <div className="space-y-1.5">
                                    {column.links.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.href}
                                            className="flex items-center gap-1 text-sm text-[#203b14]/70 hover:text-[#203b14] transition-colors duration-200 font-sans"
                                        >
                                            <span>
                                                {link.name}
                                            </span>
                                            {'hasArrow' in link && link.hasArrow && (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M7 7h10v10" />
                                                    <path d="M7 17 17 7" />
                                                </svg>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
