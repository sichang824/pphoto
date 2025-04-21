"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import BacksidePrintStyleList from "@/components/BacksidePrintStyleList";
import SettingsPanel from "@/components/SettingsPanel";
import StatsPanel from "@/components/StatsPanel";
import ThemePanel from "@/components/ThemePanel";
import { useTranslation } from "react-i18next";
import MobilePreview from "@/components/mobile/MobilePreview";
import MobilePhotoSizeList from "@/components/mobile/MobilePhotoSizeList";

export default function MobileEditorPage() {
  const { t } = useTranslation(["common", "editor"]);
  // 控制底部抽屉是否展开
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 更大的距离，适合触控
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd({ over }: DragEndEvent) {
    if (over?.id) {
      // 拖拽结束逻辑
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* 预览区域 - 占据更多空间 */}
        <div className="h-[60%] overflow-y-auto pb-16 bg-white">
          <MobilePreview id="preview" />
        </div>
        
        {/* 底部控制区 - 使用标签页 */}
        <div className="h-[40%] border-t border-gray-200 bg-white shadow-lg relative z-10 rounded-t-xl">
          <Tabs defaultValue="photo-size" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-3 p-1 sticky top-0 bg-white z-10 border-b">
              <TabsTrigger value="photo-size">照片尺寸</TabsTrigger>
              <TabsTrigger value="settings">{t("panel.settings", { ns: "editor" })}</TabsTrigger>
              <TabsTrigger value="themes">主题</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photo-size" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <MobilePhotoSizeList />
                <BacksidePrintStyleList />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <StatsPanel />
                <SettingsPanel />
              </div>
            </TabsContent>
            
            <TabsContent value="themes" className="flex-1 p-4 overflow-y-auto">
              <ThemePanel />
            </TabsContent>
          </Tabs>
        </div>
      </DndContext>
    </div>
  );
}
