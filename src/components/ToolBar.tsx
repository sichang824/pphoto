import { isMobileDevice } from "@/lib/utils";
import {
  Image as LucideImage,
  MoveVertical,
  RectangleVertical,
  Trash,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { FC, RefObject } from "react";
import { PhotoItem } from "./types";
import { Button } from "./ui/button";

interface ToolBarProps {
  item: PhotoItem;
  isPrinting: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onFitModeChange: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onOrientationChange: () => void;
  onRemove: () => void;
}

const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;

const ToolBar: FC<ToolBarProps> = ({
  item,
  isPrinting,
  fileInputRef,
  onFitModeChange,
  onZoomIn,
  onZoomOut,
  onOrientationChange,
  onRemove,
}) => {
  if (isPrinting) return null;

  return (
    <div
      className={`absolute z-50 flex gap-1 ${
        isMobileDevice()
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100"
      } transition-opacity`}
      style={
        item.isVertical
          ? {
              flexDirection: "row",
              top: "8px",
              left: "50%",
              transform: "translateX(-50%)",
            }
          : {
              flexDirection: "column",
              top: "8px",
              right: "8px",
            }
      }
    >
      {item.imageUrl && (
        <>
          <Button
            size="icon"
            onClick={onFitModeChange}
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
              onZoomIn();
            }}
            className="w-8 h-8 rounded-full shadow"
            title={`放大 (${Math.round((item.scale || 1) * 100)}%)`}
            disabled={(item.scale || 1) >= MAX_ZOOM}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onZoomOut();
            }}
            className="w-8 h-8 rounded-full shadow"
            title={`缩小 (${Math.round((item.scale || 1) * 100)}%)`}
            disabled={(item.scale || 1) <= MIN_ZOOM}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
        </>
      )}

      <Button
        size="icon"
        onClick={onOrientationChange}
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
          onRemove();
        }}
        className="w-8 h-8 rounded-full shadow bg-red-500 hover:bg-red-600"
        title="移除"
      >
        <Trash />
      </Button>
    </div>
  );
};

export default ToolBar;