import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    context: { params: { id: string } }
) {
    const { id } = context.params;
    const categoryId = Number(id);
    console.log("Parsed categoryId:", categoryId);

    try {
        const posts = await prisma.post.findMany({
            where: {
                categoryId: categoryId,
                isDeleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: true,
                category: true,
            },
        });
        console.log("Fetched posts:", posts);

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts by categoryId:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}