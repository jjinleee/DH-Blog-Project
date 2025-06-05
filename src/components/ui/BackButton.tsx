'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname==='/admin' || pathname=='/') return null;

    return (
        <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-10"
        >
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    );
}