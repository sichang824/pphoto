"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

interface MobilePhotoSizeProps {
  width: number;
  height: number;
  name: string;
  onClick: (width: number, height: number) => void;
  selected?: boolean;
}

const MobilePhotoSize: FC<MobilePhotoSizeProps> = ({
  width,
  height,
  name,
  onClick,
  selected = false,
}) => {
  // 计算宽高比
  const aspectRatio = width / height;
  // 归一化尺寸，使长边为固定值
  const normalizedHeight = aspectRatio >= 1 ? 70 / aspectRatio : 70;
  const normalizedWidth = aspectRatio >= 1 ? 70 : 70 * aspectRatio;

  return (
    <div className="flex-shrink-0">
      <button
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          selected
            ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
            : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-200"
        )}
        onClick={() => onClick(width, height)}
        title={selected ? "点击移除尺寸" : "点击添加尺寸"}
      >
        <div
          className="border border-gray-300 bg-white mb-2 relative"
          style={{
            width: `${normalizedWidth}px`,
            height: `${normalizedHeight}px`,
          }}
        >
          {selected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
              <span className="text-xs text-blue-600 font-medium">已选</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-xs font-medium">{name}</div>
          <div className="text-xs text-gray-500">{width}×{height}mm</div>
        </div>
      </button>
    </div>
  );
};

export default MobilePhotoSize;
