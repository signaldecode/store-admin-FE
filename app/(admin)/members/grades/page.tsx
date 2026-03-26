"use client";

import { member as L } from "@/data/labels";

/**
 * TODO: 백엔드에 등급 관리 API (getGrades, updateGradePolicy) 없음
 * 백엔드 구현 후 복원 필요
 */
export default function GradesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{L.gradePageTitle}</h1>
      <p className="py-16 text-center text-sm text-muted-foreground">
        등급 관리 기능은 현재 준비 중입니다.
      </p>
    </div>
  );
}
