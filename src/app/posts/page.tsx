

// app/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicPostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/public/posts')
            .then(res => res.json())
            .then(data => setPosts(data));
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold whitespace-nowrap">jinlee's Blog</h1>
                <div className="flex items-center gap-3 ml-auto">
                    <div className="relative w-full max-w-xs sm:w-80">
                        <input
                            type="text"
                            placeholder="제목 또는 내용을 검색하세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-5">
                {posts
                    .filter((post: any) =>
                        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((post: any) => (
                        <div
                            key={post.id}
                            onClick={() => router.push(`/posts/${post.id}`)}
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
    );
}