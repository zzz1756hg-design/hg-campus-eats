import { RequestStatus } from "@/generated/prisma/enums";

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "검토 중",
  APPROVED: "승인됨",
  REJECTED: "거부됨",
};

export const REQUEST_STATUS_BADGE_VARIANT: Record<RequestStatus, "secondary" | "default" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};
