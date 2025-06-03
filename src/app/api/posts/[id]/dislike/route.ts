// app/api/posts/[id]/like/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: { id: string } }) {
    const postId = parseInt(context.params.id);
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const userEmail = session.user?.email ?? '';

    const result = await prisma.$transaction(async (tx) => {
        const post = await tx.post.findUnique({ where: { id: postId } });
        if (!post) return { message: 'Post not found', reaction: null };

        const existingReaction = await tx.reaction.findFirst({
            where: { postId, userEmail },
        });

        let newLikeCount = post.likes;
        let newDislikeCount = post.dislikes;

        if (existingReaction?.type === 'DISLIKE') {
            // Remove dislike
            await tx.reaction.delete({ where: { id: existingReaction.id } });
            newDislikeCount -= 1;
            return {
                message: '싫어요 취소됨',
                reaction: null,
                likes: newLikeCount,
                dislikes: newDislikeCount,
            };
        } else {
            if (existingReaction?.type === 'LIKE') {
                // Switch from like to dislike
                await tx.reaction.delete({ where: { id: existingReaction.id } });
                newLikeCount -= 1;
            }

            // Add dislike
            await tx.reaction.create({
                data: { postId, userEmail, type: 'DISLIKE' },
            });
            newDislikeCount += 1;

            await tx.post.update({
                where: { id: postId },
                data: {
                    likes: newLikeCount,
                    dislikes: newDislikeCount,
                },
            });

            const updatedPost = await tx.post.findUnique({ where: { id: postId } });

            return {
                message: '싫어요 처리 완료',
                reaction: 'DISLIKE',
                likes: updatedPost?.likes ?? newLikeCount,
                dislikes: updatedPost?.dislikes ?? newDislikeCount,
            };
        }
    });

    return NextResponse.json(result);
}