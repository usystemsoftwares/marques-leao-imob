import slugify from "slugify";
import { Imóvel } from "smart-imob-types";

const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'"!:@]/g,
};

export const generateEstateUrl = (estate: Imóvel): string => {
  const { tipo, cidade, bairro, empreendimento, dormitórios, vagas, codigo } =
    estate;

  const slugifyString = (str: string) => slugify(str, slugifyOptions);

  const urlSegments = [];

  if (tipo) urlSegments.push(`tipo-${slugifyString(tipo)}`);
  if (cidade) urlSegments.push(`cidade-${slugifyString(cidade?.nome)}`);
  if (bairro) urlSegments.push(`bairro-${slugifyString(bairro)}`);

  if (empreendimento)
    urlSegments.push(
      `empreendimento-${slugifyString(String(empreendimento?.nome))}`
    );

  if (dormitórios && Number(dormitórios) > 0)
    urlSegments.push(`dormitorios-${slugifyString(String(dormitórios))}`);

  if (vagas && Number(vagas) > 0)
    urlSegments.push(`vagas-${slugifyString(String(vagas))}`);

  if (codigo) urlSegments.push(`${slugifyString(String(codigo))}`);
  const url = `/imovel/${urlSegments.join("/")}`;

  return url;
};
