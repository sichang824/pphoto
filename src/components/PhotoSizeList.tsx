"use client";

import { FC } from "react";
import PhotoSize from "./PhotoSize";
import { usePreviewStore } from "@/store/previewStore";
import { SizeItem, PhotoItem } from "./types";

interface PhotoSizeListProps {
  items: SizeItem[];
}

const PhotoSizeList: FC<PhotoSizeListProps> = ({ items }) => {
  const { addItem } = usePreviewStore();

  const handleAdd = (item: SizeItem) => {
    addItem({
      name: item.name,
      imageRatio: item.imageRatio,
    } as PhotoItem);
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">照片尺寸</h3>
      <div className="space-y-2">
        {items.map((size) => (
          <PhotoSize key={size.name} item={size} onAdd={handleAdd} />
        ))}
      </div>
    </>
  );
};

export default PhotoSizeList;
