export interface SizeItem {
  id: string;
  name: string;
  width: number;
  height: number;
  imageRatio: string;
}

export interface PhotoItem {
  id: string;
  name: string;
  imageRatio: string;
  isVertical: boolean;
  imageUrl?: string;
  x: number;
  y: number;
}

export type PrintStyleId = "normal" | "borderless" | `style${number}`;
export const defaultPrintStyleId: PrintStyleId = "normal";

export type PrintStyle = {
  id: PrintStyleId;
  name: string;
  description: string;
};

export type PageMarginUnit = "mm" | "px";
export const defaultPageMarginUnit: PageMarginUnit = "mm";
