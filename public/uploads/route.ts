import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const slug = formData.get('slug') as string;
    const categoryId = formData.get('categoryId') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';

    if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = imageFile.type.split('/').pop();
        const filename = `${uuidv4()}.${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        await writeFile(filePath, buffer);
        imageUrl = `/uploads/${filename}`;
    }

    await prisma.post.create({
        data: {
            title,
            content,
            slug,
            categoryId,
            imageUrl,
            authorId: '현재_로그인_유저_ID',
        },
    });

    return NextResponse.json({ success: true });
}