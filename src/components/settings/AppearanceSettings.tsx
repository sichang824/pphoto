"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GradientPicker } from "@/components/ui/GradientPicker";
import { usePreviewStore } from "@/store/previewStore";
import { usePhotoStore } from "@/store/PhotoStore";

const AppearanceSettings: FC = () => {
  const { showPaperBorder, setShowPaperBorder, showGuides, setShowGuides } = usePreviewStore();
  const {
    showPhotoBackground,
    setShowPhotoBackground,
    photoBackgroundColor,
    setPhotoBackgroundColor,
  } = usePhotoStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">外观</h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">显示纸张边框</label>
            <Switch checked={showPaperBorder} onCheckedChange={(checked) => setShowPaperBorder(checked)} />
          </div>
          <p className="text-sm text-gray-500">显示或隐藏纸张外边框线</p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">显示参考线</label>
            <Switch checked={showGuides} onCheckedChange={(checked) => setShowGuides(checked)} />
          </div>
          <p className="text-sm text-gray-500">显示或隐藏页边距的参考虚线</p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">显示照片背景</label>
            <Switch checked={showPhotoBackground} onCheckedChange={(checked) => setShowPhotoBackground(checked)} />
          </div>
          <p className="text-sm text-gray-500">控制图片容器的背景色显示</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">照片背景颜色</label>
          <div className={"w-full " + (!showPhotoBackground ? "opacity-50 pointer-events-none" : "")}>
            <GradientPicker className="w-full truncate" background={photoBackgroundColor} setBackground={setPhotoBackgroundColor} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppearanceSettings;


