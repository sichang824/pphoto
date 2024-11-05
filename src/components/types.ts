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


