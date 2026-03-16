"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="text-lg font-semibold">오류가 발생했습니다</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error.message || "페이지를 불러오는 중 문제가 발생했습니다."}
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
