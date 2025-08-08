/**
 * Utilities to stabilize DOM rendering before rasterizing with html-to-image or html2canvas.
 * Helps Safari avoid blank canvases caused by timing/cross-frame layout issues.
 */

export interface SnapshotMetrics {
  clientWidth: number;
  clientHeight: number;
  offsetWidth: number;
  offsetHeight: number;
  rectWidth: number;
  rectHeight: number;
  transform: string;
  imageCount: number;
}

export async function stabilizeBeforeSnapshot(element: HTMLElement): Promise<SnapshotMetrics> {
  // Wait two RAFs to ensure previous layout/paint cycles are complete
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  // Ensure images inside are decoded/loaded where possible
  const images: HTMLImageElement[] = Array.from(element.querySelectorAll('img'));
  await Promise.allSettled(
    images.map((img) => {
      if ('decode' in img && typeof img.decode === 'function') {
        return (img.decode() as Promise<void>).catch(() => undefined);
      }
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    })
  );

  // Force layout by reading metrics
  const rect = element.getBoundingClientRect();
  const computed = getComputedStyle(element);

  const metrics: SnapshotMetrics = {
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    rectWidth: rect.width,
    rectHeight: rect.height,
    transform: computed.transform,
    imageCount: images.length,
  };

  // One more RAF just before capture
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  return metrics;
}


