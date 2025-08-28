import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type HorizontalAlign = "left" | "center" | "right";
type VerticalAlign = "top" | "center" | "bottom";

interface PhotoStoreState {
  showPhotoBackground: boolean;
  setShowPhotoBackground: (value: boolean) => void;
  photoBackgroundColor: string;
  setPhotoBackgroundColor: (color: string) => void;
  horizontalAlign: HorizontalAlign;
  setHorizontalAlign: (align: HorizontalAlign) => void;
  verticalAlign: VerticalAlign;
  setVerticalAlign: (align: VerticalAlign) => void;
}

// Tailwind bg-gray-100 hex: #f3f4f6
const DEFAULT_BG_COLOR = "#f3f4f6";

export const usePhotoStore = create<PhotoStoreState>()(
  persist(
    (set) => ({
      showPhotoBackground: true,
      setShowPhotoBackground: (value) => set({ showPhotoBackground: value }),
      photoBackgroundColor: DEFAULT_BG_COLOR,
      setPhotoBackgroundColor: (color) => set({ photoBackgroundColor: color }),
      horizontalAlign: "center",
      setHorizontalAlign: (align) => set({ horizontalAlign: align }),
      verticalAlign: "center",
      setVerticalAlign: (align) => set({ verticalAlign: align }),
    }),
    {
      name: "photo-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        showPhotoBackground: state.showPhotoBackground,
        photoBackgroundColor: state.photoBackgroundColor,
        horizontalAlign: state.horizontalAlign,
        verticalAlign: state.verticalAlign,
      }),
    }
  )
);
