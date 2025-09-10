import { useDownloadStore } from "@/store/DownloadStore";
import html2canvas from "html2canvas";
import { stabilizeBeforeSnapshot } from "../snapshot";
import { computeFitCenterRect } from "./layout";
import { createStreamingPdf } from "./stream";

import type { ExportPdfOptions, ProgressCallback } from "./index";

const mmToPt = (mm: number) => (mm * 72) / 25.4;

export async function exportPdfSafari(
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

  const pageWidthPt = mmToPt(photoWidthMm);
  const pageHeightPt = mmToPt(photoHeightMm);

  const pageElements: HTMLElement[] = Array.from(
    document.querySelectorAll('[id^="page-"]')
  );
  const totalPages = pageElements.length;

  // Temporarily disable scale on wrapper to avoid blank captures
  const wrapper = document.getElementById(wrapperId) as HTMLElement | null;
  const prevTransform = wrapper?.style.transform;
  if (wrapper) wrapper.style.setProperty("transform", "none", "important");

  const { imageQuality } = useDownloadStore.getState();
  const { doc, finalize } = await createStreamingPdf(filename);

  for (let i = 0; i < pageElements.length; i++) {
    const element = pageElements[i];
    await stabilizeBeforeSnapshot(element);
    await new Promise((r) => setTimeout(r, 60));

    const elemWidthPx = element.offsetWidth || element.clientWidth;
    const elemHeightPx = element.offsetHeight || element.clientHeight;
    // Base 300 DPI for print; allow DPI to scale with pixelRatio up to 1200
    const baseDpi = 300;
    const desiredDpi = Math.min(
      1200,
      Math.round(baseDpi * Math.max(1, pixelRatio || 2))
    );
    const targetWidthPx = Math.round((photoWidthMm / 25.4) * desiredDpi);
    const targetHeightPx = Math.round((photoHeightMm / 25.4) * desiredDpi);
    const scaleX = targetWidthPx / Math.max(1, elemWidthPx);
    const scaleY = targetHeightPx / Math.max(1, elemHeightPx);
    // Dynamic cap to avoid Safari canvas limits (side/area). Conservative defaults.
    const maxCanvasSide = 8192; // conservative side limit per canvas
    const maxCanvasArea = 64 * 1024 * 1024; // 64M pixels
    const sideCap = Math.min(
      maxCanvasSide / Math.max(1, elemWidthPx),
      maxCanvasSide / Math.max(1, elemHeightPx)
    );
    const areaCap = Math.sqrt(
      maxCanvasArea / Math.max(1, elemWidthPx * elemHeightPx)
    );
    const scale = Math.max(1, Math.min(scaleX, scaleY, sideCap, areaCap));

    // Apply backside flip when needed (temporary), then restore after capture
    const isBackside = element.id.includes("backside");
    const prevElementTransform = element.style.transform;
    if (isBackside && backsideFlip) {
      element.style.setProperty(
        "transform",
        "rotate(180deg) scaleX(-1)",
        "important"
      );
      // allow style to take effect
      await new Promise((r) => setTimeout(r, 30));
    }

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    // Use JPEG to avoid zlib inflate issues in PDFKit image embedding
    const dataUrl = canvas.toDataURL(
      "image/jpeg",
      Math.max(0, Math.min(1, imageQuality ?? 0.85))
    );
    const blob: Blob = await (await fetch(dataUrl)).blob();
    const imgBuffer = await blob.arrayBuffer();
    const imgW = canvas.width;
    const imgH = canvas.height;
    if (!imgW || !imgH)
      throw new Error("Safari capture produced zero-sized canvas");

    // Add page and draw scaled image centered
    doc.addPage({ size: [pageWidthPt, pageHeightPt], margin: 0 });
    const { drawX, drawY, drawWidth, drawHeight } = computeFitCenterRect(
      imgW,
      imgH,
      pageWidthPt,
      pageHeightPt
    );
    doc.image(imgBuffer as ArrayBuffer, drawX, drawY, {
      width: drawWidth,
      height: drawHeight,
    });

    onProgress?.(((i + 1) / totalPages) * 100);

    // restore transform
    if (isBackside && backsideFlip) {
      if (prevElementTransform)
        element.style.setProperty("transform", prevElementTransform);
      else element.style.removeProperty("transform");
    }
  }

  if (wrapper) {
    if (prevTransform) wrapper.style.setProperty("transform", prevTransform);
    else wrapper.style.removeProperty("transform");
  }

  await finalize();
}
