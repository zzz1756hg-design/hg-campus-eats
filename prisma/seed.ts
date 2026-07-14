import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { REAL_RESTAURANTS } from "./real-restaurants-data";

// 전남대 각 상권(정문/후문/상대/예대/공대) 인근 실제 식당 약 50곳씩. 카카오
// 로컬 API 카테고리 검색(FD6)으로 조회한 실제 장소이며, kakaoPlaceId는 해당
// 카카오 장소 id입니다.
//
// 메뉴는 대부분 카카오맵에 등록된 실제 메뉴/가격을 가져온 것이고, 카카오에
// 가격 정보가 없는 일부 식당(주로 프랜차이즈)만 카테고리별 예시 메뉴를 임시로
// 담고 있습니다. 이미 메뉴가 있는 식당(관리자가 직접 수정했거나 이전 시드
// 실행에서 채워진 경우)은 건드리지 않아 이 스크립트를 다시 실행해도 안전합니다.
async function main() {
  // 이전 개발용 가상 식당(카카오 장소 id 없음) 정리.
  await prisma.restaurant.deleteMany({ where: { kakaoPlaceId: null } });

  let menuSeeded = 0;
  for (const { menus, ...restaurant } of REAL_RESTAURANTS) {
    const saved = await prisma.restaurant.upsert({
      where: { kakaoPlaceId: restaurant.kakaoPlaceId },
      create: restaurant,
      update: restaurant,
    });

    const existingMenuCount = await prisma.menu.count({ where: { restaurantId: saved.id } });
    if (existingMenuCount === 0 && menus.length > 0) {
      await prisma.menu.createMany({
        data: menus.map((menu) => ({ ...menu, restaurantId: saved.id })),
      });
      menuSeeded += 1;
    }
  }

  console.log(`Seeded ${REAL_RESTAURANTS.length} restaurants, added menus to ${menuSeeded}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
