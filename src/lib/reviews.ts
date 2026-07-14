import { prisma } from "@/lib/prisma";

export function getAllReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { name: true, email: true } },
      restaurant: { select: { id: true, name: true } },
    },
  });
}
