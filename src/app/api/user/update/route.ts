import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    console.log('🔧 [POST] /api/user/update called');
    const session = await getServerSession(authOptions);
    console.log('📦 Session:', session);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, image, password, currentPassword } = await req.json();
    console.log('📥 Request body:', { name, image, password, currentPassword });

    const updateData: any = {
        name,
        image,
    };

    if (password) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'User not found or password not set' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ field: 'currentPassword', error: '비밀번호가 다릅니다' }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);
        updateData.password = hashed;
    }

    console.log('✅ Updating user with:', updateData);
    await prisma.user.update({
        where: { email: session.user.email },
        data: updateData,
    });

    console.log('🎉 User updated successfully');
    return NextResponse.json({ message: 'Updated successfully', name: updateData.name, image: updateData.image });
}