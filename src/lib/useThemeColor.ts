import { usePreviewStore } from '@/store/PreviewStore1';
import { useEffect } from 'react';

// 将 hex 转换为 HSL
function hexToHSL(hex: string) {
  // 移除 # 号
  hex = hex.replace(/^#/, '');

  // 将 hex 转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export const useThemeColor = () => {
  const { themeColor } = usePreviewStore();

  useEffect(() => {
    const { h, s, l } = hexToHSL(themeColor);
    
    // 设置 CSS 变量
    document.documentElement.style.setProperty('--theme-color-h', `${h}`);
    document.documentElement.style.setProperty('--theme-color-s', `${s}%`);
    document.documentElement.style.setProperty('--theme-color-l', `${l}%`);
    
    // 更新 Tailwind 的 primary 颜色
    document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
  }, [themeColor]);
}; 