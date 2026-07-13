import { rejectRequest } from "@/lib/actions/admin-requests";
import { Button } from "@/components/ui/button";

export function AdminRequestRejectButton({ requestId }: { requestId: string }) {
  return (
    <form action={rejectRequest.bind(null, requestId)}>
      <Button type="submit" variant="destructive" size="sm">
        거부
      </Button>
    </form>
  );
}
