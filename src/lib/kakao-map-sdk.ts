export type KakaoLatLng = { lat: number; lng: number };
export type KakaoMapInstance = { setCenter: (latLng: KakaoLatLng) => void };
export type KakaoMarkerInstance = { setMap: (map: KakaoMapInstance | null) => void };
export type KakaoInfoWindowInstance = {
  open: (map: KakaoMapInstance, marker: KakaoMarkerInstance) => void;
};
export type KakaoSize = object;
export type KakaoPoint = object;
export type KakaoMarkerImage = object;

export type KakaoMapsSdk = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  Marker: new (options: { position: KakaoLatLng; image?: KakaoMarkerImage }) => KakaoMarkerInstance;
  MarkerImage: new (
    src: string,
    size: KakaoSize,
    options?: { offset?: KakaoPoint }
  ) => KakaoMarkerImage;
  Size: new (width: number, height: number) => KakaoSize;
  Point: new (x: number, y: number) => KakaoPoint;
  InfoWindow: new (options: { content: string }) => KakaoInfoWindowInstance;
  event: {
    addListener: (target: KakaoMarkerInstance, type: string, handler: () => void) => void;
  };
};

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsSdk };
  }
}

export const KAKAO_MAPS_SDK_SRC = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`;

// Chonnam National University (Yongbong campus) approximate center.
export const CNU_CENTER = { latitude: 35.1765, longitude: 126.9091 };
