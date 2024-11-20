import { create } from "zustand";
import {
  defaultPageMarginUnit,
  defaultPhotoItem,
  defaultPrintStyleId,
  PageMarginUnit,
  PhotoItem,
  PrintStyle,
  PrintStyleId,
  SizeItem,
} from "@/components/types";
import { calcRatio } from "@/lib/utils";

// 添加预设尺寸列表
export const PRESET_SIZES: SizeItem[] = [
  { name: "1:1", width: 102, height: 102, id: "1", imageRatio: "1/1" },
  { name: "一寸", width: 25, height: 35, id: "2", imageRatio: "5/7" },
  { name: "二寸", width: 33, height: 48, id: "3", imageRatio: "33/48" },
  { name: "三寸", width: 62, height: 85, id: "4", imageRatio: "62/85" },
  { name: "五寸", width: 89, height: 127, id: "5", imageRatio: "89/127" },
  { name: "六寸", width: 102, height: 152, id: "6", imageRatio: "102/152" },
  { name: "大六寸", width: 114, height: 152, id: "7", imageRatio: "114/152" },
  { name: "七寸", width: 127, height: 178, id: "8", imageRatio: "127/178" },
  { name: "八寸", width: 152, height: 203, id: "9", imageRatio: "152/203" },
  { name: "A4", width: 210, height: 297, id: "10", imageRatio: "70/99" },
  { name: "A3", width: 297, height: 420, id: "11", imageRatio: "99/140" },
];

export const PAPER_SIZES: Record<
  string,
  { width: number; height: number; imageRatio: string }
> = {
  A3: { width: 297, height: 420, imageRatio: "70/99" },
  A4: { width: 210, height: 297, imageRatio: "70/99" },
  A5: { width: 148, height: 210, imageRatio: "70/99" },
  六寸: { width: 102, height: 152, imageRatio: "102/152" },
};

const RATIO_TO_SIZE_MAP: Record<string, SizeItem> = {
  "1/1": PRESET_SIZES[0],
  "5/7": PRESET_SIZES[1],
  "33/48": PRESET_SIZES[2],
  "62/85": PRESET_SIZES[3],
  "89/127": PRESET_SIZES[4],
  "102/152": PRESET_SIZES[5],
  "114/152": PRESET_SIZES[6],
  "127/178": PRESET_SIZES[7],
  "152/203": PRESET_SIZES[8],
  "70/99": PRESET_SIZES[9],
  "99/140": PRESET_SIZES[10],
};

export const BACKSIDE_PRINT_STYLES: PrintStyle[] = [
  {
    id: "normal",
    name: "普通双面打印",
    description: "所有照片打印在纸张的正反两面",
  },
  {
    id: "borderless",
    name: "标准无边框",
    description: "没有边框的标准明信片样式",
  },
  {
    id: "style1",
    name: "标准明信片",
    description: "标准明信片样式",
  },
  {
    id: "style2",
    name: "标准白底黑白边框",
    description: "",
  },
];

export const SETTINGS_CONFIG = {
  pageMargin: {
    min: 0,
    max: 20,
    step: 1,
    default: 5,
  },
  pixelRatio: {
    min: 1,
    max: 4,
    step: 0.5,
    default: 2,
  },
  imageQuality: {
    min: 0.1,
    max: 1,
    step: 0.1,
    default: 0.8,
  },
  pageMarginUnit: {
    options: ["mm", "px"] as const,
  },
  spacing: {
    min: 0,
    max: 20,
    step: 1,
    default: 5,
  },
} as const;

export const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

interface PreviewStore {
  previewItems: PhotoItem[];
  addItem: (item: Partial<PhotoItem>) => void;
  updateItem: (item: Partial<PhotoItem>) => void;
  removeItem: (id: string) => void;
  toggleOrientation: (id: string) => void;
  paperLandscape: boolean;
  setPaperLandscape: (isLandscape: boolean) => void;
  paperSize: string;
  setPaperSize: (size: string) => void;
  addBatchImages: (files: File[]) => Promise<void>;
  pageMargin: number;
  setPageMargin: (margin: number) => void;
  autoLayout: boolean;
  setAutoLayout: (auto: boolean) => void;
  pixelRatio: number;
  setPixelRatio: (ratio: number) => void;
  imageQuality: number;
  setImageQuality: (quality: number) => void;
  ratioToSizeMap: Record<string, SizeItem>;
  updateRatioMap: (ratio: string, size: SizeItem) => void;
  findBestMatchSize: (imageRatio: number) => SizeItem;
  pageMarginUnit: PageMarginUnit;
  setPageMarginUnit: (unit: PageMarginUnit) => void;
  doubleSided: boolean;
  setDoubleSided: (value: boolean) => void;
  printStyleId: PrintStyleId;
  setPrintStyleId: (style: PrintStyleId) => void;
  spacing: number;
  setSpacing: (spacing: number) => void;
  enableRatioMap: boolean;
  setEnableRatioMap: (enable: boolean) => void;
  customSizes: SizeItem[];
  addCustomSize: (size: SizeItem) => void;
  removeCustomSize: (id: string) => void;
}

