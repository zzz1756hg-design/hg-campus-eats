"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

import type { CommercialArea } from "@/generated/prisma/enums";
import { CNU_CENTER, KAKAO_MAPS_SDK_SRC } from "@/lib/kakao-map-sdk";
import { AREA_CENTERS } from "@/lib/restaurant-labels";

export type MappedRestaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
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

      for (const restaurant of restaurants) {
        const position = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);
        const marker = new kakao.maps.Marker({ position });
        marker.setMap(map);

        const infoWindow = new kakao.maps.InfoWindow({
          content: `<a href="/restaurants/${restaurant.id}" style="display:block;padding:6px 10px;font-size:13px;white-space:nowrap;color:inherit;">${restaurant.name}</a>`,
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
