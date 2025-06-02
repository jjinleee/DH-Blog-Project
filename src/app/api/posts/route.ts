import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('categoryId') as string
    const slug = `${title}-${Date.now()}`

    let imageUrl: string | null = null

    const file = formData.get('image')
    if (file && file instanceof File) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const ext = file.name.split('.').pop()
        const filename = `${uuidv4()}.${ext}`
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
        await writeFile(filePath, buffer)
        imageUrl = `/uploads/${filename}`
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            slug,
            imageUrl,
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
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('categoryId') as string

    let imageUrl: string | null = null
    const file = formData.get('image')
    if (file && file instanceof File) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const ext = file.name.split('.').pop()
        const filename = `${uuidv4()}.${ext}`
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
        await writeFile(filePath, buffer)
        imageUrl = `/uploads/${filename}`
    } else {
        // fetch existing imageUrl if no new file provided
        const existing = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: { imageUrl: true },
        })
        imageUrl = existing?.imageUrl || null
    }

    const post = await prisma.post.update({
        where: {
            id: Number(id),
        },
        data: {
            title,
            content,
            categoryId: categoryId ? Number(categoryId) : null,
            imageUrl,
        },
    })

    return NextResponse.json(post)
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()

    const deleted = await prisma.post.deleteMany({
        where: { id, author: { email: session.user.email } },
    })

    return NextResponse.json(deleted)
}
