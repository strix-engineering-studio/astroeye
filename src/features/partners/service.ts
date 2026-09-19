import prisma from '@/lib/prisma'

export async function listPartners({ take = 20, skip = 0 } = {}) {
    return prisma.partner.findMany({
        take,
        skip,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' as const },
    })
}

export async function getPartnerById(id: string) {
    return prisma.partner.findUnique({ where: { id } })
}
