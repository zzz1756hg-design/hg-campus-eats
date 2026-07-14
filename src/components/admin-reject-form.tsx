"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RejectState = { error?: string } | undefined;

export function AdminRejectForm({
  action,
}: {
  action: (state: RejectState, formData: FormData) => Promise<RejectState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="destructive" size="sm" onClick={() => setOpen(true)}>
        거절
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Input name="rejectionReason" placeholder="거절 사유" required className="h-8 w-40" autoFocus />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "처리 중..." : "거절 확정"}
      </Button>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
