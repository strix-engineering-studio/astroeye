import prisma from '@/lib/prisma'

export async function listProducts({ take = 20, skip = 0 } = {}) {
    return prisma.product.findMany({
        take,
        skip,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' as const },
    })
}

export async function getProductBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug } })
}

export async function createProduct(data: Record<string, unknown>) {
    return prisma.product.create({ data: data as Parameters<typeof prisma.product.create>[0]['data'] })
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
    return prisma.product.update({ where: { id }, data: data as Parameters<typeof prisma.product.update>[0]['data'] })
}

export async function deleteProduct(id: string) {
    return prisma.product.update({ where: { id }, data: { deletedAt: new Date() } })
}
