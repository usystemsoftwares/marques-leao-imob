import slugify from "slugify";
import { Imóvel } from "smart-imob-types";

const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'"!:@]/g,
};

export const generateEstateUrl = (estate: Imóvel): string => {
  const { tipo, cidade, bairro, empreendimento, dormitórios, vagas, suítes, codigo } =
    estate;

  const slugifyString = (str: string) => slugify(str, slugifyOptions);

  const urlSegments = [];

  if (tipo) urlSegments.push(slugifyString(tipo));
  if (cidade) urlSegments.push(slugifyString(cidade?.nome));
  if (bairro) urlSegments.push(slugifyString(bairro));

  if (empreendimento)
    urlSegments.push(slugifyString(String(empreendimento?.nome)));

  if (suítes && Number(suítes) > 0)
    urlSegments.push(`${slugifyString(String(suítes))}-suites`);

  if (dormitórios && Number(dormitórios) > 0)
    urlSegments.push(`${slugifyString(String(dormitórios))}-dormitorios`);

  if (vagas && Number(vagas) > 0)
    urlSegments.push(`${slugifyString(String(vagas))}-vagas`);

  if (codigo) urlSegments.push(`${slugifyString(String(codigo))}`);
  const url = `/imovel/${urlSegments.join("/")}`;

  return url;
};
