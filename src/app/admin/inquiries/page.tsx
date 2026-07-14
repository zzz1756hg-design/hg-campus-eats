import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminInquiryAnswerForm } from "@/components/admin-inquiry-answer-form";
import { Badge } from "@/components/ui/badge";
import { getAllInquiries } from "@/lib/inquiries";

export default async function AdminInquiriesPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const inquiries = await getAllInquiries();
  const pendingCount = inquiries.filter((inquiry) => !inquiry.answer).length;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">문의 관리</h1>
        <p className="text-sm text-muted-foreground">답변 대기 {pendingCount}건</p>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">등록된 문의가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="flex flex-col gap-2 rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{inquiry.title}</p>
                  <p className="text-muted-foreground">
                    {inquiry.user.name} ({inquiry.user.email})
                  </p>
                </div>
                <Badge variant={inquiry.answer ? "default" : "secondary"}>
                  {inquiry.answer ? "답변 완료" : "답변 대기"}
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{inquiry.content}</p>
              <AdminInquiryAnswerForm inquiryId={inquiry.id} existingAnswer={inquiry.answer ?? undefined} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
