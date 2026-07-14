import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { REAL_RESTAURANTS } from "./real-restaurants-data";
import type { FoodCategory } from "../src/generated/prisma/enums";

// 전남대 각 상권(정문/후문/상대/예대/공대) 인근 실제 식당 약 50곳씩. 카카오
// 로컬 API 카테고리 검색(FD6)으로 조회한 실제 장소이며, kakaoPlaceId는 해당
// 카카오 장소 id입니다.
//
// 카카오 API는 메뉴/가격을 제공하지 않으므로, 메뉴가 하나도 없는 식당에는
// 카테고리별 예시 메뉴를 임시로 채워둡니다(실제 메뉴가 아닌 자리표시자).
// 관리자가 /restaurants/[id]에서 언제든 직접 수정·삭제할 수 있고, 이미 메뉴가
// 있는 식당(관리자가 수정했거나 이전 시드 실행에서 채워진)은 건드리지 않아
// 이 스크립트를 다시 실행해도 안전합니다.
const MENU_TEMPLATES: Record<FoodCategory, { name: string; price: number }[]> = {
  KOREAN: [
    { name: "김치찌개", price: 8000 },
    { name: "된장찌개", price: 8000 },
    { name: "제육볶음", price: 9000 },
  ],
  CHINESE: [
    { name: "짜장면", price: 7000 },
    { name: "짬뽕", price: 8000 },
    { name: "탕수육(소)", price: 15000 },
  ],
  JAPANESE: [
    { name: "돈까스", price: 9000 },
    { name: "초밥세트", price: 13000 },
    { name: "우동", price: 8000 },
  ],
  WESTERN: [
    { name: "토마토파스타", price: 11000 },
    { name: "피자", price: 15000 },
    { name: "리조또", price: 12000 },
  ],
  FASTFOOD: [
    { name: "치즈버거세트", price: 7500 },
    { name: "후라이드치킨(반마리)", price: 10000 },
    { name: "감자튀김", price: 4000 },
  ],
  CAFE: [
    { name: "아메리카노", price: 3000 },
    { name: "카페라떼", price: 3500 },
    { name: "크로플", price: 5500 },
  ],
  ETC: [
    { name: "모듬안주", price: 20000 },
    { name: "하이볼", price: 8000 },
    { name: "감자튀김", price: 5000 },
  ],
};

async function main() {
  // 이전 개발용 가상 식당(카카오 장소 id 없음) 정리.
  await prisma.restaurant.deleteMany({ where: { kakaoPlaceId: null } });

  let menuSeeded = 0;
  for (const restaurant of REAL_RESTAURANTS) {
    const saved = await prisma.restaurant.upsert({
      where: { kakaoPlaceId: restaurant.kakaoPlaceId },
      create: restaurant,
      update: restaurant,
    });

    const existingMenuCount = await prisma.menu.count({ where: { restaurantId: saved.id } });
    if (existingMenuCount === 0) {
      await prisma.menu.createMany({
        data: MENU_TEMPLATES[restaurant.category].map((menu) => ({
          ...menu,
          restaurantId: saved.id,
        })),
      });
      menuSeeded += 1;
    }
  }

  console.log(`Seeded ${REAL_RESTAURANTS.length} restaurants, added example menus to ${menuSeeded}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
