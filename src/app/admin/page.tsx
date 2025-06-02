// app/admin/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
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
            <h1 className="text-3xl font-bold mb-4 text-left">{session.user?.name}'s Blog</h1>
            <p className="text-left text-gray-600 mb-6">
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
                <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
                <ul className="space-y-3 max-w-xl">
                    {posts.map((post: any) => (
                        <li
                            key={post.id}
                            onClick={() => router.push(`/admin/posts/${post.id}`)}
                            className="border rounded-lg p-5 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
                        >
                            <h3 className="text-l font-semibold">{post.title}</h3>
                            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}