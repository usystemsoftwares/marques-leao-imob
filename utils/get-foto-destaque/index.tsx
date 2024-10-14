import { Imóvel } from "smart-imob-types";

export const getFotoDestaque = (
  imovel: Imóvel,
  resized?: boolean
): undefined | string => {
  const fotos = imovel?.fotos || [];
  const foto =
    (imovel?.foto_destaque_index !== undefined
      ? fotos[imovel?.foto_destaque_index]
      : null) ||
    fotos.find((foto) => foto.destaque) ||
    fotos[0];
  if (!foto) return undefined;
  if (resized) {
    return foto.resized || foto?.source?.uri;
  } else {
    return foto?.source?.uri;
  }
};