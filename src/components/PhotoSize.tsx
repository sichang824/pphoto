import React, { FC } from "react";
import { Card } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { SizeItem } from "./types";

interface PhotoSizeProps {
  item: SizeItem;
  onAdd?: (item: SizeItem) => void;
}

const PhotoSize: FC<PhotoSizeProps> = ({ item, onAdd }) => {
  const uniqueId = item.id;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: uniqueId,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        width: isDragging ? `${item.width}mm` : "auto",
        height: isDragging ? `${item.height}mm` : "auto",
        backgroundColor: isDragging ? "#f3f4f6" : "transparent",
        border: isDragging ? "1px dashed #9ca3af" : "none",
        padding: "8px",
        borderRadius: "4px",
        // 确保拖动时显示在最上层
        zIndex: isDragging ? 999 : "auto",
      }
    : undefined;

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div ref={setNodeRef} style={style} key={uniqueId}>
      <Card className="p-4 relative flex justify-between gap-5 group">
        <div>{item.name}</div>
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => onAdd?.(item)}
            className="text-gray-600 hover:text-gray-900"
            title="添加到预览"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            {...attributes}
            {...listeners}
            className={`${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
            aria-describedby={`DndContext-${uniqueId}`}
          >
            <svg viewBox="0 0 20 20" width="15">
              <path
                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PhotoSize;
