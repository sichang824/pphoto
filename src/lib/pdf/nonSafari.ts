import { useDownloadStore } from "@/store/DownloadStore";
import { toJpeg as htmlToJpeg } from "html-to-image";
import { stabilizeBeforeSnapshot } from "../snapshot";
import { MAX_PAGE_PIXELS, MAX_PAGE_SIDE, TILE_SIDE } from "./constants";
import { disableTransform, restoreTransform } from "./dom";
import { computeFitCenterRect } from "./layout";
import { microYield } from "./microYield";
import { createStreamingPdf } from "./stream";

import type { ExportPdfOptions, ProgressCallback } from "./index";

export async function exportPdfDefault(
  opts: ExportPdfOptions,
  onProgress?: ProgressCallback
) {
  const {
    wrapperId,
    photoWidthMm,
    photoHeightMm,
    pixelRatio,
    backsideFlip,
    filename = "照片打印.pdf",
  } = opts;

  const mmToPt = (mm: number) => (mm * 72) / 25.4;
  const pageWidthPt = mmToPt(photoWidthMm);
  const pageHeightPt = mmToPt(photoHeightMm);

  const pageElements: HTMLElement[] = Array.from(
    document.querySelectorAll('[id^="page-"]')
  );
  const totalPages = pageElements.length;

  // Large image thresholds (kept for logging/reference)
  console.log("[PDF:nonSafari] Begin export (streaming)", {
    totalPages,
    pixelRatio,
    filename,
    pageWidthPt,
    pageHeightPt,
    MAX_PAGE_SIDE,
    MAX_PAGE_PIXELS,
    TILE_SIDE,
  });

  // Temporarily disable scale on wrapper to avoid capture distortion
  const wrapper = document.getElementById(wrapperId) as HTMLElement | null;
  let prevTransform: string | undefined;
  if (wrapper) {
    console.log("[PDF:nonSafari] Temporarily disabling wrapper transform");
    prevTransform = disableTransform(wrapper);
  }

  // Helper: get image size from blob without loading full image into DOM
  const getImageSizeFromBlob = async (blob: Blob) => {
    if (typeof createImageBitmap === "function") {
      const bmp = await createImageBitmap(blob);
      const size = { width: bmp.width, height: bmp.height };
      bmp.close?.();
      return size;
    }
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const size = {
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        };
        URL.revokeObjectURL(url);
        resolve(size);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });
  };

  const { imageQuality } = useDownloadStore.getState();
  const { doc, finalize } = await createStreamingPdf(filename);

  // Build pages one-by-one and stream immediately
  for (let i = 0; i < pageElements.length; i++) {
    const element = pageElements[i];
    await stabilizeBeforeSnapshot(element);

    const toJpegOptions = {
      style: {
        transform:
          element.id.includes("backside") && backsideFlip
            ? `rotate(180deg) scaleX(-1)`
            : "",
      },
      pixelRatio,
      backgroundColor: "#ffffff",
      cacheBust: true,
      crossOrigin: "anonymous",
      quality: Math.max(0, Math.min(1, imageQuality ?? 0.85)),
    } as unknown as Parameters<typeof htmlToJpeg>[1];

    const dataUrl: string = await htmlToJpeg(element, toJpegOptions);
    const blob: Blob = await (await fetch(dataUrl)).blob();

    const { width: imgW, height: imgH } = await getImageSizeFromBlob(blob);
    const exceedSide = imgW > MAX_PAGE_SIDE || imgH > MAX_PAGE_SIDE;
    const exceedArea = imgW * imgH > MAX_PAGE_PIXELS;
    const exceeds = exceedSide || exceedArea;
    console.log("[PDF:nonSafari] Capture page", {
      index: i,
      imgW,
      imgH,
      exceedSide,
      exceedArea,
      exceeds,
    });

    // Add a page and draw the image scaled to fit and centered
    doc.addPage({ size: [pageWidthPt, pageHeightPt], margin: 0 });
    const { drawX, drawY, drawWidth, drawHeight } = computeFitCenterRect(
      imgW,
      imgH,
      pageWidthPt,
      pageHeightPt
    );

    const imgBuffer = await blob.arrayBuffer();
    // PDFKit auto-detects PNG/JPEG. html-to-image returns PNG by default.
    doc.image(imgBuffer as ArrayBuffer, drawX, drawY, {
      width: drawWidth,
      height: drawHeight,
    });

    onProgress?.(((i + 1) / totalPages) * 100);
    await microYield();
  }

  // Finalize the PDF stream
  await finalize();

  // restore wrapper transform
  if (wrapper) {
    restoreTransform(wrapper, prevTransform);
    console.log("[PDF:nonSafari] Wrapper transform restored");
  }
}
