import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// 개발용 예시 데이터. 좌표는 전남대 정문 인근 대략치이며 실제 서비스 데이터는
// 관리자 등록(카카오 장소 검색 연동) 또는 CSV 임포트로 채워질 예정.
const restaurants = [
  {
    name: "정문김밥천국",
    address: "광주 북구 용봉동 1",
    latitude: 35.1769,
    longitude: 126.9087,
    phone: "062-000-0001",
    area: "JEONGMUN" as const,
    category: "KOREAN" as const,
    menus: [
      { name: "참치김밥", price: 3500 },
      { name: "라면", price: 4000 },
      { name: "돈까스", price: 8000 },
    ],
  },
  {
    name: "후문마라탕",
    address: "광주 북구 용봉동 2",
    latitude: 35.1808,
    longitude: 126.9111,
    phone: "062-000-0002",
    area: "HUMUN" as const,
    category: "CHINESE" as const,
    menus: [
      { name: "마라탕(소)", price: 9000 },
      { name: "마라샹궈", price: 12000 },
    ],
  },
  {
    name: "공대스시로",
    address: "광주 북구 용봉동 3",
    latitude: 35.1785,
    longitude: 126.9145,
    phone: "062-000-0003",
    area: "GONGDAE" as const,
    category: "JAPANESE" as const,
    menus: [
      { name: "연어초밥세트", price: 13000 },
      { name: "가락우동", price: 7000 },
    ],
  },
  {
    name: "예대파스타",
    address: "광주 북구 용봉동 4",
    latitude: 35.1751,
    longitude: 126.9098,
    phone: "062-000-0004",
    area: "YEDAE" as const,
    category: "WESTERN" as const,
    menus: [
      { name: "토마토파스타", price: 11000 },
      { name: "리조또", price: 12000 },
    ],
  },
  {
    name: "상대버거",
    address: "광주 북구 용봉동 5",
    latitude: 35.1739,
    longitude: 126.9072,
    phone: "062-000-0005",
    area: "SANGDAE" as const,
    category: "FASTFOOD" as const,
    menus: [
      { name: "치즈버거세트", price: 7500 },
      { name: "치킨텐더", price: 6000 },
    ],
  },
  {
    name: "용봉동카페",
    address: "광주 북구 용봉동 6",
    latitude: 35.1778,
    longitude: 126.9102,
    phone: "062-000-0006",
    area: "JEONGMUN" as const,
    category: "CAFE" as const,
    menus: [
      { name: "아메리카노", price: 3000 },
      { name: "카페라떼", price: 3500 },
    ],
  },
];

async function main() {
  for (const { menus, ...restaurant } of restaurants) {
    const existing = await prisma.restaurant.findFirst({
      where: { name: restaurant.name, address: restaurant.address },
    });
    if (existing) continue;
    await prisma.restaurant.create({
      data: {
        ...restaurant,
        menus: { create: menus },
      },
    });
  }
  console.log(`Seeded ${restaurants.length} restaurants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
