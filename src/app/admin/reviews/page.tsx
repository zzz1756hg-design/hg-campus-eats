import Link from "next/link";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";

import { auth } from "@/auth";
import { AdminReviewDeleteButton } from "@/components/admin-review-delete-button";
import { getAllReviews } from "@/lib/reviews";

export default async function AdminReviewsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const reviews = await getAllReviews();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">리뷰 관리</h1>
        <p className="text-sm text-muted-foreground">전체 {reviews.length}개</p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">등록된 리뷰가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/restaurants/${review.restaurant.id}`}
                    className="font-medium hover:underline"
                  >
                    {review.restaurant.name}
                  </Link>
                  <p className="text-muted-foreground">
                    {review.user.name} ({review.user.email})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3.5" />
                    {review.rating}
                  </span>
                  <AdminReviewDeleteButton reviewId={review.id} />
                </div>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
