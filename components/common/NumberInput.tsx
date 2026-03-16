"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";

/** 숫자만 추출 */
function stripNonDigits(str: string): string {
  return str.replace(/[^0-9]/g, "");
}

/** 천 단위 콤마 포맷 */
function formatWithComma(value: string): string {
  const digits = stripNonDigits(value);
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

interface NumberInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  /** 원시 숫자 문자열 (콤마 없는 값, 예: "169000") */
  value: string;
  /** 원시 숫자 문자열을 전달받는 핸들러 */
  onValueChange: (raw: string) => void;
}

export default function NumberInput({
  value,
  onValueChange,
  ...props
}: NumberInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = stripNonDigits(e.target.value);
      onValueChange(raw);
    },
    [onValueChange]
  );

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={formatWithComma(value)}
      onChange={handleChange}
      {...props}
    />
  );
}
