"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageIcon, LayoutIcon, RocketIcon, SmileIcon } from "lucide-react";
import { motion } from "motion/react";
import { VT323 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const pixelFont = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <div
      className={`${pixelFont.className} bg-[url('/mosaic-bg.png')] bg-repeat text-gray-800 font-sans overflow-x-hidden`}
    >
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
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            🚀 {t("app.slogan")}
          </p>
          <p className="max-w-xl mx-auto text-gray-500 mb-8">
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
          <div className="mx-auto w-full max-w-5xl rounded-2xl shadow-2xl border-4 border-indigo-100 bg-gray-100">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    <Image
                      src="/preview.png"
                      alt="PPhoto"
                      fill
                      className="object-cover"
                      quality={95}
                      priority
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
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
    </div>
  );
}
