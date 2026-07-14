import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// 전남대 각 상권(정문/후문/상대/예대/공대) 인근 실제 식당. 카카오 로컬 API
// 카테고리 검색(FD6, 상권 중심 좌표 반경 350m)으로 조회한 실제 장소이며,
// kakaoPlaceId는 해당 카카오 장소 id입니다. 메뉴/가격 정보는 카카오 API에서
// 제공하지 않아 비워두며, 필요 시 관리자가 직접 등록합니다.
const restaurants = [
  {
    kakaoPlaceId: "8102203",
    name: "K2",
    address: "광주 북구 신안동 226-7",
    latitude: 35.172290650905026,
    longitude: 126.90512799915454,
    phone: "062-529-5700",
    area: "JEONGMUN" as const,
    category: "JAPANESE" as const,
  },
  {
    kakaoPlaceId: "837679019",
    name: "밥밥디라라 전남대점",
    address: "광주 북구 자미로 68-6",
    latitude: 35.171891240623694,
    longitude: 126.90498905112506,
    phone: "062-513-6669",
    area: "JEONGMUN" as const,
    category: "KOREAN" as const,
  },
  {
    kakaoPlaceId: "26051313",
    name: "BBQ 전남대정문점",
    address: "광주 북구 자미로66번길 8",
    latitude: 35.1715325730054,
    longitude: 126.905081677466,
    phone: "062-525-0731",
    area: "JEONGMUN" as const,
    category: "FASTFOOD" as const,
  },
  {
    kakaoPlaceId: "295407511",
    name: "소중대",
    address: "광주 북구 자미로66번길 15",
    latitude: 35.17163922153804,
    longitude: 126.90545039041183,
    phone: "062-522-3368",
    area: "JEONGMUN" as const,
    category: "CHINESE" as const,
  },
  {
    kakaoPlaceId: "1862857716",
    name: "후토후토 전남대점",
    address: "광주 북구 우치로 92-1",
    latitude: 35.1757169624831,
    longitude: 126.91265481481534,
    phone: "062-710-4009",
    area: "HUMUN" as const,
    category: "JAPANESE" as const,
  },
  {
    kakaoPlaceId: "1637007878",
    name: "롤링파스타 광주전남대점",
    address: "광주 북구 우치로 94",
    latitude: 35.1757890781495,
    longitude: 126.912664617742,
    phone: "062-262-8879",
    area: "HUMUN" as const,
    category: "WESTERN" as const,
  },
  {
    kakaoPlaceId: "27093675",
    name: "맘스터치 전남대점",
    address: "광주 북구 우치로 92-1",
    latitude: 35.1756917680735,
    longitude: 126.91271521984932,
    phone: "062-251-0900",
    area: "HUMUN" as const,
    category: "FASTFOOD" as const,
  },
  {
    kakaoPlaceId: "766476342",
    name: "육회바른연어 전남대점",
    address: "광주 북구 우치로 98",
    latitude: 35.1760964223682,
    longitude: 126.912639039895,
    phone: "062-261-7778",
    area: "HUMUN" as const,
    category: "KOREAN" as const,
  },
  {
    kakaoPlaceId: "1711969750",
    name: "다원",
    address: "광주 북구 설죽로202번길 98",
    latitude: 35.1774868464594,
    longitude: 126.902694710096,
    phone: "062-266-1648",
    area: "SANGDAE" as const,
    category: "KOREAN" as const,
  },
  {
    kakaoPlaceId: "16980164",
    name: "마니마니 전대상대점",
    address: "광주 북구 설죽로202번길 100",
    latitude: 35.1775635735738,
    longitude: 126.90283404033742,
    phone: "062-434-6765",
    area: "SANGDAE" as const,
    category: "JAPANESE" as const,
  },
  {
    kakaoPlaceId: "596883620",
    name: "마라푸우 상대점",
    address: "광주 북구 설죽로202번길 90",
    latitude: 35.1773063686761,
    longitude: 126.902438038795,
    phone: null,
    area: "SANGDAE" as const,
    category: "CHINESE" as const,
  },
  {
    kakaoPlaceId: "335995762",
    name: "꼬케키",
    address: "광주 북구 설죽로214번길 115",
    latitude: 35.1778808260071,
    longitude: 126.903932573353,
    phone: "0502-5550-8270",
    area: "SANGDAE" as const,
    category: "CAFE" as const,
  },
  {
    kakaoPlaceId: "783616283",
    name: "테트리스찜닭 전남대점",
    address: "광주 북구 용주로30번길 64",
    latitude: 35.180689683610034,
    longitude: 126.90422459025378,
    phone: "062-529-7778",
    area: "YEDAE" as const,
    category: "KOREAN" as const,
  },
  {
    kakaoPlaceId: "8947341",
    name: "동흥루",
    address: "광주 북구 반룡로 56",
    latitude: 35.1783603924862,
    longitude: 126.903989095728,
    phone: "062-521-2754",
    area: "YEDAE" as const,
    category: "CHINESE" as const,
  },
  {
    kakaoPlaceId: "1460312580",
    name: "어바웃피자 광주북구전남대점",
    address: "광주 북구 용주로30번길 67",
    latitude: 35.1808950518072,
    longitude: 126.904046497117,
    phone: "070-4367-1492",
    area: "YEDAE" as const,
    category: "WESTERN" as const,
  },
  {
    kakaoPlaceId: "1340532214",
    name: "지코바 용봉1호점",
    address: "광주 북구 용주로30번길 56",
    latitude: 35.1805882432495,
    longitude: 126.903608815887,
    phone: "062-515-7766",
    area: "YEDAE" as const,
    category: "FASTFOOD" as const,
  },
  {
    kakaoPlaceId: "1946224759",
    name: "햇들마루",
    address: "광주 북구 용봉로 77",
    latitude: 35.1808786534257,
    longitude: 126.910898217413,
    phone: "062-530-0015",
    area: "GONGDAE" as const,
    category: "KOREAN" as const,
  },
  {
    kakaoPlaceId: "24664590",
    name: "맥도날드 전남대DT점",
    address: "광주 북구 우치로 134",
    latitude: 35.179484316971,
    longitude: 126.912217140276,
    phone: "062-462-3200",
    area: "GONGDAE" as const,
    category: "FASTFOOD" as const,
  },
  {
    kakaoPlaceId: "922931258",
    name: "신선한빵집",
    address: "광주 북구 우치로 178",
    latitude: 35.1824351239219,
    longitude: 126.909451716506,
    phone: "062-251-8670",
    area: "GONGDAE" as const,
    category: "CAFE" as const,
  },
  {
    kakaoPlaceId: "1060825123",
    name: "승미",
    address: "광주 북구 우치로 177-1",
    latitude: 35.1821428183964,
    longitude: 126.909096330792,
    phone: null,
    area: "GONGDAE" as const,
    category: "KOREAN" as const,
  },
];

async function main() {
  // 이전 개발용 가상 식당(카카오 장소 id 없음) 정리.
  await prisma.restaurant.deleteMany({ where: { kakaoPlaceId: null } });

  for (const restaurant of restaurants) {
    await prisma.restaurant.upsert({
      where: { kakaoPlaceId: restaurant.kakaoPlaceId },
      create: restaurant,
      update: restaurant,
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