// 从 localStorage 加载 customSizes
const loadCustomSizes = (): SizeItem[] => {
  const savedSizes = localStorage.getItem("customSizes");
  return savedSizes ? JSON.parse(savedSizes) : [];
};

export const usePreviewStore = create<PreviewStore>((set) => ({
  paperLandscape: false,
  previewItems: [],
  paperSize: "A4",
  updateItem: (item) =>
    set((state) => ({
      previewItems: state.previewItems.map((i) =>
        i.id === item.id ? { ...i, ...item } : i
      ),
    })),
  setPaperSize: (size) =>
    set(() => ({
      paperSize: size,
    })),
  addItem: (item) =>
    set((state) => ({
      previewItems: [...state.previewItems, { ...defaultPhotoItem, ...item }],
    })),
  removeItem: (id) =>
    set((state) => ({
      previewItems: state.previewItems.filter((item) => item.id !== id),
    })),
  toggleOrientation: (id) =>
    set((state) => ({
      previewItems: state.previewItems.map((item) =>
        item.id === id ? { ...item, isVertical: !item.isVertical } : item
      ),
    })),
  setPaperLandscape: (isLandscape) =>
    set(() => ({
      paperLandscape: isLandscape,
    })),

  findBestMatchSize: (imageRatio: number): SizeItem => {
    let bestMatch = PRESET_SIZES[0];
    let minDifference = Infinity;
    PRESET_SIZES.forEach((size) => {
      const sizeRatio = size.width / size.height;
      const difference = Math.abs(sizeRatio - imageRatio);

      if (difference < minDifference) {
        minDifference = difference;
        bestMatch = size;
      }
    });

    return bestMatch;
  },

  addBatchImages: async (files: File[]) => {
    const state = usePreviewStore.getState();
    const { ratioToSizeMap, updateRatioMap, findBestMatchSize, addItem } =
      state;

    const processImage = async (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const w = img.width;
            const h = img.height;
            const imageRatio = calcRatio(w, h);

            if (!ratioToSizeMap[imageRatio]) {
              const size = findBestMatchSize(w / h);
              updateRatioMap(imageRatio, size);
            }

            addItem({
              imageRatio,
              id: generateId(),
              name: `${file.name}`,
              imageUrl: e.target?.result as string,
            });
            resolve();
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      await Promise.all(files.map(processImage));
    } catch (error) {
      console.error("处理批量图片失败:", error);
    }
  },
  pageMargin: SETTINGS_CONFIG.pageMargin.default,
  setPageMargin: (margin) => set({ pageMargin: margin }),
  autoLayout: true,
  setAutoLayout: (auto) => set({ autoLayout: auto }),
  pixelRatio: SETTINGS_CONFIG.pixelRatio.default,
  setPixelRatio: (ratio) => set({ pixelRatio: ratio }),
  imageQuality: SETTINGS_CONFIG.imageQuality.default,
  setImageQuality: (quality) => set({ imageQuality: quality }),
  ratioToSizeMap: RATIO_TO_SIZE_MAP,
  updateRatioMap: (ratio, size) =>
    set((state) => ({
      ratioToSizeMap: {
        ...state.ratioToSizeMap,
        [ratio]: size,
      },
    })),
  pageMarginUnit: defaultPageMarginUnit,
  setPageMarginUnit: (unit) => set({ pageMarginUnit: unit }),
  doubleSided: false,
  setDoubleSided: (value: boolean) => set({ doubleSided: value }),
  printStyleId: defaultPrintStyleId,
  setPrintStyleId: (style) => set({ printStyleId: style }),
  spacing: SETTINGS_CONFIG.spacing.default,
  setSpacing: (spacing) => set({ spacing: spacing }),
  enableRatioMap: true,
  setEnableRatioMap: (enable) => set({ enableRatioMap: enable }),
  customSizes: loadCustomSizes(),
  addCustomSize: (size: SizeItem) =>
    set((state) => {
      const updatedSizes = [...state.customSizes, size];
      localStorage.setItem("customSizes", JSON.stringify(updatedSizes));
      return { customSizes: updatedSizes };
    }),
  removeCustomSize: (id: string) =>
    set((state) => {
      const updatedSizes = state.customSizes.filter((size) => size.id !== id);
      localStorage.setItem("customSizes", JSON.stringify(updatedSizes));
      return { customSizes: updatedSizes };
    }),
}));
