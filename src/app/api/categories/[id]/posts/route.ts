import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const categoryId = Number(params.id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        categoryId,
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

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts by categoryId:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}