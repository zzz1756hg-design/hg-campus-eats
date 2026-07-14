import { prisma } from "@/lib/prisma";
import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { haversineDistanceMeters } from "@/lib/geo";
import { CNU_CENTER } from "@/lib/kakao-map-sdk";
import { AREA_CENTERS } from "@/lib/restaurant-labels";

export type RestaurantSort = "name" | "rating" | "distance";

export type RestaurantListFilters = {
  area?: CommercialArea;
  category?: FoodCategory;
  q?: string;
  sort?: RestaurantSort;
};

export async function getRestaurants({ area, category, q, sort = "name" }: RestaurantListFilters) {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      ...(area ? { area } : {}),
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { menus: { some: { name: { contains: q, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: {
      menus: { orderBy: { price: "asc" }, take: 3 },
      reviews: { select: { rating: true } },
      _count: { select: { favorites: true, reviews: true } },
    },
    orderBy: { name: "asc" },
  });

  const withAverageRating = restaurants.map((restaurant) => ({
    ...restaurant,
    averageRating:
      restaurant.reviews.length > 0
        ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / restaurant.reviews.length
        : null,
  }));

  if (sort === "rating") {
    withAverageRating.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0) || a.name.localeCompare(b.name));
  } else if (sort === "distance") {
    const origin = area ? AREA_CENTERS[area] : CNU_CENTER;
    withAverageRating.sort(
      (a, b) => haversineDistanceMeters(origin, a) - haversineDistanceMeters(origin, b)
    );
  }

  return withAverageRating;
}

export type RestaurantListItem = Awaited<ReturnType<typeof getRestaurants>>[number];

export function getRestaurantById(id: string) {
  return prisma.restaurant.findUnique({
    where: { id },
    include: {
      menus: { orderBy: { price: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
      _count: { select: { favorites: true } },
    },
  });
}

export type RestaurantDetail = NonNullable<Awaited<ReturnType<typeof getRestaurantById>>>;

export function isFavoritedByUser(restaurantId: string, userId: string) {
  return prisma.favorite
    .findUnique({ where: { userId_restaurantId: { userId, restaurantId } } })
    .then((favorite) => favorite !== null);
}
