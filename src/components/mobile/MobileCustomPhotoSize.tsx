"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calcRatio } from "@/lib/utils";
import { usePreviewStore } from "@/store/previewStore";
import { FC, useState } from "react";
import { SizeItem } from "../types";
import { Button } from "../ui/button";

const MobileCustomPhotoSize: FC = () => {
  const { addCustomSize, customSizes } = usePreviewStore();
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  const handleAdd = () => {
    if (!width || !height) return;

    const numWidth = parseFloat(width);
    const numHeight = parseFloat(height);

    if (isNaN(numWidth) || isNaN(numHeight)) return;

    const customSize: SizeItem = {
      name: `custom ${customSizes.length + 1}`,
      width: numWidth,
      height: numHeight,
      id: `custom-${Date.now()}`,
      imageRatio: calcRatio(numWidth, numHeight),
    };
    addCustomSize(customSize);
    
    // 清空输入框
    setWidth("");
    setHeight("");
  };

  return (
    <Card className="bg-white shadow-sm mb-4">
      <div className="p-4">
        <h3 className="text-base font-medium mb-4">自定义尺寸 (mm)</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col">
            <label htmlFor="width" className="text-sm text-gray-500 mb-1">宽 (mm)</label>
            <Input
              id="width"
              className="h-12 text-base"
              type="number"
              inputMode="decimal"
              min="1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="height" className="text-sm text-gray-500 mb-1">高 (mm)</label>
            <Input
              id="height"
              className="h-12 text-base"
              type="number"
              inputMode="decimal"
              min="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>
        
        <Button
          onClick={handleAdd}
          disabled={!width || !height}
          className="w-full h-12 text-base font-medium"
        >
          添加自定义尺寸
        </Button>
      </div>
    </Card>
  );
};

export default MobileCustomPhotoSize;
