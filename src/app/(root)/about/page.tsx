"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpenIcon,
  Code2Icon,
  HeartIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ContactSection } from "@/components/ContactSection";

export default function AboutPage() {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* About Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("about.pageTitle")}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t("about.pageDescription")}
        </p>
      </div>

      {/* Developer Story */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.developerStory.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg h-64 bg-indigo-50 flex items-center justify-center p-6">
              <div className="max-w-md text-center">
                <Code2Icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <p className="text-indigo-700 font-medium italic">
                  {t("about.developerQuote")}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-700 mb-4">
              {t("about.developerStory.paragraph1")}
            </p>
            <p className="text-gray-700 mb-4">
              {t("about.developerStory.paragraph2")}
            </p>
            <p className="text-gray-700">
              {t("about.developerStory.paragraph3")}
            </p>
          </div>
        </div>
      </div>

      {/* My Mission */}
      <div className="bg-indigo-50 rounded-xl p-8 text-center mb-20">
        <HeartIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("about.mission.title")}
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          {t("about.mission.description")}
        </p>
      </div>

      {/* Features Overview */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.keyFeatures.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <BookOpenIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-center mb-2">
                {t("about.keyFeatures.feature1.title")}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t("about.keyFeatures.feature1.description")}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <Image
                src="/logo.png"
                alt="Layout icon"
                width={40}
                height={40}
                className="mx-auto mb-4"
              />
              <h3 className="font-bold text-lg text-center mb-2">
                {t("about.keyFeatures.feature2.title")}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t("about.keyFeatures.feature2.description")}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <HeartIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-center mb-2">
                {t("about.keyFeatures.feature3.title")}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t("about.keyFeatures.feature3.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact & Connect Section */}
      <ContactSection className="mb-20" />

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.faq.title")}
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">{t("about.faq.q1")}</h3>
            <p className="text-gray-700">{t("about.faq.a1")}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">{t("about.faq.q2")}</h3>
            <p className="text-gray-700">{t("about.faq.a2")}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">{t("about.faq.q3")}</h3>
            <p className="text-gray-700">{t("about.faq.a3")}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">{t("about.faq.q4")}</h3>
            <p className="text-gray-700">{t("about.faq.a4")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
