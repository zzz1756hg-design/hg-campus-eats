"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하고 리뷰와 찜을 남겨보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
