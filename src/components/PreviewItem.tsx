import { getItemSize } from "@/lib/PageCalculator";
import { usePreviewStore } from "@/store/previewStore";
import {
  Image as LucideImage,
} from "lucide-react";
import Image from "next/image";
import { FC, useRef, useState } from "react";
import ToolBar from "./ToolBar";
import { PhotoItem } from "./types";

interface PreviewItemProps {
  item: PhotoItem;
}

const PreviewItem: FC<PreviewItemProps> = ({ item }) => {
  const {
    removeItem,
    toggleOrientation,
    updateItem,
    ratioToSizeMap,
    enableRatioMap,
    customSizes,
    presetSizes,
    isPrinting,
  } = usePreviewStore();
  const [position, setPosition] = useState({ x: item.x, y: item.y });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const size = getItemSize(
    item,
    ratioToSizeMap,
    enableRatioMap,
    customSizes,
    presetSizes
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateItem({ ...item, imageUrl: url });
    }
  };

  // 添加新的辅助函数来处理坐标计算
  const calculatePosition = (
    clientX: number,
    clientY: number,
    baseX: number,
    baseY: number
  ) => {
    if (item.isVertical) {
      return {
        x: -clientY - baseX,
        y: clientX - baseY,
      };
    }
    return {
      x: clientX - baseX,
      y: clientY - baseY,
    };
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!item.imageUrl) return;
    e.preventDefault();
    e.stopPropagation();

    // 获取初始坐标，兼容鼠标和触摸事件
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;

    const startPosition = calculatePosition(
      clientX,
      clientY,
      position.x,
      position.y
    );

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const moveClientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
      const moveClientY = "clientY" in e ? e.clientY : e.touches[0].clientY;

      const newPosition = calculatePosition(
        moveClientX,
        moveClientY,
        startPosition.x,
        startPosition.y
      );
      setPosition(newPosition);
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      const endClientX =
        "clientX" in e ? e.clientX : e.changedTouches[0].clientX;
      const endClientY =
        "clientY" in e ? e.clientY : e.changedTouches[0].clientY;

      const finalPosition = calculatePosition(
        endClientX,
        endClientY,
        startPosition.x,
        startPosition.y
      );
      updateItem({ ...item, x: finalPosition.x, y: finalPosition.y });

      window.removeEventListener("mousemove", handleMove as EventListener);
      window.removeEventListener("mouseup", handleEnd as EventListener);
      window.removeEventListener("touchmove", handleMove as EventListener);
      window.removeEventListener("touchend", handleEnd as EventListener);
    };

    window.addEventListener("mousemove", handleMove as EventListener);
    window.addEventListener("mouseup", handleEnd as EventListener);
    window.addEventListener("touchmove", handleMove as EventListener);
    window.addEventListener("touchend", handleEnd as EventListener);
  };

  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => {
    updateItem({ ...item, scale: (item.scale || 1) + ZOOM_STEP });
  };

  const handleZoomOut = () => {
    updateItem({ ...item, scale: (item.scale || 1) - ZOOM_STEP });
  };

  const handleFitModeChange = () => {
    const newFitMode = item.fitMode === "width" ? "height" : "width";
    updateItem({ ...item, fitMode: newFitMode, x: 0, y: 0, scale: 1 });
    setPosition({ x: 0, y: 0 });
  };

  const handleOrientationChange = () => {
    toggleOrientation(item.id);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };


  return (
    <div
      className="group relative overflow-visible"
      style={{
        height: item.isVertical ? `${size.width}mm` : `${size.height}mm`,
        width: item.isVertical ? `${size.height}mm` : `${size.width}mm`,
      }}
      ref={anchorRef}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />

      {/* 图片容器 */}
      {item.imageUrl ? (
        <div
          className="relative border border-white box-border overflow-hidden bg-gray-100"
          style={{
            width: `${size.width}mm`,
            height: `${size.height}mm`,
            transform: `rotate(${item.isVertical ? -90 : 0}deg) scaleX(${
              item.isVertical ? -1 : 1
            }) `,
            transformOrigin: "0 0",
            position: "absolute",
            top: "0",
            left: "0",
          }}
        >
          <Image
            className="relative"
            src={item.imageUrl}
            alt="预览照片"
            fill
            sizes="100vw"
            crossOrigin="anonymous"
            style={{
              objectFit: item.fitMode === "width" ? "contain" : "cover",
              transform: ` scaleX(${item.isVertical ? -1 : 1}) scale(${
                item.scale
              }) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center",
            }}
            onMouseDown={handleMove}
            onTouchStart={handleMove}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center bg-gray-50 cursor-pointer"
          style={{
            width: `${size.width}mm`,
            height: `${size.height}mm`,
            position: "absolute",
            top: "0",
            left: "0",
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          <div className="flex flex-col items-center justify-center text-gray-400">
            <LucideImage className="w-6 h-6" />
            <div className="text-[10px]">点击添加图片</div>
          </div>
        </div>
      )}

      <ToolBar
        item={item}
        isPrinting={isPrinting}
        fileInputRef={fileInputRef}
        onFitModeChange={handleFitModeChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onOrientationChange={handleOrientationChange}
        onRemove={handleRemove}
        anchorRef={anchorRef}
      />
    </div>
  );
};

export default PreviewItem;
