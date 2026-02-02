export interface ProductMenuItem {
    id: string
    title: string
    subtitle?: string
    icon: string
    isPillar?: boolean
}

export interface PillarWithProducts {
    pillar: ProductMenuItem
    products: ProductMenuItem[]
}

export const pillarsWithProducts: PillarWithProducts[] = [
    {
        pillar: {
            id: "iterate",
            title: "Iterate",
            subtitle: "Sketch, test and refine",
            icon: "iterate",
            isPillar: true,
        },
        products: [
            { id: "editor", title: "Editor", icon: "editor" },
            { id: "playground", title: "Playground", icon: "playground" },
            { id: "datasets", title: "Datasets", icon: "datasets" },
        ],
    },
    {
        pillar: {
            id: "evaluate",
            title: "Evaluate",
            subtitle: "Reflect and measure",
            icon: "evaluate",
            isPillar: true,
        },
        products: [
            { id: "evaluations", title: "Evaluations", icon: "evaluations" },
            { id: "datasets", title: "Datasets", icon: "datasets" },
        ],
    },
    {
        pillar: {
            id: "deploy",
            title: "Deploy",
            subtitle: "From draft to live",
            icon: "deploy",
            isPillar: true,
        },
        products: [
            { id: "deployments", title: "Deployments", icon: "deployments" },
            { id: "analytics", title: "Analytics", icon: "analytics" },
            { id: "gateway", title: "Gateway", icon: "gateway" },
        ],
    },
    {
        pillar: {
            id: "monitor",
            title: "Monitor",
            subtitle: "Insights in real time",
            icon: "monitor",
            isPillar: true,
        },
        products: [
            { id: "logs", title: "Logs", icon: "logs" },
            { id: "analytics", title: "Analytics", icon: "analytics" },
        ],
    },
]

export const pillarItems: ProductMenuItem[] = pillarsWithProducts.map(p => p.pillar)

export const specificProducts: ProductMenuItem[] = [
    { id: "editor", title: "Editor", subtitle: "Build and refine prompts", icon: "editor" },
    { id: "playground", title: "Playground", subtitle: "Test and experiment", icon: "playground" },
    { id: "evaluations", title: "Evaluations", subtitle: "Measure performance", icon: "evaluations" },
    { id: "datasets", title: "Datasets", subtitle: "Manage your data", icon: "datasets" },
    { id: "deployments", title: "Deployments", subtitle: "Ship to production", icon: "deployments" },
    { id: "logs", title: "Logs", subtitle: "Track every request", icon: "logs" },
    { id: "analytics", title: "Analytics", subtitle: "Understand usage", icon: "analytics" },
    { id: "gateway", title: "Gateway", subtitle: "API management", icon: "gateway" },
]

export const allProducts: ProductMenuItem[] = [...pillarItems, ...specificProducts]