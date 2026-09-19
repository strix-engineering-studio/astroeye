import { AdminConsole } from "@/components/admin/admin-console"
import { requireAdminSession } from "@/lib/admin-auth"
import { getClientsCollection, getIndustrySignalsCollection, getLandingPagesCollection } from "@/lib/admin-data"
import { getContactInquiryCollection } from "@/lib/db"

export default async function AdminPage() {
    await requireAdminSession()

    const [landingPages, clients, signals, inquiries] = await Promise.all([
        getLandingPagesCollection().then((collection) => collection.find({}).sort({ updatedAt: -1 }).limit(50).toArray()),
        getClientsCollection().then((collection) => collection.find({}).sort({ updatedAt: -1 }).limit(50).toArray()),
        getIndustrySignalsCollection().then((collection) => collection.find({}).sort({ updatedAt: -1 }).limit(50).toArray()),
        getContactInquiryCollection().then((collection) => collection.find({}).sort({ createdAt: -1 }).limit(50).toArray()),
    ])

    return (
        <AdminConsole
            initialLandingPages={JSON.parse(JSON.stringify(landingPages))}
            initialClients={JSON.parse(JSON.stringify(clients))}
            initialSignals={JSON.parse(JSON.stringify(signals))}
            initialInquiries={JSON.parse(JSON.stringify(inquiries))}
        />
    )
}