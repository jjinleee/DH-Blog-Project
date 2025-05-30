// app/admin/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // 아직 세션 확인 중
        if (!session || session.user?.role !== 'ADMIN') {
            router.replace('/'); // 관리자 아니면 홈으로 이동
        }
    }, [session, status, router]);

    if (status === 'loading' || session?.user?.role !== 'ADMIN') {
        return <p className="p-6">접근 권한 확인 중...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">관리자 페이지</h1>
            <p>안녕하세요, {session.user?.name}님!</p>
            <p>이 페이지는 관리자만 접근 가능합니다.</p>
            <div className="mt-6 space-y-4">
                <button
                  onClick={() => router.push('/admin/write')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  글쓰기
                </button>
                <button
                  onClick={() => router.push('/admin/settings')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  관리자 설정
                </button>
            </div>
        </div>
    );
}