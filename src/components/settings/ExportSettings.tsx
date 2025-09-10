"use client";

import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useDownloadStore } from "@/store/DownloadStore";
import { SETTINGS_CONFIG } from "@/store/previewStore";
import { FC } from "react";

const ExportSettings: FC = () => {
  const {
    askBeforeDownload,
    setAskBeforeDownload,
    pixelRatio,
    setPixelRatio,
    imageQuality,
    setImageQuality,
    cleanExport,
    setCleanExport,
  } = useDownloadStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">导出</h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">导出前隐藏装饰</label>
            <Switch
              checked={!!cleanExport}
              onCheckedChange={(checked) => setCleanExport?.(checked)}
            />
          </div>
          <p className="text-sm text-gray-500">
            导出前自动隐藏纸张边框、参考线和照片背景
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">弹出保存对话框</label>
            <Switch
              checked={!!askBeforeDownload}
              onCheckedChange={(checked) => setAskBeforeDownload(checked)}
            />
          </div>
          <p className="text-sm text-gray-500">
            开启：使用系统保存对话框（可选位置与文件名）；关闭：直接下载（浏览器下载栏显示进度）。
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">像素比</label>
            <span className="text-sm text-gray-500">{pixelRatio}x</span>
          </div>
          <Slider
            value={[pixelRatio]}
            onValueChange={([value]) => setPixelRatio(value)}
            max={SETTINGS_CONFIG.pixelRatio.max}
            min={SETTINGS_CONFIG.pixelRatio.min}
            step={SETTINGS_CONFIG.pixelRatio.step}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">图片质量</label>
            <span className="text-sm text-gray-500">
              {Math.round(imageQuality * 100)}%
            </span>
          </div>
          <Slider
            value={[imageQuality]}
            onValueChange={([value]) => setImageQuality(value)}
            max={SETTINGS_CONFIG.imageQuality.max}
            min={SETTINGS_CONFIG.imageQuality.min}
            step={SETTINGS_CONFIG.imageQuality.step}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default ExportSettings;
