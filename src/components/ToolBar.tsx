import { isMobileDevice } from "@/lib/utils";
import {
  Image as LucideImage,
  MoveVertical,
  RectangleVertical,
  RotateCcw,
  RotateCw,
  Trash,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { PhotoItem } from "./types";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";
import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";

interface ToolBarProps {
  item: PhotoItem;
  isPrinting: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onFitModeChange: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onOrientationChange: () => void;
  onRemove: () => void;
  anchorRef: RefObject<HTMLDivElement>;
}

const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;
const HOVER_CLOSE_DELAY_MS = 150;

const ToolBar: FC<ToolBarProps> = ({
  item,
  isPrinting,
  fileInputRef,
  onFitModeChange,
  onZoomIn,
  onZoomOut,
  onRotateCW,
  onRotateCCW,
  onOrientationChange,
  onRemove,
  anchorRef,
}) => {
  // Hide when printing: handled later to avoid conditional hooks

  // Visibility: always-on for mobile, hover-based for desktop
  const [open, setOpen] = useState<boolean>(isMobileDevice());
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (isMobileDevice()) return; // mobile stays open
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      closeTimeoutRef.current = null;
    }, HOVER_CLOSE_DELAY_MS);
  }, [cancelClose]);

  // Positioning: only left/top (no flip) to avoid appearing on right/bottom
  const { x, y, strategy, refs, update } = useFloating({
    placement: item.isVertical ? "left" : "top",
    middleware: [offset(8), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // SSR-safe: render portal only after mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Bind reference element for Floating UI
  useEffect(() => {
    if (anchorRef?.current) {
      refs.setReference(anchorRef.current);
      // Initial position update
      update?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorRef?.current, refs, item.isVertical]);

  // Desktop: control visible via hover on the anchor with delayed close
  useEffect(() => {
    if (!anchorRef?.current) return;
    if (isMobileDevice()) return; // always on for mobile

    const el = anchorRef.current;
    const onEnter = () => {
      cancelClose();
      setOpen(true);
    };
    const onLeave = () => {
      scheduleClose();
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [anchorRef, scheduleClose, cancelClose]);

  // Cleanup any pending timers on unmount
  useEffect(() => {
    return () => cancelClose();
  }, [cancelClose]);

  // Do not render when printing, or no anchor/open, or not mounted/SSR
  if (isPrinting) return null;
  if (!anchorRef?.current || !open) return null;
  if (!mounted || typeof document === "undefined" || !document.body) return null;

  return createPortal(
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      className={`z-50 w-max flex gap-1 ${item.isVertical ? "flex-col" : "flex-row"}`}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={() => {
        scheduleClose();
      }}
    >
        {item.imageUrl && (
          <>
            <Button
              size="icon"
              onClick={onFitModeChange}
              className="w-8 h-8 rounded-full shadow"
              title={
                item.fitMode === "width" ? "切换为高度铺满" : "切换为宽度铺满"
              }
            >
              <MoveVertical
                className="w-3.5 h-3.5"
                style={{
                  transform:
                    item.fitMode === "width" ? "rotate(-90deg)" : "none",
                  transition: "transform 0.2s ease-in-out",
                }}
              />
            </Button>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="w-8 h-8 rounded-full shadow"
              title="更换图片"
            >
              <LucideImage className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onZoomIn();
              }}
              className="w-8 h-8 rounded-full shadow"
              title={`放大 (${Math.round((item.scale || 1) * 100)}%)`}
              disabled={(item.scale || 1) >= MAX_ZOOM}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onZoomOut();
              }}
              className="w-8 h-8 rounded-full shadow"
              title={`缩小 (${Math.round((item.scale || 1) * 100)}%)`}
              disabled={(item.scale || 1) <= MIN_ZOOM}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRotateCCW();
              }}
              className="w-8 h-8 rounded-full shadow"
              title="逆时针旋转"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRotateCW();
              }}
              className="w-8 h-8 rounded-full shadow"
              title="顺时针旋转"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </Button>
          </>
        )}

        <Button
          size="icon"
          onClick={onOrientationChange}
          className="w-8 h-8 rounded-full shadow"
          title={item.isVertical ? "切换为横向" : "切换为竖向"}
        >
          <RectangleVertical
            className="w-3.5 h-3.5"
            style={{
              transform: item.isVertical ? "rotate(90deg)" : "none",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </Button>

        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-8 h-8 rounded-full shadow bg-red-500 hover:bg-red-600"
          title="移除"
        >
          <Trash />
        </Button>
    </div>,
    document.body
  );
};

export default ToolBar;