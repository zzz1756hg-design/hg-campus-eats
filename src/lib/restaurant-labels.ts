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

// Representative building per commercial area (전남대학교 광주캠퍼스), used to center/zoom the map.
export const AREA_CENTERS: Record<CommercialArea, { latitude: number; longitude: number }> = {
  JEONGMUN: { latitude: 35.172909835492526, longitude: 126.90506690385546 }, // 정문
  HUMUN: { latitude: 35.1757542269919, longitude: 126.91183692571 }, // 후문
  SANGDAE: { latitude: 35.1765284887127, longitude: 126.903552131839 }, // 경영대학2호관
  YEDAE: { latitude: 35.1795478226098, longitude: 126.905572973414 }, // 예술대학1호관
  GONGDAE: { latitude: 35.1797447866262, longitude: 126.908532516393 }, // 공과대학6호관
};
