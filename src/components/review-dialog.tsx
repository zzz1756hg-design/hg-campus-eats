"use client";

import { useState } from "react";

import { ReviewForm } from "@/components/review-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ReviewDialog({
  restaurantId,
  existingReview,
}: {
  restaurantId: string;
  existingReview?: { rating: number; content: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        {existingReview ? "리뷰 수정하기" : "리뷰 쓰기"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 작성하기</DialogTitle>
        </DialogHeader>
        <ReviewForm restaurantId={restaurantId} existingReview={existingReview} />
      </DialogContent>
    </Dialog>
  );
}
