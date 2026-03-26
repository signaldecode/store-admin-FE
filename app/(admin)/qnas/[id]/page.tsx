"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getQna, answerQna } from "@/services/qnaService";
import type { Qna } from "@/types/qna";
import { qna as L, common, QNA_STATUS_LABEL } from "@/data/labels";
import {
  DetailShell, DetailLoading, DetailNotFound,
  Section, InfoGrid, InfoItem,
} from "@/components/common/DetailPage";

export default function QnaDetailPage() {
  const id = Number(useParams().id);
  const [data, setData] = useState<Qna | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetch = useCallback(() => {
    getQna(id).then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(fetch, [fetch]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitting(true);
    try { await answerQna(id, answer.trim()); setAnswer(""); fetch(); } catch {} finally { setSubmitting(false); }
  };

  if (loading) return <DetailLoading />;
  if (!data) return <DetailNotFound message={L.notFound} backHref="/qnas" />;

  const isAnswered = data.status === "ANSWERED";

  return (
    <DetailShell
      title={data.title}
      backHref="/qnas"
      actions={
        <div className="flex items-center gap-2">
          {data.isSecret && <Lock className="h-4 w-4 text-muted-foreground" />}
          <Badge variant={isAnswered ? "default" : "secondary"}>{QNA_STATUS_LABEL[data.status]}</Badge>
        </div>
      }
    >
      <Section title={L.sectionQuestion}>
        <InfoGrid>
          <InfoItem label={L.colProduct} value={data.qnaType} />
          <InfoItem label={L.colUser} value={`#${data.userId}`} />
          <InfoItem label={L.colCreatedAt} value={new Date(data.createdAt).toLocaleDateString("ko-KR")} />
        </InfoGrid>
        <div className="mt-4 whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm">{data.question}</div>
      </Section>

      <Section title={L.sectionAnswer}>
        {isAnswered ? (
          <div>
            <div className="whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm">{data.answer}</div>
            {data.answeredAt && (
              <p className="mt-2 text-xs text-muted-foreground">{L.answeredAt}: {new Date(data.answeredAt).toLocaleDateString("ko-KR")}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleAnswer} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="qna-answer">{L.sectionAnswer}</Label>
              <Textarea id="qna-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={L.answerPlaceholder} rows={5} aria-required="true" />
            </div>
            <Button type="submit" size="sm" disabled={submitting || !answer.trim()}>
              {submitting ? common.saving : L.answerButton}
            </Button>
          </form>
        )}
      </Section>
    </DetailShell>
  );
}
