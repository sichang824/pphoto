import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
import { stabilizeBeforeSnapshot } from "../snapshot";

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

	const captured: { dataUrl: string; width: number; height: number }[] = [];

	// Temporarily disable scale on wrapper to avoid blank captures
	const wrapper = document.getElementById(wrapperId) as HTMLElement | null;
	const prevTransform = wrapper?.style.transform;
	if (wrapper) wrapper.style.setProperty("transform", "none", "important");

	for (let i = 0; i < pageElements.length; i++) {
		const element = pageElements[i];
		await stabilizeBeforeSnapshot(element);
		await new Promise((r) => setTimeout(r, 60));

		const elemWidthPx = element.offsetWidth || element.clientWidth;
		const elemHeightPx = element.offsetHeight || element.clientHeight;
		const targetDpi = 300;
		const targetWidthPx = Math.round((photoWidthMm / 25.4) * targetDpi);
		const targetHeightPx = Math.round((photoHeightMm / 25.4) * targetDpi);
		const scaleX = targetWidthPx / Math.max(1, elemWidthPx);
		const scaleY = targetHeightPx / Math.max(1, elemHeightPx);
		// Allow higher scale for sharper output in Safari, while keeping a reasonable upper bound
		const scale = Math.min(5, Math.min(scaleX, scaleY, pixelRatio || 2));

		// Apply backside flip when needed (temporary), then restore after capture
		const isBackside = element.id.includes("backside");
		const prevElementTransform = element.style.transform;
		if (isBackside && backsideFlip) {
			element.style.setProperty("transform", "rotate(180deg) scaleX(-1)", "important");
			// allow style to take effect
			await new Promise((r) => setTimeout(r, 30));
		}

		const canvas = await html2canvas(element, {
			scale,
			useCORS: true,
			backgroundColor: "#ffffff",
		});
		// Prefer PNG for lossless quality suitable for print
		const dataUrl = canvas.toDataURL("image/png");
		const width = canvas.width;
		const height = canvas.height;
		if (!width || !height) throw new Error("Safari capture produced zero-sized canvas");
		captured.push({ dataUrl, width, height });
		onProgress?.(((i + 1) / totalPages) * 100);

		// restore transform
		if (isBackside && backsideFlip) {
			if (prevElementTransform) element.style.setProperty("transform", prevElementTransform);
			else element.style.removeProperty("transform");
		}
	}

	if (wrapper) {
		if (prevTransform) wrapper.style.setProperty("transform", prevTransform);
		else wrapper.style.removeProperty("transform");
	}

	const pdfDoc = await PDFDocument.create();
	for (const { dataUrl } of captured) {
		const img = await pdfDoc.embedPng(dataUrl);
		const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
		page.drawImage(img, { x: 0, y: 0, width: pageWidthPt, height: pageHeightPt });
	}
	const pdfBytes = await pdfDoc.save();
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


