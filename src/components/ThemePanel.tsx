"use client";

import { Card } from "@/components/ui/card";
import { usePreviewStore } from "@/store/PreviewStore1";
import { FC } from "react";
import { GradientPicker } from "./ui/GradientPicker";

const ThemePanel: FC = () => {
  const { themeColor, setThemeColor } = usePreviewStore();

  return (
    <>
      <h3 className="text-sm font-medium mb-2">主题</h3>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">主题颜色</label>
            <GradientPicker
              className="w-full truncate"
              background={themeColor}
              setBackground={setThemeColor}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ThemePanel;
