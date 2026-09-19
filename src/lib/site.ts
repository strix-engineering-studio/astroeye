export type NavItem = {
    href: string
    label: string
}

export type Project = {
    slug: string
    title: string
    category: string
    summary: string
    tagline: string
    stack: string[]
    metrics: string[]
    timeline: string
    spotlight: string
    problem: string
    solution: string
    result: string
    architecture: string[]
    deployment: string[]
    highlights: string[]
}

export type Service = {
    title: string
    summary: string
    bullets: string[]
    visual: string
}

export type Testimonial = {
    quote: string
    name: string
    role: string
    company: string
}

export type TimelineItem = {
    title: string
    description: string
    year: string
    kind: string
}

export type UseItem = {
    label: string
    value: string
    description: string
}

export type BlogTopic = {
    title: string
    subtitle: string
}

export const navigation: NavItem[] = [
    { href: "/capabilities", label: "Capabilities" },
    { href: "/systems", label: "Systems" },
    { href: "/products", label: "Products" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/open-source", label: "Open Source" },
    { href: "/insights", label: "Insights" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

export const heroStats = [
    { label: "Products shipped", value: 24 },
    { label: "Production systems launched", value: 38 },
    { label: "AI-enabled workflows", value: 16 },
    { label: "Reliability improvements", value: 21 },
    { label: "Teams supported long-term", value: 12 },
    { label: "Months of active support", value: 18 },
]

export const featuredProjects: Project[] = [
    {
        slug: "operational-telemetry-platform",
        title: "Operational Telemetry Platform",
        category: "Operational Systems",
        summary:
            "A field operations platform for route visibility, offline capture, and leadership dashboards that stay usable in low-connectivity environments.",
        tagline: "Operational clarity for teams working in motion.",
        stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "WebSockets"],
        metrics: ["38% faster dispatch decisions", "Offline capture on weak networks", "3 operator views unified"],
        timeline: "34-day production launch",
        spotlight: "Unified route telemetry, incident logging, and team visibility into one dependable workflow.",
        problem:
            "Field teams were relying on spreadsheets and delayed updates, which made dispatch decisions slow and inconsistent.",
        solution:
            "Built an offline-first system with sync queues, geospatial events, and an operator dashboard that made status visible in real time.",
        result:
            "Managers now have a reliable source of truth for field activity, and operational handoff is much faster.",
        architecture: ["Geospatial events", "Offline sync queue", "Realtime dashboard", "Role-based access", "Audit log"],
        deployment: ["Offline-first workflow", "Monitoring on critical routes", "Reliable sync on reconnect"],
        highlights: ["field visibility", "offline capture", "operational dashboards"],
    },
    {
        slug: "ai-workflow-orchestrator",
        title: "AI Workflow Orchestrator",
        category: "AI-enabled Systems",
        summary:
            "A guarded orchestration layer for research, retrieval, approvals, and content workflows that runs with auditability and clear operator control.",
        tagline: "AI as a capability inside a larger product system.",
        stack: ["Next.js", "NestJS", "OpenAI", "PostgreSQL", "Prisma", "Redis"],
        metrics: ["42% faster turnaround", "<200ms internal API p95", "6 core automations"],
        timeline: "34-day production launch",
        spotlight: "Orchestrated multi-step AI jobs with retry logic, approval gates, and realtime feedback.",
        problem:
            "The client needed a way to coordinate multiple AI tasks without brittle one-off scripts and manual follow-up.",
        solution:
            "Designed an event-driven workflow engine, added queue-backed execution, and surfaced a clean operator UI for monitoring every job.",
        result:
            "Teams launch and observe AI work from one place with clearer ownership and predictable delivery.",
        architecture: ["API gateway", "Queue workers", "Prompt routing", "Realtime status stream", "Audit log"],
        deployment: ["Audit trail for every AI action", "Retry-safe queue processing", "Guardrails for each workflow step"],
        highlights: ["LLM routing", "approval gates", "observable workflow history"],
    },
    {
        slug: "internal-operations-hub",
        title: "Internal Operations Hub",
        category: "Product Engineering",
        summary:
            "A back-office platform that centralizes admin flows, customer records, content controls, and day-to-day business operations.",
        tagline: "Product engineering that reduces operational drag.",
        stack: ["Next.js", "Auth.js", "PostgreSQL", "Prisma", "Tailwind", "Server Actions"],
        metrics: ["5 key workflows consolidated", "2x faster admin actions", "Single source of truth"],
        timeline: "3-week rollout",
        spotlight: "Replaced scattered tools with a cohesive internal system for operating the business.",
        problem:
            "Teams were switching between too many tools for simple operational tasks, which slowed down support and content updates.",
        solution:
            "Built a coherent operations hub with clean permissions, fast data entry, and reusable workflow patterns.",
        result:
            "Daily operations became easier to manage, with less context switching and fewer dropped tasks.",
        architecture: ["Admin workflows", "Permission model", "Structured forms", "Searchable records", "Activity log"],
        deployment: ["Operational controls in one place", "Clear handoff between team members", "Support-ready workflow structure"],
        highlights: ["admin tooling", "workflow automation", "support infrastructure"],
    },
]

export const services: Service[] = [
    {
        title: "Discovery and Architecture",
        summary:
            "Clarify the problem, map the system, and define the product shape before implementation begins.",
        bullets: ["Discovery", "PRD", "Architecture"],
        visual: "Requirements translated into a system model the team can build with confidence.",
    },
    {
        title: "Product Engineering",
        summary:
            "Build production software across web, backend, and mobile with a focus on architecture, release quality, and maintainability.",
        bullets: ["Web apps", "Backend APIs", "Mobile experiences"],
        visual: "Cross-functional delivery with disciplined execution and maintainable code.",
    },
    {
        title: "Platform and Backend Systems",
        summary:
            "Design APIs, data boundaries, admin systems, and internal platforms that stay fast and understandable.",
        bullets: ["APIs", "Admin consoles", "Infrastructure"],
        visual: "Backend systems with clean boundaries, observability, and room to grow.",
    },
    {
        title: "AI-enabled Workflows",
        summary:
            "Add AI where it improves the product, using guardrails, retrieval, approvals, and fallbacks.",
        bullets: ["LLM routing", "Workflow automation", "RAG"],
        visual: "AI capability integrated into the product instead of standing apart from it.",
    },
    {
        title: "Long-term Partnership",
        summary:
            "Stay with the system after launch to improve reliability, reduce technical debt, and support the next round of growth.",
        bullets: ["Iteration", "Maintenance", "Operational support"],
        visual: "Ongoing engineering support that keeps the product healthy over time.",
    },
]

export const experienceTimeline: TimelineItem[] = [
    {
        year: "2026",
        kind: "Discovery",
        title: "Discovery became the starting point",
        description: "Focused on the workflows, constraints, and handoffs that define a durable system before writing a line of code.",
    },
    {
        year: "2025",
        kind: "Architecture",
        title: "Systems architecture shaped delivery",
        description: "Built reusable foundations for product systems, internal tools, and AI-enabled workflows with clearer separation of concerns.",
    },
    {
        year: "2024",
        kind: "Delivery",
        title: "Structured delivery became the norm",
        description: "Shipped releases with better planning, stronger validation, and fewer surprises during launch.",
    },
    {
        year: "2023",
        kind: "Support",
        title: "Long-term support became part of the work",
        description: "Kept improving the systems after launch so the product stayed reliable as the team and scope grew.",
    },
]

export const testimonials: Testimonial[] = [
    {
        quote:
            "Strix understood the operational problem quickly and turned it into a system we could actually run every day.",
        name: "Aarav Mehta",
        role: "Founder",
        company: "Seed-stage SaaS",
    },
    {
        quote:
            "The architecture work was exceptional. We got a cleaner backend, stronger permissions, and a delivery process we can trust.",
        name: "Nisha Rao",
        role: "Product Lead",
        company: "B2B Platform",
    },
    {
        quote:
            "They moved like an engineering partner, not a short-term vendor. The result was a much more durable product.",
        name: "Karan Iyer",
        role: "CTO",
        company: "Growth-stage company",
    },
]

export const usesStack: UseItem[] = [
    { label: "Editor", value: "VS Code", description: "Primary environment with custom tasking and AI-assisted workflows." },
    { label: "Design", value: "Figma", description: "Product systems, diagrams, and interface direction." },
    { label: "Frontend", value: "Next.js + Tailwind", description: "Primary stack for shipping polished interfaces quickly." },
    { label: "Motion", value: "Framer Motion", description: "Used for elegant reveal and transition layers." },
    { label: "Database", value: "PostgreSQL + Prisma", description: "Structured data and reliable data access patterns." },
    { label: "AI", value: "OpenAI + RAG", description: "Applied where it improves product utility and speed." },
]

export const blogTopics: BlogTopic[] = [
    {
        title: "Product architecture",
        subtitle: "How to structure systems around workflows, handoffs, and long-term maintainability.",
    },
    {
        title: "Reliable AI workflows",
        subtitle: "Guardrails, approvals, and fallback paths for AI features that have to work in production.",
    },
    {
        title: "Clean data boundaries",
        subtitle: "Why schema discipline and validation matter when the product starts growing quickly.",
    },
    {
        title: "System observability",
        subtitle: "Practical dashboards and logs that help teams understand what the product is doing.",
    },
    {
        title: "Infrastructure reviews",
        subtitle: "The release and deployment choices that keep a team moving without losing control.",
    },
    {
        title: "Support models",
        subtitle: "What long-term technical partnership looks like after the initial launch is done.",
    },
    {
        title: "Backend scaling",
        subtitle: "Patterns for keeping APIs fast, safe, and easier to extend under real usage.",
    },
]

export const contactCategories = [
    "Discovery and roadmap",
    "Product engineering",
    "Platform and backend systems",
    "Mobile and web applications",
    "AI-enabled workflows",
    "Long-term partnership",
]

export const budgetBands = ["< $10k", "$10k - $25k", "$25k - $50k", "$50k+"]

export const timelineBands = ["1-2 weeks", "3-4 weeks", "1-2 months", "2+ months"]
