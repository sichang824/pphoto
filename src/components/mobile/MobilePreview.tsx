"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageCalculator } from "@/lib/PageCalculator";
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { FC, useMemo, useState } from "react";
import { BacksidePaperPreview } from "../BacksidePaperPreview";
import PaperPreview from "../PaperPreview";
import TemplateManager from "../templates/Manager";
import { cn } from "@/lib/utils";

interface MobilePreviewProps {
  id: string;
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
  const { setIsPrinting } = usePreviewStore.getState();

  try {
    setIsPrinting(true);

    const { 
      paperSize, 
      paperLandscape, 
      pixelRatio, 
      imageQuality,
      backsideFlip,
    } = usePreviewStore.getState();
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
            transform: isBackside && backsideFlip ? `rotate(180deg) scaleX(-1)` : "",
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
    setTimeout(() => {
      onProgress?.(0);
      setIsPrinting(false);
    }, 1000);
  } catch (error) {
    console.error("生成 PDF 失败:", error);
    onProgress?.(0);
    setIsPrinting(false);
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

      const { addBatchImages } = usePreviewStore.getState();
      const fileArray = Array.from(files);
      await addBatchImages(fileArray);
    };

    input.click();
  } catch (error) {
    console.error("批量选择图片失败:", error);
  }
};

const MobilePreview: FC<MobilePreviewProps> = ({ id }) => {
  const [pdfProgress, setPdfProgress] = useState(0);

  const {
    paperLandscape,
    previewItems,
    paperSize,
    pageMargin,
    autoLayout,
    ratioToSizeMap,
    enableRatioMap,
    customSizes,
    doubleSided,
    paperScale,
  } = usePreviewStore();

  const pages = useMemo(() => {
    const calculator = new PageCalculator(
      paperLandscape,
      paperSize,
      autoLayout,
      pageMargin,
      ratioToSizeMap,
      enableRatioMap,
      customSizes
    );
    return calculator.calculate(previewItems);
  }, [
    previewItems,
    paperLandscape,
    paperSize,
    autoLayout,
    pageMargin,
    ratioToSizeMap,
    enableRatioMap,
    customSizes,
  ]);

  return (
    <div className="flex flex-col">
      <style>{printStyles}</style>
      <div className="flex flex-col">
        {/* 横向按钮布局 */}
        <div className="flex justify-between items-center p-3 mb-3 rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold">打印预览</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleBatchSelect}
              variant="secondary"
              className="bg-green-500 text-white hover:bg-green-600 text-sm p-2 h-auto"
            >
              批量选择
            </Button>
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600 text-sm p-2 h-auto"
            >
              打印
            </Button>
            <Button
              onClick={() => handlePrintPdf((progress = 0) => setPdfProgress(progress))}
              variant="secondary"
              className="bg-red-500 text-white hover:bg-red-600 text-sm p-2 h-auto"
            >
              导出PDF
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <TemplateManager />
        </div>

        {pdfProgress > 0 && (
          <div className="w-full px-3 mb-3">
            <Progress value={pdfProgress} />
            <div className="text-center text-sm text-gray-500 mt-1">
              正在生成PDF: {Math.round(pdfProgress)}%
            </div>
          </div>
        )}

        <div
          id={id}
          className={cn(
            "flex flex-wrap items-center justify-center gap-6 scale-[0.6] origin-top"
          )}
          style={{
            transform: `scale(${paperScale * 0.8})`,
          }}
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

export default MobilePreview;
