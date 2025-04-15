"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { VT323 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const pixelFont = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function MainHeader() {
  const { t } = useTranslation("common");

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.features"), href: "/features" },
    { label: t("nav.tutorials"), href: "/tutorials" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md backdrop-blur-md bg-white/80 sticky top-0 z-50">
      <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="PPhoto Logo" width={40} height={40} />
            <span className={`${pixelFont.className} text-4xl font-bold`}>
            {t("app.title")}
          </span>
          </div>
        </Link>
      </div>
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="hover:text-indigo-600 transition duration-200"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center">
        <LanguageSwitcher />
        <Link href="/editor">
          <Button className="bg-indigo-600 text-white hover:bg-indigo-500 ml-4">
            {t("nav.openEditor")}
          </Button>
        </Link>
      </div>
    </header>
  );
}
