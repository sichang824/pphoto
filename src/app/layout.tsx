import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "照片打印排版工具 | Photo Print Layout Tool",
  description: "一个帮助用户轻松实现照片在不同尺寸打印纸张上智能排版的工具。支持多种照片尺寸（1寸、2寸、证件照等）和打印纸张规格（A4、A3等），提供智能排版预览和自动优化功能。 | A tool that helps users easily layout photos on different sizes of printing paper. Supports various photo sizes (ID photos, passport photos, etc.) and paper formats (A4, A3, etc.), with intelligent preview and auto-optimization features.",
  keywords: [
    "照片打印", "排版工具", "智能排版", "照片排版", "证件照打印", "A4打印", "照片工具",
    "photo print", "layout tool", "smart layout", "photo layout", "ID photo print", "A4 printing", "photo tool"
  ],
  authors: [{ name: "Photo Print Layout Tool" }],
  creator: "Photo Print Layout Tool",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
