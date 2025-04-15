"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpenIcon,
  Code2Icon,
  GithubIcon,
  HeartIcon,
  MailIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* About Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("about.pageTitle", "关于这个项目")}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t(
            "about.pageDescription",
            "一个为摄影爱好者和普通用户设计的免费照片打印排版工具，帮助您轻松解决照片打印问题。"
          )}
        </p>
      </div>

      {/* Developer Story */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.developerStory.title", "开发者的话")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg h-64 bg-indigo-50 flex items-center justify-center p-6">
              <div className="max-w-md text-center">
                <Code2Icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <p className="text-indigo-700 font-medium italic">
                  {t(
                    "about.developerQuote",
                    "作为一名摄影爱好者和开发者，我创建这个工具是为了解决自己遇到的实际问题。希望它也能帮到你！"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-700 mb-4">
              {t(
                "about.developerStory.paragraph1",
                "照片打印排版工具（PPhoto）是我个人开发的项目，源于我自己经常需要打印照片时遇到的困扰。我发现市场上缺乏一款简单、免费且高效的工具来帮助普通人解决照片排版打印问题。"
              )}
            </p>
            <p className="text-gray-700 mb-4">
              {t(
                "about.developerStory.paragraph2",
                "这个项目使用 Next.js 和现代前端技术构建，完全在浏览器中运行，无需安装任何软件。所有照片处理都在本地完成，不会上传到任何服务器，保证您的隐私安全。"
              )}
            </p>
            <p className="text-gray-700">
              {t(
                "about.developerStory.paragraph3",
                "作为个人开发者，我致力于不断改进这个工具。如果您有任何建议或反馈，欢迎随时联系我！"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* My Mission */}
      <div className="bg-indigo-50 rounded-xl p-8 text-center mb-20">
        <HeartIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("about.mission.title", "项目理念")}
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          {t(
            "about.mission.description",
            "我相信好的工具应该是简单、实用且免费的。PPhoto 的核心理念是帮助用户节省时间和纸张，让照片打印变得简单愉快。无论是打印证件照、纪念照还是艺术作品，都能轻松完成。"
          )}
        </p>
      </div>

      {/* Features Overview */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.keyFeatures.title", "核心功能")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <BookOpenIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-center mb-2">
                {t("about.keyFeatures.feature1.title", "简单易用")}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t(
                  "about.keyFeatures.feature1.description",
                  "直观的界面设计，无需专业知识，几分钟即可完成照片排版。"
                )}
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
                {t("about.keyFeatures.feature2.title", "灵活排版")}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t(
                  "about.keyFeatures.feature2.description",
                  "支持多种纸张和照片尺寸，自动计算最佳排列方式。"
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <HeartIcon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-center mb-2">
                {t("about.keyFeatures.feature3.title", "完全免费")}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t(
                  "about.keyFeatures.feature3.description",
                  "所有功能完全免费使用，没有水印，没有隐藏收费。"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact & Connect Section */}
      <div className="bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.contact.title", "联系与关注")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <MailIcon className="h-10 w-10 text-indigo-600 mb-3" />
            <h3 className="font-medium text-lg mb-2">
              {t("about.contact.email", "电子邮件")}
            </h3>
            <a
              href="mailto:zhaoanke@163.com"
              className="text-indigo-600 hover:underline"
            >
              zhaoanke@163.com
            </a>
          </div>

          <div className="flex flex-col items-center text-center">
            <GithubIcon className="h-10 w-10 text-indigo-600 mb-3" />
            <h3 className="font-medium text-lg mb-2">
              {t("about.contact.github", "GitHub")}
            </h3>
            <a
              href="https://github.com/sichang824/pphoto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              sichang824/pphoto
            </a>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="h-10 w-10 flex items-center justify-center mb-3">
              <Image
                src="/logo.png"
                alt="Xiaohongshu icon"
                width={40}
                height={40}
              />
            </div>
            <h3 className="font-medium text-lg mb-2">
              {t("about.contact.xiaohongshu", "小红书")}
            </h3>
            <div className="w-32 h-32 bg-white p-1 border border-gray-200 rounded-md shadow-sm">
              <Image
                src="/rednote.png"
                alt="Xiaohongshu QR Code"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t("about.contact.scanToFollow", "扫码关注")}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("about.faq.title", "常见问题")}
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">
              {t("about.faq.q1", "这个工具是免费使用的吗？")}
            </h3>
            <p className="text-gray-700">
              {t(
                "about.faq.a1",
                "是的，完全免费。这是我的个人项目，旨在帮助有照片打印需求的人。"
              )}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">
              {t("about.faq.q2", "我需要安装什么软件吗？")}
            </h3>
            <p className="text-gray-700">
              {t(
                "about.faq.a2",
                "不需要，直接在浏览器中使用即可，无需下载或安装任何软件。支持电脑、平板和手机。"
              )}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">
              {t("about.faq.q3", "我的照片会上传到服务器吗？")}
            </h3>
            <p className="text-gray-700">
              {t(
                "about.faq.a3",
                "不会。所有照片处理都在您的浏览器本地完成，不会上传到任何服务器，确保您的隐私安全。"
              )}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">
              {t("about.faq.q4", "如何支持这个项目？")}
            </h3>
            <p className="text-gray-700">
              {t(
                "about.faq.a4",
                "您可以通过分享给更多需要的人、提供使用反馈或在小红书关注我来支持这个项目。如果您是开发者，也欢迎在GitHub上贡献代码。"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
