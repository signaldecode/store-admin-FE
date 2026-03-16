"use client";

import { useCallback, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageUploader } from "@/data/labels";

interface ImageFile {
  file?: File;
  url: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxCount?: number;
  maxSizeMB?: number;
  accept?: string;
}

export default function ImageUploader({
  images,
  onChange,
  maxCount = 5,
  maxSizeMB = 5,
  accept = "image/jpeg,image/png,image/webp",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newImages: ImageFile[] = [];

      for (const file of Array.from(files)) {
        if (images.length + newImages.length >= maxCount) break;
        if (file.size > maxSizeMB * 1024 * 1024) continue;

        newImages.push({
          file,
          url: URL.createObjectURL(file),
        });
      }

      onChange([...images, ...newImages]);
    },
    [images, onChange, maxCount, maxSizeMB]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const removed = images[index];
      if (removed.file) URL.revokeObjectURL(removed.url);
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="group relative h-24 w-24 overflow-hidden rounded-md border"
          >
            <img
              src={img.url}
              alt={imageUploader.altText("상품", i)}
              className="h-full w-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleRemove(i)}
              aria-label={imageUploader.deleteLabel(i)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {images.length < maxCount && (
          <button
            type="button"
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            onClick={() => inputRef.current?.click()}
            aria-label={imageUploader.addLabel}
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">{imageUploader.addButton}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-muted-foreground">
        {imageUploader.hint(maxCount, maxSizeMB)}
      </p>
    </div>
  );
}
