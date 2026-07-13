import { prisma } from "@/lib/prisma";

export function getMyFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: {
        include: { _count: { select: { reviews: true, favorites: true } } },
      },
    },
  });
}

export function getMyReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { restaurant: { select: { id: true, name: true } } },
  });
}
