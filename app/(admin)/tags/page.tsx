"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { type Column } from "@/components/common/DataTable";
import { getTags, createTag } from "@/services/tagService";
import type { Tag } from "@/types/tag";
import { tag as tagLabels, common } from "@/data/labels";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [newTagName, setNewTagName] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTags();
      setTags(res.data);
    } catch {
      // api.ts handles common errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleAdd = async () => {
    if (!newTagName.trim()) return;
    setAddLoading(true);
    try {
      await createTag(newTagName.trim());
      setNewTagName("");
      await fetchTags();
    } catch {
      // api.ts handles common errors
    } finally {
      setAddLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const columns: Column<Tag>[] = [
    {
      key: "name",
      label: tagLabels.colName,
      render: (item) => item.name,
    },
    {
      key: "createdAt",
      label: tagLabels.colCreatedAt,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{tagLabels.pageTitle}</h1>

      {/* Add form */}
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="tag-name">
            {tagLabels.nameLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tag-name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tagLabels.namePlaceholder}
            aria-required="true"
          />
        </div>
        <Button onClick={handleAdd} disabled={addLoading || !newTagName.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          {addLoading ? common.saving : tagLabels.addButton}
        </Button>
      </div>

      {/* Tag list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tags}
          keyExtractor={(item) => item.id}
          emptyMessage={tagLabels.emptyMessage}
        />
      )}
    </div>
  );
}
