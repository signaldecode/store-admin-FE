"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import { category as categoryLabels } from "@/data/labels";

const LEVEL_BADGE: Record<number, { label: string; className: string }> = {
  1: {
    label: categoryLabels.levelMain,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  2: {
    label: categoryLabels.levelSub,
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  3: {
    label: categoryLabels.levelDetail,
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
};

interface CategoryTreeProps {
  categories: Category[];
  editing: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onReorder: (parentId: number | null, orderedIds: number[]) => void;
}

/* ── 드래그 오버레이용 미리보기 ── */
function DragPreview({ category }: { category: Category }) {
  const badge = LEVEL_BADGE[category.level];
  return (
    <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 shadow-lg">
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{category.name}</span>
      {badge && (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0 h-5 font-normal",
            badge.className
          )}
        >
          {badge.label}
        </Badge>
      )}
    </div>
  );
}

/* ── 트리 노드 ── */
interface TreeNodeProps {
  category: Category;
  depth: number;
  isLast: boolean;
  ancestorIsLast: boolean[];
  editing: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onReorder: (parentId: number | null, orderedIds: number[]) => void;
  siblings: Category[];
  activeId: number | null;
  /** 대분류 아코디언: 현재 펼쳐진 대분류 ID */
  expandedRootId: number | null;
  onExpandRoot: (id: number | null) => void;
}

function TreeNodeContent({
  category,
  depth,
  isLast,
  ancestorIsLast,
  editing,
  onEdit,
  onDelete,
  onReorder,
  siblings,
  activeId,
  expandedRootId,
  onExpandRoot,
  sortableProps,
}: TreeNodeProps & {
  sortableProps?: {
    attributes: ReturnType<typeof useSortable>["attributes"];
    listeners: ReturnType<typeof useSortable>["listeners"];
    setNodeRef: ReturnType<typeof useSortable>["setNodeRef"];
  };
}) {
  // 대분류(depth 0): 상위에서 제어, 하위: 로컬 상태
  const isRoot = depth === 0;
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = isRoot ? expandedRootId === category.id : localExpanded;

  const toggleExpanded = () => {
    if (isRoot) {
      onExpandRoot(expanded ? null : category.id);
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const hasChildren = category.children && category.children.length > 0;
  const badge = LEVEL_BADGE[category.level];
  const isDragging = activeId === category.id;

  return (
    <>
      <div
        ref={sortableProps?.setNodeRef}
        className={cn(
          "group flex items-center gap-1.5 rounded-md py-1.5 pr-2",
          "hover:bg-accent/50 transition-colors focus-within:ring-1 focus-within:ring-ring",
          isDragging && "opacity-30"
        )}
        tabIndex={0}
        role="listitem"
        aria-label={categoryLabels.treeItemLabel(category.name)}
        onKeyDown={
          editing
            ? (e) => {
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
              }
            : undefined
        }
      >
        {/* 트리 연결선 */}
        {depth > 0 && (
          <div className="flex shrink-0 items-stretch" aria-hidden="true">
            {ancestorIsLast.map((aIsLast, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block w-5 border-border",
                  !aIsLast && "border-l"
                )}
              />
            ))}
            <span
              className={cn(
                "inline-block w-5 border-border border-b",
                isLast
                  ? "border-l rounded-bl-sm h-1/2"
                  : "border-l h-full"
              )}
            />
          </div>
        )}

        {depth === 0 && <span className="w-2 shrink-0" />}

        {/* 드래그 핸들 (순서 변경 모드에서만) */}
        {editing && sortableProps ? (
          <button
            className="shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground transition-opacity hover:text-foreground active:cursor-grabbing"
            {...sortableProps.attributes}
            {...sortableProps.listeners}
            aria-label={`${category.name} 순서 변경`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          !editing && <span className="w-5 shrink-0" />
        )}

        {/* 펼치기/접기 */}
        {hasChildren ? (
          <button
            onClick={toggleExpanded}
            className="shrink-0 p-0.5"
            aria-expanded={expanded}
            aria-label={
              expanded ? categoryLabels.collapse : categoryLabels.expand
            }
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}

        {/* 카테고리명 */}
        <span
          className={cn("flex-1 text-sm", depth === 0 && "font-semibold")}
        >
          {category.name}
        </span>

        {/* 레벨 뱃지 */}
        {badge && (
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px] px-1.5 py-0 h-5 font-normal",
              badge.className
            )}
          >
            {badge.label}
          </Badge>
        )}

        {/* 수정/삭제 버튼 (보기 모드에서만) */}
        {!editing && (onEdit || onDelete) && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEdit(category)}
                aria-label={categoryLabels.editLabel(category.name)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete(category)}
                aria-label={categoryLabels.deleteLabel(category.name)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 하위 카테고리 */}
      {hasChildren && expanded && (
        <SortableGroup
          categories={category.children!}
          parentId={category.id}
          depth={depth + 1}
          parentIsLast={isLast}
          ancestorIsLast={ancestorIsLast}
          editing={editing}
          onEdit={onEdit}
          onDelete={onDelete}
          onReorder={onReorder}
          activeId={activeId}
          expandedRootId={expandedRootId}
          onExpandRoot={onExpandRoot}
        />
      )}
    </>
  );
}

