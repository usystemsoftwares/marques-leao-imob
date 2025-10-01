"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow as InfoWindowReact,
  Map as GoogleMapComponent,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import MapsArrow from "/public/marqueseleao/maps-arrow.svg";
import { Imóvel } from "smart-imob-types";
import EstateDetails from "./estate-details";

const InfoWindow = InfoWindowReact as any;

type BairroMarker = {
  bairro: string;
  quantidade: number;
  imoveis: Imóvel[];
  position: {
    lat: number;
    lng: number;
  };
  bg: string;
  clr: string;
};

type GoogleMapProps = {
  closeMap: () => void;
  imoveis: Imóvel[];
  defaultCenter?: Imóvel;
};

const GoogleMap = ({ closeMap, imoveis, defaultCenter }: GoogleMapProps) => {
  const [bairroMarkers, setBairroMarkers] = useState<BairroMarker[]>([]);
  const [selectedBairro, setSelectedBairro] = useState<BairroMarker | null>(null);
  const [showingProperties, setShowingProperties] = useState(false);

  const mapPosition = {
    lat: defaultCenter?.lat || -29.6846,
    lng: defaultCenter?.long || -51.1303,
  };
  
  // Debug para verificar as coordenadas
  console.log('Map Position:', mapPosition);
  console.log('Total de imóveis:', imoveis.length);
  console.log('Imóveis com coordenadas:', imoveis.filter(i => i.lat && i.long).length);
  console.log('Google Maps API Key exists:', !!process.env.NEXT_PUBLIC_MAPS_API_KEY);
  console.log('Bairro markers:', bairroMarkers);

  const predefinedColors = useMemo(() => [
    { bg: "#530944", clr: "#fff" },
    { bg: "#095310", clr: "#fff" },
    { bg: "#0A0A0A", clr: "#fff" },
  ], []);

  useEffect(() => {
    // Agrupar imóveis por bairro
    const bairrosMap = new window.Map<string, Imóvel[]>();
    
    imoveis.forEach((imovel) => {
      const bairro = imovel.bairro || "Sem bairro";
      if (!bairrosMap.has(bairro)) {
        bairrosMap.set(bairro, []);
      }
      const bairroImoveis = bairrosMap.get(bairro);
      if (bairroImoveis) {
        bairroImoveis.push(imovel);
      }
    });

    // Criar marcadores para cada bairro
    const markers: BairroMarker[] = Array.from(bairrosMap.entries()).map(
      ([bairro, imoveisBairro], index) => {
        // Calcular posição média do bairro baseada nos imóveis
        const avgLat = imoveisBairro.reduce((sum: number, im: Imóvel) => sum + (im.lat || 0), 0) / imoveisBairro.length;
        const avgLng = imoveisBairro.reduce((sum: number, im: Imóvel) => sum + (im.long || 0), 0) / imoveisBairro.length;
        
        const color = predefinedColors[index % predefinedColors.length];
        
        return {
          bairro,
          quantidade: imoveisBairro.length,
          imoveis: imoveisBairro,
          position: {
            lat: avgLat || mapPosition.lat,
            lng: avgLng || mapPosition.lng,
          },
          bg: color.bg,
          clr: color.clr,
        };
      }
    );

    setBairroMarkers(markers);
  }, [imoveis, mapPosition.lat, mapPosition.lng, predefinedColors]);

  if (!process.env.NEXT_PUBLIC_MAPS_API_KEY) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <p className="text-gray-600">Mapa não configurado</p>
    </div>;
  }

  return (
    <div className="w-full h-full relative">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
        <GoogleMapComponent
          defaultZoom={12}
          defaultCenter={mapPosition}
          style={{ width: '100%', height: '100%' }}
        >
          <button
            className="bg-white w-12 aspect-square flex justify-center items-center shadow-lg rounded-[.625rem] top-6 left-6 absolute lg:hidden"
            onClick={closeMap}
          >
            <Image
              src={MapsArrow}
              alt="Seta para esquerda"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </button>
          {bairroMarkers.map((marker) => (
            <AdvancedMarker
              key={marker.bairro}
              position={marker.position}
              onClick={() => {
                setSelectedBairro(selectedBairro?.bairro === marker.bairro ? null : marker);
                setShowingProperties(false);
              }}
            >
              <div
                className="flex tracking-wider justify-center items-center shadow-xl px-4 py-2 rounded-full transition-all hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: marker.bg,
                  color: marker.clr,
                  whiteSpace: "nowrap",
                }}
              >
                <span className="font-bold mr-2">{marker.quantidade}</span>
                <span>imóveis em {marker.bairro}</span>
              </div>
            </AdvancedMarker>
          ))}
          
          {selectedBairro && (
            <InfoWindow
              className="max-w-[30rem]"
              headerDisabled
              position={selectedBairro.position}
              onCloseClick={() => {
                setSelectedBairro(null);
                setShowingProperties(false);
              }}
            >
              <div className="p-4">
                <h3 className="text-lg font-bold mb-3">
                  {selectedBairro.quantidade} imóveis em {selectedBairro.bairro}
                </h3>
                
                {!showingProperties ? (
                  <button
                    onClick={() => setShowingProperties(true)}
                    className="w-full py-2 px-4 bg-[#530944] text-white rounded-lg hover:bg-[#6a0b58] transition-colors"
                  >
                    Ver imóveis disponíveis
                  </button>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {selectedBairro.imoveis.map((imovel) => (
                      <div key={imovel.db_id} className="mb-4 pb-4 border-b last:border-b-0">
                        <EstateDetails estate={imovel} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMapComponent>
      </APIProvider>
    </div>
  );
};

export default GoogleMap;
