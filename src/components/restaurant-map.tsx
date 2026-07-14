"use client";

import Script from "next/script";
import { useRef } from "react";

import { KAKAO_MAPS_SDK_SRC } from "@/lib/kakao-map-sdk";

export function RestaurantMap({
  name,
  latitude,
  longitude,
}: {
  name: string;
  latitude: number;
  longitude: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function initMap() {
    const kakao = window.kakao;
    const container = containerRef.current;
    if (!kakao || !container) return;

    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(latitude, longitude);
      const map = new kakao.maps.Map(container, { center, level: 3 });
      const marker = new kakao.maps.Marker({ position: center });
      marker.setMap(map);

      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">${name}</div>`,
      });
      infoWindow.open(map, marker);
    });
  }

  return (
    <>
      <Script src={KAKAO_MAPS_SDK_SRC} strategy="afterInteractive" onReady={initMap} />
      <div ref={containerRef} className="h-56 w-full overflow-hidden rounded-lg border" />
    </>
  );
}
