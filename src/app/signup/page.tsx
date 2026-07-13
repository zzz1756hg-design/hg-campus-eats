"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/app/signup/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>전남대 맛집 정보를 함께 만들어가요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">이름</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
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
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">8자 이상, 영문자와 숫자를 포함해주세요.</p>
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "가입 중..." : "회원가입"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
