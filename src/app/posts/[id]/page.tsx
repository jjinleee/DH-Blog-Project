'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PublicPostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const { data: session } = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        fetch(`/api/public/posts/${id}`)
            .then(res => res.json())
            .then(setPost);
    }, [id]);

    const handleLike = async () => {
        if (!session) {
            setShowLoginModal(true);
            return;
        }
        try {
            const res = await fetch(`/api/posts/${String(id)}/like`, { method: 'POST' });
            let data = null;

            try {
                data = await res.json();
            } catch (jsonError) {
                console.error('JSON 파싱 실패:', jsonError);
                alert('서버에서 올바른 응답을 받지 못했습니다.');
                return;
            }

            if (!res.ok) {
                alert(data?.message || '에러가 발생했습니다.');
            } else {
                setPost((prev: any) => ({
                    ...prev,
                    likes: data.likes,
                    dislikes: data.dislikes,
                    reaction: data.reaction,
                }));
            }
        } catch (error) {
            console.error('Like 요청 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    const handleDislike = async () => {
        if (!session) {
            setShowLoginModal(true);
            return;
        }
        try {
            const res = await fetch(`/api/posts/${String(id)}/dislike`, { method: 'POST' });
            let data = null;

            try {
                data = await res.json();
            } catch (jsonError) {
                console.error('JSON 파싱 실패:', jsonError);
                alert('서버에서 올바른 응답을 받지 못했습니다.');
                return;
            }

            if (!res.ok) {
                alert(data?.message || '에러가 발생했습니다.');
            } else {
                setPost((prev: any) => ({
                    ...prev,
                    likes: data.likes,
                    dislikes: data.dislikes,
                    reaction: data.reaction,
                }));
            }
        } catch (error) {
            console.error('Dislike 요청 중 오류 발생:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

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

            <div className="mt-4 flex items-center gap-6">
                <button
                    onClick={handleLike}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-800 text-sm px-4 py-2 rounded"
                    title={session ? '좋아요' : '로그인이 필요합니다'}
                >
                    👍 ({post.likes})
                </button>
                <button
                    onClick={handleDislike}
                    className="bg-gray-100 hover:bg-red-100 text-gray-800 text-sm px-4 py-2 rounded"
                    title={session ? '싫어요' : '로그인이 필요합니다'}
                >
                    👎 ({post.dislikes})
                </button>
            </div>

            {showLoginModal && (
                <div className="fixed inset-0 z-50 bg-black/20  flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-md p-6 w-[320px] text-center">
                        <p className="mb-4 text-gray-800 font-medium">로그인이 필요한 기능입니다.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                로그인하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}