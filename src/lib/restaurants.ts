import { prisma } from "@/lib/prisma";
import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";

export type RestaurantListFilters = {
  area?: CommercialArea;
  category?: FoodCategory;
  q?: string;
};

export function getRestaurants({ area, category, q }: RestaurantListFilters) {
  return prisma.restaurant.findMany({
    where: {
      ...(area ? { area } : {}),
      ...(category ? { category } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: {
      menus: { orderBy: { price: "asc" }, take: 3 },
      _count: { select: { favorites: true, reviews: true } },
    },
    orderBy: { name: "asc" },
  });
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
