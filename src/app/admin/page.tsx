// app/admin/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

    useEffect(() => {
        if (status === 'loading') return; // 아직 세션 확인 중
        if (!session || session.user?.role !== 'ADMIN') {
            router.replace('/'); // 관리자 아니면 홈으로 이동
        }
    }, [session, status, router]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetch('/api/posts')
                .then(res => res.json())
                .then(data => setPosts(data));
            fetch('/api/categories')
                .then(res => res.json())
                .then(data => setCategories(data));
        }
    }, [status, session]);

    if (status === 'loading' || session?.user?.role !== 'ADMIN') {
        return <p className="p-6">접근 권한 확인 중...</p>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">관리자 페이지</h1>
            <p className="text-center text-gray-600 mb-6">
                안녕하세요, {session.user?.name}님! 이 페이지는 관리자만 접근 가능합니다.
            </p>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => router.push('/admin/write')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
                >
                    글쓰기
                </button>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">전체 게시글</h2>
                <ul className="space-y-4">
                    {posts.map((post: any) => (
                        <li key={post.id} className="border rounded-lg p-5 bg-white shadow-sm">
                            <h3 className="text-xl font-semibold">{post.title}</h3>
                            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                            <div className="mt-4 flex space-x-3">
                                <button
                                    onClick={() => router.push(`/admin/write/edit?id=${post.id}`)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteTarget(post.id);
                                        setShowDeleteModal(true);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">게시글 삭제</h3>
                        <p>정말 삭제하시겠습니까?</p>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={async () => {
                                    if (deleteTarget === null) return;
                                    await fetch('/api/posts', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: deleteTarget }),
                                    });
                                    setPosts(posts.filter((p: any) => p.id !== deleteTarget));
                                    setShowDeleteModal(false);
                                    setDeleteTarget(null);
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}