'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

interface Category {
    id: string;
    name: string;
}

export default function SidebarWrapper({ categories }: { categories: Category[] }) {
    const pathname = usePathname();
    const hideSidebar = ['/', '/login', '/signup'].includes(pathname);

    if (hideSidebar) return null;

    return <Sidebar categories={categories} />;
}