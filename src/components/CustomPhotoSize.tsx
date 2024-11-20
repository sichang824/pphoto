import React, { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SizeItem } from "./types";
import { calcRatio } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { usePreviewStore } from "@/store/previewStore";

interface CustomPhotoSizeProps {
  onAdd?: (item: SizeItem) => void;
}

const CustomPhotoSize: FC<CustomPhotoSizeProps> = ({ onAdd }) => {
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
  };

  return (
    <Card className="p-2">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium">自定义尺寸（mm）</div>
        <div className="flex gap-1 items-center">
          <Input
            className="p-1 h-8"
            type="number"
            min="1"
            placeholder="宽(mm)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <span>X</span>
          <Input
            className="p-1 h-8"
            type="number"
            min="1"
            placeholder="高(mm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <button
            onClick={handleAdd}
            disabled={!width || !height}
            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            title="添加到预览"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CustomPhotoSize;
