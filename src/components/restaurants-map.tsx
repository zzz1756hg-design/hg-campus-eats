"use client";

import Script from "next/script";
import { useRef } from "react";

import { CNU_CENTER, KAKAO_MAPS_SDK_SRC } from "@/lib/kakao-map-sdk";

export type MappedRestaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export function RestaurantsMap({ restaurants }: { restaurants: MappedRestaurant[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  function initMap() {
    const kakao = window.kakao;
    const container = containerRef.current;
    if (!kakao || !container) return;

    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(CNU_CENTER.latitude, CNU_CENTER.longitude);
      const map = new kakao.maps.Map(container, { center, level: 5 });

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

  return (
    <>
      <Script src={KAKAO_MAPS_SDK_SRC} strategy="afterInteractive" onReady={initMap} />
      <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-lg border" />
    </>
  );
}
