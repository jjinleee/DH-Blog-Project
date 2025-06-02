import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProviderWrapper } from "./SessionProviderWrapper";
import "./globals.css";
import BackButton from "@/components/ui/BackButton"; // 👈 새로 만든 컴포넌트

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hanaro Blog",
  description: "블로그 프로젝트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SessionProviderWrapper>
        <div className="relative">
          <BackButton />
          {children}
        </div>
      </SessionProviderWrapper>
      </body>
      </html>
  );
}