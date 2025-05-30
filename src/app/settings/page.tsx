'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function SettingsPage() {
    const { data: session } = useSession();

    const [name, setName] = useState(session?.user?.name || '');
    const [image, setImage] = useState(session?.user?.image || '');

    if (!session) return <p>로그인 후 이용 가능합니다.</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, image }),
        });
        alert('수정되었습니다.');
    };

    const handleDelete = async () => {
        const confirmDelete = confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
        if (!confirmDelete) return;

        const res = await fetch('/api/user/delete', { method: 'DELETE' });

        if (res.ok) {
            await signOut({ callbackUrl: '/' });
        } else {
            alert('탈퇴에 실패했습니다.');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-6">
            <h1 className="text-2xl font-bold">내 정보 수정</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-1">이름</label>
                    <input
                        className="w-full border p-2 rounded"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1">프로필 이미지 URL</label>
                    <input
                        className="w-full border p-2 rounded"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                        저장
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        탈퇴
                    </button>
                </div>
            </form>
        </div>
    );
}