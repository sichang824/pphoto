import LanguageHtmlAttrs from "@/components/LanguageHtmlAttrs";
import Providers from "@/components/Providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Photo Print Layout Tool",
  description:
    "A tool that helps users easily layout photos on different sizes of printing paper. Supports various photo sizes (ID photos, passport photos, etc.) and paper formats (A4, A3, etc.), with intelligent preview and auto-optimization features.",
  keywords: [
    "photo print",
    "layout tool",
    "smart layout",
    "photo layout",
    "ID photo print",
    "A4 printing",
    "photo tool",
  ],
  authors: [{ name: "Photo Print Layout Tool" }],
  creator: "Photo Print Layout Tool",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageHtmlAttrs>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </LanguageHtmlAttrs>
  );
}
