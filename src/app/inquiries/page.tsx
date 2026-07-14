import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getMyInquiries } from "@/lib/inquiries";
import { cn } from "@/lib/utils";

export default async function MyInquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const inquiries = await getMyInquiries(session.user.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">내 문의</h1>
        <Link href="/inquiries/new" className={cn(buttonVariants({ size: "sm" }))}>
          새 문의
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 등록한 문의가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="flex flex-col gap-2 rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{inquiry.title}</span>
                <Badge variant={inquiry.answer ? "default" : "secondary"}>
                  {inquiry.answer ? "답변 완료" : "답변 대기"}
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{inquiry.content}</p>
              {inquiry.answer && (
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-xs font-medium">관리자 답변</p>
                  <p className="whitespace-pre-wrap text-muted-foreground">{inquiry.answer}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
