"use client";

import { usePreviewStore } from "@/store/previewStore";
import { useEffect, useState } from "react";
import MobilePhotoSize from "./MobilePhotoSize";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

// 预设照片尺寸
const PREDEFINED_SIZES = [
  { width: 89, height: 119, name: "1寸" },
  { width: 102, height: 152, name: "2寸" },
  { width: 35, height: 45, name: "小1寸" },
  { width: 33, height: 48, name: "证件照" },
  { width: 40, height: 60, name: "小2寸" },
  { width: 110, height: 160, name: "大2寸" },
  { width: 127, height: 178, name: "5寸" },
  { width: 152, height: 102, name: "6寸" },
  { width: 152, height: 89, name: "长6寸" },
  { width: 178, height: 127, name: "7寸" },
  { width: 203, height: 152, name: "8寸" },
  { width: 305, height: 203, name: "12寸" },
];

export default function MobilePhotoSizeList() {
  const {
    previewItems,
    photoSizes,
    addPhotoSize,
    removePhotoSize,
    customSizes,
    photoGap,
  } = usePreviewStore();

  const [sizes, setSizes] = useState<
    { width: number; height: number; name: string }[]
  >([]);

  useEffect(() => {
    // 合并预设尺寸和自定义尺寸
    setSizes([...PREDEFINED_SIZES, ...customSizes]);
  }, [customSizes]);

  const handleSizeClick = (width: number, height: number) => {
    addPhotoSize(width, height, photoGap);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="font-medium">标准尺寸</Label>
        <ScrollArea className="w-full">
          <div className="flex items-start flex-nowrap space-x-2 py-2 pr-4">
            {sizes.map((size) => (
              <MobilePhotoSize
                key={`${size.width}x${size.height}`}
                width={size.width}
                height={size.height}
                name={size.name}
                onClick={handleSizeClick}
                selected={photoSizes.some(
                  (s) => s.width === size.width && s.height === size.height
                )}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div>
        <Label className="font-medium">当前选择</Label>
        <ScrollArea className="w-full">
          <div className="flex items-start flex-nowrap space-x-2 py-2 pr-4 overflow-x-auto">
            {photoSizes.length === 0 ? (
              <div className="text-sm text-gray-500 p-2">尚未选择尺寸</div>
            ) : (
              photoSizes.map((size, index) => (
                <MobilePhotoSize
                  key={`selected-${index}`}
                  width={size.width}
                  height={size.height}
                  name={`${size.width}×${size.height}mm`}
                  onClick={(width, height) => removePhotoSize(width, height)}
                  selected={true}
                />
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
