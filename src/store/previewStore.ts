import { create } from "zustand";
import { PhotoItem, SizeItem } from "@/components/types";
import { calcRatio } from "@/lib/utils";

interface PreviewStore {
  previewItems: PhotoItem[];
  addItem: (item: PhotoItem) => void;
  updateItem: (item: PhotoItem) => void;
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
  scale: number;
  setScale: (scale: number) => void;
  imageQuality: number;
  setImageQuality: (quality: number) => void;
  ratioToSizeMap: Record<string, SizeItem>;
  updateRatioMap: (ratio: string, size: SizeItem) => void;
  findBestMatchSize: (imageRatio: number) => SizeItem;
}

// 添加预设尺寸列表
export const PRESET_SIZES: SizeItem[] = [
  { name: "1:1", width: 102, height: 102, id: "1", imageRatio: "1/1" },
  { name: "一寸", width: 25, height: 35, id: "2", imageRatio: "5/7" },
  { name: "二寸", width: 35, height: 49, id: "3", imageRatio: "5/7" },
  { name: "五寸", width: 89, height: 127, id: "4", imageRatio: "127/89" },
  { name: "六寸", width: 102, height: 152, id: "5", imageRatio: "3/4" },
  { name: "A4", width: 210, height: 297, id: "6", imageRatio: "70/99" },
];

export const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  六寸: { width: 102, height: 152 },
};

const RATIO_TO_SIZE_MAP: Record<string, SizeItem> = {
  "1/1": PRESET_SIZES[0],
  "3/4": PRESET_SIZES[4],
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
    set((state) => ({
      paperSize: size,
    })),
  addItem: (item) =>
    set((state) => ({
      previewItems: [
        ...state.previewItems,
        {
          ...item,
          id: crypto.randomUUID(),
          isVertical: false,
          x: 0,
          y: 0,
        },
      ],
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
    set((state) => ({
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
    const { ratioToSizeMap, updateRatioMap, findBestMatchSize } = state;

    const processImage = async (file: File) => {
      return new Promise<PhotoItem>((resolve, reject) => {
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

            const newItem: PhotoItem = {
              imageRatio,
              id: crypto.randomUUID(),
              name: `${file.name}`,
              imageUrl: e.target?.result as string,
              isVertical: false,
              x: 0,
              y: 0,
            };
            resolve(newItem);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const newItems = await Promise.all(files.map(processImage));
      set({ previewItems: [...state.previewItems, ...newItems] });
    } catch (error) {
      console.error("处理批量图片失败:", error);
    }
  },
  pageMargin: 0,
  setPageMargin: (margin) => set({ pageMargin: margin }),
  autoLayout: false,
  setAutoLayout: (auto) => set({ autoLayout: auto }),
  scale: 4,
  setScale: (scale) => set({ scale }),
  imageQuality: 0.8,
  setImageQuality: (quality) => set({ imageQuality: quality }),
  ratioToSizeMap: RATIO_TO_SIZE_MAP,
  updateRatioMap: (ratio, size) =>
    set((state) => ({
      ratioToSizeMap: {
        ...state.ratioToSizeMap,
        [ratio]: size,
      },
    })),
}));
