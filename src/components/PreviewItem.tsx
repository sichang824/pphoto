import { getItemSize } from "@/lib/PageCalculator";
import { isMobileDevice } from "@/lib/utils";
import { usePreviewStore } from "@/store/previewStore";
import {
  Image as LucideImage,
  MoveVertical,
  RectangleVertical,
  Trash,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { FC, useRef, useState } from "react";
import { PhotoItem } from "./types";
import { Button } from "./ui/button";

interface PreviewItemProps {
  item: PhotoItem;
}

const PreviewItem: FC<PreviewItemProps> = ({ item }) => {
  const {
    removeItem,
    toggleOrientation,
    updateItem,
    pageMargin,
    pageMarginUnit,
    ratioToSizeMap,
    enableRatioMap,
    customSizes,
    presetSizes,
    isPrinting,
  } = usePreviewStore();
  const [position, setPosition] = useState({ x: item.x, y: item.y });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 添加缩放步长常量
  const ZOOM_STEP = 0.1;
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.5;

  const handleZoomIn = () => {
    updateItem({ ...item, scale: (item.scale || 1) + ZOOM_STEP });
  };

  const handleZoomOut = () => {
    updateItem({ ...item, scale: (item.scale || 1) - ZOOM_STEP });
  };

  // 修改 fitMode 的切换处理函数
  const handleFitModeChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFitMode = item.fitMode === "width" ? "height" : "width";
    updateItem({ ...item, fitMode: newFitMode, x: 0, y: 0, scale: 1 });
    setPosition({ x: 0, y: 0 });
    console.log("Fit mode changed to:", newFitMode); // 添加日志以便调试
  };

  const handleOrientationChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOrientation(item.id);
  };

  return (
    <div
      className="group relative"
      style={{
        height: item.isVertical ? `${size.width}mm` : `${size.height}mm`,
        width: item.isVertical ? `${size.height}mm` : `${size.width}mm`,
      }}
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
              }) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center",
            }}
            onMouseDown={handleMove}
            onTouchStart={handleMove}
          />
        </div>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-50 cursor-pointer"
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

      {/* 控制按钮组 */}
      {!isPrinting && (
        <div
          className={`absolute z-30 flex flex-wrap gap-1 ${
            isMobileDevice()
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          } transition-opacity`}
          style={
            item.isVertical
              ? {
                  flexDirection: size.width < 100 ? "column" : "row",
                  top: `${pageMargin + 0.2}${pageMarginUnit}`,
                  left: size.width < 100 ? `${pageMargin + 0.2}${pageMarginUnit}` : "50%",
                  transform: size.width < 100 ? "none" : "translateX(-50%)",
                }
              : {
                  flexDirection: size.height < 100 ? "row" : "column",
                  top: size.height < 100 ? `${pageMargin + 0.2}${pageMarginUnit}` : "50%",
                  left: `${pageMargin + 0.2}${pageMarginUnit}`,
                  transform: size.height < 100 ? "none" : "translateY(-50%)",
                }
          }
        >
          {item.imageUrl && (
            <>
              <Button
                size="icon"
                onClick={handleFitModeChange}
                className="w-8 h-8 rounded-full shadow"
                title={
                  item.fitMode === "width" ? "切换为高度铺满" : "切换为宽度铺满"
                }
              >
                <MoveVertical
                  className="w-3.5 h-3.5"
                  style={{
                    transform:
                      item.fitMode === "width" ? "rotate(-90deg)" : "none",
                    transition: "transform 0.2s ease-in-out",
                  }}
                />
              </Button>
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-8 h-8 rounded-full shadow"
                title="更换图片"
              >
                <LucideImage className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="w-8 h-8 rounded-full shadow"
                title={`放大 (${Math.round(item.scale * 100)}%)`}
                disabled={item.scale >= MAX_ZOOM}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="w-8 h-8 rounded-full shadow"
                title={`缩小 (${Math.round(item.scale * 100)}%)`}
                disabled={item.scale <= MIN_ZOOM}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          <Button
            size="icon"
            onClick={handleOrientationChange}
            className="w-8 h-8 rounded-full shadow"
            title={item.isVertical ? "切换为横向" : "切换为竖向"}
          >
            <RectangleVertical
              className="w-3.5 h-3.5"
              style={{
                transform: item.isVertical ? "rotate(90deg)" : "none",
                transition: "transform 0.2s ease-in-out",
              }}
            />
          </Button>

          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(item.id);
            }}
            className="w-8 h-8 rounded-full shadow bg-red-500 hover:bg-red-600"
            title="移除"
          >
            <Trash />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PreviewItem;
