import type { Collection, Document, ObjectId } from "mongodb"
import { getMongoCollection } from "@/lib/mongo"

export type LandingPageMetric = {
    label: string
    value: string
}

export type LandingPageFeature = {
    title: string
    description: string
}

export type LandingPageConfig = Document & {
    _id?: ObjectId
    slug: string
    businessName: string
    industry: string
    heroEyebrow: string
    heroTitle: string
    heroDescription: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
    metrics: LandingPageMetric[]
    features: LandingPageFeature[]
    offerBullets: string[]
    seoTitle: string
    seoDescription: string
    contactEmail: string
    notes?: string
    published: boolean
    createdAt: Date
    updatedAt: Date
}

export type ClientRecord = Document & {
    _id?: ObjectId
    name: string
    industry: string
    status: string
    owner: string
    website: string
    contactEmail: string
    notes: string
    createdAt: Date
    updatedAt: Date
}

export type IndustrySignal = Document & {
    _id?: ObjectId
    title: string
    source: string
    industry: string
    summary: string
    impact: string
    link: string
    priority: "low" | "medium" | "high"
    createdAt: Date
    updatedAt: Date
}

export async function getLandingPagesCollection(): Promise<Collection<LandingPageConfig>> {
    return getMongoCollection<LandingPageConfig>("landingPages")
}

export async function getClientsCollection(): Promise<Collection<ClientRecord>> {
    return getMongoCollection<ClientRecord>("clients")
}

export async function getIndustrySignalsCollection(): Promise<Collection<IndustrySignal>> {
    return getMongoCollection<IndustrySignal>("industrySignals")
}
