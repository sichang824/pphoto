"use client";

import { useThemeColor } from "@/lib/useThemeColor";
import { cn } from "@/lib/utils";
import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout: FC<MobileLayoutProps> = ({ children }) => {
  useThemeColor();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* 移动端导航栏 */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center">
          <Link href="/" className="mr-3">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-medium">照片打印工具</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* 侧边菜单 - 只有在menuOpen为true时才显示 */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={cn(
            "absolute top-0 right-0 w-2/3 h-full bg-white shadow-lg transition-transform",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">设置</h2>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/features"
                className="block p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                功能介绍
              </Link>
              <Link
                href="/tutorials"
                className="block p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                使用教程
              </Link>
              <Link
                href="/about"
                className="block p-3 hover:bg-gray-100 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                关于我们
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default MobileLayout;
