import { usePreviewStore } from "@/store/previewStore";
import { toBlob as htmlToBlob } from "html-to-image";
import { PDFDocument } from "pdf-lib";
import { del, get, prefixClear, put } from "../idb";
import { logMemory } from "../memory";
import { stabilizeBeforeSnapshot } from "../snapshot";
import { microYield } from "./microYield";
import { extractTileBlob, getImageSizeFromBlob, planTiles } from "./tiling";

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

  // Large image thresholds and tile config (balanced for performance)
  const MAX_PAGE_SIDE = 4096; // px
  const MAX_PAGE_PIXELS = 16 * 1024 * 1024; // 16M px
  const TILE_SIDE = 2048; // px per tile side

  console.log("[PDF:nonSafari] Begin export", {
    totalPages,
    pixelRatio,
    filename,
    pageWidthPt,
    pageHeightPt,
    MAX_PAGE_SIDE,
    MAX_PAGE_PIXELS,
    TILE_SIDE,
  });
  logMemory("begin export");

  // Clean up any leftover cache from previous runs
  try {
    await prefixClear("page:");
  } catch {}

  // Temporarily disable scale on wrapper to avoid capture distortion
  const wrapper = document.getElementById(wrapperId) as HTMLElement | null;
  const prevTransform = wrapper?.style.transform;
  if (wrapper) {
    console.log("[PDF:nonSafari] Temporarily disabling wrapper transform");
    wrapper.style.setProperty("transform", "none", "important");
    logMemory("after disable transform");
  }

  // Capture phase (store blobs in IndexedDB)
  for (let i = 0; i < pageElements.length; i++) {
    const element = pageElements[i];
    await stabilizeBeforeSnapshot(element);

    const toBlobOptions = {
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
    } as unknown as Parameters<typeof htmlToBlob>[1];
    const blob: Blob | null = await htmlToBlob(element, toBlobOptions);
    if (!blob) throw new Error("Canvas toBlob failed");
    logMemory(`after toBlob page ${i}`);

    // Check size and optionally tile
    let tiled = false;
    try {
      const { enableTiles } = usePreviewStore.getState();
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
      if (enableTiles && exceeds) {
        const tiles = planTiles(imgW, imgH, TILE_SIDE);
        console.log("[PDF:nonSafari] Page tiling", {
          index: i,
          tiles: tiles.length,
          tileSide: TILE_SIDE,
        });
        await put(`page:${i}:meta`, { imgW, imgH, tileSide: TILE_SIDE });
        for (let t = 0; t < tiles.length; t++) {
          const tileBlob = await extractTileBlob(blob, tiles[t], "image/png");
          await put(`page:${i}:${t}`, tileBlob);
          await microYield();
          logMemory(`after store tile ${i}:${t}`);
        }
        tiled = true;
      }
    } catch (e) {
      console.warn(
        "[PDF:nonSafari] Tiling failed, fallback to single image",
        e
      );
    }

    if (!tiled) {
      await put(`page:${i}`, blob);
      logMemory(`after store page ${i}`);
    }
    onProgress?.(((i + 1) / totalPages) * 50); // first 50% for capture

    await microYield();
    logMemory(`after yield capture page ${i}`);
  }

  // Assembly phase (read blobs and build PDF)
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
    // Decide path by presence of meta
    const meta =
      (await get<{ imgW: number; imgH: number; tileSide: number }>(
        `page:${i}:meta`
      )) || null;
    if (!meta) {
      // Single image path
      const blob = (await get<Blob>(`page:${i}`)) as Blob | undefined;
      if (!blob) throw new Error(`Missing page blob for index ${i}`);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const img = await pdfDoc.embedPng(bytes);
      // Preserve aspect ratio and center inside the page
      const imgWidthPt = img.width;
      const imgHeightPt = img.height;
      const imgRatio = imgWidthPt / Math.max(1, imgHeightPt);
      const pageRatio = pageWidthPt / Math.max(1, pageHeightPt);
      let drawWidth = pageWidthPt;
      let drawHeight = pageHeightPt;
      let drawX = 0;
      let drawY = 0;
      if (Math.abs(imgRatio - pageRatio) < 1e-3) {
        drawWidth = pageWidthPt;
        drawHeight = pageHeightPt;
        drawX = 0;
        drawY = 0;
      } else if (imgRatio > pageRatio) {
        drawWidth = pageWidthPt;
        drawHeight = pageWidthPt / imgRatio;
        drawX = 0;
        drawY = (pageHeightPt - drawHeight) / 2;
      } else {
        drawHeight = pageHeightPt;
        drawWidth = pageHeightPt * imgRatio;
        drawX = (pageWidthPt - drawWidth) / 2;
        drawY = 0;
      }
      console.log("[PDF:nonSafari] Assemble single image", {
        index: i,
        imgWidthPt,
        imgHeightPt,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      });
      page.drawImage(img, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
      });
      await del(`page:${i}`);
      logMemory(`after assemble single page ${i}`);
    } else {
      // Tiled path
      const imgW = meta.imgW;
      const imgH = meta.imgH;
      // Compute draw rect consistent with single-image logic (fit and center)
      const imgRatio = imgW / Math.max(1, imgH);
      const pageRatio = pageWidthPt / Math.max(1, pageHeightPt);
      let drawWidth = pageWidthPt;
      let drawHeight = pageHeightPt;
      let drawX = 0;
      let drawY = 0;
      if (Math.abs(imgRatio - pageRatio) < 1e-3) {
        drawWidth = pageWidthPt;
        drawHeight = pageHeightPt;
        drawX = 0;
        drawY = 0;
      } else if (imgRatio > pageRatio) {
        drawWidth = pageWidthPt;
        drawHeight = pageWidthPt / imgRatio;
        drawX = 0;
        drawY = (pageHeightPt - drawHeight) / 2;
      } else {
        drawHeight = pageHeightPt;
        drawWidth = pageHeightPt * imgRatio;
        drawX = (pageWidthPt - drawWidth) / 2;
        drawY = 0;
      }

      console.log("[PDF:nonSafari] Assemble tiled image", {
        index: i,
        imgW,
        imgH,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      });

      // Precompute tile rects and iterate deterministically by index
      const tiles = planTiles(imgW, imgH, meta.tileSide);
      for (let tileIdx = 0; tileIdx < tiles.length; tileIdx++) {
        const rect = tiles[tileIdx];
        const key = `page:${i}:${tileIdx}`;
        const tBlob = await get<Blob>(key);
        if (!tBlob) throw new Error(`Missing tile blob ${key}`);
        const tBytes = new Uint8Array(await tBlob.arrayBuffer());
        const tImg = await pdfDoc.embedPng(tBytes);
        // Map tile rect in px to PDF pt inside draw rect
        const scaleX = drawWidth / Math.max(1, imgW);
        const scaleY = drawHeight / Math.max(1, imgH);
        const xPt = drawX + rect.sx * scaleX;
        const hPt = rect.sh * scaleY;
        const yPt = drawY + (drawHeight - (rect.sy + rect.sh) * scaleY);
        const wPt = rect.sw * scaleX;
        page.drawImage(tImg, { x: xPt, y: yPt, width: wPt, height: hPt });
        await del(key);
        await microYield();
        logMemory(`after draw tile ${i}:${tileIdx}`);
      }
      await del(`page:${i}:meta`);
      logMemory(`after assemble tiled page ${i}`);
    }
    onProgress?.(50 + ((i + 1) / totalPages) * 50);
    await microYield();
    logMemory(`after yield assemble page ${i}`);
  }

  // restore wrapper transform
  if (wrapper) {
    if (prevTransform) wrapper.style.setProperty("transform", prevTransform);
    else wrapper.style.removeProperty("transform");
    console.log("[PDF:nonSafari] Wrapper transform restored");
    logMemory("after restore transform");
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  console.log("[PDF:nonSafari] Save complete", { bytes: pdfBytes.length });
  logMemory("after save pdf (bytes in memory)");
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
