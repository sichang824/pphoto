import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DownloadMethod = "auto" | "fileSystem" | "anchor";

interface DownloadState {
  isExporting: boolean;
  preferredMethod: DownloadMethod;
  askBeforeDownload: boolean;
  // Export-related settings decoupled from preview store
  pixelRatio: number;
  imageQuality: number; // 0..1
  enableTiles: boolean;
  cleanExport: boolean;
  setIsExporting: (value: boolean) => void;
  setPreferredMethod: (method: DownloadMethod) => void;
  setAskBeforeDownload: (value: boolean) => void;
  setPixelRatio: (value: number) => void;
  setImageQuality: (value: number) => void;
  setEnableTiles: (value: boolean) => void;
  setCleanExport: (value: boolean) => void;
}

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set) => ({
      isExporting: false,
      preferredMethod: "auto",
      askBeforeDownload: false,
      pixelRatio: 2,
      imageQuality: 0.8,
      enableTiles: false,
      cleanExport: true,
      setIsExporting: (value: boolean) => set({ isExporting: value }),
      setPreferredMethod: (method: DownloadMethod) =>
        set({ preferredMethod: method }),
      setAskBeforeDownload: (value: boolean) => set({ askBeforeDownload: value }),
      setPixelRatio: (value: number) => set({ pixelRatio: value }),
      setImageQuality: (value: number) => set({ imageQuality: value }),
      setEnableTiles: (value: boolean) => set({ enableTiles: value }),
      setCleanExport: (value: boolean) => set({ cleanExport: value }),
    }),
    {
      name: "download-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
