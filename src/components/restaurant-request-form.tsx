"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitRestaurantRequest } from "@/lib/actions/restaurant-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RestaurantRequestForm() {
  const [state, action, pending] = useActionState(submitRestaurantRequest, undefined);

  if (state?.success) {
    return (
      <div className="flex flex-col gap-3 text-sm">
        <p>제보가 접수되었어요. 검토 후 목록에 반영될 예정이에요.</p>
        <Link href="/requests" className="font-medium underline underline-offset-4">
          내 제보 목록 보기
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">식당 이름</Label>
        <Input id="name" name="name" required maxLength={100} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">식당 위치</Label>
        <Input id="address" name="address" required maxLength={200} placeholder="예: 후문 우치로 92-1" />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="menuName">대표메뉴 이름</Label>
          <Input id="menuName" name="menuName" required maxLength={50} placeholder="예: 돈까스" />
        </div>
        <div className="flex w-28 flex-col gap-1.5">
          <Label htmlFor="menuPrice">가격</Label>
          <Input id="menuPrice" name="menuPrice" type="number" min={0} required />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reason">제보 사유 (선택)</Label>
        <Textarea
          id="reason"
          name="reason"
          maxLength={500}
          placeholder="이 식당을 추가해주세요! 이유를 알려주시면 검토에 도움이 돼요."
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "제출 중..." : "제보 제출"}
      </Button>
    </form>
  );
}
