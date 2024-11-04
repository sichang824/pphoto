import { FC, useState, useRef } from "react";
import { usePreviewStore } from "@/store/previewStore";
import { SizeItem } from "./types";
import { Settings, Trash, ZoomIn, ZoomOut, Image } from "lucide-react";

interface PreviewItemProps {
  item: SizeItem;
}

const PreviewItem: FC<PreviewItemProps> = ({ item }) => {
  const removeItem = usePreviewStore((state) => state.removeItem);
  const toggleOrientation = usePreviewStore((state) => state.toggleOrientation);

  const [imageUrl, setImageUrl] = useState<string | null>(item.imageUrl || null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState<'width' | 'height'>('width');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 根据方向计算实际宽高
  const width = item.isVertical ? item.height : item.width;
  const height = item.isVertical ? item.width : item.height;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (imageUrl) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加缩放步长常量
  const ZOOM_STEP = 0.1;
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.5;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  // 添加 onDragStart 处理函数
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 添加重置位置和缩放的函数
  const resetPositionAndScale = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  // 修改 fitMode 的切换处理函数
  const handleFitModeChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFitMode(prev => prev === 'width' ? 'height' : 'width');
    resetPositionAndScale(); // 切换时重置位置和缩放
  };

  return (
    <div
      className={`bg-white border rounded flex items-center justify-center group box-border relative cursor-pointer select-none border-gray-300`}
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        transition: "all 0.2s ease-in-out",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={handleDragStart}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />

      {/* 图片容器 */}
      <div className="overflow-hidden w-full h-full flex items-center justify-center">
        {imageUrl ? (
          <div
            className={`transition-all ${
              fitMode === 'width' ? 'w-full h-full' : 'w-full h-full'
            }`}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: fitMode === 'width' ? '100% auto' : 'auto 100%',
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'all 0.2s ease-in-out',
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gray-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Image className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* 控制按钮组 */}
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {imageUrl && (
          <>
            <button
              onClick={handleFitModeChange}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
              title={fitMode === 'width' ? "切换为高度铺满" : "切换为宽度铺满"}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: fitMode === 'width' ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="12" y1="3" x2="12" y2="21"/>
              </svg>
            </button>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                fileInputRef.current?.click(); 
              }}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
              title="更换图片"
            >
              <Image className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
              title={`放大 (${Math.round(scale * 100)}%)`}
              disabled={scale >= MAX_ZOOM}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-100 disabled:opacity-50"
              title={`缩小 (${Math.round(scale * 100)}%)`}
              disabled={scale <= MIN_ZOOM}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        
        <button
          onClick={(e) => { e.stopPropagation(); toggleOrientation(item.id); }}
          className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
          title={item.isVertical ? "切换为横向" : "切换为竖向"}
        >
          <Settings
            className="w-3.5 h-3.5"
            style={{
              transform: item.isVertical ? "rotate(90deg)" : "none",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
          className="bg-white p-1 rounded-full shadow hover:bg-red-100"
          title="移除"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PreviewItem;
