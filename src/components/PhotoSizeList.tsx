"use client";

import { generateId, usePreviewStore } from "@/store/previewStore";
import { FC } from "react";
import CustomPhotoSize from "./CustomPhotoSize";
import PhotoSize from "./PhotoSize";
import { SizeItem } from "./types";

const PhotoSizeList: FC = () => {
  const { addItem, customSizes, presetSizes } = usePreviewStore();

  const handleAdd = (item: SizeItem) => {
    addItem({ id: generateId(), name: item.name, imageRatio: item.imageRatio });
  };

  return (
    <>
      <div className="text-sm font-medium">自定义尺寸（mm）</div>
      <div className="space-y-1">
        <CustomPhotoSize />
        {customSizes.length > 0 &&
          customSizes.map((size) => (
            <PhotoSize key={size.id} item={size} onAdd={handleAdd} />
          ))}
        {presetSizes.map((size) => (
          <PhotoSize key={size.id} item={size} onAdd={handleAdd} />
        ))}
      </div>
    </>
  );
};

export default PhotoSizeList;
