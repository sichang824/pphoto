import { FC, useState, useRef } from "react";
import { PRESET_SIZES, usePreviewStore } from "@/store/previewStore";
import { PhotoItem } from "./types";
import {
  Trash,
  ZoomIn,
  ZoomOut,
  Image as LucideImage,
  MoveVertical,
  RectangleVertical,
} from "lucide-react";
import NextImage from "next/image";

interface PreviewItemProps {
  item: PhotoItem;
}

// 添加样式常量
const getImageStyles = (
  scale: number,
  position: { x: number; y: number },
  isVertical: boolean,
  fitMode: "width" | "height",
  isDragging: boolean
): React.CSSProperties => ({
  objectFit: fitMode === "width" ? "contain" : ("cover" as const),
  maxWidth: fitMode === "width" ? "100%" : "none",
  maxHeight: fitMode === "height" ? "100%" : "none",
  transform: `rotate(${isVertical ? -90 : 0}deg) scale(${scale}) translate(${
    position.x
  }px, ${position.y}px)`,
  transition: isDragging ? "none" : "all 0.2s ease-in-out",
  userSelect: "none" as const,
  pointerEvents: "none" as const,
});

const containerStyles = (photoWidth: number, photoHeight: number) => ({
  width: `calc(${photoWidth}mm - 2px)`,
  height: `calc(${photoHeight}mm - 2px)`,
});

const PreviewItem: FC<PreviewItemProps> = ({ item }) => {
  const {
    removeItem,
    toggleOrientation,
    updateItem,
    paperLandscape,
    ratioToSizeMap,
  } = usePreviewStore();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState<"width" | "height">("width");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const size =
    ratioToSizeMap[item.imageRatio] ||
    PRESET_SIZES.find((size) => size.name === item.name);

  const photoWidth = paperLandscape ? size.height : size.width;
  const photoHeight = paperLandscape ? size.width : size.height;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateItem({ ...item, imageUrl: url });
    }
  };

  // 添加新的辅助函数来处理坐标计算
  const calculatePosition = (clientX: number, clientY: number, baseX: number, baseY: number) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.imageUrl) {
      setIsDragging(true);
      setDragStart(calculatePosition(e.clientX, e.clientY, position.x, position.y));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition(calculatePosition(e.clientX, e.clientY, dragStart.x, dragStart.y));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加缩放步长常量
  const ZOOM_STEP = 0.1;
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.5;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  // 添加 onDragStart 处理函数
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 修改 fitMode 的切换处理函数
  const handleFitModeChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFitMode = fitMode === "width" ? "height" : "width";
    setFitMode(newFitMode);
    // 重置位置和缩放
    setPosition({ x: 0, y: 0 });
    setScale(1);
    console.log("Fit mode changed to:", newFitMode); // 添加日志以便调试
  };

  return (
    <div
      className={`group relative border border-white`}
      style={containerStyles(photoWidth, photoHeight)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={handleDragStart}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />

      {/* 图片容器 */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <div className="relative w-full h-full">
            <NextImage
              src={item.imageUrl}
              alt="预览照片"
              fill
              style={getImageStyles(
                scale,
                position,
                item.isVertical,
                fitMode,
                isDragging
              )}
              draggable={false}
              unoptimized
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
            <LucideImage className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* 控制按钮组 */}
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.imageUrl && (
          <>
            <button
              onClick={handleFitModeChange}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
              title={fitMode === "width" ? "切换为高度铺满" : "切换为宽度铺满"}
            >
              <MoveVertical
                className="w-3.5 h-3.5"
                style={{
                  transform: fitMode === "width" ? "rotate(-90deg)" : "none",
                  transition: "transform 0.2s ease-in-out",
                }}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
              title="更换图片"
            >
              <LucideImage className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
              title={`放大 (${Math.round(scale * 100)}%)`}
              disabled={scale >= MAX_ZOOM}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
              title={`缩小 (${Math.round(scale * 100)}%)`}
              disabled={scale <= MIN_ZOOM}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleOrientation(item.id);
          }}
          className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
          title={item.isVertical ? "切换为横向" : "切换为竖向"}
        >
          <RectangleVertical
            className="w-3.5 h-3.5"
            style={{
              transform: item.isVertical ? "rotate(-90deg)" : "none",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removeItem(item.id);
          }}
          className="bg-white p-1 rounded-full shadow hover:bg-red-100"
          title="移除"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PreviewItem;
