'use client';

import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-gray-50">
      <Link href="/login">
        <button className="bg-blue-600 text-white font-medium rounded-md px-6 py-2 hover:bg-blue-700 transition w-40">
          Login
        </button>
      </Link>
      <Link href="/signup">
        <button className="bg-white border border-blue-600 text-blue-600 font-medium rounded-md px-6 py-2 hover:bg-blue-50 transition w-40">
          Sign Up
        </button>
      </Link>
      <Link href="/posts">
        <span className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-500 transition">
          로그인 없이 사용하기
        </span>
      </Link>
    </div>
  );
}
