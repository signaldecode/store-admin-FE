"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SiteSelect from "@/components/common/SiteSelect";
import { common, settings as s } from "@/data/labels";
import {
  getDisplaySections,
  updateDisplaySections,
  type DisplaySection,
} from "@/services/displayService";

export default function DisplaysPage() {
  const [siteId, setSiteId] = useState<number | null>(null);
  const [sections, setSections] = useState<DisplaySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getDisplaySections();
        setSections(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateSection = (id: number, updates: Partial<DisplaySection>) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDisplaySections(sections);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-busy="true">
        <p className="text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{s.sectionDisplay}</h1>
        <div className="flex items-center gap-2">
          <SiteSelect value={siteId} onChange={setSiteId} />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? common.saving : common.save}
          </Button>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-muted-foreground">{s.displayEmpty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <Switch
                    checked={section.isActive}
                    onCheckedChange={(checked) =>
                      updateSection(section.id, { isActive: checked })
                    }
                    aria-label={`${section.title} 활성 상태 토글`}
                  />
                </div>
                <CardDescription className="font-mono text-xs">
                  {section.keyword}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor={`limit-${section.id}`}>노출 개수</Label>
                  <Input
                    id={`limit-${section.id}`}
                    type="number"
                    min={1}
                    max={100}
                    value={section.limit}
                    onChange={(e) =>
                      updateSection(section.id, {
                        limit: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
