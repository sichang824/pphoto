import { beforeAll, describe, expect, it } from "bun:test";

// Setup mock localStorage before importing the store
beforeAll(() => {
  const store: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  } as unknown as Storage;
  // @ts-ignore
  globalThis.localStorage = mockLocalStorage;
});

import { useDownloadStore } from "@/store/DownloadStore";
import { usePreviewStore } from "@/store/PreviewStore";

describe("PreviewStore - paper border visibility", () => {
  it("should have showPaperBorder enabled by default", () => {
    const state = usePreviewStore.getState();
    expect(state.showPaperBorder).toBe(true);
  });

  it("should update showPaperBorder via setter", () => {
    const { setShowPaperBorder } = usePreviewStore.getState();
    setShowPaperBorder(false);
    expect(usePreviewStore.getState().showPaperBorder).toBe(false);

    setShowPaperBorder(true);
    expect(usePreviewStore.getState().showPaperBorder).toBe(true);
  });
});

describe("DownloadStore - clean export option", () => {
  it("should have cleanExport enabled by default", () => {
    const state = useDownloadStore.getState();
    expect(state.cleanExport).toBe(true);
  });

  it("should update cleanExport via setter", () => {
    const { setCleanExport } = useDownloadStore.getState();
    setCleanExport(false);
    expect(useDownloadStore.getState().cleanExport).toBe(false);
    setCleanExport(true);
    expect(useDownloadStore.getState().cleanExport).toBe(true);
  });
});
