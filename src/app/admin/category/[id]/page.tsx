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
    category: Category;
}

export default function CategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const [posts, setPosts] = useState<Post[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-left">{categoryName}</h1>
            <div>
                <ul className="space-y-3 max-w-xl">
                    {posts.map((post) => (
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