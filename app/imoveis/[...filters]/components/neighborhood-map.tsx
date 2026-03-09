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
const BairroMarkers = ({
  markers,
  activeBairros,
  onMarkerClick,
}: {
  markers: MarkerData[];
  activeBairros: Set<string>;
  onMarkerClick: (slug: string) => void;
}) => {
  const map = useMap();
  const overlaysRef = useRef<google.maps.OverlayView[]>([]);
  const hasFittedBoundsRef = useRef(false);
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

    // Fit map to show all markers (only on first render)
    if (markers.length > 0 && !hasFittedBoundsRef.current) {
      hasFittedBoundsRef.current = true;
      const G = (window as any).google;
      const bounds = new G.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(new G.maps.LatLng(m.lat, m.lng)));
      G.maps.event.addListenerOnce(map, "idle", () => {
        const zoom = map.getZoom() ?? 0;
        if (zoom > 14) map.setZoom(14);
        else if (zoom < 9) map.setZoom(9);
      });
      map.fitBounds(bounds, 80);
    }

    return () => {
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [map, markers]);

  // Update z-index of container divs when active state changes
  useEffect(() => {
    containers.forEach(({ el, index }) => {
      const marker = markers[index];
      if (!marker) return;
      el.style.zIndex = activeBairros.has(marker.slug) ? "10" : "1";
    });
  }, [containers, markers, activeBairros]);

  return (
    <>
      {containers.map(({ el, index }) => {
        const marker = markers[index];
        if (!marker) return null;
        const isActive = activeBairros.has(marker.slug);
        return createPortal(
          <div
            onClick={() => onMarkerClick(marker.slug)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: isActive
                ? "0 0 0 3px #fff, 0 4px 20px rgba(201,162,39,0.55)"
                : "0 4px 14px rgba(0,0,0,0.3)",
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
              backgroundColor: isActive ? "#c9a227" : marker.color.bg,
              color: isActive ? "#000" : marker.color.clr,
              whiteSpace: "nowrap",
              fontSize: "0.8rem",
              fontWeight: 700,
              gap: "0.35rem",
              transition: "transform 0.15s",
              userSelect: "none",
              transform: isActive ? "scale(1.18)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = isActive
                ? "scale(1.28)"
                : "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = isActive
                ? "scale(1.18)"
                : "scale(1)";
            }}
          >
            <span>{marker.bairro}</span>
            <span
              style={{
                background: isActive
                  ? "rgba(0,0,0,0.15)"
                  : "rgba(255,255,255,0.22)",
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

  // Derive which bairros are currently active from the URL filter segments
  const activeBairros = useMemo(() => {
    const seg = (filters ?? []).find((s) => s.startsWith("bairro-"));
    if (!seg) return new Set<string>();
    const slugs = seg.replace(/^bairros?-/, "").split(",");
    return new Set(slugs);
  }, [filters]);

  // Geographic centroid of all markers
  const centroid = useMemo(() => {
    if (markers.length === 0) return { lat: -27.1000, lng: -48.6000 };
    const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
    const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
    return { lat, lng };
  }, [markers]);

  const handleMarkerClick = useCallback(
    (slug: string) => {
      const current = (filters ?? []).filter(
        (s) => !s.startsWith("bairro-") && !s.startsWith("pagina-")
      );
      // Toggle: if already active, remove the filter; otherwise apply it
      if (!activeBairros.has(slug)) {
        current.push(`bairro-${slug}`);
      }
      const url =
        current.length > 0 ? `/imoveis/${current.join("/")}` : "/imoveis";
      router.push(url);
    },
    [router, filters, activeBairros]
  );

  // Guard after all hooks
  if (!process.env.NEXT_PUBLIC_MAPS_API_KEY) {
    return null;
  }

  return (
    <GoogleMapComponent
      defaultZoom={12}
      defaultCenter={centroid}
      style={{ width: "100%", height: "100%" }}
      disableDefaultUI
      gestureHandling="cooperative"
      reuseMaps
    >
      <BairroMarkers
        markers={markers}
        activeBairros={activeBairros}
        onMarkerClick={handleMarkerClick}
      />
    </GoogleMapComponent>
  );
};

export default NeighborhoodMap;
