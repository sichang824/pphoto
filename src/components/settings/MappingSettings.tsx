"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreviewStore } from "@/store/previewStore";

const MappingSettings: FC = () => {
  const {
    enableRatioMap,
    setEnableRatioMap,
    ratioToSizeMap,
    updateRatioMap,
    presetSizes,
    customSizes,
  } = usePreviewStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">比例尺寸映射</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium">启用映射</label>
          <Switch checked={enableRatioMap} onCheckedChange={(checked) => setEnableRatioMap(checked)} />
        </div>

        {enableRatioMap && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Select
                onValueChange={(value) => {
                  const allSizes = [...customSizes, ...presetSizes];
                  const size = allSizes.find((s) => s.id === value);
                  if (size) {
                    Object.keys(ratioToSizeMap).forEach((ratio) => {
                      updateRatioMap(ratio, size);
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择统一尺寸" />
                </SelectTrigger>
                <SelectContent>
                  {[...customSizes, ...presetSizes].map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.name} ({size.width}×{size.height}mm)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {Object.entries(ratioToSizeMap).map(([ratio, size]) => (
              <div key={ratio} className="flex items-center gap-2">
                <span className="min-w-[60px]">{ratio}</span>
                <Select
                  value={size.id}
                  onValueChange={(value) => {
                    const allSizes = [...customSizes, ...presetSizes];
                    const found = allSizes.find((s) => s.id === value);
                    if (found) {
                      updateRatioMap(ratio, found);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择尺寸" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...customSizes, ...presetSizes].map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.width}×{s.height}mm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MappingSettings;


