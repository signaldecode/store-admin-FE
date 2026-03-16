"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { common } from "@/data/labels";

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
      <h2 className="text-lg font-semibold">{common.errorOccurred}</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error.message || common.errorFallback}
      </p>
      <Button onClick={reset}>{common.retry}</Button>
    </div>
  );
}
