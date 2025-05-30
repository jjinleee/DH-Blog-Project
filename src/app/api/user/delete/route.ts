import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.account.deleteMany({ where: { user: { email: session.user.email } } });
    await prisma.session.deleteMany({ where: { user: { email: session.user.email } } });

    try {
        await prisma.user.delete({ where: { email: session.user.email } });
    } catch (error) {
        return NextResponse.json({ error: 'User not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted' });
}