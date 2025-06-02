import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }  // context로부터 직접 받아야 함
) {
    const { id } = context.params;  // ✅ context에서 params 꺼내기

    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { category: true },
        });
        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(post);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}