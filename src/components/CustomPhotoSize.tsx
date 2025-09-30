import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePreviewStore } from "@/store/PreviewStore";
import { PlusIcon } from "lucide-react";
import { FC, useState } from "react";
import { SizeItem } from "./types";
import { Button } from "./ui/button";

const CustomPhotoSize: FC = () => {
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
    };
    addCustomSize(customSize);
  };

  return (
    <Card className="p-2">
      <div className="flex flex-col gap-4">
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
          <Button
            onClick={handleAdd}
            disabled={!width || !height}
            className="w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
            title="添加到预览"
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CustomPhotoSize;
