"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePreviewStore, SETTINGS_CONFIG } from "@/store/PreviewStore";
import { usePhotoStore } from "@/store/PhotoStore";
import {
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from "lucide-react";

const LayoutSettings: FC = () => {
  const { spacing, setSpacing, autoLayout, setAutoLayout } = usePreviewStore();
  const { horizontalAlign, setHorizontalAlign, verticalAlign, setVerticalAlign } = usePhotoStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">布局</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">水平对齐</label>
          <div className="inline-flex gap-2">
            <Button
              variant={horizontalAlign === "left" ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setHorizontalAlign("left")}
              title="左对齐"
              aria-label="Align Left"
            >
              <AlignStartHorizontal className="w-4 h-4" />
            </Button>
            <Button
              variant={horizontalAlign === "center" ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setHorizontalAlign("center")}
              title="居中对齐"
              aria-label="Align Center"
            >
              <AlignCenterHorizontal className="w-4 h-4" />
            </Button>
            <Button
              variant={horizontalAlign === "right" ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setHorizontalAlign("right")}
              title="右对齐"
              aria-label="Align Right"
            >
              <AlignEndHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">垂直对齐</label>
          <div className="inline-flex gap-2">
            <Button
              variant={verticalAlign === "top" ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setVerticalAlign("top")}
              title="顶端对齐"
              aria-label="Align Top"
            >
              <AlignStartVertical className="w-4 h-4" />
            </Button>
            <Button
              variant={verticalAlign === "center" ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setVerticalAlign("center")}
              title="垂直居中"
              aria-label="Align Middle"
            >
              <AlignCenterVertical className="w-4 h-4" />
            </Button>
            <Button
              variant={verticalAlign === "bottom" ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
              onClick={() => setVerticalAlign("bottom")}
              title="底部对齐"
              aria-label="Align Bottom"
            >
              <AlignEndVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">照片间隔</label>
            <span className="text-sm text-gray-500">{spacing}mm</span>
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
            <Switch checked={autoLayout} onCheckedChange={(checked) => setAutoLayout(checked)} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LayoutSettings;


