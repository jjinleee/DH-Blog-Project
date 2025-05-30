import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('카테고리 불러오기 오류:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}