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
  ClipboardIcon,
  GalleryVerticalEndIcon,
  ImageIcon,
  LayoutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TutorialsPage() {
  const { t } = useTranslation("common");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const tutorialsList = [
    {
      icon: <BookOpenIcon className="h-8 w-8" />,
      title: t("tutorials.gettingStarted.title"),
      description: t("tutorials.gettingStarted.description"),
      level: t("tutorials.level.beginner"),
      time: "5 min",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <CameraIcon className="h-8 w-8" />,
      title: t("tutorials.photoPreparation.title"),
      description: t("tutorials.photoPreparation.description"),
      level: t("tutorials.level.beginner"),
      time: "8 min",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <LayoutIcon className="h-8 w-8" />,
      title: t("tutorials.basicLayout.title"),
      description: t("tutorials.basicLayout.description"),
      level: t("tutorials.level.beginner"),
      time: "10 min",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      icon: <ImageIcon className="h-8 w-8" />,
      title: t("tutorials.idPhotos.title"),
      description: t("tutorials.idPhotos.description"),
      level: t("tutorials.level.intermediate"),
      time: "12 min",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: t("tutorials.groupPhotos.title"),
      description: t("tutorials.groupPhotos.description"),
      level: t("tutorials.level.intermediate"),
      time: "15 min",
      color: "bg-pink-100 text-pink-700",
    },
    {
      icon: <ClipboardIcon className="h-8 w-8" />,
      title: t("tutorials.templates.title"),
      description: t("tutorials.templates.description"),
      level: t("tutorials.level.beginner"),
      time: "7 min",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: <GalleryVerticalEndIcon className="h-8 w-8" />,
      title: t("tutorials.advancedLayout.title"),
      description: t("tutorials.advancedLayout.description"),
      level: t("tutorials.level.advanced"),
      time: "20 min",
      color: "bg-red-100 text-red-700",
    },
    {
      icon: <SettingsIcon className="h-8 w-8" />,
      title: t("tutorials.customSettings.title"),
      description: t("tutorials.customSettings.description"),
      level: t("tutorials.level.advanced"),
      time: "18 min",
      color: "bg-teal-100 text-teal-700",
    },
  ];

  // 过滤级别数据
  const filterOptions = [
    { id: "all", label: t("tutorials.filter.all") },
    { id: "beginner", label: t("tutorials.filter.beginner") },
    { id: "intermediate", label: t("tutorials.filter.intermediate") },
    { id: "advanced", label: t("tutorials.filter.advanced") },
  ];

  // 过滤后的教程列表
  const filteredTutorials = tutorialsList.filter((tutorial) => {
    // 搜索条件：标题或描述包含搜索词
    const matchesSearch =
      searchTerm === "" ||
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());

    // 级别过滤
    const matchesFilter =
      activeFilter === "all" ||
      tutorial.level.includes(
        activeFilter === "beginner"
          ? "初级"
          : activeFilter === "intermediate"
          ? "中级"
          : activeFilter === "advanced"
          ? "高级"
          : ""
      );

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("tutorials.pageTitle")}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t("tutorials.pageDescription")}
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
              placeholder={t("tutorials.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
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
                ${
                  index === 0
                    ? "rounded-l-md rounded-r-none"
                    : index === filterOptions.length - 1
                    ? "rounded-r-md rounded-l-none"
                    : "rounded-none"
                } 
                ${index !== filterOptions.length - 1 ? "border-r-0" : ""}
                ${
                  activeFilter === option.id
                    ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                    : "bg-white"
                }
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
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tutorial.color}`}
                >
                  {tutorial.icon}
                </div>
                <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
                    {tutorial.level}
                  </span>
                  <span className="text-sm">{tutorial.time}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Content removed to avoid duplication with CardDescription */}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {t("tutorials.viewTutorial")}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">{t("tutorials.noResults")}</p>
          </div>
        )}
      </div>

      {/* Request Tutorial Section */}
      <div className="mt-20 bg-indigo-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("tutorials.requestTitle")}
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {t("tutorials.requestDescription")}
        </p>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
          {t("tutorials.requestButton")}
        </Button>
      </div>
    </div>
  );
}
