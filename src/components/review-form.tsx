"use client";

import { useActionState } from "react";

import { submitReview } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const RATING_OPTIONS = [5, 4, 3, 2, 1];

export function ReviewForm({
  restaurantId,
  existingReview,
}: {
  restaurantId: string;
  existingReview?: { rating: number; content: string };
}) {
  const action = submitReview.bind(null, restaurantId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rating">평점</Label>
        <select
          id="rating"
          name="rating"
          defaultValue={existingReview?.rating ?? 5}
          className="h-8 w-24 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {RATING_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {"★".repeat(value)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">리뷰</Label>
        <Textarea
          id="content"
          name="content"
          required
          defaultValue={existingReview?.content}
          placeholder="이 식당은 어땠나요?"
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm" className="self-start">
        {pending ? "등록 중..." : existingReview ? "리뷰 수정" : "리뷰 등록"}
      </Button>
    </form>
  );
}
