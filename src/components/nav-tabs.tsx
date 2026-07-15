"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "홈 / 지도", href: "/", match: (path: string) => path === "/" },
  { label: "검색 필터", href: "/", match: () => false },
  { label: "식당 제보", href: "/requests/new", match: (path: string) => path.startsWith("/requests") },
  { label: "마이페이지", href: "/mypage", match: (path: string) => path.startsWith("/mypage") },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm">
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "border-b-2 border-transparent pb-3 pt-1 transition-colors",
              active
                ? "border-point font-bold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
