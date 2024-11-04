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
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";

const SettingsPanel: FC = () => {
  const {
    paperLandscape,
    setPaperLandscape,
    setPaperSize,
    pageMargin,
    setPageMargin,
  } = usePreviewStore();

  return (
    <div className="p-4 bg-white rounded-lg shadow sticky top-4 z-50">
      <h2 className="text-lg font-semibold mb-4">设置</h2>
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
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;
