import { adminDeleteReview } from "@/lib/actions/admin-reviews";
import { Button } from "@/components/ui/button";

export function AdminReviewDeleteButton({ reviewId }: { reviewId: string }) {
  return (
    <form action={adminDeleteReview.bind(null, reviewId)}>
      <Button type="submit" variant="destructive" size="sm">
        삭제
      </Button>
    </form>
  );
}
