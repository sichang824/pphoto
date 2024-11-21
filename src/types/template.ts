import { PageMarginUnit, PrintStyleId, SizeItem } from "@/components/types";
import { PhotoItem } from "@/components/types";

export interface TemplateConfig {
  paperSize: string;
  paperLandscape: boolean;
  pageMargin: number;
  pageMarginUnit: PageMarginUnit;
  spacing: number;
  doubleSided: boolean;
  printStyleId: PrintStyleId;
  pixelRatio: number;
  imageQuality: number;
  enableRatioMap: boolean;
}

export interface Template {
  id: string;
  name: string;
  createdAt: string;
  image: string;
  configs: TemplateConfig;
  items: PhotoItem[];
  customSizes: SizeItem[];
}
