import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    console.log('🧾 Authenticated as:', session?.user?.email);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, categoryId } = await req.json()
    const slug = `${title}-${Date.now()}`;
    const post = await prisma.post.create({
        data: {
            title,
            content,
            slug,
            author: { connect: { email: session.user.email } },
            category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
        },
    })

    return NextResponse.json(post)
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const posts = await prisma.post.findMany({
        where: { author: { email: session.user.email } },
        orderBy: { createdAt: 'desc' },
        include: { author: true, category: true },
    })
    return NextResponse.json(posts)
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, title, content } = await req.json()

    const post = await prisma.post.updateMany({
        where: {
            id: Number(id),
            author: { email: session.user.email } },
        data: { title, content },
    })

    return NextResponse.json(post)
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()

    const deleted = await prisma.post.deleteMany({
        where: { id, author: { email: session.user.email } },
    })

    return NextResponse.json(deleted)
}
