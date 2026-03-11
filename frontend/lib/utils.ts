import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import numbro from "numbro"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 数値を見やすく省略表示する (例: 500→"500", 1500→"1.5k", 3000000→"3m") */
export function formatNumber(value: number): string {
  if (value < 1000) return numbro(value).format({ mantissa: 0 });
  return numbro(value).format({ average: true, mantissa: 1, trimMantissa: true });
}
