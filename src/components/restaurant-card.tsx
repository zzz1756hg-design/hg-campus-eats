import { Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AREA_LABELS, CATEGORY_LABELS } from "@/lib/restaurant-labels";
import type { RestaurantListItem } from "@/lib/restaurants";

export function RestaurantCard({ restaurant }: { restaurant: RestaurantListItem }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link href={`/restaurants/${restaurant.id}`} className="hover:underline">
            {restaurant.name}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {restaurant.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{AREA_LABELS[restaurant.area]}</Badge>
          <Badge variant="outline">{CATEGORY_LABELS[restaurant.category]}</Badge>
        </div>

        {restaurant.menus.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {restaurant.menus.map((menu) => (
              <li key={menu.id} className="flex items-center justify-between gap-2">
                <span>{menu.name}</span>
                <span>{menu.price.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5" />
            {restaurant.averageRating !== null
              ? `${restaurant.averageRating.toFixed(1)} (${restaurant._count.reviews})`
              : "리뷰 없음"}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" />
            찜 {restaurant._count.favorites}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
