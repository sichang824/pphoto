"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import PhotoSizeList from "@/components/PhotoSizeList";
import PaperPreview from "@/components/PaperPreview";
import SettingsPanel from "@/components/SettingsPanel";
import { useState } from "react";
import PhotoSize from "@/components/PhotoSize";
import { SizeItem } from "@/components/types";
import Preview from "@/components/Preview";
import { PRESET_SIZES } from "@/store/previewStore";

export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findItem = (id: string) => {
    return PRESET_SIZES.find((item) => item.id === id);
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (over?.id) {
    }
  }

  return (
    <main className="flex min-h-screen gap-4 p-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[]}>
        {/* 左侧照片尺寸列表 */}
        <div className="w-64">
          <PhotoSizeList items={PRESET_SIZES} />
        </div>

        {/* 中间预览区域 */}
        <div className="flex-1">
          <Preview id="preview" />
        </div>
      </DndContext>

      {/* 右侧设置面板 */}
      <div className="w-64">
        <SettingsPanel />
      </div>
    </main>
  );
}
