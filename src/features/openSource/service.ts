import prisma from '@/lib/prisma'

export async function listOpenSource({ take = 20, skip = 0 } = {}) {
    return prisma.openSourceProject.findMany({
        take,
        skip,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' as const },
    })
}

export async function getOpenSourceBySlug(slug: string) {
    return prisma.openSourceProject.findUnique({ where: { slug } })
}
