"use client";

import { useActionState } from "react";

import { answerInquiry } from "@/lib/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AdminInquiryAnswerForm({
  inquiryId,
  existingAnswer,
}: {
  inquiryId: string;
  existingAnswer?: string;
}) {
  const action = answerInquiry.bind(null, inquiryId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Textarea
        name="answer"
        required
        maxLength={2000}
        defaultValue={existingAnswer}
        placeholder="답변을 입력해주세요."
      />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "저장 중..." : existingAnswer ? "답변 수정" : "답변 등록"}
      </Button>
    </form>
  );
}
