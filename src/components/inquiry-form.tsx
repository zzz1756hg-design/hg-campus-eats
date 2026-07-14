"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitInquiry } from "@/lib/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, undefined);

  if (state?.success) {
    return (
      <div className="flex flex-col gap-3 text-sm">
        <p>문의가 접수되었어요. 답변이 등록되면 내 문의 목록에서 확인할 수 있어요.</p>
        <Link href="/inquiries" className="font-medium underline underline-offset-4">
          내 문의 목록 보기
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" required maxLength={100} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">내용</Label>
        <Textarea id="content" name="content" required maxLength={2000} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "제출 중..." : "문의 제출"}
      </Button>
    </form>
  );
}
