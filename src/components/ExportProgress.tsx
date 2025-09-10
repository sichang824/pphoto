"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDownloadStore } from "@/store/DownloadStore";

const MESSAGES = [
  "正在把像素一点点塞进 PDF…",
  "正在排版页面，请稍候…",
  "正在压缩图片，轻装上阵…",
  "正在写入文件流，别眨眼…",
  "正在校准尺寸与留白…",
  "正在整理队列，马上就好…",
] as const;

export default function ExportProgress() {
  const { pdfProgress } = useDownloadStore();
  const open = !!pdfProgress && pdfProgress > 0;

  const step = Math.max(1, Math.floor(100 / MESSAGES.length));
  const rawSlot = Math.floor((pdfProgress - 1) / step);
  const idx = Number.isFinite(rawSlot)
    ? Math.min(MESSAGES.length - 1, Math.max(0, rawSlot))
    : 0;
  const percent = Math.max(0, Math.min(100, Math.round(pdfProgress)));

  // Simple CSS-only enter animation using key change
  const displayText = MESSAGES[idx];

  return (
    <Dialog open={open}>
      <DialogContent hideClose className="sm:max-w-md">
        <DialogTitle className="sr-only">正在导出 PDF</DialogTitle>
        <div className="flex flex-col items-center text-center">
          <img
            src="/anim.webp"
            alt="processing animation"
            className="select-none mb-3 scale-75"
            draggable={false}
          />
          <div className="relative h-[2.25rem] w-full overflow-hidden mb-1">
            <div key={displayText} className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-900 slide-in-up">
              {displayText}
            </div>
          </div>
          <div className="text-base font-semibold tabular-nums text-gray-700">{percent}%</div>
          <style jsx>{`
            @keyframes slideInUp { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            .slide-in-up { animation: slideInUp 200ms ease-out; }
          `}</style>
        </div>
      </DialogContent>
    </Dialog>
  );
}
