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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAPER_SIZES, PRESET_SIZES, usePreviewStore, SETTINGS_CONFIG } from "@/store/previewStore";
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
    pixelRatio,
    setPixelRatio,
    imageQuality,
    setImageQuality,
    ratioToSizeMap,
    updateRatioMap,
    pageMarginUnit,
    setPageMarginUnit,
    doubleSided,
    setDoubleSided,
    spacing,
    setSpacing,
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">页边距</label>
              <span className="text-sm text-gray-500">
                {pageMargin}{pageMarginUnit}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[pageMargin]}
                onValueChange={([value]) => setPageMargin(value)}
                max={SETTINGS_CONFIG.pageMargin.max}
                min={SETTINGS_CONFIG.pageMargin.min}
                step={SETTINGS_CONFIG.pageMargin.step}
                className="flex-1"
              />
              <RadioGroup
                value={pageMarginUnit}
                onValueChange={(value: 'mm' | 'px') => setPageMarginUnit(value)}
                className="flex gap-2"
              >
                {SETTINGS_CONFIG.pageMarginUnit.options.map((unit) => (
                  <div key={unit} className="flex items-center space-x-1">
                    <RadioGroupItem value={unit} id={`unit-${unit}`} />
                    <label htmlFor={`unit-${unit}`} className="text-sm">
                      {unit}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">照片间隔</label>
              <span className="text-sm text-gray-500">
                {spacing}mm
              </span>
            </div>
            <Slider
              value={[spacing]}
              onValueChange={([value]) => setSpacing(value)}
              max={SETTINGS_CONFIG.spacing.max}
              min={SETTINGS_CONFIG.spacing.min}
              step={SETTINGS_CONFIG.spacing.step}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">自动布局</label>
              <Switch
                checked={autoLayout}
                onCheckedChange={(checked) => setAutoLayout(checked)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">双面打印</label>
              <Switch
                checked={doubleSided}
                onCheckedChange={(checked) => setDoubleSided(checked)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">像素比</label>
              <span className="text-sm text-gray-500">
                {pixelRatio}x
              </span>
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
