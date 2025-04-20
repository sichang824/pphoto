"use client";

import React, { FC } from "react";
import { Card } from "@/components/ui/card";
import { SizeItem } from "../types";
import { Plus, Trash2 } from "lucide-react";
import { usePreviewStore } from "@/store/previewStore";
import { Button } from "../ui/button";

interface MobilePhotoSizeProps {
  item: SizeItem;
  onAdd?: (item: SizeItem) => void;
}

const MobilePhotoSize: FC<MobilePhotoSizeProps> = ({ item, onAdd }) => {
  const { removeCustomSize } = usePreviewStore();

  return (
    <Card className="p-3 mb-2 flex justify-between items-center">
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-gray-500">
          {item.width}mm × {item.height}mm
        </div>
      </div>
      
      <div className="flex gap-2">
        {item.name.startsWith("custom") && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeCustomSize(item.id)}
            className="h-9 px-2"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            删除
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdd?.(item)}
          className="h-9 px-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          添加
        </Button>
      </div>
    </Card>
  );
};

export default MobilePhotoSize;
