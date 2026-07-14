import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllInquiries } from "@/lib/inquiries";
import { getPendingEditRequests } from "@/lib/restaurant-edit-requests";
import { getPendingRequests } from "@/lib/restaurant-requests";

export default async function AdminHomePage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const [pending, pendingEdits, inquiries] = await Promise.all([
    getPendingRequests(),
    getPendingEditRequests(),
    getAllInquiries(),
  ]);
  const pendingInquiries = inquiries.filter((inquiry) => !inquiry.answer).length;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-semibold tracking-tight">관리자</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/requests">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>식당 제보</CardTitle>
              <CardDescription>대기 중 {pending.length}건</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/edit-requests">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>식당 수정요청</CardTitle>
              <CardDescription>대기 중 {pendingEdits.length}건</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/reviews">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>리뷰 관리</CardTitle>
              <CardDescription>전체 리뷰 확인·삭제</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/admin/inquiries">
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>문의 관리</CardTitle>
              <CardDescription>답변 대기 {pendingInquiries}건</CardDescription>
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
