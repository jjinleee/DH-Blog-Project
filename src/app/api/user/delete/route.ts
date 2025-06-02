// src/app/api/user/delete/route.ts

import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 👇 연결된 데이터 먼저 삭제
        await prisma.post.deleteMany({ where: { authorId: user.id } });
        await prisma.account.deleteMany({ where: { userId: user.id } });
        await prisma.session.deleteMany({ where: { userId: user.id } });

        // 🔥 이제 유저 삭제
        await prisma.user.delete({ where: { id: user.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Failed to delete user:', error);
        return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
    }
}