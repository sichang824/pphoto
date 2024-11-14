"use client";

import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";
import { PhotoItem } from "./types";
import PreviewItem from "./PreviewItem";

interface PaperPreviewProps {
  id: string;
  items: PhotoItem[];
}

const PaperPreview: FC<PaperPreviewProps> = ({ id, items }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const { paperLandscape, paperSize, pageMargin, pageMarginUnit } = usePreviewStore();

  const ps = PAPER_SIZES[paperSize];
  const paperWidth = paperLandscape ? ps.height : ps.width;
  const paperHeight = paperLandscape ? ps.width : ps.height;

  const style = {
    color: isOver ? "green" : undefined,
    width: `${paperWidth}mm`,
    height: `${paperHeight}mm`,
    padding: `${pageMargin}${pageMarginUnit}`,
  };

  const contentClass = paperSize == "六寸" ? "content-center" : "content-start";
  const itemsClass = paperSize == "六寸" ? "items-center" : "items-start";
  const justifyClass = paperSize == "六寸" ? "justify-center" : "justify-start";

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={id}
      className={`relative bg-white border border-gray-100 flex flex-wrap ${contentClass} ${itemsClass} ${justifyClass}`}
    >
      {items.length > 0 ? (
        items.map((item) => (
          <PreviewItem key={item.id} item={item} />
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300 font-bold">
          {paperSize}
        </div>
      )}
    </div>
  );
};

export default PaperPreview;
