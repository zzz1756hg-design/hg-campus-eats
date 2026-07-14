import { EditRequestType } from "@/generated/prisma/enums";

export const EDIT_REQUEST_TYPE_LABELS: Record<EditRequestType, string> = {
  INFO_CORRECTION: "정보 수정",
  MENU_ADD: "메뉴 추가",
  MENU_PRICE_FIX: "메뉴 가격 수정",
};
