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
import { useState } from "react";
import BacksidePrintStyleList from "@/components/BacksidePrintStyleList";
import SettingsPanel from "@/components/SettingsPanel";
import StatsPanel from "@/components/StatsPanel";
import ThemePanel from "@/components/ThemePanel";
import { useTranslation } from "react-i18next";
import MobilePreview, { handleBatchSelect, handlePrint, handlePrintPdf } from "@/components/mobile/MobilePreview";
import MobilePhotoSizeList from "@/components/mobile/MobilePhotoSizeList";
import MobileBottomBar from "@/components/mobile/MobileBottomBar";
import MobileBottomDrawer from "@/components/mobile/MobileBottomDrawer";
import MobileStatusPanel from "@/components/mobile/MobileStatusPanel";
import MobileCustomPhotoSize from "@/components/mobile/MobileCustomPhotoSize";
import { usePreviewStore } from "@/store/previewStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function MobileEditorPage() {
  const { t } = useTranslation(["common", "editor"]);
  // 控制底部抽屉是否展开及当前显示的标签页
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("photo");
  const [pdfProgress, setPdfProgress] = useState(0);
  
  // Get store state and actions
  const {
    paperSize, 
    setPaperSize,
    paperLandscape, 
    setPaperLandscape,
    paperScale, 
    setPaperScale,
    pageMargin, 
    setPageMargin,
    photoGap, 
    setPhotoGap,
    showMargin, 
    setShowMargin,
    doubleSided, 
    setDoubleSided,
    backsideFlip, 
    setBacksideFlip,
    autoLayout, 
    setAutoLayout,
    pixelRatio, 
    setPixelRatio,
    imageQuality, 
    setImageQuality,
    themeColor, 
    setThemeColor,
    enableRatioMap, 
    setEnableRatioMap
  } = usePreviewStore();
  
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

  // 处理底部栏选择
  const handleBottomBarSelect = (tab: string) => {
    setActiveTab(tab);
    setDrawerOpen(true);
    
    // 如果是导出选项，直接执行导出而不打开抽屉
    if (tab === "export") {
      setDrawerOpen(false);
      handlePrintPdf((progress = 0) => setPdfProgress(progress));
    }
  };

  // 处理关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  
  // 照片设置
  const renderPhotoSettings = () => {
    return (
      <ScrollArea className="w-full">
        <div className="pr-4">
          <div className="space-y-4">
            <div className="flex space-x-4 pb-2 overflow-x-auto">
              <Button onClick={handleBatchSelect} className="whitespace-nowrap flex-shrink-0">
                选择照片
              </Button>
              <Button variant="outline" onClick={handlePrint} className="whitespace-nowrap flex-shrink-0">
                打印
              </Button>
            </div>
            <MobilePhotoSizeList />
            <BacksidePrintStyleList />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  };

  // 渲染主题颜色选择器
  const renderThemeSettings = () => {
    return (
      <ScrollArea className="w-full">
        <div className="pr-4">
          <div className="space-y-4">
            <div className="p-2 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">当前颜色：{themeColor}</p>
              <div className="w-full flex justify-center">
                <HexColorPicker color={themeColor} onChange={setThemeColor} />
              </div>
            </div>
            <div className="flex overflow-x-auto pb-2">
              {["#09203f", "#1A4B84", "#2E86C1", "#3498DB", "#85C1E9", "#e74c3c", "#27ae60", "#f39c12", "#8e44ad", "#7f8c8d"].map((color) => (
                <button
                  key={color}
                  className="w-12 h-12 rounded-md border-2 mr-2 flex-shrink-0"
                  style={{ 
                    backgroundColor: color,
                    borderColor: themeColor === color ? "white" : color,
                    outline: themeColor === color ? "2px solid black" : "none" 
                  }}
                  onClick={() => setThemeColor(color)}
                />
              ))}
            </div>
            <ThemePanel />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  };

  // 渲染纸张设置
  const renderPaperSettings = () => {
    return (
      <ScrollArea className="w-full">
        <div className="pr-4">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">纸张大小</Label>
              <div className="flex space-x-2 overflow-x-auto pb-2 mt-2">
                <Button 
                  variant={paperSize === "A4" ? "default" : "outline"}
                  onClick={() => setPaperSize("A4")}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  A4 (210×297mm)
                </Button>
                <Button 
                  variant={paperSize === "A5" ? "default" : "outline"}
                  onClick={() => setPaperSize("A5")}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  A5 (148×210mm)
                </Button>
                <Button 
                  variant={paperSize === "A6" ? "default" : "outline"}
                  onClick={() => setPaperSize("A6")}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  A6 (105×148mm)
                </Button>
                <Button 
                  variant={paperSize === "Letter" ? "default" : "outline"}
                  onClick={() => setPaperSize("Letter")}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  Letter (8.5×11")
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium">纸张缩放 {Math.round(paperScale * 100)}%</Label>
              <Slider 
                value={[paperScale * 100]} 
                min={50} 
                max={150} 
                step={1}
                onValueChange={(value) => setPaperScale(value[0] / 100)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-base font-medium">打印方向</Label>
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant={!paperLandscape ? "default" : "outline"}
                  onClick={() => setPaperLandscape(false)}
                  className="flex-1"
                >
                  纵向
                </Button>
                <Button 
                  variant={paperLandscape ? "default" : "outline"}
                  onClick={() => setPaperLandscape(true)}
                  className="flex-1"
                >
                  横向
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  };

  // 渲染布局设置
  const renderLayoutSettings = () => {
    return (
      <ScrollArea className="w-full">
        <div className="pr-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">页边距 {pageMargin}mm</Label>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPageMargin(Math.max(0, pageMargin - 1))}
                  >
                    -
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPageMargin(pageMargin + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Slider 
                value={[pageMargin]} 
                min={0} 
                max={30} 
                step={1}
                onValueChange={(value) => setPageMargin(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">照片间隔 {photoGap}mm</Label>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPhotoGap(Math.max(0, photoGap - 1))}
                  >
                    -
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPhotoGap(photoGap + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Slider 
                value={[photoGap]} 
                min={0} 
                max={20} 
                step={1}
                onValueChange={(value) => setPhotoGap(value[0])}
                className="mt-2"
              />
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg overflow-x-auto">
              <div className="flex space-x-8">
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Label className="text-sm">显示参考线</Label>
                  <Switch 
                    checked={showMargin} 
                    onCheckedChange={setShowMargin} 
                  />
                </div>
                
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Label className="text-sm">自动布局</Label>
                  <Switch 
                    checked={autoLayout} 
                    onCheckedChange={setAutoLayout} 
                  />
                </div>
                
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Label className="text-sm">比例映射</Label>
                  <Switch 
                    checked={enableRatioMap} 
                    onCheckedChange={setEnableRatioMap} 
                  />
                </div>
                
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <Label className="text-sm">双面打印</Label>
                  <Switch 
                    checked={doubleSided} 
                    onCheckedChange={setDoubleSided} 
                  />
                </div>
                
                {doubleSided && (
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <Label className="text-sm">背面翻转</Label>
                    <Switch 
                      checked={backsideFlip} 
                      onCheckedChange={setBacksideFlip} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  };

  // 渲染质量设置
  const renderQualitySettings = () => {
    return (
      <ScrollArea className="w-full">
        <div className="pr-4">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">像素比 {pixelRatio}x</Label>
              <Slider 
                value={[pixelRatio]} 
                min={1} 
                max={3} 
                step={0.5}
                onValueChange={(value) => setPixelRatio(value[0])}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                较高的像素比会提高输出质量，但会增加生成时间
              </p>
            </div>
            
            <div>
              <Label className="text-base font-medium">图片质量 {imageQuality}%</Label>
              <Slider 
                value={[imageQuality]} 
                min={50} 
                max={100} 
                step={5}
                onValueChange={(value) => setImageQuality(value[0])}
                className="mt-2"
              />
            </div>
            
            <div className="flex justify-center space-x-2 mt-4">
              <Button onClick={() => setPixelRatio(1)} variant={pixelRatio === 1 ? "default" : "outline"} className="flex-1">
                低质量 (1x)
              </Button>
              <Button onClick={() => setPixelRatio(2)} variant={pixelRatio === 2 ? "default" : "outline"} className="flex-1">
                中质量 (2x)
              </Button>
              <Button onClick={() => setPixelRatio(3)} variant={pixelRatio === 3 ? "default" : "outline"} className="flex-1">
                高质量 (3x)
              </Button>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  };
  
  // 渲染状态面板
  const renderStatusPanel = () => {
    return <MobileStatusPanel />;
  };

  // 根据当前标签页渲染抽屉内容
  const renderDrawerContent = () => {
    switch (activeTab) {
      case "photo":
        return renderPhotoSettings();
      case "paper":
        return renderPaperSettings();
      case "layout":
        return renderLayoutSettings();
      case "quality":
        return renderQualitySettings();
      case "theme":
        return renderThemeSettings();
      case "settings":
        return renderStatusPanel();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* 预览区域 - 占据整个屏幕 */}
        <div className="flex-1 overflow-y-auto bg-white pb-16">
          <MobilePreview id="preview" />
        </div>
        
        {/* 底部控制栏 - 仅在抽屉关闭时显示 */}
        <div className={drawerOpen ? "hidden" : "block"}>
          <MobileBottomBar onSelect={handleBottomBarSelect} />
        </div>
        
        {/* 底部抽屉 */}
        <MobileBottomDrawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
        >
          {renderDrawerContent()}
        </MobileBottomDrawer>
      </DndContext>
    </div>
  );
}
