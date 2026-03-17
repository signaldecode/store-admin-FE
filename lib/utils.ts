import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 숫자를 한글 단위 문자열로 변환 + 원
 * 예: 169000 → "16만 9천"
 *     1234567 → "123만 4천 5백 6십 7"
 */
export function formatKoreanUnit(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (!num || isNaN(num)) return "";

  const units = [
    { value: 100000000, label: "억" },
    { value: 10000, label: "만" },
    { value: 1000, label: "천" },
    { value: 100, label: "백" },
    { value: 10, label: "십" },
    { value: 1, label: "" },
  ];

  let remaining = num;
  const parts: string[] = [];

  for (const unit of units) {
    if (remaining >= unit.value) {
      const digit = Math.floor(remaining / unit.value);
      remaining = remaining % unit.value;
      parts.push(`${digit}${unit.label}`);
    }
  }

  return parts.join(" ") + "원";
}

/** 숫자를 한글 단위 문자열로 변환 
 * 예: 169000 → "16만 9천"
 *     1234567 → "123만 4천 5백 6십 7"
 *  */
export function formatKoreanUnitShort(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (!num || isNaN(num)) return "";

  const units = [
    { value: 100000000, label: "억" },
    { value: 10000, label: "만" },
    { value: 1000, label: "천" },
    { value: 100, label: "백" },
    { value: 10, label: "십" },
    { value: 1, label: "" },
  ];

  let remaining = num;
  const parts: string[] = [];

  for (const unit of units) {
    if (remaining >= unit.value) {
      const digit = Math.floor(remaining / unit.value);
      remaining = remaining % unit.value;
      parts.push(`${digit}${unit.label}`);
    }
  }
  return parts.join("");
}
