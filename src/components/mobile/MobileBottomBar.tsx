"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC, useRef, useState } from "react";
import { 
  Image, 
  Settings, 
  Palette, 
  FileDown,
  Printer,
  Layers,
  FileImage,
  LayoutGrid
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MobileBottomBarProps {
  onSelect: (tab: string) => void;
}

const MobileBottomBar: FC<MobileBottomBarProps> = ({ onSelect }) => {
  const { t } = useTranslation(["common", "editor"]);
  
  const items = [
    { id: "photo", icon: <FileImage className="h-5 w-5" />, label: "照片" },
    { id: "paper", icon: <Image className="h-5 w-5" />, label: "纸张" },
    { id: "layout", icon: <LayoutGrid className="h-5 w-5" />, label: "布局" },
    { id: "quality", icon: <Layers className="h-5 w-5" />, label: "质量" },
    { id: "theme", icon: <Palette className="h-5 w-5" />, label: "主题" },
    { id: "export", icon: <FileDown className="h-5 w-5" />, label: "导出" },
    { id: "settings", icon: <Settings className="h-5 w-5" />, label: "设置" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 h-16">
      <ScrollArea className="w-full h-full">
        <div className="flex items-center px-2 h-full">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="flex flex-col items-center justify-center h-14 w-16 rounded-none"
              onClick={() => onSelect(item.id)}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default MobileBottomBar;
