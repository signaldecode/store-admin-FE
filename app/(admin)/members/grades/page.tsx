"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, X } from "lucide-react";
import { getGrades, updateGradePolicy } from "@/services/memberService";
import { getCoupons } from "@/services/couponService";
import { member as L, common } from "@/data/labels";
import type { Grade } from "@/types/member";
import type { Coupon } from "@/types/coupon";

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // 수정 다이얼로그
  const [editGrade, setEditGrade] = useState<Grade | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinAmount, setEditMinAmount] = useState("");
  const [editCouponIds, setEditCouponIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gradeRes, couponRes] = await Promise.all([
        getGrades(),
        getCoupons({ page: 1, size: 100 }),
      ]);
      setGrades(gradeRes.data);
      setCoupons(couponRes.data.content);
    } catch {
      // 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openEdit = (grade: Grade) => {
    setEditGrade(grade);
    setEditName(grade.name);
    setEditMinAmount(String(grade.minAmount));
    setEditCouponIds([...grade.couponIds]);
  };

  const toggleCoupon = (couponId: number) => {
    setEditCouponIds((prev) =>
      prev.includes(couponId) ? prev.filter((id) => id !== couponId) : [...prev, couponId]
    );
  };

  const handleSave = async () => {
    if (!editGrade) return;
    setSaving(true);
    try {
      await updateGradePolicy(editGrade.id, {
        name: editName.trim(),
        minAmount: Number(editMinAmount),
        couponIds: editCouponIds,
      });
      setEditGrade(null);
      await fetchData();
    } catch {
      // 공통 에러 처리
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{L.gradePageTitle}</h1>

      {grades.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">{L.gradeEmptyMessage}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{L.gradeName}</TableHead>
                <TableHead scope="col">{L.gradeMinAmount}</TableHead>
                <TableHead scope="col">연결 쿠폰</TableHead>
                <TableHead scope="col" className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.name}</TableCell>
                  <TableCell>{grade.minAmount.toLocaleString("ko-KR")}{common.currency}</TableCell>
                  <TableCell>
                    {grade.couponIds.length === 0 ? (
                      <span className="text-sm text-muted-foreground">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {grade.couponIds.map((cid) => {
                          const c = coupons.find((cp) => cp.id === cid);
                          return (
                            <Badge key={cid} variant="secondary" className="text-xs">
                              {c?.name ?? `#${cid}`}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(grade)} aria-label={`${grade.name} 수정`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 등급 수정 다이얼로그 */}
      <Dialog open={!!editGrade} onOpenChange={(open) => { if (!open) setEditGrade(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>등급 수정 — {editGrade?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="grade-name">{L.gradeName}</Label>
              <Input id="grade-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grade-min">{L.gradeMinAmount}</Label>
              <Input id="grade-min" type="number" value={editMinAmount} onChange={(e) => setEditMinAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>연결 쿠폰</Label>
              <p className="text-xs text-muted-foreground">등급 승급 시 자동 발급할 쿠폰을 선택하세요</p>
              {coupons.length === 0 ? (
                <p className="text-sm text-muted-foreground">등록된 쿠폰이 없습니다.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 rounded-md border p-3">
                  {coupons.map((c) => {
                    const selected = editCouponIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCoupon(c.id)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {c.name}
                        {selected && <X className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGrade(null)}>{common.cancel}</Button>
            <Button onClick={handleSave} disabled={saving || !editName.trim()}>
              {saving ? common.saving : common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
