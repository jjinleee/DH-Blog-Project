// components/Sidebar.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const { data: session } = useSession();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);


    return (
        <aside className="w-65 bg-white border-r p-10">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex flex-col items-center mt-6">
                        <img src="/images/admin-profile.png" alt="admin" className="w-24 h-24 rounded-full object-cover" />
                        <p className="mt-4 font-bold text-lg">{session?.user?.name ?? '관리자'}</p>
                        <p className="text-sm text-gray-600">{session?.user?.email}</p>
                    </div>

                    <nav className="mt-15 space-y-2 p-5">
                        <Link href="/admin" className="block text-gray-800 hover:underline">
                            All Posts
                        </Link>
                        {categories.map((cat: any) => (
                            <Link key={cat.id} href={`/admin/category/${cat.slug}`} className="block text-gray-700 hover:underline">
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="px-5 space-y-1 text-sm text-gray-500">
                    <Link href="/admin/profile" className="block hover:underline">
                        내 정보 수정하기
                    </Link>
                    <Link href="/admin/settings" className="block hover:underline">
                        회원 검색
                    </Link>
                </div>
            </div>
        </aside>
    );
}