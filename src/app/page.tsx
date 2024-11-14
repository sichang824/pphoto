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

import BacksidePrintStyleList from "@/components/BacksidePrintStyleList";
import PhotoSizeList from "@/components/PhotoSizeList";
import Preview from "@/components/Preview";
import SettingsPanel from "@/components/SettingsPanel";
import StatsPanel from "@/components/StatsPanel";

export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd({ over }: DragEndEvent) {
    if (over?.id) {
    }
  }

  return (
    <main className="flex h-screen overflow-hidden">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[]}>
        {/* 左侧照片尺寸列表 */}
        <div className="w-64 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-6">
            <PhotoSizeList />
            <BacksidePrintStyleList />
          </div>
        </div>

        {/* 中间预览区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <Preview id="preview" />
          </div>
        </div>
      </DndContext>

      {/* 右侧设置面板 */}
      <div className="w-64 border-l border-gray-200 overflow-y-auto">
        <div className="p-4">
          <StatsPanel />
          <SettingsPanel />
        </div>
      </div>
    </main>
  );
}
