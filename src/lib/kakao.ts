export type KakaoPlace = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
};

export async function searchKakaoPlaces(query: string): Promise<KakaoPlace[]> {
  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("size", "10");

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`카카오 장소 검색에 실패했어요. (${res.status})`);
  }

  const data = (await res.json()) as { documents: KakaoPlace[] };
  return data.documents ?? [];
}
