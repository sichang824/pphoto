"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { motion } from "motion/react";
import { 
  Image, 
  Settings, 
  Palette, 
  ChevronLeft, 
  ChevronRight,
  FilePlus2,
  Printer,
  ImagePlus,
  Layout,
  FileText,
  PaintBucket,
  LayoutGrid,
  SquareStack,
  Maximize,
  Move,
  Ruler,
  FlipHorizontal
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePreviewStore } from "@/store/previewStore";

interface MobileControlBarProps {
  onOpenDrawer: (tab: string) => void;
  onBatchSelect: () => void;
  onPrint: () => void;
  onPrintPdf: () => void;
}

interface OptionGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const OptionGroup: FC<OptionGroupProps> = ({ title, icon, children }) => {
  return (
    <div className="flex flex-col items-center mr-2">
      <div className="flex items-center space-x-1 mb-1.5">
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </div>
      <div className="flex space-x-1.5">
        {children}
      </div>
    </div>
  );
};

const MobileControlBar: FC<MobileControlBarProps> = ({
  onOpenDrawer,
  onBatchSelect,
  onPrint,
  onPrintPdf
}) => {
  const { t } = useTranslation(["common", "editor"]);
  const [scrollPos, setScrollPos] = useState(0);
  const maxScroll = 600; // Adjusted for more content
  
  // Get store state for displaying current values
  const { 
    paperSize,
    paperLandscape,
    previewItems,
    ratioToSizeMap,
    enableRatioMap,
    themeColor
  } = usePreviewStore();
  
  // Calculate photo ratio types
  const photoRatioTypes = previewItems.reduce((acc, item) => {
    if (item.width && item.height) {
      const ratio = Math.round((item.width / item.height) * 10) / 10;
      if (!acc.includes(ratio)) acc.push(ratio);
    }
    return acc;
  }, [] as number[]);

  const handleScroll = (direction: "left" | "right") => {
    const newPos = direction === "left" 
      ? Math.max(scrollPos - 120, 0)
      : Math.min(scrollPos + 120, maxScroll);
    setScrollPos(newPos);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      {/* Debug message */}
      <div className="bg-red-100 p-1 text-xs text-center">控制栏已加载</div>
      
      <div className="flex items-center h-16 px-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 flex-shrink-0"
          onClick={() => handleScroll("left")}
          disabled={scrollPos <= 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 overflow-hidden relative">
          <motion.div 
            className="flex items-center absolute left-0 py-1"
            animate={{ x: -scrollPos }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Primary Actions */}
            <OptionGroup title="操作" icon={<Settings className="h-4 w-4" />}>
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={onBatchSelect}
              >
                <Image className="h-5 w-5 mb-0.5" />
                <span className="text-xs">选择照片</span>
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={onPrint}
              >
                <Printer className="h-5 w-5 mb-0.5" />
                <span className="text-xs">打印</span>
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={onPrintPdf}
              >
                <FilePlus2 className="h-5 w-5 mb-0.5" />
                <span className="text-xs">导出PDF</span>
              </Button>
            </OptionGroup>

            {/* Image Sizes */}
            <OptionGroup title="照片尺寸" icon={<ImagePlus className="h-4 w-4" />}>
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("photo-size")}
              >
                <LayoutGrid className="h-5 w-5 mb-0.5" />
                <span className="text-xs">标准尺寸</span>
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("custom-size")}
              >
                <Maximize className="h-5 w-5 mb-0.5" />
                <span className="text-xs">自定义</span>
              </Button>
            </OptionGroup>
            
            {/* Status Info */}
            <OptionGroup title="状态信息" icon={<FileText className="h-4 w-4" />}>
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("status")}
              >
                <div className="h-5 w-5 mb-0.5 flex items-center justify-center">ℹ️</div>
                <span className="text-xs">详情</span>
              </Button>
              <div className="bg-gray-50 rounded-lg p-2 text-xs">
                <div className="flex flex-col">
                  <span>纸张：{paperSize} {paperLandscape ? "横向" : "纵向"}</span>
                  <span>比例类型：{photoRatioTypes.length > 0 ? photoRatioTypes.join(', ') : "无"}</span>
                  <span>照片数量：{previewItems.length}</span>
                </div>
              </div>
            </OptionGroup>
            
            {/* Theme Settings */}
            <OptionGroup title="样式设置" icon={<Palette className="h-4 w-4" />}>
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("themes")}
              >
                <PaintBucket className="h-5 w-5 mb-0.5" />
                <span className="text-xs">主题</span>
              </Button>
              <div className="rounded-full h-8 w-8 border border-gray-200 flex items-center justify-center overflow-hidden mt-1.5" style={{ backgroundColor: themeColor || '#09203f' }} onClick={() => onOpenDrawer("theme-color")}>
              </div>
            </OptionGroup>
            
            {/* Paper Settings */}
            <OptionGroup title="纸张设置" icon={<Layout className="h-4 w-4" />}>
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("paper-settings")}
              >
                <SquareStack className="h-5 w-5 mb-0.5" />
                <span className="text-xs">纸张尺寸</span>
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("paper-settings")}
              >
                <Move className="h-5 w-5 mb-0.5" />
                <span className="text-xs">缩放</span>
              </Button>
            </OptionGroup>
            
            {/* Layout Settings */}
            <OptionGroup title="布局设置" icon={<LayoutGrid className="h-4 w-4" />}>
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("layout-settings")}
              >
                <Ruler className="h-5 w-5 mb-0.5" />
                <span className="text-xs">页边距</span>
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-full flex flex-col items-center p-2 h-auto"
                onClick={() => onOpenDrawer("layout-settings")}
              >
                <FlipHorizontal className="h-5 w-5 mb-0.5" />
                <span className="text-xs">双面打印</span>
              </Button>
            </OptionGroup>
            
            {/* All Settings */}
            <Button
              variant="ghost"
              className="rounded-full flex flex-col items-center p-2 h-auto ml-2"
              onClick={() => onOpenDrawer("settings")}
            >
              <Settings className="h-5 w-5 mb-0.5" />
              <span className="text-xs">全部设置</span>
            </Button>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 flex-shrink-0"
          onClick={() => handleScroll("right")}
          disabled={scrollPos >= maxScroll}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MobileControlBar;
