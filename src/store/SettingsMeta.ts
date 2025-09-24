import type { ExportableSettings } from "@/store/Export";

export const SETTINGS_LABELS: Partial<Record<keyof ExportableSettings, string>> = {
  paperSize: "纸张大小",
  paperLandscape: "纸张方向",
  pageMargin: "页面边距",
  pageMarginUnit: "边距单位",
  spacing: "间距",
  doubleSided: "双面打印",
  printStyleId: "打印样式",
  pixelRatio: "像素比",
  imageQuality: "图片质量",
  enableRatioMap: "启用比例映射",
  themeColor: "主题色",
  showGuides: "辅助线",
  showPaperBorder: "纸张边框",
  paperScale: "预览缩放",
  backsideFlip: "背面翻转",
  preferredMethod: "导出方式",
  askBeforeDownload: "导出前确认",
  enableTiles: "启用分片",
  cleanExport: "干净导出",
};

export function formatSettingValue(
  key: keyof ExportableSettings,
  value: unknown
): string {
  if (key === "paperLandscape") return value ? "横向" : "纵向";
  if (typeof value === "boolean") return value ? "是" : "否";
  return String(value);
}
