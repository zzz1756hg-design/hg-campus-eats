import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { searchKakaoPlaces } from "@/lib/kakao";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "관리자만 접근할 수 있어요." }, { status: 403 });
  }

  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json({ places: [] });
  }

  try {
    const places = await searchKakaoPlaces(query);
    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ error: "카카오 장소 검색에 실패했어요." }, { status: 502 });
  }
}
