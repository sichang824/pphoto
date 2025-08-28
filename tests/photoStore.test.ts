import { describe, it, expect, beforeAll } from "bun:test";

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
  globalThis.localStorage = mockLocalStorage;
});

import { usePhotoStore } from "@/store/PhotoStore";

describe("PhotoStore", () => {
  it("should have default values", () => {
    const state = usePhotoStore.getState();
    expect(state.showPhotoBackground).toBe(true);
    expect(state.photoBackgroundColor.toLowerCase()).toBe("#f3f4f6");
    expect(state.horizontalAlign).toBe("center");
    expect(state.verticalAlign).toBe("center");
  });

  it("should update showPhotoBackground", () => {
    const { setShowPhotoBackground } = usePhotoStore.getState();
    setShowPhotoBackground(false);
    expect(usePhotoStore.getState().showPhotoBackground).toBe(false);
  });

  it("should update photoBackgroundColor", () => {
    const { setPhotoBackgroundColor } = usePhotoStore.getState();
    setPhotoBackgroundColor("#ff0000");
    expect(usePhotoStore.getState().photoBackgroundColor.toLowerCase()).toBe(
      "#ff0000"
    );
  });

  it("should update horizontal alignment", () => {
    const { setHorizontalAlign } = usePhotoStore.getState();
    setHorizontalAlign("left");
    expect(usePhotoStore.getState().horizontalAlign).toBe("left");
    setHorizontalAlign("right");
    expect(usePhotoStore.getState().horizontalAlign).toBe("right");
    setHorizontalAlign("center");
    expect(usePhotoStore.getState().horizontalAlign).toBe("center");
  });

  it("should update vertical alignment", () => {
    const { setVerticalAlign } = usePhotoStore.getState();
    setVerticalAlign("top");
    expect(usePhotoStore.getState().verticalAlign).toBe("top");
    setVerticalAlign("bottom");
    expect(usePhotoStore.getState().verticalAlign).toBe("bottom");
    setVerticalAlign("center");
    expect(usePhotoStore.getState().verticalAlign).toBe("center");
  });
});
