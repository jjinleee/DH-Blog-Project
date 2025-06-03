'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function AdminProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
  }, [session]);

  const handleBasicInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image }),
    });
    if (res.ok) {
      const data = await res.json();
      await update({ name: data.name, image: data.image });
      router.refresh();
    } else {
      alert('기본 정보 수정 실패');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, currentPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/login');
    } else {
      if (data.field === 'currentPassword') {
        setError('비밀번호가 다릅니다');
      } else {
        alert('비밀번호 변경 실패');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Profile Update</h1>
      <form onSubmit={handleBasicInfoUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">프로필 이미지</label>
          <label className="w-24 h-24 border rounded overflow-hidden cursor-pointer mb-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 text-3xl">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              '+'
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          기본 정보 수정
        </button>
      </form>
      <form onSubmit={handlePasswordChange} className="space-y-4 mt-6 border-t pt-4">
        <h1 className="text-xl font-bold mb-4">Password Update</h1>

        <div>
          <label className="block mb-1">현재 비밀번호</label>
          <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
          />
          {error && <p className="text-red-500 text-sm mt-0.5">{error}</p>}
        </div>
        <div>
          <label className="block mb-1">새 비밀번호</label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          비밀번호 변경
        </button>
      </form>
      <div className="mt-6 space-y-2">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full text-sm text-gray-600 hover:underline"
        >
          로그아웃
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full text-sm text-blue-600 hover:underline"
        >
          탈퇴하기
        </button>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-7 rounded shadow-lg space-y-4 max-w-sm w-full">
            <h2 className=" font-semibold">로그아웃 하시겠습니까?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-7 rounded shadow-lg space-y-4 max-w-sm w-full">
            <h2 className="font-semibold">정말로 탈퇴하시겠습니까?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await fetch('/api/user/delete', { method: 'DELETE' });
                  if (res.ok) {
                    window.location.href = '/';
                  } else {
                    alert('탈퇴 실패');
                  }
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  탈퇴하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}