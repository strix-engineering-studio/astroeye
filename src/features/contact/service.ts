import prisma from '@/lib/prisma'

export async function listContactRequests({ take = 20, skip = 0 } = {}) {
    return prisma.contactRequest.findMany({
        take,
        skip,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' as const },
    })
}

export async function getContactRequest(id: string) {
    return prisma.contactRequest.findUnique({ where: { id } })
}
