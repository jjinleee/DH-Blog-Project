import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params

    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }, // ID가 숫자라면 Number로 변환 필요
        })
        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(post)
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }
}