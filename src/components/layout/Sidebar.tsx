'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
}

export default function Sidebar({ categories }: { categories: Category[] }) {
    const { data: session } = useSession();
    const user = session?.user;
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    return (
        <aside className="w-65 bg-white border-r shadow-md p-6">
            <div className="flex flex-col justify-between h-full">
                {!user && (
                    <div className="flex flex-col items-center mt-6">
                        <img
                            src="/images/admin-profile.png"
                            alt="기본 프로필 이미지"
                            className="w-24 h-24 rounded-full object-cover mb-3"
                        />
                        <p className="font-semibold text-[18px] text-base">로그인 필요</p>
                    </div>
                )}
                {user && (
                    <>
                        <div className="flex flex-col items-center mt-6">
                            <img
                                src={user.image || "/images/admin-profile.png"}
                                alt={`${user.name}의 프로필 이미지`}
                                className="w-24 h-24 rounded-full object-cover mb-3"
                            />
                            <p className="font-semibold text-[18px] text-base">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

                        <nav className="mt-13 space-y-2 p-3">
                            <Link
                                href={isAdmin ? "/admin" : "/posts"}
                                className="block text-[16px] font-medium text-gray-700 hover:text-blue-600 pl-2"
                            >
                                All Posts
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={isAdmin ? `/admin/category/${cat.id}` : `/category/${cat.id}`}
                                    className="block text-[16px] font-medium text-gray-700 hover:text-blue-600 pl-2"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    href="/admin/category/manage"
                                    className="text-[12px] text-gray-500 hover:text-blue-500 ml-2 mt-5 block"
                                >
                                    카테고리 편집
                                </Link>
                            )}
                        </nav>
                    </>
                )}
                {user && (
                    <div className="text-sm text-gray-600 px-2 space-y-1 mt-8">
                        <Link href="/admin/profile" className="block hover:text-blue-500">
                            내 정보 수정하기
                        </Link>
                        {isAdmin && (
                            <Link href="/admin/settings" className="block hover:text-blue-500">
                                회원 검색
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}