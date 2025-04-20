"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calcRatio } from "@/lib/utils";
import { usePreviewStore } from "@/store/previewStore";
import { PlusCircle } from "lucide-react";
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
    <Card className="p-4 mb-4">
      <h3 className="text-base font-medium mb-3">自定义尺寸 (mm)</h3>
      
      <div className="grid grid-cols-5 gap-2 items-center">
        <Input
          className="col-span-2 h-10"
          type="number"
          min="1"
          placeholder="宽(mm)"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <div className="flex justify-center text-lg font-bold">X</div>
        <Input
          className="col-span-2 h-10"
          type="number"
          min="1"
          placeholder="高(mm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      
      <Button
        onClick={handleAdd}
        disabled={!width || !height}
        className="w-full mt-3 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        添加自定义尺寸
      </Button>
    </Card>
  );
};

export default MobileCustomPhotoSize;
