"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";


import PhotoSizeList from "@/components/PhotoSizeList";
import Preview from "@/components/Preview";
import SettingsPanel from "@/components/SettingsPanel";
import StatsPanel from "@/components/StatsPanel";
import { PRESET_SIZES } from "@/store/previewStore";

export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd({over}: DragEndEvent) {
    if (over?.id) {
    }
  }

  return (
    <main className="flex min-h-screen gap-4 p-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[]}>
        {/* 左侧照片尺寸列表 */}
        <div className="w-64">
          <div className="space-y-4 sticky top-4 z-50">
            <PhotoSizeList items={PRESET_SIZES} />
          </div>
        </div>

        {/* 中间预览区域 */}
        <div className="flex-1">
          <Preview id="preview" />
        </div>
      </DndContext>

      {/* 右侧设置面板 */}
      <div className="w-64">
        <div className="space-y-4 sticky top-4 z-50">
          <StatsPanel />
          <SettingsPanel />
        </div>
      </div>
    </main>
  );
}
