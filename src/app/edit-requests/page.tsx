import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { EDIT_REQUEST_TYPE_LABELS } from "@/lib/edit-request-labels";
import { REQUEST_STATUS_BADGE_VARIANT, REQUEST_STATUS_LABELS } from "@/lib/request-labels";
import { getMyEditRequests } from "@/lib/restaurant-edit-requests";

export default async function MyEditRequestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const editRequests = await getMyEditRequests(session.user.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-xl font-semibold tracking-tight">내 수정요청</h1>

      {editRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 제출한 수정요청이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {editRequests.map((request) => (
            <li key={request.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/restaurants/${request.restaurant.id}`}
                  className="font-medium hover:underline"
                >
                  {request.restaurant.name}
                </Link>
                <Badge variant={REQUEST_STATUS_BADGE_VARIANT[request.status]}>
                  {REQUEST_STATUS_LABELS[request.status]}
                </Badge>
              </div>
              <p className="text-muted-foreground">{EDIT_REQUEST_TYPE_LABELS[request.type]}</p>
              {request.description && <p className="text-muted-foreground">{request.description}</p>}
              {request.menuName && (
                <p className="text-muted-foreground">
                  {request.menuName}
                  {request.menuPrice !== null && ` (${request.menuPrice.toLocaleString()}원)`}
                </p>
              )}
              {request.status === "REJECTED" && request.rejectionReason && (
                <p className="text-destructive">거절 사유: {request.rejectionReason}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
