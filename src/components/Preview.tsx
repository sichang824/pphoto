"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageCalculator } from "@/lib/PageCalculator";
import { usePreviewStore } from "@/store/previewStore";
import { FC, useMemo, useState } from "react";
import { exportPreviewToPdf } from "@/lib/pdf";
import { BacksidePaperPreview } from "./BacksidePaperPreview";
import PaperPreview from "./PaperPreview";
import TemplateManager from "./templates/Manager";
import { cn } from "@/lib/utils";

interface PreviewProps {
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
    // Show progress before starting the first page capture
    onProgress?.(1);

    const {
      paperSize,
      paperLandscape,
      pixelRatio,
      imageQuality,
      backsideFlip,
      paperSizes,
    } = usePreviewStore.getState();
    const ps = paperSizes[paperSize];

    const photoWidth = paperLandscape ? ps.height : ps.width;
    const photoHeight = paperLandscape ? ps.width : ps.height;

    // Diagnostics: environment and settings
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isSafari = /safari/i.test(ua) && !/chrome|android/i.test(ua);
    const startTs = performance.now();
    console.log("[PDF] Start export", {
      ua,
      isSafari,
      paperSize,
      paperLandscape,
      pixelRatio,
      imageQuality,
      backsideFlip,
      photoWidth,
      photoHeight,
    });

    await exportPreviewToPdf(
      {
        wrapperId: "preview",
        photoWidthMm: photoWidth,
        photoHeightMm: photoHeight,
        pixelRatio,
        imageQuality,
        backsideFlip,
        filename: "照片打印.pdf",
      },
      onProgress
    );
    console.log("[PDF] Save complete", {
      totalElapsedMs: Math.round(performance.now() - startTs),
    });
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
    enableRatioMap,
    customSizes,
    doubleSided,
    paperScale,
    paperSizes,
    presetSizes,
  } = usePreviewStore();

  const pages = useMemo(() => {
    const calculator = new PageCalculator(
      paperLandscape,
      paperSize,
      autoLayout,
      pageMargin,
      ratioToSizeMap,
      enableRatioMap,
      customSizes,
      paperSizes,
      presetSizes
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
        <div className="flex items-center justify-between p-4 mb-4 sticky top-4 bg-white rounded-lg shadow z-50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">打印预览</h2>
            <TemplateManager />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleBatchSelect}
              variant="secondary"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              批量选择
            </Button>
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              打印
            </Button>
            <Button
              onClick={() =>
                handlePrintPdf((progress = 0) => setPdfProgress(progress))
              }
              variant="secondary"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              导出PDF
            </Button>
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
          className={cn(
            "flex flex-wrap items-center justify-center gap-8 scale-[0.7] origin-top"
          )}
          style={{
            transform: `scale(${paperScale})`,
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

export default Preview;
