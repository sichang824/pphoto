"use client";

import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";
import { SizeItem } from "./types";
import PreviewItem from "./PreviewItem";

interface PaperPreviewProps {
  id: string;
  items: SizeItem[];
}

const PaperPreview: FC<PaperPreviewProps> = ({ id, items }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const { paperLandscape, paperSize, pageMargin } = usePreviewStore();
  const padding = pageMargin * 2;

  const ps = PAPER_SIZES[paperSize];
  const paperWidth = paperLandscape ? ps.height : ps.width;
  const paperHeight = paperLandscape ? ps.width : ps.height;

  const style = {
    color: isOver ? "green" : undefined,
    width: `${paperWidth}mm`,
    height: `${paperHeight}mm`,
    padding: `${padding}mm`,
  };

  return (
    <>
      <div className="p-4 flex items-center justify-center">
        <div
          ref={setNodeRef}
          style={style}
          id="preview"
          className="bg-gray-100 rounded-lg relative flex flex-wrap content-start items-center justify-center"
        >
          {items.map((item) => (
            <PreviewItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PaperPreview;
