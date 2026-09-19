export type AuthorityContent = {
    slug: string
    title: string
    description: string
    whatIsThis: string
    whoIsItFor: string
    whatProblemDoesItSolve: string
    howDoesItWork: string
    whyChooseStrix: string
    related: { label: string; href: string }[]
    faqs: { question: string; answer: string }[]
}

export const authorityPages: AuthorityContent[] = [
    {
        slug: "process",
        title: "Engineering Process",
        description: "How Strix designs, validates, and ships production systems with architecture first.",
        whatIsThis: "A delivery model that starts with system boundaries, workflows, and operating constraints before UI implementation.",
        whoIsItFor: "Founders, CTOs, and operators who need reliable product delivery without bloated process theater.",
        whatProblemDoesItSolve: "It reduces rework by aligning product scope, architecture, and implementation before execution starts.",
        howDoesItWork: "Discovery, architecture mapping, technical decisions, scoped implementation, validation, and long-term support.",
        whyChooseStrix: "Strix focuses on systems that stay maintainable after launch, not just code that looks good on day one.",
        related: [
            { label: "Capabilities", href: "/capabilities" },
            { label: "Systems", href: "/systems" },
            { label: "Products", href: "/products" },
            { label: "Case Studies", href: "/case-studies" },
        ],
        faqs: [
            {
                question: "What is Strix's engineering process?",
                answer: "Strix starts with discovery and architecture, then moves into scoped implementation, validation, and support.",
            },
            {
                question: "Why is process important in product engineering?",
                answer: "Because the wrong system design creates compounding cost later in delivery, support, and scaling.",
            },
        ],
    },
    {
        slug: "engineering-principles",
        title: "Engineering Principles",
        description: "The rules Strix uses to keep product systems durable, understandable, and easy to evolve.",
        whatIsThis: "A concise set of system-design principles that shape delivery decisions.",
        whoIsItFor: "Teams that want a repeatable engineering philosophy instead of ad hoc implementation choices.",
        whatProblemDoesItSolve: "It prevents teams from optimizing for speed in ways that make the product fragile.",
        howDoesItWork: "Use domain boundaries, explicit contracts, observable behavior, and progressive simplification.",
        whyChooseStrix: "The studio is organized around operational clarity and maintainability, not temporary output volume.",
        related: [
            { label: "Architecture Philosophy", href: "/architecture-philosophy" },
            { label: "Technology Decisions", href: "/technology-decisions" },
            { label: "System Design Framework", href: "/system-design-framework" },
        ],
        faqs: [
            {
                question: "What is system-first engineering?",
                answer: "It means designing the operating model and architecture before deciding the implementation details.",
            },
            {
                question: "How is Strix different from an agency?",
                answer: "Strix focuses on systems, long-term maintainability, and architecture decisions rather than generic production hours.",
            },
        ],
    },
    {
        slug: "architecture-philosophy",
        title: "Architecture Philosophy",
        description: "Why Strix believes architecture is the product's operating system, not a documentation exercise.",
        whatIsThis: "A practical philosophy for building production-grade systems that can change without collapsing.",
        whoIsItFor: "Teams that operate software over time and need reliable growth without constant rewrites.",
        whatProblemDoesItSolve: "It avoids the common failure mode where a product is easy to launch but hard to evolve.",
        howDoesItWork: "Clarify boundaries, model data carefully, isolate workflows, and design for operational visibility.",
        whyChooseStrix: "The studio pairs product thinking with architecture discipline, which lowers delivery and maintenance risk.",
        related: [
            { label: "Process", href: "/process" },
            { label: "Capabilities", href: "/capabilities" },
            { label: "Products", href: "/products" },
        ],
        faqs: [
            {
                question: "Why does architecture matter so much?",
                answer: "Because architecture determines how expensive it is to change the product later.",
            },
            {
                question: "What does Strix optimize for?",
                answer: "Clarity, maintainability, operational fit, and long-term evolution.",
            },
        ],
    },
    {
        slug: "technology-decisions",
        title: "Technology Decisions",
        description: "How Strix chooses technology based on product requirements, risk, and long-term operating cost.",
        whatIsThis: "A decision framework for selecting frameworks, databases, and infrastructure with intent.",
        whoIsItFor: "Founders and technical leaders who want an architecture rationale, not a trend-driven stack.",
        whatProblemDoesItSolve: "It prevents over-engineering and under-engineering by matching tools to the system constraints.",
        howDoesItWork: "Evaluate use case, scale profile, team capability, delivery risk, and migration cost.",
        whyChooseStrix: "Strix is explicit about tradeoffs and avoids technology choices that only look good in a pitch.",
        related: [
            { label: "Engineering Principles", href: "/engineering-principles" },
            { label: "System Design Framework", href: "/system-design-framework" },
            { label: "Open Source", href: "/open-source" },
        ],
        faqs: [
            {
                question: "When should a startup change its stack?",
                answer: "When the current architecture materially blocks delivery, reliability, or operational clarity.",
            },
            {
                question: "How does Strix evaluate technologies?",
                answer: "By looking at tradeoffs, production readiness, migration cost, and team fit.",
            },
        ],
    },
    {
        slug: "system-design-framework",
        title: "System Design Framework",
        description: "A practical framework for designing software systems around real workflows and operating constraints.",
        whatIsThis: "A repeatable way to design product systems, internal platforms, and operational tools.",
        whoIsItFor: "Startups and technology businesses building products that must survive real usage.",
        whatProblemDoesItSolve: "It makes complex systems easier to reason about by defining boundaries, inputs, and outputs.",
        howDoesItWork: "Model domains, define states, draw boundaries, design APIs, and instrument the system.",
        whyChooseStrix: "The studio treats systems as the product, which keeps implementation aligned with outcomes.",
        related: [
            { label: "Process", href: "/process" },
            { label: "Capabilities", href: "/capabilities" },
            { label: "Case Studies", href: "/case-studies" },
        ],
        faqs: [
            {
                question: "What is system-first engineering?",
                answer: "Designing the system of work and the software architecture before implementation decisions.",
            },
            {
                question: "Why use a framework?",
                answer: "Because it creates consistency and reduces design drift across products and teams.",
            },
        ],
    },
]

export function getAuthorityPage(slug: string) {
    return authorityPages.find((page) => page.slug === slug)
}
