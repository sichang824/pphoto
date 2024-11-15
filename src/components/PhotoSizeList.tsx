"use client";

import { PRESET_SIZES, generateId, usePreviewStore } from "@/store/previewStore";
import { FC } from "react";
import PhotoSize from "./PhotoSize";
import { SizeItem } from "./types";

const PhotoSizeList: FC = () => {
  const { addItem } = usePreviewStore();

  const handleAdd = (item: SizeItem) => {
    addItem({ id: generateId(), name: item.name, imageRatio: item.imageRatio });
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">照片尺寸</h3>
      <div className="space-y-2">
        {PRESET_SIZES.map((size) => (
          <PhotoSize key={size.name} item={size} onAdd={handleAdd} />
        ))}
      </div>
    </>
  );
};

export default PhotoSizeList;
