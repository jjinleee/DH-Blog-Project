'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    createdAt: string;
    content: string;
    category: Category;
    imageUrl?: string;
    likes?: number;
    dislikes?: number;
}

export default function CategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const [posts, setPosts] = useState<Post[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!categoryId) return;
        fetch(`/api/categories/${categoryId}/posts`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                if (data.length > 0 && data[0].category?.name) {
                    setCategoryName(data[0].category.name);
                } else {
                    // fetch category name directly if no posts
                    fetch(`/api/categories/${categoryId}`)
                        .then(res => res.json())
                        .then(cat => {
                            setCategoryName(cat.name);
                        });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching posts:', err);
                setLoading(false);
            });
    }, [categoryId]);

    if (loading) return <p className="p-6">로딩 중...</p>;

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold whitespace-nowrap">{categoryName}</h1>
                <div className="flex items-center gap-3 ml-auto">
                    <div className="relative w-full max-w-xs sm:w-80">
                        <input
                            type="text"
                            placeholder="제목 또는 내용을 검색하세요"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <button
                        onClick={() => router.push('/admin/write')}
                        className="p-1 hover:opacity-80"
                        title="글쓰기"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-18 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-5">
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => router.push(`/admin/posts/${post.id}`)}
                    className="border rounded-md overflow-hidden bg-white shadow-sm cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col"
                  >
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="text-md font-semibold mb-1 text-gray-800 truncate">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                      <div className="mt-auto flex justify-between text-xs text-gray-500 pt-2">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>👍 {post.likes || 0} / 👎 {post.dislikes || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    );
}