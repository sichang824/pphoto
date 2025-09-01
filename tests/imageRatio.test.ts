import { describe, it, expect, vi } from "bun:test";
import { computeAndEnsureRatioMapping } from "@/lib/imageLoader";
import type { SizeItem } from "@/components/types";

describe("computeAndEnsureRatioMapping", () => {
  it("returns existing ratio without updating map", () => {
    const existing: Record<string, SizeItem> = {
      "1/1": { id: "a", name: "1:1", width: 100, height: 100, imageRatio: "1/1" },
    };
    const updateRatioMap = vi.fn();
    const findBestMatchSize = vi.fn();

    const ratio = computeAndEnsureRatioMapping(
      { ratioToSizeMap: existing, updateRatioMap, findBestMatchSize },
      500,
      500
    );

    expect(ratio).toBe("1/1");
    expect(updateRatioMap).not.toHaveBeenCalled();
    expect(findBestMatchSize).not.toHaveBeenCalled();
  });

  it("computes ratio and updates map when missing", () => {
    const existing: Record<string, SizeItem> = {};
    const updateRatioMap = vi.fn();
    const findBestMatchSize = vi.fn().mockReturnValue({
      id: "x",
      name: "mock",
      width: 50,
      height: 100,
      imageRatio: "1/2",
    } satisfies SizeItem);

    const ratio = computeAndEnsureRatioMapping(
      { ratioToSizeMap: existing, updateRatioMap, findBestMatchSize },
      300,
      600
    );

    expect(ratio).toBe("1/2");
    expect(findBestMatchSize).toHaveBeenCalledWith(0.5);
    expect(updateRatioMap).toHaveBeenCalledWith("1/2", expect.any(Object));
  });
});


