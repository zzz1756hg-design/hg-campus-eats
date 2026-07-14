import Link from "next/link";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";

import { auth } from "@/auth";
import { FavoriteButton } from "@/components/favorite-button";
import { ReviewDeleteButton } from "@/components/review-delete-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AREA_LABELS, CATEGORY_LABELS } from "@/lib/restaurant-labels";
import { getMyFavorites, getMyReviews } from "@/lib/mypage";
import { cn } from "@/lib/utils";

export default async function MyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [favorites, reviews] = await Promise.all([
    getMyFavorites(session.user.id),
    getMyReviews(session.user.id),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
        <p className="text-sm text-muted-foreground">
          {session.user.name} ({session.user.email})
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">내 식당 제보</h2>
          <Link href="/requests" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            제보 내역 보기
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">내 수정요청</h2>
          <Link href="/edit-requests" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            수정요청 내역 보기
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">내 문의</h2>
          <Link href="/inquiries" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            문의 내역 보기
          </Link>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">찜한 식당 {favorites.length}곳</h2>
        {favorites.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 찜한 식당이 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {favorites.map(({ restaurant }) => (
              <li
                key={restaurant.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
              >
                <div className="flex flex-col gap-1">
                  <Link href={`/restaurants/${restaurant.id}`} className="font-medium hover:underline">
                    {restaurant.name}
                  </Link>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{AREA_LABELS[restaurant.area]}</Badge>
                    <Badge variant="outline">{CATEGORY_LABELS[restaurant.category]}</Badge>
                  </div>
                </div>
                <FavoriteButton restaurantId={restaurant.id} favorited />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">내가 쓴 리뷰 {reviews.length}개</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 작성한 리뷰가 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/restaurants/${review.restaurant.id}`} className="font-medium hover:underline">
                    {review.restaurant.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="size-3.5" />
                      {review.rating}
                    </span>
                    <ReviewDeleteButton reviewId={review.id} />
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{review.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
