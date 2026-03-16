"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OptionDraft } from "./OptionTypeSelector";

export interface VariantDraft {
  optionValues: Record<string, string>;
  sku: string;
  stock: number;
  additionalPrice: number;
}

interface OptionCombinationTableProps {
  options: OptionDraft[];
  variants: VariantDraft[];
  onChange: (variants: VariantDraft[]) => void;
  disabled?: boolean;
}

/** 고정 옵션들의 값 조합을 생성 */
function generateCombinations(
  options: OptionDraft[]
): Record<string, string>[] {
  const fixedOptions = options.filter(
    (o) => o.type === "FIXED" && o.values.length > 0 && o.name.trim()
  );

  if (fixedOptions.length === 0) return [];

  let combos: Record<string, string>[] = [{}];

  for (const opt of fixedOptions) {
    const next: Record<string, string>[] = [];
    for (const combo of combos) {
      for (const val of opt.values) {
        next.push({ ...combo, [opt.name]: val });
      }
    }
    combos = next;
  }

  return combos;
}

/** optionValues를 키 문자열로 변환 (기존 데이터 매칭용) */
function variantKey(optionValues: Record<string, string>): string {
  return Object.entries(optionValues)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

export default function OptionCombinationTable({
  options,
  variants,
  onChange,
  disabled = false,
}: OptionCombinationTableProps) {
  const combinations = generateCombinations(options);

  if (combinations.length === 0) {
    return null;
  }

  // 기존 variants를 키로 매핑
  const existingMap = new Map<string, VariantDraft>();
  for (const v of variants) {
    existingMap.set(variantKey(v.optionValues), v);
  }

  // 조합에 맞는 variants 배열 생성 (기존 데이터 유지)
  const currentVariants: VariantDraft[] = combinations.map((combo) => {
    const key = variantKey(combo);
    const existing = existingMap.get(key);
    return existing
      ? { ...existing, optionValues: combo }
      : { optionValues: combo, sku: "", stock: 0, additionalPrice: 0 };
  });

  // variants가 변경되었으면 부모에 알림
  const currentKeys = currentVariants.map((v) => variantKey(v.optionValues));
  const prevKeys = variants.map((v) => variantKey(v.optionValues));
  if (
    currentKeys.length !== prevKeys.length ||
    currentKeys.some((k, i) => k !== prevKeys[i])
  ) {
    // 다음 렌더 사이클에서 동기화
    queueMicrotask(() => onChange(currentVariants));
  }

  const updateVariant = (index: number, partial: Partial<VariantDraft>) => {
    const updated = currentVariants.map((v, i) =>
      i === index ? { ...v, ...partial } : v
    );
    onChange(updated);
  };

  const fixedOptionNames = options
    .filter((o) => o.type === "FIXED" && o.values.length > 0 && o.name.trim())
    .map((o) => o.name);

  return (
    <div className="space-y-2">
      <Label>옵션 조합별 재고/가격</Label>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {fixedOptionNames.map((name) => (
                <TableHead key={name}>{name}</TableHead>
              ))}
              <TableHead className="w-32">SKU</TableHead>
              <TableHead className="w-24">재고</TableHead>
              <TableHead className="w-32">추가금액 (원)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVariants.map((variant, idx) => (
              <TableRow key={variantKey(variant.optionValues)}>
                {fixedOptionNames.map((name) => (
                  <TableCell key={name} className="font-medium">
                    {variant.optionValues[name]}
                  </TableCell>
                ))}
                <TableCell>
                  <Input
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(idx, { sku: e.target.value })
                    }
                    placeholder="SKU"
                    disabled={disabled}
                    aria-label={`${Object.values(variant.optionValues).join(" ")} SKU`}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(idx, {
                        stock: Math.max(0, Number(e.target.value)),
                      })
                    }
                    disabled={disabled}
                    aria-label={`${Object.values(variant.optionValues).join(" ")} 재고`}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={variant.additionalPrice}
                    onChange={(e) =>
                      updateVariant(idx, {
                        additionalPrice: Math.max(0, Number(e.target.value)),
                      })
                    }
                    disabled={disabled}
                    aria-label={`${Object.values(variant.optionValues).join(" ")} 추가금액`}
                    className="h-8"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        총 {currentVariants.length}개 조합 | 추가금액은 기본 가격에 더해집니다.
      </p>
    </div>
  );
}

export { generateCombinations, variantKey };
