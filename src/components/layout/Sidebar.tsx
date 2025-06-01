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
        <aside className="w-65 bg-blue-200 border-r p-10">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex flex-col items-center mt-6">
                        <img
                            src={user?.image || "/images/admin-profile.png"}
                            alt={user?.name ? `${user.name}의 프로필 이미지` : "기본 프로필 이미지"}
                            className="w-24 h-24 rounded-full object-cover"
                        />                        <p className="mt-4 font-bold text-lg">{user?.name ?? '관리자'}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>

                    <nav className="mt-15 space-y-2 p-5">
                        <Link href="/admin" className="block text-gray-800 hover:underline">
                            All Posts
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/admin/category/${cat.slug}`} className="block text-gray-700 hover:underline">
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="px-5 space-y-1 text-sm text-gray-600">
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