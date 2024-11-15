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
  scale: number;
  fitMode: "width" | "height";
}

export const defaultPhotoItem: PhotoItem = {
  id: "",
  name: "",
  imageRatio: "",
  isVertical: false,
  x: 0,
  y: 0,
  scale: 1,
  fitMode: "height",
};

export type PrintStyleId = "normal" | "borderless" | `style${number}`;
export const defaultPrintStyleId: PrintStyleId = "normal";

export type PrintStyle = {
  id: PrintStyleId;
  name: string;
  description: string;
};

export type PageMarginUnit = "mm" | "px";
export const defaultPageMarginUnit: PageMarginUnit = "mm";

export interface Page {
  id: string;
  items: PhotoItem[];
}
