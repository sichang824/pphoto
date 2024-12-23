import { getItemSize } from "@/lib/PageCalculator";
import { usePreviewStore } from "@/store/previewStore";
import { Image as LucideImage } from "lucide-react";
import React, { FC } from "react";
import PostcardBorderless from "./postcard/borderless";
import PostcardStyle1 from "./postcard/style1";
import PostcardStyle2 from "./postcard/style2";
import { PhotoItem } from "./types";
import Image from "next/image";

interface StyledPreviewItemProps {
  item: PhotoItem;
}

// 添加样式组件映射
const POSTCARD_STYLES: { [key: string]: React.ComponentType } = {
  style1: PostcardStyle1,
  style2: PostcardStyle2,
  borderless: PostcardBorderless,
};

export const StyledPreviewItem: FC<StyledPreviewItemProps> = ({ item }) => {
  const { ratioToSizeMap, printStyleId, enableRatioMap, customSizes } =
    usePreviewStore();

  // 如果启用了比例映射，使用映射的尺寸，否则直接使用照片本身的尺寸
  const size = getItemSize(item, ratioToSizeMap, enableRatioMap, customSizes);

  return (
    <div
      className="group relative "
      style={{
        height: item.isVertical ? `${size.width}mm` : `${size.height}mm`,
        width: item.isVertical ? `${size.height}mm` : `${size.width}mm`,
      }}
    >
      {/* 图片容器 */}
      {item.imageUrl ? (
        <div
          className="relative border border-white box-border overflow-hidden"
          style={{
            width: `${size.width}mm`,
            height: `${size.height}mm`,
            transform: `rotate(${item.isVertical ? -90 : 0}deg) scaleX(${
              item.isVertical ? -1 : 1
            }) `,
            transformOrigin: "0 0",
          }}
        >
          <div className="absolute inset-0 bg-white/60 z-10"></div>

          <Image
            className="relative"
            src={item.imageUrl}
            alt="预览照片"
            fill
            sizes="100vw"
            style={{
              objectFit: item.fitMode === "width" ? "contain" : "cover",
              transform: ` scaleX(${item.isVertical ? -1 : 1}) scale(${
                item.scale
              }) translate(${item.x}px, ${item.y}px)`,
              transformOrigin: "center",
            }}
          />
          {/* 动态渲染明信片样式组件 */}
          <div className="absolute inset-0 z-20">
            {printStyleId && POSTCARD_STYLES[printStyleId] ? (
              React.createElement(POSTCARD_STYLES[printStyleId])
            ) : (
              <PostcardBorderless />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <LucideImage className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};
