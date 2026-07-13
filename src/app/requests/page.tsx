import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { REQUEST_STATUS_BADGE_VARIANT, REQUEST_STATUS_LABELS } from "@/lib/request-labels";
import { getMyRequests } from "@/lib/restaurant-requests";
import { cn } from "@/lib/utils";

export default async function MyRestaurantRequestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const requests = await getMyRequests(session.user.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">내 식당 등록 요청</h1>
        <Link href="/requests/new" className={cn(buttonVariants({ size: "sm" }))}>
          새 요청
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 요청한 식당이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((request) => (
            <li key={request.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{request.name}</span>
                <Badge variant={REQUEST_STATUS_BADGE_VARIANT[request.status]}>
                  {REQUEST_STATUS_LABELS[request.status]}
                </Badge>
              </div>
              {request.address && <p className="text-muted-foreground">{request.address}</p>}
              {request.reason && <p className="text-muted-foreground">{request.reason}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
