import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true, author: { select: { name: true } } },
    })

    return NextResponse.json(posts)
}