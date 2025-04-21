"use client";

import {
  PRESET_SIZES,
  generateId,
  usePreviewStore,
} from "@/store/previewStore";
import { FC } from "react";
import { SizeItem } from "../types";
import MobilePhotoSize from "./MobilePhotoSize";
import MobileCustomPhotoSize from "./MobileCustomPhotoSize";

const MobilePhotoSizeList: FC = () => {
  const { addItem, customSizes } = usePreviewStore();

  const handleAdd = (item: SizeItem) => {
    addItem({ id: generateId(), name: item.name, imageRatio: item.imageRatio });
  };

  return (
    <div className="space-y-5 pb-16">
      <MobileCustomPhotoSize />
      
      {customSizes.length > 0 && (
        <div>
          <h3 className="text-base font-medium px-1 mb-2">自定义尺寸</h3>
          <div className="space-y-2">
            {customSizes.map((size) => (
              <MobilePhotoSize key={size.id} item={size} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-base font-medium px-1 mb-2">预设尺寸</h3>
        <div className="grid grid-cols-1 gap-2">
          {PRESET_SIZES.map((size) => (
            <MobilePhotoSize key={size.id} item={size} onAdd={handleAdd} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilePhotoSizeList;
