"use client";

import { useActionState, useState, useTransition } from "react";

import { approveRequest } from "@/lib/actions/admin-requests";
import type { KakaoPlace } from "@/lib/kakao";
import { AREAS, AREA_LABELS, CATEGORIES, CATEGORY_LABELS } from "@/lib/restaurant-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function AdminRequestApproveForm({
  requestId,
  defaultName,
  defaultAddress,
  defaultMenuName,
  defaultMenuPrice,
}: {
  requestId: string;
  defaultName: string;
  defaultAddress: string;
  defaultMenuName: string;
  defaultMenuPrice: string;
}) {
  const action = approveRequest.bind(null, requestId);
  const [state, formAction, pending] = useActionState(action, undefined);

  const [name, setName] = useState(defaultName);
  const [address, setAddress] = useState(defaultAddress);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [kakaoPlaceId, setKakaoPlaceId] = useState("");
  const [menuName, setMenuName] = useState(defaultMenuName);
  const [menuPrice, setMenuPrice] = useState(defaultMenuPrice);

  const [query, setQuery] = useState(defaultName);
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [searchError, setSearchError] = useState<string>();
  const [searching, startSearch] = useTransition();

  function handleSearch() {
    if (!query.trim()) return;
    setSearchError(undefined);
    startSearch(async () => {
      const res = await fetch(`/api/admin/kakao-places?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error ?? "검색에 실패했어요.");
        setResults([]);
        return;
      }
      setResults(data.places ?? []);
    });
  }

  function handleSelect(place: KakaoPlace) {
    setName(place.place_name);
    setAddress(place.road_address_name || place.address_name);
    setLatitude(place.y);
    setLongitude(place.x);
    setPhone(place.phone);
    setKakaoPlaceId(place.id);
    setResults([]);
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-dashed p-3 text-sm">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`kakao-query-${requestId}`}>카카오 장소 검색</Label>
        <div className="flex gap-2">
          <Input
            id={`kakao-query-${requestId}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소명으로 검색"
            className="h-8"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={searching || !query.trim()}
            onClick={handleSearch}
          >
            {searching ? "검색 중..." : "검색"}
          </Button>
        </div>
        {searchError && <p className="text-destructive">{searchError}</p>}
        {results.length > 0 && (
          <ul className="flex flex-col gap-0.5 rounded-lg border p-1">
            {results.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(place)}
                  className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-muted"
                >
                  <span className="font-medium">{place.place_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {place.road_address_name || place.address_name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <input type="hidden" name="kakaoPlaceId" value={kakaoPlaceId} />

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`name-${requestId}`}>식당 이름</Label>
          <Input
            id={`name-${requestId}`}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-8"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`address-${requestId}`}>주소</Label>
          <Input
            id={`address-${requestId}`}
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`area-${requestId}`}>상권</Label>
          <select id={`area-${requestId}`} name="area" required className={selectClassName}>
            {AREAS.map((value) => (
              <option key={value} value={value}>
                {AREA_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`category-${requestId}`}>카테고리</Label>
          <select id={`category-${requestId}`} name="category" required className={selectClassName}>
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`lat-${requestId}`}>위도</Label>
          <Input
            id={`lat-${requestId}`}
            name="latitude"
            type="number"
            step="any"
            required
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`lng-${requestId}`}>경도</Label>
          <Input
            id={`lng-${requestId}`}
            name="longitude"
            type="number"
            step="any"
            required
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <Label htmlFor={`phone-${requestId}`}>전화번호 (선택)</Label>
          <Input
            id={`phone-${requestId}`}
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`menu-name-${requestId}`}>대표메뉴 이름</Label>
          <Input
            id={`menu-name-${requestId}`}
            name="menuName"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor={`menu-price-${requestId}`}>대표메뉴 가격</Label>
          <Input
            id={`menu-price-${requestId}`}
            name="menuPrice"
            type="number"
            min={0}
            value={menuPrice}
            onChange={(e) => setMenuPrice(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" id={`partnered-${requestId}`} name="isPartnered" className="size-4" />
          <Label htmlFor={`partnered-${requestId}`}>학교 제휴 식당이에요</Label>
        </div>
      </div>
      {state?.error && <p className="text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "승인 중..." : "승인하고 식당 등록"}
      </Button>
    </form>
  );
}