/* 순서 변경 모드: Sortable 래퍼 */
function SortableTreeNode(props: TreeNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isSorting,
  } = useSortable({ id: props.category.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={style} className={cn(isSorting && "transition-transform")}>
      <TreeNodeContent
        {...props}
        sortableProps={{ attributes, listeners, setNodeRef }}
      />
    </div>
  );
}

/* 보기 모드: 일반 래퍼 */
function StaticTreeNode(props: TreeNodeProps) {
  return (
    <div>
      <TreeNodeContent {...props} />
    </div>
  );
}

/* ── 같은 부모를 가진 형제 그룹 ── */
interface SortableGroupProps {
  categories: Category[];
  parentId: number | null;
  depth: number;
  parentIsLast?: boolean;
  ancestorIsLast?: boolean[];
  editing: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onReorder: (parentId: number | null, orderedIds: number[]) => void;
  activeId: number | null;
  expandedRootId: number | null;
  onExpandRoot: (id: number | null) => void;
}

function SortableGroup({
  categories,
  depth,
  parentIsLast,
  ancestorIsLast = [],
  editing,
  onEdit,
  onDelete,
  onReorder,
  activeId,
  expandedRootId,
  onExpandRoot,
}: SortableGroupProps) {
  const ids = useMemo(() => categories.map((c) => c.id), [categories]);

  const buildProps = (cat: Category, i: number): TreeNodeProps => ({
    category: cat,
    depth,
    isLast: i === categories.length - 1,
    ancestorIsLast:
      depth > 0 ? [...ancestorIsLast, parentIsLast ?? false] : [],
    editing,
    onEdit,
    onDelete,
    onReorder,
    siblings: categories,
    activeId,
    expandedRootId,
    onExpandRoot,
  });

  if (editing) {
    return (
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div>
          {categories.map((cat, i) => (
            <SortableTreeNode key={cat.id} {...buildProps(cat, i)} />
          ))}
        </div>
      </SortableContext>
    );
  }

  return (
    <div>
      {categories.map((cat, i) => (
        <StaticTreeNode key={cat.id} {...buildProps(cat, i)} />
      ))}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function CategoryTree({
  categories,
  editing,
  onEdit,
  onDelete,
  onReorder,
}: CategoryTreeProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [expandedRootId, setExpandedRootId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findCategory = (
    items: Category[],
    id: number
  ): Category | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findCategory(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

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

  const activeCategory = activeId
    ? findCategory(categories, activeId)
    : undefined;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const draggedItem = findCategory(categories, active.id as number);
    const targetItem = findCategory(categories, over.id as number);

    if (!draggedItem || !targetItem) return;
    if (draggedItem.parentId !== targetItem.parentId) return;

    const sibs = findSiblings(categories, draggedItem.parentId);
    const ids = sibs.map((s) => s.id);
    const fromIndex = ids.indexOf(active.id as number);
    const toIndex = ids.indexOf(over.id as number);

    if (fromIndex === -1 || toIndex === -1) return;

    ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, active.id as number);

    onReorder(draggedItem.parentId, ids);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (categories.length === 0) {
    return null;
  }

  if (editing) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="rounded-md border p-2">
          <SortableGroup
            categories={categories}
            parentId={null}
            depth={0}
            editing
            onReorder={onReorder}
            activeId={activeId}
            expandedRootId={expandedRootId}
            onExpandRoot={setExpandedRootId}
          />
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeCategory ? <DragPreview category={activeCategory} /> : null}
        </DragOverlay>
      </DndContext>
    );
  }

  return (
    <div className="rounded-md border p-2">
      <SortableGroup
        categories={categories}
        parentId={null}
        depth={0}
        editing={false}
        onEdit={onEdit}
        onDelete={onDelete}
        onReorder={onReorder}
        activeId={null}
        expandedRootId={expandedRootId}
        onExpandRoot={setExpandedRootId}
      />
    </div>
  );
}
