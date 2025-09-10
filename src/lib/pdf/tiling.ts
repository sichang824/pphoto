export interface ImageSize {
	width: number;
	height: number;
}

export interface TileRect {
	sx: number; // source x in px (top-left origin)
	sy: number; // source y in px (top-left origin)
	sw: number; // source width in px
	sh: number; // source height in px
}

export async function getImageSizeFromBlob(blob: Blob): Promise<ImageSize> {
	// Prefer createImageBitmap for performance when available
	if (typeof createImageBitmap === "function") {
		const bmp = await createImageBitmap(blob);
		const size = { width: bmp.width, height: bmp.height };
		bmp.close?.();
		return size;
	}
	// Fallback to HTMLImageElement
	return new Promise<ImageSize>((resolve, reject) => {
		const url = URL.createObjectURL(blob);
		const img = new Image();
		img.onload = () => {
			const size = { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
			URL.revokeObjectURL(url);
			resolve(size);
		};
		img.onerror = (e) => {
			URL.revokeObjectURL(url);
			reject(e);
		};
		img.src = url;
	});
}

export function planTiles(imageWidth: number, imageHeight: number, tileSide = 2048): TileRect[] {
	const tiles: TileRect[] = [];
	const cols = Math.ceil(imageWidth / tileSide);
	const rows = Math.ceil(imageHeight / tileSide);
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const sx = c * tileSide;
			const sy = r * tileSide;
			const sw = Math.min(tileSide, imageWidth - sx);
			const sh = Math.min(tileSide, imageHeight - sy);
			tiles.push({ sx, sy, sw, sh });
		}
	}
	return tiles;
}

export async function extractTileBlob(source: Blob, rect: TileRect, mime: string = "image/png"): Promise<Blob> {
	// Use createImageBitmap with crop rect to avoid drawing the entire image when possible
	if (typeof createImageBitmap === "function") {
		const bmp = await createImageBitmap(source, rect.sx, rect.sy, rect.sw, rect.sh);
		const canvas = document.createElement("canvas");
		canvas.width = rect.sw;
		canvas.height = rect.sh;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("2D context not available");
		ctx.drawImage(bmp, 0, 0);
		bmp.close?.();
		const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, mime));
		if (!blob) throw new Error("toBlob failed for tile");
		return blob;
	}
	// Fallback: draw the full image then crop (may be heavier but rarely used)
	const url = URL.createObjectURL(source);
	const img = await new Promise<HTMLImageElement>((resolve, reject) => {
		const i = new Image();
		i.onload = () => resolve(i);
		i.onerror = reject;
		i.src = url;
	});
	const canvas = document.createElement("canvas");
	canvas.width = rect.sw;
	canvas.height = rect.sh;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("2D context not available");
	ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, rect.sw, rect.sh);
	URL.revokeObjectURL(url);
	const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, mime));
	if (!blob) throw new Error("toBlob failed for tile");
	return blob;
}


