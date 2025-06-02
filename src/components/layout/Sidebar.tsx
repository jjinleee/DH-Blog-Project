import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Sidebar() {
    const session = await getServerSession(authOptions);
    const user = session?.user?.email
        ? await prisma.user.findUnique({ where: { email: session.user.email } })
        : null;
    const categories = await prisma.category.findMany();

    return (
        <aside className="w-65 bg-white border-r shadow-md p-6">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex flex-col items-center mt-6">
                        <img
                            src={user?.image || "/images/admin-profile.png"}
                            alt={user?.name ? `${user.name}의 프로필 이미지` : "기본 프로필 이미지"}
                            className="w-24 h-24 rounded-full object-cover mb-3"
                        />
                        <p className="font-semibold text-[18px] text-base">{user?.name ?? '로그인필요'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    <nav className="mt-13 space-y-2 p-3">
                        <Link href="/admin" className="block text-[16px] font-medium text-gray-700 hover:text-blue-600 pl-2">
                            All Posts
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/admin/category/${cat.id}`}
                                className="block text-[16px] font-medium text-gray-700 hover:text-blue-600 pl-2"
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin/category/manage"
                            className="text-[12px] text-gray-500 hover:text-blue-500 ml-2 mt-5 block"
                        >
                            카테고리 편집
                        </Link>
                    </nav>
                </div>

                <div className="text-sm text-gray-600 px-2 space-y-1 mt-8">
                    <Link href="/admin/profile" className="block hover:text-blue-500">
                        내 정보 수정하기
                    </Link>
                    <Link href="/admin/settings" className="block hover:text-blue-500">
                        회원 검색
                    </Link>
                </div>
            </div>
        </aside>
    );
}