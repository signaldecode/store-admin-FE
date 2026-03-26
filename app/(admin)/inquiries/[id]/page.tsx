"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getInquiry, answerInquiry } from "@/services/inquiryService";
import type { Inquiry } from "@/types/inquiry";
import { inquiry as L, common, INQUIRY_STATUS_LABEL } from "@/data/labels";
import {
  DetailShell, DetailLoading, DetailNotFound,
  Section, InfoGrid, InfoItem,
} from "@/components/common/DetailPage";

export default function InquiryDetailPage() {
  const id = Number(useParams().id);
  const [data, setData] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetch = useCallback(() => {
    getInquiry(id).then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(fetch, [fetch]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitting(true);
    try { await answerInquiry(id, answer.trim()); setAnswer(""); fetch(); } catch {} finally { setSubmitting(false); }
  };

  if (loading) return <DetailLoading />;
  if (!data) return <DetailNotFound message={L.notFound} backHref="/inquiries" />;

  const isAnswered = data.status === "ANSWERED";

  return (
    <DetailShell
      title={data.title}
      backHref="/inquiries"
      actions={<Badge variant={isAnswered ? "default" : "secondary"}>{INQUIRY_STATUS_LABEL[data.status]}</Badge>}
    >
      <Section title={L.sectionQuestion}>
        <InfoGrid>
          <InfoItem label={L.colType} value={data.type} />
          <InfoItem label={L.colUser} value={data.userName} />
          <InfoItem label={L.colCreatedAt} value={new Date(data.createdAt).toLocaleDateString("ko-KR")} />
        </InfoGrid>
        <div className="mt-4 whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm">{data.content}</div>
        {data.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.attachments.map((url, i) => (
              <img key={i} src={url} alt={`첨부 ${i + 1}`} className="h-20 w-20 rounded border object-cover" />
            ))}
          </div>
        )}
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
              <Label htmlFor="inquiry-answer">{L.sectionAnswer}</Label>
              <Textarea id="inquiry-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={L.answerPlaceholder} rows={5} aria-required="true" />
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
