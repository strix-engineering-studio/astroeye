import { NextResponse } from "next/server"
import { z } from "zod"
import { getContactInquiryCollection } from "@/lib/db"
import { budgetBands, contactCategories, timelineBands } from "@/lib/site"

const projectTypes = [
    "Discovery and fixed scope",
    "Engineering partnership",
    "Platform build",
    "Product modernization",
    "AI-enabled systems",
    "Other",
]

const currentStages = ["Discovery", "Architecture", "Implementation", "Launch", "Support"]
const designReadinessOptions = ["Architecture docs", "Reference material", "Existing product", "No design yet"]
const platformOptions = ["Web", "Mobile", "Backend APIs", "Admin tooling", "Infrastructure"]
const featureOptions = [
    "Authentication",
    "AI workflows",
    "Realtime updates",
    "Notifications",
    "Analytics",
    "File Uploads",
    "Integrations",
    "Role-based access",
    "Automation workflows",
]
const decisionMakerOptions = ["Yes", "No", "Partially"]

const attachmentSchema = z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
})

const inquirySchema = z.preprocess((input) => {
    if (!input || typeof input !== "object") return input

    const payload = input as Record<string, unknown>
    const rawAttachments = payload.attachments

    if (typeof rawAttachments === "string") {
        try {
            payload.attachments = JSON.parse(rawAttachments)
        } catch {
            payload.attachments = rawAttachments
        }
    }

    return payload
}, z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    company: z.string().optional(),
    category: z.string().optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    brief: z.string().optional(),
    projectSummary: z.string().optional(),
    fullName: z.string().min(1).optional(),
    emailAddress: z.string().email().optional(),
    whatsappNumber: z.string().optional(),
    companyName: z.string().optional(),
    websiteProductLink: z.string().optional(),
    projectOverview: z.string().optional(),
    projectType: z.string().optional(),
    currentStage: z.string().optional(),
    designReadiness: z.string().optional(),
    referenceLinks: z.string().optional(),
    platformsRequired: z.array(z.string()).optional(),
    featuresRequired: z.array(z.string()).optional(),
    importantRequirements: z.string().optional(),
    estimatedBudget: z.string().optional(),
    expectedTimeline: z.string().optional(),
    decisionMaker: z.string().optional(),
    technicalRequirements: z.string().optional(),
    attachments: z
        .array(attachmentSchema)
        .optional(),
    anythingElse: z.string().optional(),
}))

// Simple in-memory IP rate limiter (suitable for demo/local; replace with durable solution in production)
type RateEntry = { count: number; resetAt: number }
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10
const ipRateMap = new Map<string, RateEntry>()

function getClientIp(request: Request) {
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    return request.headers.get("x-real-ip") || "unknown"
}

