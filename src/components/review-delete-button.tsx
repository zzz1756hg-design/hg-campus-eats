import { deleteReview } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";

export function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  return (
    <form action={deleteReview.bind(null, reviewId)}>
      <Button type="submit" variant="ghost" size="sm">
        삭제
      </Button>
    </form>
  );
}
