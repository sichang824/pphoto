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
    <Card className="overflow-hidden bg-white shadow-sm">
      <div className="flex items-center p-3">
        <div className="flex-1 min-w-0">
          <div className="text-base font-medium truncate">{item.name}</div>
          <div className="text-sm text-gray-500">
            {item.width}mm × {item.height}mm
          </div>
        </div>
        
        <div className="flex">
          {item.name.startsWith("custom") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCustomSize(item.id)}
              className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAdd?.(item)}
            className="h-10 w-10 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MobilePhotoSize;
