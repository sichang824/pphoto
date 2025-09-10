export interface MemoryInfoMB {
  usedMB: number;
  totalMB: number;
  limitMB: number;
}

export function getMemoryInfo(): MemoryInfoMB | null {
  if (typeof performance === "undefined") return null;
  const anyPerf = performance as unknown as {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  };
  const mem = anyPerf.memory;
  if (!mem) return null;
  const toMB = (v: number) => Math.round((v / (1024 * 1024)) * 10) / 10;
  return {
    usedMB: toMB(mem.usedJSHeapSize),
    totalMB: toMB(mem.totalJSHeapSize),
    limitMB: toMB(mem.jsHeapSizeLimit),
  };
}

export function logMemory(label: string): void {
  try {
    const info = getMemoryInfo();
    if (info) {
      console.log("[MEM]", label, info);
    } else {
      console.log("[MEM]", label, { note: "performance.memory not available" });
    }
  } catch (e) {
    console.warn("[MEM] log failed", e);
  }
}
