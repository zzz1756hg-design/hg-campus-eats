"use client";

import Script from "next/script";
import { useRef } from "react";

type KakaoLatLng = { lat: number; lng: number };
type KakaoMap = { setCenter: (latLng: KakaoLatLng) => void };
type KakaoMarker = { setMap: (map: KakaoMap | null) => void };
type KakaoInfoWindow = { open: (map: KakaoMap, marker: KakaoMarker) => void };

type KakaoMapsSdk = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
  InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsSdk };
  }
}

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
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
        strategy="afterInteractive"
        onReady={initMap}
      />
      <div ref={containerRef} className="h-56 w-full overflow-hidden rounded-lg border" />
    </>
  );
}
