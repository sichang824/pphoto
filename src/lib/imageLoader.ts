import { calcRatio } from "@/lib/utils";
import type { SizeItem } from "@/components/types";

export interface RatioDeps {
  ratioToSizeMap: Record<string, SizeItem>;
  updateRatioMap: (ratio: string, size: SizeItem) => void;
  findBestMatchSize: (imageRatio: number) => SizeItem;
}

/**
 * Compute ratio string from width/height and ensure it exists in the ratio map.
 * If missing, choose the nearest SizeItem and register it via updateRatioMap.
 * Returns the computed ratio string used by the app (e.g. "5/7").
 */
export function computeAndEnsureRatioMapping(
  deps: RatioDeps,
  width: number,
  height: number
): string {
  const imageRatio = calcRatio(width, height);
  if (!deps.ratioToSizeMap[imageRatio]) {
    const size = deps.findBestMatchSize(width / Math.max(1, height));
    deps.updateRatioMap(imageRatio, size);
  }
  return imageRatio;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function probeImageSizeFromDataURL(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}


