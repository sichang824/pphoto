"use client";

import { FC, useMemo, useState } from "react";
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";
import PaperPreview from "./PaperPreview";
import { PhotoItem } from "./types";
import jsPDF from "jspdf";
import { Progress } from "@/components/ui/progress";
import { toPng } from "html-to-image";
import { BacksidePaperPreview } from "./BacksidePaperPreview";

interface PreviewProps {
  id: string;
}

interface Page {
  id: string;
  items: PhotoItem[];
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

const handlePrintPdf = async (onProgress?: (progress?: number) => void) => {
  try {
    const { paperSize, paperLandscape, pixelRatio, imageQuality } =
      usePreviewStore.getState();
    const ps = PAPER_SIZES[paperSize];

    const photoWidth = paperLandscape ? ps.height : ps.width;
    const photoHeight = paperLandscape ? ps.width : ps.height;

    const pdf = new jsPDF({
      orientation: paperLandscape ? "landscape" : "portrait",
      unit: "mm",
      format: [photoWidth, photoHeight],
    });

    const pageElements: HTMLElement[] = Array.from(
      document.querySelectorAll('[id^="page-"]')
    );
    const totalPages = pageElements.length;

    for (let i = 0; i < pageElements.length; i++) {
      const element = pageElements[i];

      if (i > 0) {
        pdf.addPage();
      }
      const isBackside = element.id.includes("backside");

      try {
        const dataUrl = await toPng(element, {
          style: {
            transform: isBackside ? `rotate(180deg) scaleX(-1)` : "",
          },
          pixelRatio,
          quality: imageQuality,
        });

        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          0,
          photoWidth,
          photoHeight,
          undefined,
          "SLOW"
        );

        onProgress?.(((i + 1) / totalPages) * 100);
      } catch (error) {
        console.error(`第 ${i + 1} 页图片生成失败:`, error);
      }
    }

    pdf.save("照片打印.pdf");
    setTimeout(() => onProgress?.(0), 1000);
  } catch (error) {
    console.error("生成 PDF 失败:", error);
    onProgress?.(0);
  }
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

      // 这里需在 previewStore 中添加一个处理批量图片的方法
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
  const [pdfProgress, setPdfProgress] = useState(0);

  const {
    paperLandscape,
    previewItems,
    paperSize,
    pageMargin,
    autoLayout,
    ratioToSizeMap,
    doubleSided,
  } = usePreviewStore();

  const pages = useMemo(() => {
    const pages: Page[] = [];

    // 如果没有预览项目，返回一个空白页
    if (previewItems.length === 0) {
      return [{ id: "page-1", items: [] }];
    }

    let currentPage: PhotoItem[] = [];
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
      if (!autoLayout) {
        const itemWithPosition = {
          ...item,
          x: currentRowX,
          y: currentY,
        };
        pages.push({
          id: `page-${currentPageId}`,
          items: [itemWithPosition],
        });
        currentPageId++;
      } else {
        const size = ratioToSizeMap[item.imageRatio];
        const itemWidth = item.isVertical ? size.height : size.width;
        const itemHeight = item.isVertical ? size.width : size.height;

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

        // 加项目到当前行
        const itemWithPosition = {
          ...item,
          x: currentRowX,
          y: currentY,
        };
        currentPage.push(itemWithPosition);
        currentRowX += itemWidth;
        currentRowHeight = Math.max(currentRowHeight, itemHeight);
      }
    });

    // 添加最后一页
    if (currentPage.length > 0) {
      pages.push({
        id: `page-${currentPageId}`,
        items: currentPage,
      });
    }

    return pages;
  }, [
    previewItems,
    paperLandscape,
    paperSize,
    autoLayout,
    pageMargin,
    ratioToSizeMap,
  ]);

  return (
    <div className="flex flex-col">
      <style>{printStyles}</style>
      <div className="flex flex-col">
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
            <button
              onClick={() =>
                handlePrintPdf((progress = 0) => setPdfProgress(progress))
              }
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              导出PDF
            </button>
          </div>
        </div>

        {pdfProgress > 0 && (
          <div className="w-full px-4 mb-4">
            <Progress value={pdfProgress} />
            <div className="text-center text-sm text-gray-500 mt-1">
              正在生成PDF: {Math.round(pdfProgress)}%
            </div>
          </div>
        )}

        <div
          id={id}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {pages.map((page) => (
            <div key={page.id}>
              <PaperPreview id={page.id} items={page.items} />
              {doubleSided && (
                <BacksidePaperPreview id={page.id} items={page.items} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
