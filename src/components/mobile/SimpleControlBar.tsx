"use client";

import { FC } from "react";

interface SimpleControlBarProps {
  onOpenDrawer: (tab: string) => void;
}

const SimpleControlBar: FC<SimpleControlBarProps> = ({ onOpenDrawer }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 p-4 text-white text-center z-50">
      控制栏测试
      <button 
        className="bg-white text-red-500 px-4 py-2 rounded-md ml-2"
        onClick={() => onOpenDrawer("settings")}
      >
        设置
      </button>
    </div>
  );
};

export default SimpleControlBar;
