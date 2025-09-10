export interface FitCenterRect {
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}

export function computeFitCenterRect(
  imgWidth: number,
  imgHeight: number,
  pageWidth: number,
  pageHeight: number
): FitCenterRect {
  const imgRatio = imgWidth / Math.max(1, imgHeight);
  const pageRatio = pageWidth / Math.max(1, pageHeight);
  let drawWidth = pageWidth;
  let drawHeight = pageHeight;
  let drawX = 0;
  let drawY = 0;
  if (Math.abs(imgRatio - pageRatio) < 1e-3) {
    drawWidth = pageWidth;
    drawHeight = pageHeight;
    drawX = 0;
    drawY = 0;
  } else if (imgRatio > pageRatio) {
    drawWidth = pageWidth;
    drawHeight = pageWidth / imgRatio;
    drawX = 0;
    drawY = (pageHeight - drawHeight) / 2;
  } else {
    drawHeight = pageHeight;
    drawWidth = pageHeight * imgRatio;
    drawX = (pageWidth - drawWidth) / 2;
    drawY = 0;
  }
  return { drawX, drawY, drawWidth, drawHeight };
}
