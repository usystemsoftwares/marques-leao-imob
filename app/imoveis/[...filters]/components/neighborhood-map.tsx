"use client";

import {
  APIProvider,
  Map as GoogleMapComponent,
  useMap,
} from "@vis.gl/react-google-maps";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { createPortal } from "react-dom";

export type BairroContagem = {
  bairro: string;
  quantidade: number;
  lat: number;
  lng: number;
};

type NeighborhoodMapProps = {
  bairrosContagem: BairroContagem[];
  filters?: string[];
};

const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'\"!:@]/g,
};

const COLORS = [
  { bg: "#530944", clr: "#fff" },
  { bg: "#095310", clr: "#fff" },
  { bg: "#0A0A0A", clr: "#fff" },
  { bg: "#1a3a5c", clr: "#fff" },
  { bg: "#7a1f1f", clr: "#fff" },
];

type MarkerData = BairroContagem & {
  slug: string;
  color: { bg: string; clr: string };
};

// Inner component: renders custom HTML overlays via google.maps.OverlayView
// (does NOT require a mapId — works with any Google Map)
const BairroMarkers = ({
  markers,
  onMarkerClick,
}: {
  markers: MarkerData[];
  onMarkerClick: (slug: string) => void;
}) => {
  const map = useMap();
  const overlaysRef = useRef<google.maps.OverlayView[]>([]);
  const [containers, setContainers] = useState<
    { el: HTMLElement; index: number }[]
  >([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing overlays
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    const newContainers: { el: HTMLElement; index: number }[] = [];

    markers.forEach((marker, i) => {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.transform = "translate(-50%, -50%)";
      div.style.cursor = "pointer";
      div.style.zIndex = "1";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const G = (window as any).google;

      class PillOverlay extends G.maps.OverlayView {
        onAdd() {
          // overlayMouseTarget pane captures click events on overlays
          this.getPanes().overlayMouseTarget.appendChild(div);
        }
        draw() {
          const pt = this.getProjection().fromLatLngToDivPixel(
            new G.maps.LatLng(marker.lat, marker.lng)
          );
          if (pt) {
            div.style.left = `${pt.x}px`;
            div.style.top = `${pt.y}px`;
          }
        }
        onRemove() {
          div.parentNode?.removeChild(div);
        }
      }

      const overlay = new PillOverlay();
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
      newContainers.push({ el: div, index: i });
    });

    setContainers(newContainers);

    // Fit map to show all markers, with zoom band to avoid extremes
    if (markers.length > 0) {
      const G = (window as any).google;
      const bounds = new G.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(new G.maps.LatLng(m.lat, m.lng)));
      // Keep zoom between 9 (regional) and 14 (neighborhood) — avoids country-level zoom-out
      // and avoids exposing exact property coordinates at street level
      G.maps.event.addListenerOnce(map, "idle", () => {
        const zoom = map.getZoom() ?? 0;
        if (zoom > 14) map.setZoom(14);
        else if (zoom < 9) map.setZoom(9);
      });
      map.fitBounds(bounds, 80); // 80px padding so badges aren't clipped at edges
    }

    return () => {
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [map, markers]);

  return (
    <>
      {containers.map(({ el, index }) => {
        const marker = markers[index];
        if (!marker) return null;
        return createPortal(
          <div
            onClick={() => onMarkerClick(marker.slug)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
              backgroundColor: marker.color.bg,
              color: marker.color.clr,
              whiteSpace: "nowrap",
              fontSize: "0.8rem",
              fontWeight: 700,
              gap: "0.35rem",
              transition: "transform 0.15s",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <span>{marker.bairro}</span>
            <span
              style={{
                background: "rgba(255,255,255,0.22)",
                borderRadius: "9999px",
                padding: "0.1rem 0.5rem",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              {marker.quantidade}
            </span>
          </div>,
          el
        );
      })}
    </>
  );
};

const NeighborhoodMap = ({ bairrosContagem, filters }: NeighborhoodMapProps) => {
  const router = useRouter();

  const markers = useMemo(
    () =>
      bairrosContagem
        .filter((b) => b.lat !== 0 && b.lng !== 0)
        .map((b, index) => ({
          ...b,
          slug: slugify(b.bairro, slugifyOptions),
          color: COLORS[index % COLORS.length],
        })),
    [bairrosContagem]
  );

  // Geographic centroid of all markers
  const centroid = useMemo(() => {
    if (markers.length === 0) return { lat: -29.6846, lng: -51.1303 };
    const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
    const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
    return { lat, lng };
  }, [markers]);

  const handleMarkerClick = useCallback(
    (slug: string) => {
      // Preserve all current filter segments, replacing any existing bairro segment
      const current = (filters ?? []).filter(
        (s) => !s.startsWith("bairro-") && !s.startsWith("pagina-")
      );
      current.push(`bairro-${slug}`);
      router.push(`/imoveis/${current.join("/")}`);
    },
    [router, filters]
  );

  // Guard after all hooks
  if (!process.env.NEXT_PUBLIC_MAPS_API_KEY) {
    return null;
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
      <GoogleMapComponent
        defaultZoom={12}
        defaultCenter={centroid}
        style={{ width: "100%", height: "100%" }}
        disableDefaultUI
        gestureHandling="cooperative"
        reuseMaps
      >
        <BairroMarkers markers={markers} onMarkerClick={handleMarkerClick} />
      </GoogleMapComponent>
    </APIProvider>
  );
};

export default NeighborhoodMap;
