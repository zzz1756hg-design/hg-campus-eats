import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingRequests } from "@/lib/restaurant-requests";

export default async function AdminHomePage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const pending = await getPendingRequests();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-semibold tracking-tight">관리자</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/requests">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>식당 등록 요청</CardTitle>
              <CardDescription>대기 중 {pending.length}건</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>회원 관리</CardTitle>
              <CardDescription>회원 권한 변경</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
