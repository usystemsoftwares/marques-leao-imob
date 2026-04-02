import { Imóvel } from "smart-imob-types";

export function getSingleArea(imovel: Imóvel) {
  if (imovel.area_privativa) {
    return `${imovel.area_privativa} ${imovel.tipo_area_privativa ?? "m²"}`;
  }
  if (imovel.area_terreno) {
    return `${imovel.area_terreno} ${imovel.tipo_area_terreno ?? "m²"}`;
  }
  if (imovel.area_construída) {
    return `${imovel.area_construída} ${imovel.tipo_area_construída ?? "m²"}`;
  }
  if (imovel.area_total) {
    return `${imovel.area_total} ${imovel.tipo_area_total ?? "m²"}`;
  }
  if (imovel.area_útil) {
    return `${imovel.area_útil} ${imovel.tipo_area_útil ?? "m²"}`;
  } else {
    return "N/D";
  }
}
