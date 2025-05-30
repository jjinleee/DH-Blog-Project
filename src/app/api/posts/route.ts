import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, slug, categoryId } = await req.json()

    const post = await prisma.post.create({
        data: {
            title,
            content,
            slug,
            author: { connect: { email: session.user.email } },
            category: categoryId ? { connect: { id: categoryId } } : undefined,
        },
    })

    return NextResponse.json(post)
}

export async function GET() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true, category: true },
    })
    return NextResponse.json(posts)
}