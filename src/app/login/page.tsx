'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">로그인</h1>
            <Button onClick={() => signIn('github')}>GitHub로 로그인</Button>
        </div>
    );
}