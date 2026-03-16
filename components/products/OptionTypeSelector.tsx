"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OPTION_TYPE, OPTION_TYPE_LABEL } from "@/lib/constants";
import type { OptionType } from "@/lib/constants";

export interface OptionDraft {
  name: string;
  type: OptionType;
  values: string[];
}

interface OptionTypeSelectorProps {
  options: OptionDraft[];
  onChange: (options: OptionDraft[]) => void;
  disabled?: boolean;
}

export default function OptionTypeSelector({
  options,
  onChange,
  disabled = false,
}: OptionTypeSelectorProps) {
  const addOption = () => {
    onChange([
      ...options,
      { name: "", type: OPTION_TYPE.FIXED, values: [] },
    ]);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, partial: Partial<OptionDraft>) => {
    onChange(
      options.map((opt, i) => (i === index ? { ...opt, ...partial } : opt))
    );
  };

  const addValue = (optionIndex: number, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const opt = options[optionIndex];
    if (opt.values.includes(trimmed)) return;

    updateOption(optionIndex, { values: [...opt.values, trimmed] });
  };

  const removeValue = (optionIndex: number, valueIndex: number) => {
    const opt = options[optionIndex];
    updateOption(optionIndex, {
      values: opt.values.filter((_, i) => i !== valueIndex),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>상품 옵션</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          disabled={disabled}
        >
          <Plus className="mr-1 h-4 w-4" />
          옵션 추가
        </Button>
      </div>

      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
          옵션이 없습니다. 옵션을 추가하면 색상, 사이즈 등을 관리할 수 있습니다.
        </p>
      )}

      {options.map((opt, optIdx) => (
        <div
          key={optIdx}
          className="space-y-3 rounded-md border p-4"
        >
          <div className="flex items-start gap-3">
            {/* 옵션명 */}
            <div className="flex-1 space-y-1">
              <Label htmlFor={`option-name-${optIdx}`}>
                옵션명 <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`option-name-${optIdx}`}
                value={opt.name}
                onChange={(e) =>
                  updateOption(optIdx, { name: e.target.value })
                }
                placeholder="예: 색상, 사이즈"
                disabled={disabled}
              />
            </div>

            {/* 옵션 타입 */}
            <div className="w-36 space-y-1">
              <Label htmlFor={`option-type-${optIdx}`}>타입</Label>
              <Select
                value={opt.type}
                onValueChange={(v) => {
                  if (v) updateOption(optIdx, { type: v as OptionType });
                }}
                disabled={disabled}
              >
                <SelectTrigger id={`option-type-${optIdx}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPTION_TYPE_LABEL).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 삭제 */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-6 shrink-0 text-destructive hover:text-destructive"
              onClick={() => removeOption(optIdx)}
              disabled={disabled}
              aria-label={`${opt.name || "옵션"} 삭제`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 고정 옵션: 옵션값 입력 */}
          {opt.type === OPTION_TYPE.FIXED && (
            <div className="space-y-2">
              <Label>옵션값</Label>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val, valIdx) => (
                  <Badge key={valIdx} variant="secondary" className="gap-1">
                    {val}
                    <button
                      type="button"
                      onClick={() => removeValue(optIdx, valIdx)}
                      disabled={disabled}
                      aria-label={`${val} 삭제`}
                      className="ml-0.5 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <OptionValueInput
                onAdd={(value) => addValue(optIdx, value)}
                disabled={disabled}
                optionIndex={optIdx}
              />
            </div>
          )}

          {/* 자유 입력 옵션 안내 */}
          {opt.type === OPTION_TYPE.FREE && (
            <p className="text-sm text-muted-foreground">
              고객이 주문 시 직접 입력하는 옵션입니다. (예: 각인 문구)
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/** 옵션값 입력 (Enter로 추가) */
function OptionValueInput({
  onAdd,
  disabled,
  optionIndex,
}: {
  onAdd: (value: string) => void;
  disabled: boolean;
  optionIndex: number;
}) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        onAdd(value);
        setValue("");
      }
    }
  };

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        if (value.trim()) {
          onAdd(value);
          setValue("");
        }
      }}
      placeholder="옵션값 입력 후 Enter"
      disabled={disabled}
      aria-label={`옵션 ${optionIndex + 1} 값 추가`}
    />
  );
}
