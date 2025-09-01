"use client";

import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import { usePreviewStore } from "@/store/previewStore";
import { usePhotoStore } from "@/store/PhotoStore";
import { PhotoItem } from "./types";
import PreviewItem from "./PreviewItem";

interface PaperPreviewProps {
  id: string;
  items: PhotoItem[];
}

const PaperPreview: FC<PaperPreviewProps> = ({ id, items }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const { 
    paperLandscape, 
    paperSize, 
    pageMargin, 
    pageMarginUnit, 
    spacing,
    showGuides,
    showPaperBorder,
  } = usePreviewStore();

  const { paperSizes } = usePreviewStore.getState();
  const ps = paperSizes[paperSize];
  const paperWidth = paperLandscape ? ps.height : ps.width;
  const paperHeight = paperLandscape ? ps.width : ps.height;
  // Use global photo alignment settings instead of paper-size specific logic
  const { horizontalAlign, verticalAlign } = usePhotoStore();
  const justifyMap: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };
  const itemsMap: Record<string, string> = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };
  const contentMap: Record<string, string> = {
    top: "content-start",
    center: "content-center",
    bottom: "content-end",
  };

  return (
    <>
      {id}
      <div
        ref={setNodeRef}
        style={{
          color: isOver ? "green" : undefined,
          width: `${paperWidth}mm`,
          height: `${paperHeight}mm`,
        }}
        id={id}
        className={`relative bg-white ${showPaperBorder ? 'border border-gray-100' : ''}`}
      >
        <div
          className={`absolute inset-0 ${showGuides ? 'border border-dashed border-gray-300' : ''} overflow-hidden flex flex-wrap ${contentMap[verticalAlign]} ${itemsMap[verticalAlign]} ${justifyMap[horizontalAlign]}`}
          style={{
            margin: `${pageMargin}${pageMarginUnit}`,
            gap: `${spacing}mm`,
          }}
        >
          {items.length > 0 ? (
            items.map((item) => <PreviewItem key={item.id} item={item} />)
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300 font-bold">
              {paperSize}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaperPreview;
