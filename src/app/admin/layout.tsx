
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
    );
}