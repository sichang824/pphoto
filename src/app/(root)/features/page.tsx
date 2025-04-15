"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileIcon,
  ImageIcon,
  LayoutIcon,
  PencilIcon,
  PrinterIcon,
  RocketIcon,
  SaveIcon,
  ScissorsIcon,
  SearchIcon,
  SlidersIcon,
  SmileIcon,
  ZoomInIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function FeaturesPage() {
  const { t } = useTranslation("common");

  const featuresList = [
    {
      icon: <ImageIcon className="h-8 w-8" />,
      title: t("features.multipleFormats.title"),
      description: t("features.multipleFormats.description"),
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      icon: <LayoutIcon className="h-8 w-8" />,
      title: t("features.paperSizes.title"),
      description: t("features.paperSizes.description"),
      color: "bg-pink-100 text-pink-700",
    },
    {
      icon: <RocketIcon className="h-8 w-8" />,
      title: t("features.pdfExport.title"),
      description: t("features.pdfExport.description"),
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: <SmileIcon className="h-8 w-8" />,
      title: t("features.easyToUse.title"),
      description: t("features.easyToUse.description"),
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: <FileIcon className="h-8 w-8" />,
      title: t("features.templates.title"),
      description: t("features.templates.description"),
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <PencilIcon className="h-8 w-8" />,
      title: t("features.customization.title"),
      description: t("features.customization.description"),
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: <SlidersIcon className="h-8 w-8" />,
      title: t("features.optimization.title"),
      description: t("features.optimization.description"),
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <PrinterIcon className="h-8 w-8" />,
      title: t("features.batchPrinting.title"),
      description: t("features.batchPrinting.description"),
      color: "bg-red-100 text-red-700",
    },
    {
      icon: <SearchIcon className="h-8 w-8" />,
      title: t("features.preview.title"),
      description: t("features.preview.description"),
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: <ScissorsIcon className="h-8 w-8" />,
      title: t("features.crop.title"),
      description: t("features.crop.description"),
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      icon: <ZoomInIcon className="h-8 w-8" />,
      title: t("features.finetuning.title"),
      description: t("features.finetuning.description"),
      color: "bg-rose-100 text-rose-700",
    },
    {
      icon: <SaveIcon className="h-8 w-8" />,
      title: t("features.save.title"),
      description: t("features.save.description"),
      color: "bg-teal-100 text-teal-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("features.pageTitle")}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t("features.pageDescription")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {featuresList.map((feature, index) => (
          <Card
            key={index}
            className="border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}
              >
                {feature.icon}
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t("features.readyToTry")}
        </h2>
        <Link href="/editor">
          <Button
            size="lg"
            className="bg-indigo-600 text-white hover:bg-indigo-500 px-8"
          >
            {t("features.startNow")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
