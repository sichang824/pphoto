"use client";

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const MobileBottomDrawer: FC<MobileBottomDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [height, setHeight] = useState<number>(250); // Default height
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const minHeight = 120; // Minimum drawer height
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400; // Maximum drawer height
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if ('touches' in e) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(e.clientY);
    }
    
    setStartHeight(height);
    e.preventDefault();
  };
  
  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    
    const deltaY = clientY - startY;
    setDragOffset(deltaY);
    
    // If dragging down and exceeds threshold, prepare to close
    if (deltaY > 80) {
      return; // We'll handle this in dragEnd
    }
    
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - deltaY));
    setHeight(newHeight);
  };
  
  const handleDragEnd = () => {
    if (dragOffset > 80) {
      // User dragged down past threshold - close the drawer
      onClose();
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY);
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

  // Reset height when drawer is opened
  useEffect(() => {
    if (isOpen) {
      setHeight(250);
    }
  }, [isOpen]);

  return (
    <div
      ref={drawerRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-60 transition-transform duration-300",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
      style={{ height: `${height}px` }}
    >
      <div className="bg-white rounded-t-xl shadow-lg h-full">
        {/* Drag handle */}
        <div 
          ref={handleRef}
          className="w-full h-7 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-t-xl bg-white"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-3" style={{ height: `calc(${height}px - 1.75rem)` }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomDrawer;
