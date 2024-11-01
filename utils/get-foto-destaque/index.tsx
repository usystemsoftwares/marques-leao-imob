import { Imóvel } from "smart-imob-types";

export const getFotoDestaque = (
  imovel: Imóvel,
  resized?: boolean
): undefined | string => {
  const fotos = imovel.fotos || [];
  const firstImage = fotos.find((image) => image.destaque);
  if (firstImage) {
    if (resized) {
      return firstImage.resized || firstImage.source.uri;
    } else {
      return firstImage.source.uri;
    }
  }

  const foto =
    fotos.find((foto) => foto.destaque) ||
    fotos.find((e) => e.ordem == 1) ||
    fotos[0];
  if (!foto) return undefined;
  if (resized) {
    return foto.resized || foto.source.uri;
  } else {
    return foto.source.uri;
  }
};
