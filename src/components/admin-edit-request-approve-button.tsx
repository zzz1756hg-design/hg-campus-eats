import { approveEditRequest } from "@/lib/actions/admin-edit-requests";
import { Button } from "@/components/ui/button";

export function AdminEditRequestApproveButton({ editRequestId }: { editRequestId: string }) {
  return (
    <form action={approveEditRequest.bind(null, editRequestId)}>
      <Button type="submit" size="sm">
        승인
      </Button>
    </form>
  );
}
