import { exportPdfSafari } from "@/lib/pdf/safari";
import { exportPdfDefault } from "@/lib/pdf/nonSafari";

export interface ExportPdfOptions {
	wrapperId: string;
	photoWidthMm: number; // page width in millimeters
	photoHeightMm: number; // page height in millimeters
	pixelRatio: number;
	imageQuality: number; // 0..1
	backsideFlip: boolean;
	filename?: string;
}

export type ProgressCallback = (progress?: number) => void;

export function detectSafari(): boolean {
	if (typeof navigator === "undefined") return false;
	const ua = navigator.userAgent;
	return /safari/i.test(ua) && !/chrome|android/i.test(ua);
}

export async function exportPreviewToPdf(
	opts: ExportPdfOptions,
	onProgress?: ProgressCallback
) {
	const isSafari = detectSafari();
	if (isSafari) {
		return exportPdfSafari(opts, onProgress);
	}
	return exportPdfDefault(opts, onProgress);
}


