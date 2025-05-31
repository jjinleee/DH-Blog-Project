import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, image } = await req.json();

    await prisma.user.update({
        where: { email: session.user.email },
        data: { name, image },
    });

    return NextResponse.json({ message: 'Updated successfully' });
}