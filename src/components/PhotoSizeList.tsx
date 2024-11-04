"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import PhotoSize from "./PhotoSize";
import { usePreviewStore } from "@/store/previewStore";
import { SizeItem } from "./types";

interface PhotoSizeListProps {
  items: SizeItem[];
}

const PhotoSizeList: FC<PhotoSizeListProps> = ({ items }) => {
  const addItem = usePreviewStore((state) => state.addItem);

  const handleAdd = (item: SizeItem) => {
    addItem(item);
  };

  return (
    <div className="p-4 sticky top-4 bg-white rounded-lg shadow z-50">
      <h2 className="text-lg font-semibold mb-4">照片尺寸</h2>
      <div className="space-y-2">
        {items.map((size) => (
          <PhotoSize 
            key={size.name} 
            item={size} 
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoSizeList;
