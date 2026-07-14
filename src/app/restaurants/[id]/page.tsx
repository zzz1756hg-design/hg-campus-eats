import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, MapPin, Phone, Star } from "lucide-react";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdminMenuManager } from "@/components/admin-menu-manager";
import { AdminPartnershipToggle } from "@/components/admin-partnership-toggle";
import { AdminRestaurantInfoForm } from "@/components/admin-restaurant-info-form";
import { FavoriteButton } from "@/components/favorite-button";
import { RestaurantEditRequestForm } from "@/components/restaurant-edit-request-form";
import { RestaurantMap } from "@/components/restaurant-map";
import { ReviewForm } from "@/components/review-form";
import { AREA_LABELS, CATEGORY_LABELS } from "@/lib/restaurant-labels";
import { getRestaurantById, isFavoritedByUser } from "@/lib/restaurants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function RestaurantDetailPage(props: PageProps<"/restaurants/[id]">) {
  const { id } = await props.params;
  const restaurant = await getRestaurantById(id);
  if (!restaurant) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const favorited = userId ? await isFavoritedByUser(restaurant.id, userId) : false;
  const myReview = userId ? restaurant.reviews.find((review) => review.userId === userId) : undefined;

  const reviewCount = restaurant.reviews.length;
  const averageRating =
    reviewCount > 0
      ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{AREA_LABELS[restaurant.area]}</Badge>
          <Badge variant="outline">{CATEGORY_LABELS[restaurant.category]}</Badge>
          {restaurant.isPartnered && <Badge>제휴</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{restaurant.name}</h1>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {restaurant.address}
          </span>
          {restaurant.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="size-4" />
              {restaurant.phone}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 pt-1 text-sm">
          <span className="flex items-center gap-1">
            <Star className="size-4" />
            {averageRating ? `${averageRating.toFixed(1)} (${reviewCount})` : "리뷰 없음"}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Heart className="size-4" />
            찜 {restaurant._count.favorites}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          {userId ? (
            <FavoriteButton restaurantId={restaurant.id} favorited={favorited} />
          ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              로그인하고 찜하기
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <AdminPartnershipToggle restaurantId={restaurant.id} isPartnered={restaurant.isPartnered} />
          )}
        </div>
        {session?.user?.role === "ADMIN" && (
          <AdminRestaurantInfoForm
            restaurantId={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            phone={restaurant.phone}
            area={restaurant.area}
            category={restaurant.category}
          />
        )}
      </div>

      <RestaurantMap name={restaurant.name} latitude={restaurant.latitude} longitude={restaurant.longitude} />

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">메뉴</h2>
        {restaurant.menus.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 메뉴가 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-sm">
            {restaurant.menus.map((menu) => (
              <li key={menu.id} className="flex items-center justify-between gap-2">
                <span>{menu.name}</span>
                <span className="text-muted-foreground">{menu.price.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        )}
        {session?.user?.role === "ADMIN" && (
          <AdminMenuManager restaurantId={restaurant.id} menus={restaurant.menus} />
        )}
      </div>

      <Separator />

      {userId ? (
        <RestaurantEditRequestForm restaurantId={restaurant.id} menus={restaurant.menus} />
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            로그인
          </Link>
          하고 식당 정보 수정을 요청해보세요.
        </p>
      )}

      <Separator />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">리뷰 {reviewCount}개</h2>

        {userId ? (
          <ReviewForm
            restaurantId={restaurant.id}
            existingReview={myReview ? { rating: myReview.rating, content: myReview.content } : undefined}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
              로그인
            </Link>
            하고 리뷰를 남겨보세요.
          </p>
        )}

        {reviewCount > 0 && (
          <ul className="flex flex-col gap-4">
            {restaurant.reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.user.name}</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3.5" />
                    {review.rating}
                  </span>
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
