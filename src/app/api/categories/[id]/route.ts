import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = Number(params.id);

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}