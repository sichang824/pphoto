"use client";

import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePreviewStore } from "@/store/previewStore";

const DuplexSettings: FC = () => {
  const { doubleSided, setDoubleSided, backsideFlip, setBacksideFlip } = usePreviewStore();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-3">双面</h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">双面打印</label>
            <Switch checked={doubleSided} onCheckedChange={(checked) => setDoubleSided(checked)} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">背面翻转</label>
            <Switch checked={backsideFlip} onCheckedChange={(checked) => setBacksideFlip(checked)} />
          </div>
          <p className="text-sm text-gray-500">双面打印时背面是否需要翻转</p>
        </div>
      </div>
    </Card>
  );
};

export default DuplexSettings;


