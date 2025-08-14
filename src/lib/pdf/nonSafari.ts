import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { stabilizeBeforeSnapshot } from "../snapshot";

import type { ExportPdfOptions, ProgressCallback } from "./index";

export async function exportPdfDefault(
	opts: ExportPdfOptions,
	onProgress?: ProgressCallback
) {
	const {
		photoWidthMm,
		photoHeightMm,
		pixelRatio,
		backsideFlip,
		filename = "照片打印.pdf",
	} = opts;

	const pdf = new jsPDF({
		orientation: photoWidthMm > photoHeightMm ? "landscape" : "portrait",
		unit: "mm",
		format: [photoWidthMm, photoHeightMm],
	});
	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();

	const pageElements: HTMLElement[] = Array.from(
		document.querySelectorAll('[id^="page-"]')
	);
	const totalPages = pageElements.length;

	for (let i = 0; i < pageElements.length; i++) {
		const element = pageElements[i];
		if (i > 0) {
			pdf.addPage();
		}
		await stabilizeBeforeSnapshot(element);
		const toPngOptions = {
			style: {
				transform: element.id.includes("backside") && backsideFlip ? `rotate(180deg) scaleX(-1)` : "",
			},
			pixelRatio,
			// quality does not apply to PNG; keep background solid white for print
			backgroundColor: "#ffffff",
			cacheBust: true,
			// crossOrigin is not in the official types; cast through unknown
			crossOrigin: "anonymous",
		} as unknown as Parameters<typeof toPng>[1];
		const dataUrl = await toPng(element, toPngOptions);
		const isJpeg = dataUrl.startsWith("data:image/jpeg");
		const fmt: "PNG" | "JPEG" = isJpeg ? "JPEG" : "PNG";
		pdf.addImage(dataUrl, fmt, 0, 0, pageWidth, pageHeight);
		onProgress?.(((i + 1) / totalPages) * 100);
	}

	pdf.save(filename);
}


