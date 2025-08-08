"use client";

import { generateId, usePreviewStore } from "@/store/previewStore";
import { FC } from "react";
import PhotoSize from "./PhotoSize";
import { SizeItem } from "./types";
import CustomPhotoSize from "./CustomPhotoSize";

const PhotoSizeList: FC = () => {
  const { addItem, customSizes, presetSizes } = usePreviewStore();

  const handleAdd = (item: SizeItem) => {
    addItem({ id: generateId(), name: item.name, imageRatio: item.imageRatio });
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">照片尺寸</h3>
      <div className="space-y-1">
        <CustomPhotoSize />
        {customSizes.length > 0 && customSizes.map((size) => (
          <PhotoSize key={size.name} item={size} onAdd={handleAdd} />
        ))}
        {presetSizes.map((size) => (
          <PhotoSize key={size.name} item={size} onAdd={handleAdd} />
        ))}
      </div>
    </>
  );
};

export default PhotoSizeList;
