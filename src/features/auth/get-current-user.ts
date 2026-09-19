import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const ck = cookieStore.get('strix_user')
        const userId = ck?.value
        if (!userId) return null
        const user = await prisma.user.findUnique({ where: { id: userId } })
        return user
    } catch (e) {
        console.error('getCurrentUser error', e)
        return null
    }
}
