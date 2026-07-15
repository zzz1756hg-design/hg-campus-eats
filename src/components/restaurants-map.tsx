"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

import type { CommercialArea, FoodCategory } from "@/generated/prisma/enums";
import { CNU_CENTER, KAKAO_MAPS_SDK_SRC } from "@/lib/kakao-map-sdk";
import { AREA_CENTERS, AREA_LABELS, CATEGORY_LABELS } from "@/lib/restaurant-labels";

const MARKER_SVG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24C32 7.163 24.837 0 16 0z" fill="oklch(0.78 0.17 75)"/>
      <circle cx="16" cy="16" r="7" fill="oklch(0.24 0.05 260)"/>
    </svg>`
  );

export type MappedRestaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: CommercialArea;
  category: FoodCategory;
  averageRating: number | null;
  menus: { name: string }[];
};

export function RestaurantsMap({
  restaurants,
  area,
}: {
  restaurants: MappedRestaurant[];
  area?: CommercialArea;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function renderMap() {
    const kakao = window.kakao;
    const container = containerRef.current;
    if (!kakao || !container) return;

    kakao.maps.load(() => {
      const centerPoint = area ? AREA_CENTERS[area] : CNU_CENTER;
      const center = new kakao.maps.LatLng(centerPoint.latitude, centerPoint.longitude);
      const map = new kakao.maps.Map(container, { center, level: area ? 3 : 5 });
      const markerImage = new kakao.maps.MarkerImage(
        MARKER_SVG,
        new kakao.maps.Size(32, 40),
        { offset: new kakao.maps.Point(16, 40) }
      );

      for (const restaurant of restaurants) {
        const position = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);
        const marker = new kakao.maps.Marker({ position, image: markerImage });
        marker.setMap(map);

        const ratingText =
          restaurant.averageRating !== null ? `★ ${restaurant.averageRating.toFixed(1)}` : "리뷰 없음";
        const topMenu = restaurant.menus[0]?.name;
        const routeUrl = `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`;

        const infoWindow = new kakao.maps.InfoWindow({
          content: `
            <div style="min-width:160px;padding:8px 10px;font-size:13px;line-height:1.4;">
              <a href="/restaurants/${restaurant.id}" style="display:block;color:inherit;">
                <div style="font-weight:600;">${restaurant.name}</div>
                <div style="color:#71717a;font-size:12px;">${CATEGORY_LABELS[restaurant.category]} · ${AREA_LABELS[restaurant.area]} · ${ratingText}</div>
                ${topMenu ? `<div style="color:#71717a;font-size:12px;">${topMenu}</div>` : ""}
              </a>
              <a href="${routeUrl}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:6px;color:oklch(0.24 0.05 260);font-size:12px;font-weight:600;">길찾기 →</a>
            </div>
          `,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      }
    });
  }

  useEffect(() => {
    if (window.kakao?.maps) {
      renderMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, restaurants]);

  return (
    <>
      <Script src={KAKAO_MAPS_SDK_SRC} strategy="afterInteractive" onReady={renderMap} />
      <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-lg border" />
    </>
  );
}
