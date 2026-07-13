import { CommercialArea, FoodCategory } from "@/generated/prisma/enums";

export const AREA_LABELS: Record<CommercialArea, string> = {
  SANGDAE: "상대",
  YEDAE: "예대",
  GONGDAE: "공대",
  HUMUN: "후문",
  JEONGMUN: "정문",
};

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  KOREAN: "한식",
  CHINESE: "중식",
  JAPANESE: "일식",
  WESTERN: "양식",
  FASTFOOD: "패스트푸드",
  CAFE: "카페",
  ETC: "기타",
};

export const AREAS = Object.keys(AREA_LABELS) as CommercialArea[];
export const CATEGORIES = Object.keys(CATEGORY_LABELS) as FoodCategory[];
