"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTable, { type Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  getFaqCategories,
  createFaqCategory,
  updateFaqCategory,
  deleteFaqCategory,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/services/faqService";
import type { Faq, FaqCategory, FaqFormData } from "@/types/faq";
import { faq as faqLabels, common } from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

const INITIAL_FAQ_FORM: FaqFormData = {
  categoryId: 0,
  question: "",
  answer: "",
};

export default function FaqsPage() {
  const [siteId, setSiteId] = useState<number | null>(null);

  // ─── FAQ Categories ───
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<FaqCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryFormLoading, setCategoryFormLoading] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<FaqCategory | null>(null);
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false);

  // ─── FAQ List ───
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);
  const [formData, setFormData] = useState<FaqFormData>(INITIAL_FAQ_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Search / Filter
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Sort
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  // ─── Fetch Categories ───
  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true);
    try {
      const res = await getFaqCategories();
      setCategories(res.data);
    } catch {
      // api.ts handles common errors
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ─── Fetch FAQs ───
  const fetchFaqs = useCallback(async () => {
    setFaqLoading(true);
    try {
      const categoryId = categoryFilter === "all" ? undefined : Number(categoryFilter);
      const res = await getFaqs({
        keyword: debouncedKeyword || undefined,
        categoryId,
        page,
        size: PAGE_SIZE,
      });
      setFaqs(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts handles common errors
    } finally {
      setFaqLoading(false);
    }
  }, [siteId, debouncedKeyword, categoryFilter, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [siteId, debouncedKeyword, categoryFilter]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  // ─── Category CRUD ───
  const handleOpenCategoryForm = (cat?: FaqCategory) => {
    if (cat) {
      setEditCategory(cat);
      setCategoryName(cat.name);
    } else {
      setEditCategory(null);
      setCategoryName("");
    }
    setCategoryFormOpen(true);
  };

  const handleCategorySubmit = async () => {
    if (!categoryName.trim()) return;
    setCategoryFormLoading(true);
    try {
      if (editCategory) {
        await updateFaqCategory(editCategory.id, categoryName.trim());
      } else {
        await createFaqCategory(categoryName.trim());
      }
      setCategoryFormOpen(false);
      await fetchCategories();
      await fetchFaqs();
    } catch {
      // api.ts handles common errors
    } finally {
      setCategoryFormLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    setDeleteCategoryLoading(true);
    try {
      await deleteFaqCategory(deleteCategoryTarget.id);
      await fetchCategories();
      await fetchFaqs();
      setDeleteCategoryTarget(null);
    } catch {
      // api.ts handles common errors
    } finally {
      setDeleteCategoryLoading(false);
    }
  };

  // ─── FAQ CRUD ───
  const handleCreateFaq = () => {
    setEditTarget(null);
    setFormData(INITIAL_FAQ_FORM);
    setFormOpen(true);
  };

  const handleEditFaq = (faqItem: Faq) => {
    setEditTarget(faqItem);
    setFormData({
      categoryId: faqItem.categoryId,
      question: faqItem.question,
      answer: faqItem.answer,
    });
    setFormOpen(true);
  };

  const handleFaqSubmit = async () => {
    if (!formData.question.trim() || !formData.answer.trim() || !formData.categoryId) return;
    setFormLoading(true);
    try {
      if (editTarget) {
        await updateFaq(editTarget.id, formData);
      } else {
        await createFaq(formData);
      }
      setFormOpen(false);
      await fetchFaqs();
    } catch {
      // api.ts handles common errors
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteFaq(deleteTarget.id);
      await fetchFaqs();
      setDeleteTarget(null);
    } catch {
      // api.ts handles common errors
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<Faq>[] = [
    {
      key: "categoryName",
      label: faqLabels.colCategory,
      render: (item) => item.categoryName,
    },
    {
      key: "question",
      label: faqLabels.colQuestion,
      sortable: true,
      render: (item) =>
        item.question.length > 50
          ? `${item.question.slice(0, 50)}...`
          : item.question,
    },
    {
      key: "createdAt",
      label: faqLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditFaq(item)}
          >
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(item)}
          >
            {common.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* ─── FAQ 카테고리 섹션 ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{faqLabels.categoryPageTitle}</h2>
          <Button variant="outline" size="sm" onClick={() => handleOpenCategoryForm()}>
            <Plus className="mr-2 h-4 w-4" />
            {faqLabels.addCategoryButton}
          </Button>
        </div>

        {categoryLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-sm text-muted-foreground">{common.loading}</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {faqLabels.categoryEmptyMessage}
          </p>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th scope="col" className="px-4 py-2 text-left font-medium">
                    {faqLabels.categoryNameLabel}
                  </th>
                  <th scope="col" className="w-32 px-4 py-2 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenCategoryForm(cat)}
                          aria-label={`${cat.name} ${common.edit}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteCategoryTarget(cat)}
                          aria-label={`${cat.name} ${common.delete}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ─── FAQ 목록 섹션 ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{faqLabels.pageTitle}</h1>
          <Button onClick={handleCreateFaq}>
            <Plus className="mr-2 h-4 w-4" />
            {faqLabels.addButton}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SiteSelect value={siteId} onChange={setSiteId} />
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={faqLabels.searchPlaceholder}
              className="pl-9"
              aria-label={faqLabels.searchPlaceholder}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(v) => { if (v !== null) setCategoryFilter(v); }}
          >
            <SelectTrigger className="h-9 w-36" aria-label={faqLabels.filterCategory}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{common.all}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {faqLoading ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-muted-foreground">{common.loading}</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={faqs}
              keyExtractor={(item) => item.id}
              sort={sort}
              order={order}
              onSort={handleSort}
              emptyMessage={faqLabels.emptyMessage}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {common.totalCount(totalElements)}
              </p>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </section>

      {/* ─── Category Add/Edit Dialog ─── */}
      <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory ? faqLabels.categoryPageTitle : faqLabels.addCategoryButton}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="faq-category-name">
                {faqLabels.categoryNameLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="faq-category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder={faqLabels.categoryNamePlaceholder}
                aria-required="true"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryFormOpen(false)}
              disabled={categoryFormLoading}
            >
              {common.cancel}
            </Button>
            <Button onClick={handleCategorySubmit} disabled={categoryFormLoading}>
              {categoryFormLoading ? common.saving : common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Category Delete Confirm ─── */}
      <ConfirmDialog
        open={!!deleteCategoryTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteCategoryTarget(null);
        }}
        title={faqLabels.categoryDeleteTitle}
        description={
          deleteCategoryTarget
            ? faqLabels.categoryDeleteDescription(deleteCategoryTarget.name)
            : ""
        }
        confirmLabel={common.delete}
        onConfirm={handleDeleteCategory}
        loading={deleteCategoryLoading}
        destructive
      />

      {/* ─── FAQ Add/Edit Dialog ─── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? faqLabels.editTitle : faqLabels.createTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="faq-category">
                {faqLabels.categoryLabel} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId ? String(formData.categoryId) : ""}
                onValueChange={(v) => {
                  if (v !== null) setFormData((prev) => ({ ...prev, categoryId: Number(v) }));
                }}
              >
                <SelectTrigger id="faq-category" className="w-full" aria-required="true">
                  <SelectValue placeholder={faqLabels.categoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faq-question">
                {faqLabels.questionLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="faq-question"
                value={formData.question}
                onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                placeholder={faqLabels.questionPlaceholder}
                aria-required="true"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faq-answer">
                {faqLabels.answerLabel} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="faq-answer"
                value={formData.answer}
                onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                placeholder={faqLabels.answerPlaceholder}
                rows={5}
                aria-required="true"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={formLoading}
            >
              {common.cancel}
            </Button>
            <Button onClick={handleFaqSubmit} disabled={formLoading}>
              {formLoading ? common.saving : common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── FAQ Delete Confirm ─── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={faqLabels.deleteTitle}
        description={deleteTarget ? faqLabels.deleteDescription(deleteTarget.question) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDeleteFaq}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
