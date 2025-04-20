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
import PhotoSizeList from "@/components/PhotoSizeList";
import BacksidePrintStyleList from "@/components/BacksidePrintStyleList";
import Preview from "@/components/Preview";
import SettingsPanel from "@/components/SettingsPanel";
import StatsPanel from "@/components/StatsPanel";
import ThemePanel from "@/components/ThemePanel";
import { useThemeColor } from "@/lib/useThemeColor";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function MobileEditorPage() {
  useThemeColor();
  const { t } = useTranslation(["common", "editor"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd({ over }: DragEndEvent) {
    if (over?.id) {
      // Handle drag end logic if needed
    }
  }

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* Header with back button */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center text-sm font-medium">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("nav.home", { ns: "common" })}
        </Link>
        <h1 className="text-lg font-semibold mx-auto">Mobile Editor</h1>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[]}>
          {/* Preview area */}
          <div className="h-1/2 overflow-y-auto p-4">
            <Preview id="preview" />
          </div>

          {/* Controls in tabs */}
          <div className="h-1/2 border-t border-gray-200">
            <Tabs defaultValue="options" className="h-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="settings">{t("panel.settings", { ns: "editor" })}</TabsTrigger>
                <TabsTrigger value="themes">Themes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="options" className="p-4 h-full overflow-y-auto">
                <div className="space-y-6">
                  <PhotoSizeList />
                  <BacksidePrintStyleList />
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="p-4 h-full overflow-y-auto">
                <div className="space-y-4">
                  <StatsPanel />
                  <SettingsPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="themes" className="p-4 h-full overflow-y-auto">
                <ThemePanel />
              </TabsContent>
            </Tabs>
          </div>
        </DndContext>
      </div>
    </main>
  );
}
