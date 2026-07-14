import { prisma } from "@/lib/prisma";

export function getMyEditRequests(userId: string) {
  return prisma.restaurantEditRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { restaurant: { select: { id: true, name: true } } },
  });
}

export function getPendingEditRequests() {
  return prisma.restaurantEditRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, email: true } },
      restaurant: { select: { id: true, name: true } },
      menu: { select: { id: true, name: true, price: true } },
    },
  });
}

export function getProcessedEditRequests() {
  return prisma.restaurantEditRequest.findMany({
    where: { status: { not: "PENDING" } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { name: true, email: true } },
      restaurant: { select: { id: true, name: true } },
    },
  });
}
