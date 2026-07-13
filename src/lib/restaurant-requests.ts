import { prisma } from "@/lib/prisma";

export function getMyRequests(userId: string) {
  return prisma.restaurantRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getPendingRequests() {
  return prisma.restaurantRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });
}

export function getProcessedRequests() {
  return prisma.restaurantRequest.findMany({
    where: { status: { not: "PENDING" } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: { select: { name: true, email: true } } },
  });
}
