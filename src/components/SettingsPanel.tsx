"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PAPER_SIZES, PRESET_SIZES, usePreviewStore } from "@/store/previewStore";
import { Switch } from "./ui/switch";

const SettingsPanel: FC = () => {
  const {
    paperLandscape,
    setPaperLandscape,
    setPaperSize,
    pageMargin,
    setPageMargin,
    autoLayout,
    setAutoLayout,
    scale,
    setScale,
    imageQuality,
    setImageQuality,
    ratioToSizeMap,
    updateRatioMap,
  } = usePreviewStore();

  return (
    <>
      <h3 className="text-sm font-medium mb-2">设置</h3>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">纸张大小</label>
            <Select
              defaultValue="A4"
              onValueChange={(value) => setPaperSize(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择纸张大小" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAPER_SIZES).map(([key, size]) => (
                  <SelectItem key={key} value={key}>
                    {key} ({size.width}×{size.height}mm)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">打印方向</label>
            <Select
              defaultValue={paperLandscape ? "landscape" : "portrait"}
              onValueChange={(value) =>
                setPaperLandscape(value === "landscape")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择打印方向" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">纵向</SelectItem>
                <SelectItem value="landscape">横向</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              页边距 ({pageMargin}mm)
            </label>
            <Slider
              value={[pageMargin]}
              onValueChange={([value]) => setPageMargin(value)}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">自动布局</label>
            <Switch
              checked={autoLayout}
              onCheckedChange={(checked) => setAutoLayout(checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              导出缩放比例 ({scale}x)
            </label>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              max={4}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              图片质量 ({Math.round(imageQuality * 100)}%)
            </label>
            <Slider
              value={[imageQuality]}
              onValueChange={([value]) => setImageQuality(value)}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">比例尺寸映射</label>
            <div className="space-y-2">
              {Object.entries(ratioToSizeMap).map(([ratio, size]) => (
                <div key={ratio} className="flex items-center gap-2">
                  <span className="min-w-[60px]">{ratio}</span>
                  <Select
                    value={size.id}
                    onValueChange={(value) => {
                      const size = PRESET_SIZES.find((s) => s.id === value);
                      if (size) {
                        updateRatioMap(ratio, size);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择尺寸" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_SIZES.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name} ({size.width}×{size.height}mm)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SettingsPanel;
