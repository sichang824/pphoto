"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePreviewStore, SETTINGS_CONFIG } from "@/store/PreviewStore";

const PaperSettings: FC = () => {
  const {
    paperSizes,
    setPaperSize,
    paperScale,
    setPaperScale,
    paperLandscape,
    setPaperLandscape,
    pageMargin,
    setPageMargin,
    pageMarginUnit,
    setPageMarginUnit,
  } = usePreviewStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">纸张</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">纸张大小</label>
          <Select defaultValue="A4" onValueChange={(value) => setPaperSize(value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择纸张大小" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(paperSizes).map(([key, size]) => (
                <SelectItem key={key} value={key}>
                  {key} ({size.width}×{size.height}mm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">纸张缩放</label>
            <span className="text-sm text-gray-500">{Math.round(paperScale * 100)}%</span>
          </div>
          <Slider
            value={[paperScale]}
            onValueChange={([value]) => setPaperScale(value)}
            max={SETTINGS_CONFIG.paperScale.max}
            min={SETTINGS_CONFIG.paperScale.min}
            step={SETTINGS_CONFIG.paperScale.step}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">预览效果，不影响打印</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">打印方向</label>
          <Select
            defaultValue={paperLandscape ? "landscape" : "portrait"}
            onValueChange={(value) => setPaperLandscape(value === "landscape")}
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
            <span className="text-sm text-gray-500">{pageMargin}{pageMarginUnit}</span>
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
      </div>
    </Card>
  );
};

export default PaperSettings;


