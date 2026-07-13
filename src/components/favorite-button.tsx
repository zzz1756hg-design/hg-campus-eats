import { Heart } from "lucide-react";

import { toggleFavorite } from "@/lib/actions/favorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  restaurantId,
  favorited,
}: {
  restaurantId: string;
  favorited: boolean;
}) {
  return (
    <form action={toggleFavorite.bind(null, restaurantId)}>
      <Button type="submit" variant={favorited ? "default" : "outline"} size="sm">
        <Heart className={cn("size-4", favorited && "fill-current")} />
        {favorited ? "찜 완료" : "찜하기"}
      </Button>
    </form>
  );
}
