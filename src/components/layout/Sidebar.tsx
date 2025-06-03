'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Category {
    id: string;
    name: string;
}

export default function Sidebar({ categories }: { categories: Category[] }) {
    const { data: session, status } = useSession();
    const pathname = usePathname(); // moved above conditional
    if (status === 'loading') return null;
    const user = status === 'authenticated' ? session?.user : null;
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    return (
        <aside className="w-65 bg-white border-r shadow-md p-6">
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col items-center mt-6">
                    <img
                        src={user?.image || "/images/admin-profile.png"}
                        alt={`${user?.name || '기본'}의 프로필 이미지`}
                        className="w-24 h-24 rounded-full object-cover mb-3"
                    />
                    <p className="font-semibold text-[18px] text-base">{user?.name || '방문자'}</p>
                    <p className="text-sm text-gray-500">{user?.email || '로그인이 필요합니다'}</p>
                </div>

                <nav className="mt-5 space-y-2 p-5">
                    <Link
                        href={isAdmin ? "/admin" : "/posts"}
                        className={`block text-[16px] font-medium pl-2 ${
                            pathname === (isAdmin ? "/admin" : "/posts")
                                ? "text-blue-600"
                                : "text-gray-700 hover:text-blue-600"
                        }`}
                    >
                        All Posts
                    </Link>
                    {categories.map((cat) => {
                        const href = isAdmin ? `/admin/category/${cat.id}` : `/category/${cat.id}`;
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={cat.id}
                                href={href}
                                className={`block text-[16px] font-medium pl-2 ${
                                    isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                                }`}
                            >
                                {cat.name}
                            </Link>
                        );
                    })}
                    {isAdmin && (
                        <Link href="/admin/category/manage" className="text-[12px] text-gray-500 hover:text-blue-500 ml-2 mt-5 block">
                            카테고리 편집
                        </Link>
                    )}
                </nav>

                {user && (
                    <div className="text-sm text-gray-600 px-5 space-y-1 mt-30">
                        <Link href="/admin/profile" className="block hover:text-blue-500">내 정보 수정하기</Link>
                         {isAdmin && (
                            <Link href="/admin/settings" className="block hover:text-blue-500">회원 검색</Link>
                        )}
                    </div>
                )}
                {status !== 'authenticated' && (
                    <div className="text-sm text-gray-600 px-5 space-y-1 mt-30">
                        <Link href="/login" className="block hover:text-blue-500">로그인하기</Link>
                        <Link href="/signup" className="block hover:text-blue-500">회원가입하기</Link>
                    </div>
                )}
            </div>
        </aside>
    );
}