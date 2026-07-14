import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminEditRequestApproveButton } from "@/components/admin-edit-request-approve-button";
import { AdminRejectForm } from "@/components/admin-reject-form";
import { Badge } from "@/components/ui/badge";
import { rejectEditRequest } from "@/lib/actions/admin-edit-requests";
import { EDIT_REQUEST_TYPE_LABELS } from "@/lib/edit-request-labels";
import { REQUEST_STATUS_BADGE_VARIANT, REQUEST_STATUS_LABELS } from "@/lib/request-labels";
import { getPendingEditRequests, getProcessedEditRequests } from "@/lib/restaurant-edit-requests";

export default async function AdminEditRequestsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const [pending, processed] = await Promise.all([
    getPendingEditRequests(),
    getProcessedEditRequests(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">식당 수정요청 관리</h1>
        <p className="text-sm text-muted-foreground">대기 중 {pending.length}건</p>
      </div>

      <div className="flex flex-col gap-4">
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">대기 중인 수정요청이 없어요.</p>
        ) : (
          pending.map((request) => (
            <div key={request.id} className="flex flex-col gap-2 rounded-lg border p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/restaurants/${request.restaurant.id}`}
                    className="font-medium hover:underline"
                  >
                    {request.restaurant.name}
                  </Link>
                  <p className="text-muted-foreground">
                    {request.user.name} ({request.user.email})
                  </p>
                </div>
                <Badge variant="outline">{EDIT_REQUEST_TYPE_LABELS[request.type]}</Badge>
              </div>

              {request.type === "INFO_CORRECTION" && request.description && (
                <p className="text-muted-foreground">{request.description}</p>
              )}
              {request.type === "MENU_ADD" && (
                <p className="text-muted-foreground">
                  추가 요청: {request.menuName} ({request.menuPrice?.toLocaleString()}원)
                </p>
              )}
              {request.type === "MENU_PRICE_FIX" && (
                <p className="text-muted-foreground">
                  {request.menu ? `${request.menu.name} (현재 ${request.menu.price.toLocaleString()}원)` : request.menuName}
                  {" → "}
                  제안가 {request.menuPrice?.toLocaleString()}원
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <AdminEditRequestApproveButton editRequestId={request.id} />
                <AdminRejectForm action={rejectEditRequest.bind(null, request.id)} />
              </div>
            </div>
          ))
        )}
      </div>

      {processed.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight">처리 내역</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {processed.map((request) => (
              <li key={request.id} className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    {request.restaurant.name} ({request.user.name}) ·{" "}
                    {EDIT_REQUEST_TYPE_LABELS[request.type]}
                  </span>
                  <Badge variant={REQUEST_STATUS_BADGE_VARIANT[request.status]}>
                    {REQUEST_STATUS_LABELS[request.status]}
                  </Badge>
                </div>
                {request.status === "REJECTED" && request.rejectionReason && (
                  <p className="text-xs text-muted-foreground">거절 사유: {request.rejectionReason}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
