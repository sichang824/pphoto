import { usePreviewStore } from "@/store/PreviewStore1";
import { useDownloadStore } from "@/store/DownloadStore";

export type ExportableSettings = {
  // Preview settings
  paperSize: string;
  paperLandscape: boolean;
  pageMargin: number;
  pageMarginUnit: "mm" | "px";
  spacing: number;
  autoLayout: boolean;
  doubleSided: boolean;
  backsideFlip: boolean;
  printStyleId: string;
  enableRatioMap: boolean;
  themeColor: string;
  showGuides: boolean;
  showPaperBorder: boolean;
  paperScale: number;

  // Download settings
  pixelRatio: number;
  imageQuality: number; // 0..1
  preferredMethod: "auto" | "fileSystem" | "anchor";
  askBeforeDownload: boolean;
  enableTiles: boolean;
  cleanExport: boolean;
};

export type ExportFilter = {
  include?: Array<keyof ExportableSettings>;
  exclude?: Array<keyof ExportableSettings>;
};

// Shared key lists to minimize maintenance and keep Import/Export consistent
export const PREVIEW_EXPORT_KEYS: ReadonlyArray<keyof ExportableSettings> = [
  "paperSize",
  "paperLandscape",
  "pageMargin",
  "pageMarginUnit",
  "spacing",
  "autoLayout",
  "doubleSided",
  "backsideFlip",
  "printStyleId",
  "enableRatioMap",
  "themeColor",
  "showGuides",
  "showPaperBorder",
  "paperScale",
] as const;

export const DOWNLOAD_EXPORT_KEYS: ReadonlyArray<keyof ExportableSettings> = [
  "pixelRatio",
  "imageQuality",
  "preferredMethod",
  "askBeforeDownload",
  "enableTiles",
  "cleanExport",
] as const;

export function collectAllSettings(): ExportableSettings {
  const preview = usePreviewStore.getState() as unknown as Record<string, unknown>;
  const download = useDownloadStore.getState() as unknown as Record<string, unknown>;

  const result: Partial<ExportableSettings> = {};
  type K = keyof ExportableSettings;
  const writeable = result as Partial<Record<K, ExportableSettings[K]>>;

  for (const k of PREVIEW_EXPORT_KEYS) {
    writeable[k as K] = preview[k as string] as ExportableSettings[K];
  }
  for (const k of DOWNLOAD_EXPORT_KEYS) {
    writeable[k as K] = download[k as string] as ExportableSettings[K];
  }

  return result as ExportableSettings;
}

export function exportSettings(filter?: ExportFilter): Partial<ExportableSettings> {
  const all = collectAllSettings();

  const includedKeys: Array<keyof ExportableSettings> = filter?.include
    ? [...filter.include]
    : (Object.keys(all) as Array<keyof ExportableSettings>);

  const finalKeys = new Set<keyof ExportableSettings>(includedKeys);
  if (filter?.exclude) {
    for (const key of filter.exclude) {
      finalKeys.delete(key);
    }
  }

  const result: Partial<ExportableSettings> = {};
  type K = keyof ExportableSettings;
  const writeable = result as Partial<Record<K, ExportableSettings[K]>>;
  for (const key of finalKeys) {
    writeable[key] = all[key];
  }
  return result;
}

export function exportSettingsExclude(
  exclude: Array<keyof ExportableSettings>
): Partial<ExportableSettings> {
  return exportSettings({ exclude });
}
