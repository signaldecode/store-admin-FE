"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OptionDraft } from "./OptionTypeSelector";

interface OptionPriceEditorProps {
  options: OptionDraft[];
  prices: Record<string, Record<string, number>>;
  onChange: (prices: Record<string, Record<string, number>>) => void;
  disabled?: boolean;
}

/**
 * 옵션값별 개별 추가금액 에디터
 * 조합 테이블과 별도로, 옵션 단위로 추가금액을 빠르게 설정할 때 사용
 * 예: 사이즈 XL → +2000원 (모든 색상 조합에 일괄 적용)
 */
export default function OptionPriceEditor({
  options,
  prices,
  onChange,
  disabled = false,
}: OptionPriceEditorProps) {
  const fixedOptions = options.filter(
    (o) => o.type === "FIXED" && o.values.length > 0 && o.name.trim()
  );

  if (fixedOptions.length === 0) return null;

  const updatePrice = (
    optionName: string,
    value: string,
    price: number
  ) => {
    onChange({
      ...prices,
      [optionName]: {
        ...(prices[optionName] || {}),
        [value]: Math.max(0, price),
      },
    });
  };

  return (
    <div className="space-y-4">
      <Label>옵션값별 추가금액 (빠른 설정)</Label>
      <p className="text-xs text-muted-foreground">
        여기서 설정한 추가금액은 조합 테이블에 자동 반영됩니다.
      </p>

      {fixedOptions.map((opt) => (
        <div key={opt.name} className="space-y-2 rounded-md border p-3">
          <span className="text-sm font-medium">{opt.name}</span>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {opt.values.map((val) => (
              <div key={val} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-sm">{val}</span>
                <Input
                  type="number"
                  min="0"
                  value={prices[opt.name]?.[val] || 0}
                  onChange={(e) =>
                    updatePrice(opt.name, val, Number(e.target.value))
                  }
                  disabled={disabled}
                  aria-label={`${opt.name} ${val} 추가금액`}
                  className="h-8"
                />
                <span className="shrink-0 text-xs text-muted-foreground">원</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
