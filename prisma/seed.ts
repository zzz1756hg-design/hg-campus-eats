import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { REAL_RESTAURANTS } from "./real-restaurants-data";

// 전남대 각 상권(정문/후문/상대/예대/공대) 인근 실제 식당 약 50곳씩. 카카오
// 로컬 API 카테고리 검색(FD6)으로 조회한 실제 장소이며, kakaoPlaceId는 해당
// 카카오 장소 id입니다. 메뉴/가격 정보는 카카오 API에서 제공하지 않아
// 비워두며, 필요 시 관리자가 직접 등록합니다.
async function main() {
  // 이전 개발용 가상 식당(카카오 장소 id 없음) 정리.
  await prisma.restaurant.deleteMany({ where: { kakaoPlaceId: null } });

  for (const restaurant of REAL_RESTAURANTS) {
    await prisma.restaurant.upsert({
      where: { kakaoPlaceId: restaurant.kakaoPlaceId },
      create: restaurant,
      update: restaurant,
    });
  }
  console.log(`Seeded ${REAL_RESTAURANTS.length} restaurants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
