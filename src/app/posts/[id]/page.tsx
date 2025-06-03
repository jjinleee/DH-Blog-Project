// app/posts/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PublicPostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/public/posts/${id}`)
            .then(res => res.json())
            .then(setPost);
    }, [id]);

    if (!post) return <p className="text-gray-800 p-6">로딩중</p>;

    return (
        <div className="max-w-3xl mx-auto mt-6 px-14 py-8 bg-white rounded-xl shadow-xl border border-gray-100 relative">
            <div className="mb-6">
                <p className="text-gray-800 text-[20px] font-bold">{post.title}</p>
            </div>

            <div className="absolute top-6 right-10 text-[10px] text-gray-400 text-right">
                <p>
                    작성일: {new Date(post.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                {post.updatedAt && (
                    <p>
                        수정일: {new Date(post.updatedAt).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                )}
            </div>

            <div className="relative mb-6">
                <div className="flex items-center mb-1">
                    <span className="block text-base font-semibold mb-2 text-gray-700 mr-2">카테고리</span>
                </div>
                <p className="bg-gray-50 text-gray-700 px-3 py-2 rounded-md">{post.category?.name || '없음'}</p>
            </div>

            <div className="mb-6">
                <span className="block text-base font-semibold mb-2 text-gray-700">내용</span>
                <p className="text-gray-800 px-4 whitespace-pre-wrap leading-relaxed text-base mt-2">{post.content}</p>
            </div>

            {post.imageUrl && (
                <div className="mb-6">
                    <img src={post.imageUrl} alt="첨부 이미지" className="max-w-full rounded shadow" />
                </div>
            )}
        </div>
    );
}