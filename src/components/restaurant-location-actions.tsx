"use client";

import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RestaurantLocationActions({
  name,
  address,
  latitude,
  longitude,
}: {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const kakaoRouteUrl = `https://map.kakao.com/link/to/${encodeURIComponent(name)},${latitude},${longitude}`;

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {copied ? "복사됨" : "주소 복사"}
      </Button>
      <a href={kakaoRouteUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "sm" }))}>
        카카오맵 길찾기
      </a>
    </div>
  );
}
