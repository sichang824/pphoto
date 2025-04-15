"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpenIcon,
  CameraIcon,
  LayoutIcon,
  ImageIcon,
  UsersIcon,
  ClipboardIcon,
  GalleryVerticalEndIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function TutorialsPage() {
  const { t } = useTranslation("common");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.features"), href: "/features" },
    { label: t("nav.tutorials"), href: "/tutorials" },
    { label: t("nav.about"), href: "/about" },
  ];

  const tutorialsList = [
    {
      icon: <BookOpenIcon className="h-8 w-8" />,
      title: t("tutorials.gettingStarted.title", "入门指南"),
      description: t("tutorials.gettingStarted.description", "从零开始学习如何使用照片打印排版工具的基本功能"),
      level: t("tutorials.level.beginner", "初级"),
      time: "5 min",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <CameraIcon className="h-8 w-8" />,
      title: t("tutorials.photoPreparation.title", "照片准备"),
      description: t("tutorials.photoPreparation.description", "了解如何准备最适合打印的照片格式和尺寸"),
      level: t("tutorials.level.beginner", "初级"),
      time: "8 min",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <LayoutIcon className="h-8 w-8" />,
      title: t("tutorials.basicLayout.title", "基础排版"),
      description: t("tutorials.basicLayout.description", "学习如何排列和组织照片以达到最佳打印效果"),
      level: t("tutorials.level.beginner", "初级"),
      time: "10 min",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      icon: <ImageIcon className="h-8 w-8" />,
      title: t("tutorials.idPhotos.title", "证件照制作"),
      description: t("tutorials.idPhotos.description", "掌握如何快速生成各种规格的证件照并打印"),
      level: t("tutorials.level.intermediate", "中级"),
      time: "12 min",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: t("tutorials.groupPhotos.title", "批量照片处理"),
      description: t("tutorials.groupPhotos.description", "如何一次性处理和打印多张不同尺寸的照片"),
      level: t("tutorials.level.intermediate", "中级"),
      time: "15 min",
      color: "bg-pink-100 text-pink-700",
    },
    {
      icon: <ClipboardIcon className="h-8 w-8" />,
      title: t("tutorials.templates.title", "使用模板"),
      description: t("tutorials.templates.description", "利用预设模板快速完成常见的照片排版任务"),
      level: t("tutorials.level.beginner", "初级"),
      time: "7 min",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: <GalleryVerticalEndIcon className="h-8 w-8" />,
      title: t("tutorials.advancedLayout.title", "高级排版技巧"),
      description: t("tutorials.advancedLayout.description", "探索更复杂的排版策略，最大化纸张利用率"),
      level: t("tutorials.level.advanced", "高级"),
      time: "20 min",
      color: "bg-red-100 text-red-700",
    },
    {
      icon: <SettingsIcon className="h-8 w-8" />,
      title: t("tutorials.customSettings.title", "自定义设置"),
      description: t("tutorials.customSettings.description", "深入了解所有自定义选项，打造专业级打印效果"),
      level: t("tutorials.level.advanced", "高级"),
      time: "18 min",
      color: "bg-teal-100 text-teal-700",
    },
  ];

  // 过滤级别数据
  const filterOptions = [
    { id: "all", label: t("tutorials.filter.all", "全部") },
    { id: "beginner", label: t("tutorials.filter.beginner", "初级") },
    { id: "intermediate", label: t("tutorials.filter.intermediate", "中级") },
    { id: "advanced", label: t("tutorials.filter.advanced", "高级") }
  ];

  // 过滤后的教程列表
  const filteredTutorials = tutorialsList.filter(tutorial => {
    // 搜索条件：标题或描述包含搜索词
    const matchesSearch = searchTerm === "" || 
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 级别过滤
    const matchesFilter = activeFilter === "all" || 
      tutorial.level.includes(
        activeFilter === "beginner" ? "初级" : 
        activeFilter === "intermediate" ? "中级" : 
        activeFilter === "advanced" ? "高级" : ""
      );
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md backdrop-blur-md bg-white/80 sticky top-0 z-50">
        <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="PPhoto Logo" width={40} height={40} />
              <span className="text-xl font-bold">{t("app.title")}</span>
            </div>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={item.href === "/tutorials" ? "text-indigo-600 font-bold" : "hover:text-indigo-600 transition duration-200"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <Link href="/editor">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
              {t("nav.openEditor")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("tutorials.pageTitle", "使用教程")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("tutorials.pageDescription", "通过我们的分步教程，从零开始掌握照片打印排版的所有技巧。无论您是初学者还是专业用户，都能找到适合您的内容。")}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col items-center space-y-4">
          {/* 搜索框 */}
          <div className="w-full max-w-md mb-4">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t("tutorials.searchPlaceholder", "搜索教程...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 过滤按钮 */}
          <div className="inline-flex rounded-md shadow-sm">
            {filterOptions.map((option, index) => (
              <Button
                key={option.id}
                variant="outline"
                className={`
                  ${index === 0 ? "rounded-l-md rounded-r-none" : 
                    index === filterOptions.length - 1 ? "rounded-r-md rounded-l-none" : 
                    "rounded-none"} 
                  ${index !== filterOptions.length - 1 ? "border-r-0" : ""}
                  ${activeFilter === option.id ? "bg-indigo-100 text-indigo-700 border-indigo-300" : "bg-white"}
                `}
                onClick={() => setActiveFilter(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tutorial, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tutorial.color}`}>
                  {tutorial.icon}
                </div>
                <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm px-2 py-1 rounded-full bg-gray-100">{tutorial.level}</span>
                  <span className="text-sm">{tutorial.time}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Content removed to avoid duplication with CardDescription */}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {t("tutorials.viewTutorial", "查看教程")}
                </Button>
              </CardFooter>
            </Card>
          ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">
                {t("tutorials.noResults", "没有找到匹配的教程")}
              </p>
            </div>
          )}
        </div>

        {/* Request Tutorial Section */}
        <div className="mt-20 bg-indigo-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t("tutorials.requestTitle", "没有找到您需要的教程？")}
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t("tutorials.requestDescription", "我们不断添加新的教程内容。如果您有特定需求，请告诉我们，我们会考虑添加到我们的教程库中。")}
          </p>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
            {t("tutorials.requestButton", "请求新教程")}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 px-6 text-center text-gray-500 mt-20">
        <div>{t("footer.copyright")}</div>
      </footer>
    </div>
  );
}
