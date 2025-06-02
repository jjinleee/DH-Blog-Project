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
    const [searchQuery, setSearchQuery] = useState('');

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
            <div className="mb-4 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="제목 또는 내용을 검색하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="absolute top-15 right-50">
                <button
                    onClick={() => router.push('/admin/write')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
                >
                    글쓰기
                </button>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">                    {posts
                    .filter((post: any) =>
                        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.content.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((post: any) => (
                            <div
                                key={post.id}
                                onClick={() => router.push(`/admin/posts/${post.id}`)}
                                className="border rounded-md overflow-hidden bg-white shadow-sm cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                            >
                                {post.imageUrl && (
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover"/>
                                )}
                                <div className="p-3">
                                    <h3 className="text-md font-semibold mb-1 text-gray-800 truncate">{post.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                                    <div className="mt-auto flex justify-between text-xs text-gray-500 pt-2">
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        <span>👍 {post.likes} / 👎 {post.dislikes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}