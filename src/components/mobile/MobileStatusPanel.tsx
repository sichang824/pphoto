"use client";

import { FC } from "react";
import { usePreviewStore } from "@/store/previewStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const MobileStatusPanel: FC = () => {
  const {
    paperSize,
    paperLandscape,
    pageMargin,
    previewItems,
    autoLayout,
    doubleSided,
    enableRatioMap,
    paperScale,
    pixelRatio,
    imageQuality,
  } = usePreviewStore();

  // Calculate photo ratio types
  const photoRatioTypes = previewItems.reduce((acc, item) => {
    if (item.width && item.height) {
      const ratio = Math.round((item.width / item.height) * 10) / 10;
      if (!acc.includes(ratio)) acc.push(ratio);
    }
    return acc;
  }, [] as number[]);

  return (
    <ScrollArea className="w-full">
      <div className="space-y-4 pr-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">纸张信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">纸张大小：</span>
                <span className="text-sm font-medium">{paperSize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">打印方向：</span>
                <span className="text-sm font-medium">{paperLandscape ? "横向" : "纵向"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">页边距：</span>
                <span className="text-sm font-medium">{pageMargin}mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">纸张缩放：</span>
                <span className="text-sm font-medium">{paperScale * 100}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">照片信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">照片数量：</span>
                <span className="text-sm font-medium">{previewItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">比例类型：</span>
                <span className="text-sm font-medium">
                  {photoRatioTypes.length > 0 ? photoRatioTypes.join(', ') : "无"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">自动布局：</span>
                <span className="text-sm font-medium">{autoLayout ? "开启" : "关闭"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">双面打印：</span>
                <span className="text-sm font-medium">{doubleSided ? "开启" : "关闭"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">输出质量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">像素比：</span>
                <span className="text-sm font-medium">{pixelRatio}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">图片质量：</span>
                <span className="text-sm font-medium">{imageQuality}%</span>
              </div>
              <div className="mt-1">
                <span className="text-sm">图片质量：</span>
                <Progress value={imageQuality} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default MobileStatusPanel;
