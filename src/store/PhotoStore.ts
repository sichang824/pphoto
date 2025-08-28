import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PhotoStoreState {
  showPhotoBackground: boolean;
  setShowPhotoBackground: (value: boolean) => void;
  photoBackgroundColor: string;
  setPhotoBackgroundColor: (color: string) => void;
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
    }),
    {
      name: "photo-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        showPhotoBackground: state.showPhotoBackground,
        photoBackgroundColor: state.photoBackgroundColor,
      }),
    }
  )
);
