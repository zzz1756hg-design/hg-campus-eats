import Link from "next/link";

import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { NavTabs } from "@/components/nav-tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-bold tracking-tight text-point">
          학식 말고 뭐 먹지?
        </Link>

        <NavTabs />

        {session?.user ? (
          <div className="flex items-center gap-3 text-sm">
            {session.user.role === "ADMIN" && (
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                관리자
              </Link>
            )}
            <span className="text-muted-foreground">{session.user.name}님</span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              로그인
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
