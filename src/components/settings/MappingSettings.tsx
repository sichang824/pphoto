"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreviewStore } from "@/store/PreviewStore";

const MappingSettings: FC = () => {
  const { presetSizes, customSizes, applyGlobalSize } = usePreviewStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">统一尺寸</h4>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Select
            onValueChange={(value) => {
              applyGlobalSize(value);
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
      </div>
    </Card>
  );
};

export default MappingSettings;


