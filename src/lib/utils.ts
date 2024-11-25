import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export const calcRatio = (w: number, h: number): string => {
  const divisor = gcd(w, h);
  return `${w / divisor}/${h / divisor}`;
};

export const isMobileDevice = (): boolean => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 || "ontouchstart" in window;
  }
  return false;
};

export function getDpi() {
  // 创建一个隐藏的 div 元素
  const div = document.createElement("div");
  div.style.width = "1in"; // 设置宽度为 1 英寸
  div.style.height = "1in"; // 设置高度为 1 英寸
  div.style.position = "absolute";
  div.style.visibility = "hidden";

  // 添加到页面
  document.body.appendChild(div);

  // 获取像素值，计算 DPI
  const dpi = div.offsetWidth;

  // 移除 div
  document.body.removeChild(div);

  return dpi;
}

export const getMmToPxCoefficient = () => {
  const dpi = getDpi();
  console.log(dpi);
  return dpi / 25.4;
};
