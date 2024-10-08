"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow as InfoWindowReact,
  Map,
} from "@vis.gl/react-google-maps";
import Image, { StaticImageData } from "next/legacy/image";
import { useEffect, useState } from "react";
import GoogleMapsCarousel from "./googlemaps-carousel";
import MapsArrow from "/public/marqueseleao/maps-arrow.svg";
import { Imóvel } from "smart-imob-types";
import { getFotoDestaque } from "@/utils/get-foto-destaque";

const InfoWindow = InfoWindowReact as any;

type BairroType = {
  id: number;
  name: string;
  img: StaticImageData;
  bg: string;
  clr: string;
  position: {
    lat: number;
    lng: number;
  };
};

type GoogleMapProps = {
  closeMap: () => void;
  imoveis: Imóvel[];
  bairros: BairroType[];
  defaultCenter?: Imóvel;
};

const GoogleMap = ({
  closeMap,
  imoveis,
  bairros,
  defaultCenter,
}: GoogleMapProps) => {
  const [markers, setMarkers] = useState<BairroType[]>(bairros);
  const [selectedMarker, setSelectedMarker] = useState<BairroType | null>(null);

  const mapPosition = {
    lat: defaultCenter?.lat || -29.6846,
    lng: defaultCenter?.long || -51.1,
  };

  const predefinedColors = [
    { bg: "#530944", clr: "#fff" },
    { bg: "#fff", clr: "#000" },
    { bg: "#095310", clr: "#fff" },
  ];

  const getColorForIndex = (index: number) => {
    return predefinedColors[index % predefinedColors.length];
  };

  useEffect(() => {
    const objs: any = imoveis.map((imovel, index) => {
      const color = getColorForIndex(index);
      return {
        id: imovel.db_id,
        name: imovel.bairro,
        img: getFotoDestaque(imovel) || "",
        bg: color.bg,
        clr: color.clr,
        position: {
          lat: imovel.lat,
          lng: imovel.long,
        },
      };
    });
    setMarkers(objs);
  }, [imoveis]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
      <Map
        defaultZoom={12}
        defaultCenter={mapPosition}
        mapId={process.env.NEXT_PUBLIC_MAP_ID as string}
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
      >
        <button
          className="bg-white w-12 aspect-square flex justify-center items-center shadow-lg rounded-[.625rem] top-6 left-6 absolute lg:hidden"
          onClick={closeMap}
        >
          <Image src={MapsArrow} alt="Seta para esquerda" />
        </button>
        {(markers || []).map((marker) => (
          <AdvancedMarker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(selectedMarker ? null : marker)}
          >
            <div
              className="flex tracking-wider justify-center items-center shadow-xl px-3 py-1 rounded-full transition-colors"
              style={{
                backgroundColor: marker.bg,
                color: marker.clr,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {marker.name}
            </div>
            {selectedMarker && (
              <InfoWindow
                className="max-w-[27.813rem]"
                headerDisabled
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
                onDoubleClick={() => setSelectedMarker(null)}
              >
                <GoogleMapsCarousel estates={imoveis} />
              </InfoWindow>
            )}
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
};

export default GoogleMap;
