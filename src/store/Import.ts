import { usePreviewStore } from "@/store/PreviewStore";
import { useDownloadStore } from "@/store/DownloadStore";
import type { ExportableSettings, ExportFilter } from "@/store/Export";
import { PREVIEW_EXPORT_KEYS, DOWNLOAD_EXPORT_KEYS } from "@/store/Export";

function toSetterName(key: string): string {
  return `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

export function importSettings(
  incoming: Partial<ExportableSettings>,
  filter?: ExportFilter
): void {
  // Default: include all provided keys, then remove excluded ones
  const keys = new Set<keyof ExportableSettings>(
    (filter?.include as Array<keyof ExportableSettings> | undefined) ??
      (Object.keys(incoming) as Array<keyof ExportableSettings>)
  );
  if (filter?.exclude) {
    for (const k of filter.exclude) keys.delete(k);
  }

  for (const key of keys) {
    const value = incoming[key];
    if (value === undefined) continue;

    const setterName = toSetterName(key as string);

    if (PREVIEW_EXPORT_KEYS.includes(key)) {
      const st = usePreviewStore.getState() as unknown as Record<string, unknown>;
      const setter = (st as Record<string, unknown>)[setterName];
      if (typeof setter === "function") {
        (setter as (v: unknown) => void)(value);
      }
      continue;
    }

    if (DOWNLOAD_EXPORT_KEYS.includes(key)) {
      const st = useDownloadStore.getState() as unknown as Record<string, unknown>;
      const setter = (st as Record<string, unknown>)[setterName];
      if (typeof setter === "function") {
        (setter as (v: unknown) => void)(value);
      }
      continue;
    }
  }
}
