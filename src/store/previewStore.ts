import { create } from "zustand";
import { SizeItem } from "@/components/types";

interface PreviewStore {
  previewItems: SizeItem[];
  addItem: (item: SizeItem) => void;
  removeItem: (id: string) => void;
  toggleOrientation: (id: string) => void;
  paperLandscape: boolean;
  setPaperLandscape: (isLandscape: boolean) => void;
  paperSize: string;
  setPaperSize: (size: string) => void;
  addBatchImages: (files: File[]) => Promise<void>;
  pageMargin: number;
  setPageMargin: (margin: number) => void;
}

// 添加预设尺寸列表
export const PRESET_SIZES: SizeItem[] = [
  { name: "1:1", width: 102, height: 102, id: "1", isVertical: false },
  { name: "一寸", width: 25, height: 35, id: "1", isVertical: false },
  { name: "二寸", width: 35, height: 49, id: "2", isVertical: false },
  { name: "五寸", width: 127, height: 89, id: "3", isVertical: false },
  { name: "六寸", width: 102, height: 152, id: "4", isVertical: false },
  { name: "A4", width: 210, height: 297, id: "5", isVertical: false },
];

export const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  六寸: { width: 102, height: 152 },
};

export const usePreviewStore = create<PreviewStore>((set) => ({
  paperLandscape: false,
  previewItems: [],
  paperSize: "A4",
  setPaperSize: (size) =>
    set((state) => ({
      paperSize: size,
    })),
  addItem: (item) =>
    set((state) => ({
      previewItems: [
        ...state.previewItems,
        { ...item, id: `${item.id}-${Date.now()}`, isVertical: false },
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
  addBatchImages: async (files: File[]) => {
    const findBestMatchSize = (
      imgWidth: number,
      imgHeight: number
    ): SizeItem => {
      // 计算图片的宽高比
      const imageRatio = imgWidth / imgHeight;

      // 计算每个预设尺寸与图片宽高比的差异
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
    };

    const processImage = async (file: File) => {
      return new Promise<SizeItem>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // 找到最匹配的预设尺寸
            const bestMatchSize = findBestMatchSize(img.width, img.height);

            const newItem: SizeItem = {
              ...bestMatchSize,
              id: crypto.randomUUID(),
              name: `${bestMatchSize.name}-${file.name}`,
              imageUrl: e.target?.result as string,
              isVertical: false,
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
      set((state) => ({
        previewItems: [...state.previewItems, ...newItems],
      }));
    } catch (error) {
      console.error("处理批量图片失败:", error);
    }
  },
  pageMargin: 0,
  setPageMargin: (margin) => set({ pageMargin: margin }),
}));
