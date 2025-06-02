'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setNameError('');
        setEmailError('');
        setPasswordError('');

        let hasError = false;

        if (name.length < 2) {
            setNameError('닉네임은 2자 이상이어야 합니다.');
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('유효한 이메일 형식을 입력해주세요.');
            hasError = true;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"<>,.?~\\/-]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('비밀번호는 영문, 숫자, 특수기호 포함 8자 이상이어야 합니다.');
            hasError = true;
        }

        if (hasError) return;

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            if (data.message.includes('이미 존재하는 이메일')) {
                setEmailError('이미 사용 중인 이메일입니다.');
            } else if (data.message.includes('이미 존재하는 닉네임')) {
                setNameError('이미 사용 중인 닉네임입니다.');
            } else {
                alert('회원가입 실패: ' + data.message);
            }
            return;
        }

        router.push('/login');
    };

    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
              />
              {nameError && <p className="text-red-500 text-sm -mt-1">{nameError}</p>}
            </div>
            <div className="space-y-1">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
              />
              {emailError && <p className="text-red-500 text-sm -mt-1">{emailError}</p>}
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
            />
            {passwordError && <p className="text-red-500 text-sm -mt-1">{passwordError}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    );
}