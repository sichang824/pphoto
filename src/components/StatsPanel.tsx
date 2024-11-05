import { FC } from "react";
import { Card } from "@/components/ui/card";
import { PAPER_SIZES, usePreviewStore } from "@/store/previewStore";

const StatsPanel: FC = () => {
  const { paperLandscape, ratioToSizeMap, paperSize, previewItems } =
    usePreviewStore();

  const stats = {
    currentPaper: `${paperSize} (${PAPER_SIZES[paperSize].width}×${PAPER_SIZES[paperSize].height}mm)`,
    orientation: paperLandscape ? "横向" : "纵向",
    ratioTypes: Object.keys(ratioToSizeMap).length,
    photoCount: previewItems.length,
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">当前状态</h3>
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">纸张大小：</span>
            <span className="font-medium">{stats.currentPaper}</span>
          </div>
          <div>
            <span className="text-gray-500">打印方向：</span>
            <span className="font-medium">{stats.orientation}</span>
          </div>
          <div>
            <span className="text-gray-500">比例类型：</span>
            <span className="font-medium">{stats.ratioTypes}</span>
          </div>
          <div>
            <span className="text-gray-500">照片数量：</span>
            <span className="font-medium">{stats.photoCount}</span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default StatsPanel;
