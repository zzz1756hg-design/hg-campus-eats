import Link from "next/link";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";

import { auth } from "@/auth";
import { FavoriteButton } from "@/components/favorite-button";
import { ReviewDeleteButton } from "@/components/review-delete-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EDIT_REQUEST_TYPE_LABELS } from "@/lib/edit-request-labels";
import { AREA_LABELS, CATEGORY_LABELS } from "@/lib/restaurant-labels";
import { getMyFavorites, getMyReviews } from "@/lib/mypage";
import { getMyEditRequests } from "@/lib/restaurant-edit-requests";
import { getMyRequests } from "@/lib/restaurant-requests";
import { REQUEST_STATUS_BADGE_VARIANT, REQUEST_STATUS_LABELS } from "@/lib/request-labels";
import { cn } from "@/lib/utils";

export default async function MyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [favorites, reviews, requests, editRequests] = await Promise.all([
    getMyFavorites(session.user.id),
    getMyReviews(session.user.id),
    getMyRequests(session.user.id),
    getMyEditRequests(session.user.id),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">마이페이지</h1>
          <p className="text-sm text-muted-foreground">
            {session.user.name} ({session.user.email})
          </p>
        </div>
        <Link href="/inquiries" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          내 문의
        </Link>
      </div>

      <Tabs defaultValue="reviews">
        <TabsList className="w-full">
          <TabsTrigger value="reviews">내 리뷰 ({reviews.length})</TabsTrigger>
          <TabsTrigger value="requests">내 제보 ({requests.length + editRequests.length})</TabsTrigger>
          <TabsTrigger value="favorites">찜한 식당 ({favorites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="flex flex-col gap-3 pt-4">
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
                        <Star className="size-3.5 fill-point text-point" />
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
        </TabsContent>

        <TabsContent value="requests" className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">신규 제보</h2>
              <Link href="/requests" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                전체보기
              </Link>
            </div>
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">아직 제보한 식당이 없어요.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {requests.slice(0, 5).map((request) => (
                  <li key={request.id} className="flex items-center justify-between gap-2 rounded-lg border p-3 text-sm">
                    <span className="font-medium">{request.name}</span>
                    <Badge variant={REQUEST_STATUS_BADGE_VARIANT[request.status]}>
                      {REQUEST_STATUS_LABELS[request.status]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">수정요청</h2>
              <Link href="/edit-requests" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                전체보기
              </Link>
            </div>
            {editRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">아직 제출한 수정요청이 없어요.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {editRequests.slice(0, 5).map((request) => (
                  <li key={request.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{request.restaurant.name}</span>
                      <Badge variant={REQUEST_STATUS_BADGE_VARIANT[request.status]}>
                        {REQUEST_STATUS_LABELS[request.status]}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{EDIT_REQUEST_TYPE_LABELS[request.type]}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="pt-4">
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
        </TabsContent>
      </Tabs>
    </main>
  );
}
