"use client";

import { pixelFont } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { ImageIcon, LayoutIcon, RocketIcon, SmileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const { t } = useTranslation("common");
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Create an array of useInView hooks for the features
  const featureRefs = [
    useInView({ triggerOnce: true, threshold: 0.3 }),
    useInView({ triggerOnce: true, threshold: 0.3 }),
    useInView({ triggerOnce: true, threshold: 0.3 }),
    useInView({ triggerOnce: true, threshold: 0.3 }),
  ];

  useEffect(() => {
    async function fetchPreviewImages() {
      try {
        const response = await fetch("/api/preview-images");
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setPreviewImages(data.images);
        } else {
          setPreviewImages(["/preview/preview1.png", "/preview/preview2.png"]);
        }
      } catch (error) {
        console.error("Failed to fetch preview images:", error);
        setPreviewImages(["/preview/preview1.png", "/preview/preview2.png"]);
      } finally {
        setLoading(false);
      }
    }

    fetchPreviewImages();
  }, []);

  useEffect(() => {
    if (!api) return;
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api]);
  return (
    <div className="text-gray-800 font-sans overflow-x-hidden">
      {/* Celebration Banner */}
      <motion.div
        className="fixed top-16 left-4 right-4 z-50 bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-6 px-8 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm border border-red-400/30"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background:
            "linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(185, 28, 28, 0.95), rgba(153, 27, 27, 0.95))",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-visible">
              <Image
                src="/zgrmkrzz.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-[80px] h-[80px] object-cover scale-150"
              />
            </div>
          </motion.div>

          <div className="flex-1 text-center mx-4">
            <motion.h1
              className="text-white text-xl md:text-2xl font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎉 纪念中国人民抗日战争暨世界反法西斯战争胜利80周年 🎉
            </motion.h1>
            <motion.p
              className="text-red-100 text-sm md:text-base mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              铭记历史、勿忘国耻、吾辈自强
            </motion.p>
          </div>

          <div className="flex-shrink-0 w-12 md:w-16"></div>
        </div>

        {/* Blur effects */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-10 -left-10 w-40 h-40 bg-red-400 opacity-30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-5 right-10 w-32 h-32 bg-red-300 opacity-40 rounded-full blur-xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-0 left-1/3 w-24 h-24 bg-red-500 opacity-25 rounded-full blur-2xl"
        />
      </motion.div>

      {/* Hero Section */}
      <section
        className={`${pixelFont.className} text-center py-20 px-6 relative overflow-hidden`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <motion.div
            className="text-6xl md:text-8xl text-indigo-700 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TypeAnimation
              sequence={[t("app.title")]}
              wrapper="span"
              speed={50}
              style={{ display: "inline-block" }}
              cursor={false}
            />
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl text-pink-500 mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            ✨ {t("app.subtitle")}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <TypeAnimation
              sequence={[t("app.slogan")]}
              wrapper="span"
              speed={50}
              style={{ display: "inline-block" }}
              cursor={false}
            />
          </motion.p>

          <motion.p
            className="max-w-xl mx-auto text-gray-500 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {t("app.description")}
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
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
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              setApi={setApi}
              className="w-full relative"
            >
              <CarouselContent>
                {loading ? (
                  <CarouselItem>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center bg-gray-200">
                      <div className="animate-pulse">Loading...</div>
                    </div>
                  </CarouselItem>
                ) : (
                  previewImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        <Image
                          src={image}
                          alt="PPhoto"
                          fill
                          className="object-cover"
                          quality={95}
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white" />
            </Carousel>
          </div>
        </motion.div>

        {/* Background effects */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200 opacity-20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
        <motion.h2
          className="text-3xl font-extrabold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✨ {t("features.title")}
        </motion.h2>

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
          ].map((f, idx) => {
            // Use the pre-created hooks from the array
            const { ref, inView } = featureRefs[idx];

            return (
              <motion.div
                ref={ref}
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Card className="transition duration-300 border-2 border-gray-100 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="text-indigo-500 mb-4 mx-auto"
                      whileHover={{ rotate: 10, scale: 1.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {f.icon}
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-gray-600 text-sm">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
