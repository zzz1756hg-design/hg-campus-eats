import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminRequestApproveForm } from "@/components/admin-request-approve-form";
import { AdminRequestRejectButton } from "@/components/admin-request-reject-button";
import { Badge } from "@/components/ui/badge";
import { REQUEST_STATUS_BADGE_VARIANT, REQUEST_STATUS_LABELS } from "@/lib/request-labels";
import { getPendingRequests, getProcessedRequests } from "@/lib/restaurant-requests";

export default async function AdminRequestsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const [pending, processed] = await Promise.all([getPendingRequests(), getProcessedRequests()]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">식당 등록 요청 관리</h1>
        <p className="text-sm text-muted-foreground">대기 중 {pending.length}건</p>
      </div>

      <div className="flex flex-col gap-4">
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">대기 중인 요청이 없어요.</p>
        ) : (
          pending.map((request) => (
            <div key={request.id} className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{request.name}</p>
                  <p className="text-muted-foreground">
                    {request.user.name} ({request.user.email})
                  </p>
                </div>
                <AdminRequestRejectButton requestId={request.id} />
              </div>
              {request.address && <p className="text-sm text-muted-foreground">주소: {request.address}</p>}
              {request.reason && <p className="text-sm text-muted-foreground">사유: {request.reason}</p>}
              <AdminRequestApproveForm
                requestId={request.id}
                defaultName={request.name}
                defaultAddress={request.address ?? ""}
              />
            </div>
          ))
        )}
      </div>

      {processed.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight">처리 내역</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {processed.map((request) => (
              <li key={request.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                <span>
                  {request.name} ({request.user.name})
                </span>
                <Badge variant={REQUEST_STATUS_BADGE_VARIANT[request.status]}>
                  {REQUEST_STATUS_LABELS[request.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
