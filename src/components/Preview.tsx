"use client";

import { FC, useMemo } from "react";
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";
import PaperPreview from "./PaperPreview";
import { SizeItem } from "./types";

interface PreviewProps {
  id: string;
}

interface Page {
  id: string;
  items: any[];
}

const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #preview, #preview * {
      visibility: visible;
    }
  }
`;

const handlePrint = () => {
  window.print();
};

const handleBatchSelect = async () => {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      // 这里需要在 previewStore 中添加一个处理批量图片的方法
      // 假设我们已经在 store 中添加了 addBatchImages 方法
      const { addBatchImages } = usePreviewStore.getState();

      const fileArray = Array.from(files);
      await addBatchImages(fileArray);
    };

    input.click();
  } catch (error) {
    console.error("批量选择图片失败:", error);
  }
};

const Preview: FC<PreviewProps> = ({ id }) => {
  const { paperLandscape, previewItems, paperSize, pageMargin } = usePreviewStore();

  const pages = useMemo(() => {
    const pages: Page[] = [];

    // 如果没有预览项目，返回一个空白页
    if (previewItems.length === 0) {
      return [{ id: "page-1", items: [] }];
    }

    let currentPage: SizeItem[] = [];
    let currentPageId = 1;

    const ps = PAPER_SIZES[paperSize];

    // 计算实际纸张尺寸
    const paperWidth = paperLandscape ? ps.height : ps.width;
    const paperHeight = paperLandscape ? ps.width : ps.height;

    // 考虑padding
    const padding = pageMargin * 2;
    const availableWidth = paperWidth - padding;
    const availableHeight = paperHeight - padding;

    let currentY = 0;
    let currentRowX = 0;
    let currentRowHeight = 0;

    // 遍历所有项目进行分页
    previewItems.forEach((item) => {
      const itemWidth = item.isVertical ? item.height : item.width;
      const itemHeight = item.isVertical ? item.width : item.height;

      // 检查是否需要换行
      if (currentRowX + itemWidth > availableWidth) {
        currentY += currentRowHeight;
        currentRowX = 0;
        currentRowHeight = 0;
      }

      // 检查是否需要新页
      if (currentY + itemHeight > availableHeight) {
        pages.push({
          id: `page-${currentPageId}`,
          items: [...currentPage],
        });
        currentPage = [];
        currentPageId++;
        currentY = 0;
        currentRowX = 0;
        currentRowHeight = 0;
      }

      // 添加项目到当前行
      currentPage.push(item);
      currentRowX += itemWidth;
      currentRowHeight = Math.max(currentRowHeight, itemHeight);
    });

    // 添加最后一页
    if (currentPage.length > 0) {
      pages.push({
        id: `page-${currentPageId}`,
        items: currentPage,
      });
    }

    return pages;
  }, [previewItems, paperLandscape, paperSize]);

  return (
    <>
      <style>{printStyles}</style>
      <div className="flex items-center justify-between p-4 mb-4 sticky top-4 bg-white rounded-lg shadow z-50">
        <h2 className="text-lg font-semibold">打印预览</h2>
        <div className="flex gap-2">
          <button
            onClick={handleBatchSelect}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            批量选择
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            打印
          </button>
        </div>
      </div>
      <div id={id} className="flex flex-col gap-8">
        {pages.map((page) => (
          <PaperPreview key={page.id} id={page.id} items={page.items} />
        ))}
      </div>
    </>
  );
};

export default Preview;
