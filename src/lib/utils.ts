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
