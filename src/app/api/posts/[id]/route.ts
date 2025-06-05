import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email ?? '';

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const reaction = await prisma.reaction.findFirst({
      where: {
        postId: Number(id),
        userEmail,
      },
    });

    return NextResponse.json({
      ...post,
      reaction: reaction?.type ?? null,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  // formidable expects a Node.js IncomingMessage, but Next.js passes a web Request.
  // We need to convert the web Request to a Node.js stream for formidable to work.
  const form = new IncomingForm({
    uploadDir: './public/uploads',
    keepExtensions: true,
    multiples: false,
  });
  return new Promise((resolve, reject) => {
    // @ts-ignore
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        return resolve(NextResponse.json({ error: 'Form parse error' }, { status: 400 }));
      }

      const id = fields.id;
      const title = fields.title;
      const content = fields.content;
      const categoryId = fields.categoryId;
      let imageUrl: string | undefined = undefined;

      const file = files.image;
      if (file) {
        const uploadedFile = Array.isArray(file) ? file[0] : file;
        const relativePath = `/uploads/${path.basename(uploadedFile.filepath)}`;
        imageUrl = relativePath;
      } else {
        // If no new image, keep existing imageUrl
        const existingPost = await prisma.post.findUnique({
          where: { id: Number(id) },
          select: { imageUrl: true },
        });
        imageUrl = existingPost?.imageUrl || undefined;
      }

      try {
        const updatedPost = await prisma.post.update({
          where: { id: Number(id) },
          data: {
            title: title as string,
            content: content as string,
            categoryId: Number(categoryId),
            imageUrl,
          },
        });
        resolve(NextResponse.json(updatedPost));
      } catch (error) {
        resolve(NextResponse.json({ error: 'Failed to update post' }, { status: 500 }));
      }
    });
  });
}