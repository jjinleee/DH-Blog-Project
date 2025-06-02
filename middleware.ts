// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    const { pathname } = req.nextUrl

    // 보호할 관리자 페이지 경로
    const adminOnlyPaths = ['/admin', '/admin/write', '/admin/settings']

    // 로그인하지 않은 사용자 접근 차단
    if (adminOnlyPaths.some(path => pathname.startsWith(path))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // 관리자가 아닌 경우 접근 차단
        if (token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next()
}

// 이 middleware를 적용할 경로 설정
export const config = {
    matcher: ['/admin/:path*'],
}