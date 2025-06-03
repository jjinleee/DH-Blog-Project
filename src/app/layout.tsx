import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProviderWrapper } from "./SessionProviderWrapper";
import "./globals.css";
import BackButton from "@/components/ui/BackButton"; // 👈 새로 만든 컴포넌트
import Sidebar from '@/components/layout/Sidebar';
import { prisma } from "@/lib/prisma";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hanaro Blog",
  description: "블로그 프로젝트",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany();

  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SessionProviderWrapper>
        <div className="flex h-screen">
          <Sidebar categories={categories} />
          <div className="flex-1 overflow-y-auto p-6 relative">
            <BackButton />
            {children}
          </div>
        </div>
      </SessionProviderWrapper>
      </body>
      </html>
  );
}