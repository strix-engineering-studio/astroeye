import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next()
    }

    if (process.env.ADMIN_BYPASS === 'true') {
        return NextResponse.next()
    }

    const cookie = req.cookies.get('strix_user')

    if (cookie) {
        return NextResponse.next()
    }

    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)

    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: ['/dashboard/:path*'],
}