"use client"

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps"
import Image, { StaticImageData } from "next/image"
import { useState } from "react"
import Imovel from "/public/marqueseleao/imovel-1.webp"
import { imoveis } from "@/data"
import GoogleMapsCarousel from "./googlemaps-carousel"
import ArrowLeft from "/public/marqueseleao/maps-arrow.svg"

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
}

const bairros = [{
  id: 1,
  name: "Bairro 1",
  img: Imovel,
  bg: "#530944",
  clr: "#fff",
  position: {
    lat: -29.6846,
    lng: -51.1000
  }
}, {
  id: 2,
  name: "Bairro 2",
  img: Imovel,
  bg: "#fff",
  clr: "#000",
  position: {
    lat: -29.6803,
    lng: -51.0536
  }
}, {
  id: 3,
  name: "Bairro 3",
  img: Imovel,
  bg: "#095310",
  clr: "#fff",
  position: {
    lat: -29.7608,
    lng: -51.1522
  }
}]

const GoogleMap = () => {
  const [markers] = useState(bairros)

  const [selectedMarker, setSelectedMarker] = useState<BairroType | null>(null)

  const mapPosition = {
    lat: -29.6846,
    lng: -51.1000
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
      <Map
        defaultZoom={12}
        defaultCenter={mapPosition}
        mapId={process.env.NEXT_PUBLIC_MAP_ID as string}
      >
        {/* <button className="bg-white flex justify-center items-center w-12 rounded-[.625rem] shadow-lg aspect-square absolute left-[2%] bottom-[5%]">
          <Image
            src={ArrowLeft}
            alt="Seta para esquerda"
          />
        </button> */}
        {markers.map(marker => (
          <AdvancedMarker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(selectedMarker ? null : marker)}
          >
            <div
              className="flex tracking-wider justify-center items-center shadow-xl px-3 py-1 rounded-full transition-colors"
              style={{
                backgroundColor: marker.bg,
                color: marker.clr
              }}
            >{marker.name}</div>
            {selectedMarker && (
              <InfoWindow
                className="max-w-[27.813rem]"
                headerDisabled
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}>
                <GoogleMapsCarousel estates={imoveis} />
              </InfoWindow>
            )}
          </AdvancedMarker>
        ))}

      </Map>
    </APIProvider>
  )
}

export default GoogleMap