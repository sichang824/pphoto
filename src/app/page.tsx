"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, LayoutIcon, RocketIcon, SmileIcon } from "lucide-react";
import { motion } from "motion/react";
import { Inter, VT323 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const pixelFont = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const { t } = useTranslation("common");

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.features"), href: "/features" },
    { label: t("nav.tutorials"), href: "/tutorials" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <main
      className={`${pixelFont.className} ${inter.className} bg-[url('/mosaic-bg.png')] bg-repeat text-gray-800 font-sans overflow-x-hidden`}
    >
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md backdrop-blur-md bg-white/80 sticky top-0 z-50">
        <div className="text-2xl font-bold text-indigo-600 animate-pulse flex items-center gap-2">
          <Image src="/logo.png" alt="PPhoto Logo" width={40} height={40} />
          <span className={`${pixelFont.className} text-4xl font-bold`}>
            {t("app.title")}
          </span>
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
          {/* "Get Started" button removed */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className={`${pixelFont.className} text-6xl md:text-8xl text-indigo-700 mb-4`}
          >
            {t("app.title")}
          </h1>
          <h2
            className={`${pixelFont.className} text-2xl md:text-3xl text-pink-500 mb-4`}
          >
            ✨ {t("app.subtitle")}
          </h2>
          <p
            className={`${inter.className} text-lg md:text-xl text-gray-600 mb-6`}
          >
            🚀 {t("app.slogan")}
          </p>
          <p
            className={`${inter.className} max-w-xl mx-auto text-gray-500 mb-8`}
          >
            {t("app.description")}
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button className="bg-pink-500 text-white text-lg px-6 py-3 hover:bg-pink-400 shadow-xl">
              <Link href="/editor">{t("hero.startLayoutNow")}</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-12"
        >
          <div className="mx-auto w-full max-w-4xl rounded-2xl shadow-2xl border-4 border-indigo-100 bg-gray-100 h-72 flex items-center justify-center">
            <p className="text-gray-500">App preview will be here</p>
          </div>
        </motion.div>

        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
        <h2 className="text-3xl font-extrabold text-center mb-12">
          ✨ {t("features.title")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <ImageIcon className="w-8 h-8" />,
              title: t("features.multipleFormats.title"),
              desc: t("features.multipleFormats.description"),
            },
            {
              icon: <LayoutIcon className="w-8 h-8" />,
              title: t("features.paperSizes.title"),
              desc: t("features.paperSizes.description"),
            },
            {
              icon: <RocketIcon className="w-8 h-8" />,
              title: t("features.pdfExport.title"),
              desc: t("features.pdfExport.description"),
            },
            {
              icon: <SmileIcon className="w-8 h-8" />,
              title: t("features.easyToUse.title"),
              desc: t("features.easyToUse.description"),
            },
          ].map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-2xl transition duration-300 border-2 border-gray-100">
                <CardContent className="p-6 text-center">
                  <div className="text-indigo-500 mb-4 mx-auto">{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 px-6 text-sm text-center text-gray-500 mt-20">
        <div>{t("footer.copyright")}</div>
      </footer>
    </main>
  );
}
