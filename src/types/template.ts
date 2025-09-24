import { SizeItem, PhotoItem } from "@/components/types";
import type { ExportableSettings } from "@/store/Export";

export interface Template {
  id: string;
  name: string;
  createdAt: string;
  image: string;
  // New unified settings captured via exportSettings()
  settings: Partial<ExportableSettings>;
  items: PhotoItem[];
  customSizes: SizeItem[];
  // Backward compatibility: legacy field may exist in older files
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  configs?: LegacyTemplateConfigs;
}


export interface LegacyTemplateConfigs {
  paperSize?: string;
  paperLandscape?: boolean;
  pageMargin?: number;
  pageMarginUnit?: "mm" | "px";
  spacing?: number;
  doubleSided?: boolean;
  printStyleId?: string;
  pixelRatio?: number;
  imageQuality?: number;
  enableRatioMap?: boolean;
}
