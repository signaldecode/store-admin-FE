"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import { category as categoryLabels } from "@/data/labels";

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onReorder: (parentId: number | null, orderedIds: number[]) => void;
}

interface TreeNodeProps {
  category: Category;
  depth: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onReorder: (parentId: number | null, orderedIds: number[]) => void;
  siblings: Category[];
  onDragStart: (e: React.DragEvent, id: number, parentId: number | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: number, parentId: number | null) => void;
}

function TreeNode({
  category,
  depth,
  onEdit,
  onDelete,
  onReorder,
  siblings,
  onDragStart,
  onDragOver,
  onDrop,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-accent",
          "transition-colors focus-within:ring-1 focus-within:ring-ring"
        )}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
        draggable
        tabIndex={0}
        role="listitem"
        aria-label={categoryLabels.treeItemLabel(category.name)}
        onKeyDown={(e) => {
          if (e.altKey && e.key === "ArrowUp") {
            e.preventDefault();
            const ids = siblings.map((s) => s.id);
            const idx = ids.indexOf(category.id);
            if (idx > 0) {
              ids.splice(idx, 1);
              ids.splice(idx - 1, 0, category.id);
              onReorder(category.parentId, ids);
            }
          }
          if (e.altKey && e.key === "ArrowDown") {
            e.preventDefault();
            const ids = siblings.map((s) => s.id);
            const idx = ids.indexOf(category.id);
            if (idx < ids.length - 1) {
              ids.splice(idx, 1);
              ids.splice(idx + 1, 0, category.id);
              onReorder(category.parentId, ids);
            }
          }
        }}
        onDragStart={(e) => onDragStart(e, category.id, category.parentId)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, category.id, category.parentId)}
      >
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100" aria-hidden="true" />

        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 p-0.5"
            aria-expanded={expanded}
            aria-label={expanded ? categoryLabels.collapse : categoryLabels.expand}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span className="flex-1 text-sm">{category.name}</span>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(category)}
            aria-label={categoryLabels.editLabel(category.name)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(category)}
            aria-label={categoryLabels.deleteLabel(category.name)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div>
          {category.children!.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onReorder={onReorder}
              siblings={category.children!}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({
  categories,
  onEdit,
  onDelete,
  onReorder,
}: CategoryTreeProps) {
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragParentId, setDragParentId] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    id: number,
    parentId: number | null
  ) => {
    setDragId(id);
    setDragParentId(parentId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    targetId: number,
    targetParentId: number | null
  ) => {
    e.preventDefault();

    if (dragId === null || dragId === targetId) return;
    // 같은 부모 내에서만 순서 변경
    if (dragParentId !== targetParentId) return;

    const findSiblings = (
      items: Category[],
      parentId: number | null
    ): Category[] => {
      if (parentId === null) return items;
      for (const item of items) {
        if (item.id === parentId) return item.children || [];
        if (item.children) {
          const found = findSiblings(item.children, parentId);
          if (found.length > 0) return found;
        }
      }
      return [];
    };

    const siblings = findSiblings(categories, targetParentId);
    const ids = siblings.map((s) => s.id);
    const fromIndex = ids.indexOf(dragId);
    const toIndex = ids.indexOf(targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, dragId);

    onReorder(targetParentId, ids);
    setDragId(null);
    setDragParentId(null);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border p-2">
      {categories.map((category) => (
        <TreeNode
          key={category.id}
          category={category}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onReorder={onReorder}
          siblings={categories}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
