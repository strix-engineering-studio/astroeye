import type { Collection } from "mongodb"
import { getMongoCollection } from "@/lib/mongo"

export type ContactInquiryDocument = {
    name: string
    email: string
    company?: string
    category?: string
    budget?: string
    timeline?: string
    brief?: string
    fullName?: string
    emailAddress?: string
    whatsappNumber?: string
    companyName?: string
    websiteProductLink?: string
    projectOverview?: string
    projectType?: string
    currentStage?: string
    designReadiness?: string
    referenceLinks?: string
    platformsRequired?: string[]
    featuresRequired?: string[]
    importantRequirements?: string
    estimatedBudget?: string
    expectedTimeline?: string
    decisionMaker?: string
    attachments?: { name: string; type: string; size: number }[]
    anythingElse?: string
    status?: "new" | "reviewed" | "archived"
    createdAt: Date
    updatedAt: Date
}

export async function getContactInquiryCollection(): Promise<Collection<ContactInquiryDocument>> {
    return getMongoCollection<ContactInquiryDocument>("ContactInquiry")
}