export async function POST(request: Request) {
    // Basic rate limiting by IP
    const ip = getClientIp(request)
    const now = Date.now()
    const entry = ipRateMap.get(ip)
    if (!entry || now > entry.resetAt) {
        ipRateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    } else {
        if (entry.count >= RATE_LIMIT_MAX) {
            return NextResponse.json({ ok: false, message: "Too many requests" }, { status: 429 })
        }
        entry.count += 1
        ipRateMap.set(ip, entry)
    }

    const payload = await request.json().catch(() => null)
    const result = inquirySchema.safeParse(payload)

    if (!result.success) {
        return NextResponse.json({ ok: false, message: "Invalid submission" }, { status: 400 })
    }

    // Additional domain validation against allowed lists
    const data = result.data as Record<string, unknown>
    if (data.category && typeof data.category === "string" && !contactCategories.includes(data.category)) {
        return NextResponse.json({ ok: false, message: "Invalid category" }, { status: 400 })
    }
    if (data.budget && typeof data.budget === "string" && !budgetBands.includes(data.budget)) {
        return NextResponse.json({ ok: false, message: "Invalid budget" }, { status: 400 })
    }
    if (data.timeline && typeof data.timeline === "string" && !timelineBands.includes(data.timeline)) {
        return NextResponse.json({ ok: false, message: "Invalid timeline" }, { status: 400 })
    }
    if (data.projectType && typeof data.projectType === "string" && !projectTypes.includes(data.projectType)) {
        return NextResponse.json({ ok: false, message: "Invalid project type" }, { status: 400 })
    }
    if (data.currentStage && typeof data.currentStage === "string" && !currentStages.includes(data.currentStage)) {
        return NextResponse.json({ ok: false, message: "Invalid current stage" }, { status: 400 })
    }
    if (data.designReadiness && typeof data.designReadiness === "string" && !designReadinessOptions.includes(data.designReadiness)) {
        return NextResponse.json({ ok: false, message: "Invalid design readiness" }, { status: 400 })
    }
    if (Array.isArray(data.platformsRequired) && data.platformsRequired.some((value) => typeof value !== "string" || !platformOptions.includes(value))) {
        return NextResponse.json({ ok: false, message: "Invalid platform selection" }, { status: 400 })
    }
    if (Array.isArray(data.featuresRequired) && data.featuresRequired.some((value) => typeof value !== "string" || !featureOptions.includes(value))) {
        return NextResponse.json({ ok: false, message: "Invalid feature selection" }, { status: 400 })
    }
    if (data.estimatedBudget && typeof data.estimatedBudget === "string" && !budgetBands.includes(data.estimatedBudget)) {
        return NextResponse.json({ ok: false, message: "Invalid estimated budget" }, { status: 400 })
    }
    if (data.expectedTimeline && typeof data.expectedTimeline === "string" && !timelineBands.includes(data.expectedTimeline)) {
        return NextResponse.json({ ok: false, message: "Invalid expected timeline" }, { status: 400 })
    }
    if (data.decisionMaker && typeof data.decisionMaker === "string" && !decisionMakerOptions.includes(data.decisionMaker)) {
        return NextResponse.json({ ok: false, message: "Invalid decision maker value" }, { status: 400 })
    }

    try {
        const collection = await getContactInquiryCollection()
        const timestamp = new Date()
        const submittedName = result.data.fullName ?? result.data.name
        const submittedEmail = result.data.emailAddress ?? result.data.email
        const submittedBrief = result.data.brief ?? result.data.projectSummary

        if (!submittedName || !submittedEmail) {
            return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 })
        }

        const created = await collection.insertOne({
            name: submittedName,
            email: submittedEmail,
            company: result.data.company,
            category: result.data.category,
            budget: result.data.budget,
            timeline: result.data.timeline,
            brief: submittedBrief,
            fullName: result.data.fullName,
            emailAddress: result.data.emailAddress,
            whatsappNumber: result.data.whatsappNumber,
            companyName: result.data.companyName,
            websiteProductLink: result.data.websiteProductLink,
            projectOverview: result.data.projectOverview ?? result.data.projectSummary,
            projectType: result.data.projectType,
            currentStage: result.data.currentStage,
            designReadiness: result.data.designReadiness,
            referenceLinks: result.data.referenceLinks,
            platformsRequired: result.data.platformsRequired,
            featuresRequired: result.data.featuresRequired,
            importantRequirements: result.data.importantRequirements,
            estimatedBudget: result.data.estimatedBudget,
            expectedTimeline: result.data.expectedTimeline,
            decisionMaker: result.data.decisionMaker,
            attachments: result.data.attachments,
            anythingElse: result.data.anythingElse ?? result.data.technicalRequirements,
            status: "new",
            createdAt: timestamp,
            updatedAt: timestamp,
        })

        return NextResponse.json({ ok: true, persisted: true, id: created.insertedId.toString(), message: "Inquiry received" })
    } catch (error) {
        console.error("Contact inquiry persistence failed", error)
        return NextResponse.json({ ok: false, persisted: false, message: "Server error" }, { status: 500 })
    }
}
