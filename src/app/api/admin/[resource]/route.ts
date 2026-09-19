import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/admin-auth"
import { getContactInquiryCollection } from "@/lib/db"
import {
    getClientsCollection,
    getIndustrySignalsCollection,
    getLandingPagesCollection,
} from "@/lib/admin-data"
import { ObjectId } from "@/lib/mongo"

const landingPageSchema = z.object({
    slug: z.string().min(1),
    businessName: z.string().min(1),
    industry: z.string().min(1),
    heroEyebrow: z.string().min(1),
    heroTitle: z.string().min(1),
    heroDescription: z.string().min(1),
    primaryCtaLabel: z.string().min(1),
    primaryCtaHref: z.string().min(1),
    secondaryCtaLabel: z.string().min(1),
    secondaryCtaHref: z.string().min(1),
    metrics: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
    features: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })),
    offerBullets: z.array(z.string().min(1)),
    seoTitle: z.string().min(1),
    seoDescription: z.string().min(1),
    contactEmail: z.string().email(),
    notes: z.string().optional().default(""),
    published: z.boolean().default(false),
})

const clientSchema = z.object({
    name: z.string().min(1),
    industry: z.string().min(1),
    status: z.string().min(1),
    owner: z.string().min(1),
    website: z.string().optional().default(""),
    contactEmail: z.string().email().optional().default(""),
    notes: z.string().optional().default(""),
})

const signalSchema = z.object({
    title: z.string().min(1),
    source: z.string().min(1),
    industry: z.string().min(1),
    summary: z.string().min(1),
    impact: z.string().min(1),
    link: z.string().optional().default(""),
    priority: z.enum(["low", "medium", "high"]),
})

const resourceMap = {
    "landing-pages": {
        collection: getLandingPagesCollection,
        schema: landingPageSchema,
        allowDelete: true,
    },
    clients: {
        collection: getClientsCollection,
        schema: clientSchema,
        allowDelete: true,
    },
    signals: {
        collection: getIndustrySignalsCollection,
        schema: signalSchema,
        allowDelete: true,
    },
    inquiries: {
        collection: getContactInquiryCollection,
        allowDelete: false,
    },
} as const

type ResourceName = keyof typeof resourceMap

function serializeDocument(document: { _id?: ObjectId; createdAt?: Date; updatedAt?: Date;[key: string]: unknown }) {
    const { _id, ...rest } = document
    return {
        id: _id?.toString() ?? "",
        ...rest,
        createdAt: rest.createdAt ? rest.createdAt.toISOString() : undefined,
        updatedAt: rest.updatedAt ? rest.updatedAt.toISOString() : undefined,
    }
}

function getResource(resource: string): ResourceName | null {
    return resource in resourceMap ? (resource as ResourceName) : null
}

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
    if (!(await getAdminSession())) {
        return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }

    const { resource } = await context.params
    const resolved = getResource(resource)
    if (!resolved) {
        return NextResponse.json({ ok: false, message: "Unknown resource" }, { status: 404 })
    }

    const collection = await resourceMap[resolved].collection()
    const sort: Record<string, 1 | -1> = resolved === "inquiries" ? { createdAt: -1 } : { updatedAt: -1 }
    const documents = await collection.find({}).sort(sort).limit(100).toArray()
    return NextResponse.json({ ok: true, items: documents.map(serializeDocument) })
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
    if (!(await getAdminSession())) {
        return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }

    const { resource } = await context.params
    const resolved = getResource(resource)
    if (!resolved || resolved === "inquiries") {
        return NextResponse.json({ ok: false, message: "Unsupported resource" }, { status: 400 })
    }

    const payload = await request.json().catch(() => null)
    const parsed = resourceMap[resolved].schema.safeParse(payload)

    if (!parsed.success) {
        return NextResponse.json({ ok: false, message: "Invalid submission", issues: parsed.error.flatten() }, { status: 400 })
    }

    const now = new Date()
    const id = typeof payload?.id === "string" ? payload.id : ""

    if (resolved === "landing-pages") {
        const collection = await getLandingPagesCollection()
        const data = parsed.data as z.infer<typeof landingPageSchema>
        const document = { ...data, updatedAt: now, createdAt: now }

        if (id) {
            await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...document, createdAt: undefined } }, { upsert: true })
            return NextResponse.json({ ok: true, id })
        }

        const inserted = await collection.insertOne(document)
        return NextResponse.json({ ok: true, id: inserted.insertedId.toString() })
    }

    if (resolved === "clients") {
        const collection = await getClientsCollection()
        const data = parsed.data as z.infer<typeof clientSchema>
        const document = { ...data, updatedAt: now, createdAt: now }

        if (id) {
            await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...document, createdAt: undefined } }, { upsert: true })
            return NextResponse.json({ ok: true, id })
        }

        const inserted = await collection.insertOne(document)
        return NextResponse.json({ ok: true, id: inserted.insertedId.toString() })
    }

    const collection = await getIndustrySignalsCollection()
    const data = parsed.data as z.infer<typeof signalSchema>
    const document = { ...data, updatedAt: now, createdAt: now }

    if (id) {
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...document, createdAt: undefined } }, { upsert: true })
        return NextResponse.json({ ok: true, id })
    }

    const inserted = await collection.insertOne(document)
    return NextResponse.json({ ok: true, id: inserted.insertedId.toString() })
}

export async function DELETE(request: Request, context: { params: Promise<{ resource: string }> }) {
    if (!(await getAdminSession())) {
        return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }

    const { resource } = await context.params
    const resolved = getResource(resource)
    if (!resolved || !resourceMap[resolved].allowDelete) {
        return NextResponse.json({ ok: false, message: "Unsupported resource" }, { status: 400 })
    }

    const id = new URL(request.url).searchParams.get("id")
    if (!id) {
        return NextResponse.json({ ok: false, message: "Missing id" }, { status: 400 })
    }

    const collection = await resourceMap[resolved].collection()

    if (resolved === "inquiries") {
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status: "archived", updatedAt: new Date() } })
        return NextResponse.json({ ok: true, id })
    }

    await collection.deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ ok: true, id })
}