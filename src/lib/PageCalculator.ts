import { Page, PhotoItem, SizeItem } from "@/components/types";

// 获取尺寸信息（去除比例映射）
export const getItemSize = (
  item: PhotoItem,
  customSizes: SizeItem[],
  presetSizes: SizeItem[]
) => {
  if (item.sizeId) {
    const byId =
      customSizes.find((s) => s.id === item.sizeId) ||
      presetSizes.find((s) => s.id === item.sizeId);
    if (byId) return byId;
  }
  const byName =
    customSizes.find((s) => s.name === item.name) ||
    presetSizes.find((s) => s.name === item.name);
  if (byName) return byName;
  return presetSizes[0];
};

export class PageCalculator {
  private pages: Page[] = [];
  private currentPage: PhotoItem[] = [];
  private currentPageId = 1;
  private currentY = 0;
  private currentRowX = 0;
  private currentRowHeight = 0;
  private availableWidth: number;
  private availableHeight: number;

  constructor(
    private paperLandscape: boolean,
    private paperSize: string,
    private autoLayout: boolean,
    private pageMargin: number,
    private customSizes: SizeItem[],
    private paperSizes: Record<string, { width: number; height: number }>,
    private presetSizes: SizeItem[]
  ) {
    const ps = this.paperSizes[paperSize];
    const paperWidth = paperLandscape ? ps.height : ps.width;
    const paperHeight = paperLandscape ? ps.width : ps.height;
    const padding = pageMargin * 2;

    this.availableWidth = paperWidth - padding;
    this.availableHeight = paperHeight - padding;
  }

  // full-page logic based on ratio removed

  private handleAutoLayoutItem(item: PhotoItem): void {
    const size = getItemSize(item, this.customSizes, this.presetSizes);
    const itemWidth = item.isVertical ? size.height : size.width;
    const itemHeight = item.isVertical ? size.width : size.height;

    if (this.needsNewRow(itemWidth)) {
      this.startNewRow();
    }

    if (this.needsNewPage(itemHeight)) {
      this.startNewPage();
    }

    this.addItemToCurrentPage(item, itemWidth, itemHeight);
  }

  private needsNewRow(itemWidth: number): boolean {
    return this.currentRowX + itemWidth > this.availableWidth;
  }

  private needsNewPage(itemHeight: number): boolean {
    return this.currentY + itemHeight > this.availableHeight;
  }

  private startNewRow(): void {
    this.currentY += this.currentRowHeight;
    this.currentRowX = 0;
    this.currentRowHeight = 0;
  }

  private startNewPage(): void {
    if (this.currentPage.length > 0) {
      this.pages.push({
        id: `page-${this.currentPageId}`,
        items: [...this.currentPage],
      });
      this.currentPage = [];
      this.currentPageId++;
      this.currentY = 0;
      this.currentRowX = 0;
      this.currentRowHeight = 0;
    }
  }

  private addItemToCurrentPage(
    item: PhotoItem,
    itemWidth: number,
    itemHeight: number
  ): void {
    this.currentPage.push(item);
    this.currentRowX += itemWidth;
    this.currentRowHeight = Math.max(this.currentRowHeight, itemHeight);
  }

  public calculate(previewItems: PhotoItem[]): Page[] {
    if (previewItems.length === 0) {
      return [{ id: "page-1", items: [] }];
    }

    previewItems.forEach((item) => {
      if (!this.autoLayout) {
        this.pages.push({
          id: `page-${this.currentPageId}`,
          items: [item],
        });
        this.currentPageId++;
      } else {
        this.handleAutoLayoutItem(item);
      }
    });

    // 添加最后一页
    if (this.currentPage.length > 0) {
      this.pages.push({
        id: `page-${this.currentPageId}`,
        items: this.currentPage,
      });
    }

    return this.pages;
  }
}
