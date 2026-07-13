"use client";

import { useActionState } from "react";

import { approveRequest } from "@/lib/actions/admin-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AREAS, AREA_LABELS, CATEGORIES, CATEGORY_LABELS } from "@/lib/restaurant-labels";

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function AdminRequestApproveForm({ requestId }: { requestId: string }) {
  const action = approveRequest.bind(null, requestId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-lg border border-dashed p-3 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor={`area-${requestId}`}>상권</Label>
          <select id={`area-${requestId}`} name="area" required className={selectClassName}>
            {AREAS.map((value) => (
              <option key={value} value={value}>
                {AREA_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`category-${requestId}`}>카테고리</Label>
          <select id={`category-${requestId}`} name="category" required className={selectClassName}>
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`lat-${requestId}`}>위도</Label>
          <Input id={`lat-${requestId}`} name="latitude" type="number" step="any" required className="h-8" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`lng-${requestId}`}>경도</Label>
          <Input id={`lng-${requestId}`} name="longitude" type="number" step="any" required className="h-8" />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`phone-${requestId}`}>전화번호 (선택)</Label>
          <Input id={`phone-${requestId}`} name="phone" className="h-8" />
        </div>
      </div>
      {state?.error && <p className="text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "승인 중..." : "승인하고 식당 등록"}
      </Button>
    </form>
  );
}
