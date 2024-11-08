import slugify from "slugify";
import { Imóvel } from "smart-imob-types";

const slugifyOptions = {
  lower: true,
  strict: true,
  locale: "pt",
  remove: /[*+~.()'"!:@]/g,
};

export const generateEstateUrl = (estate: Imóvel): string => {
  const { tipo, cidade, bairro, empreendimento, dormitórios, vagas, suítes, codigo } = estate;

  const slugifyString = (str: string) => slugify(str, slugifyOptions);

  const urlSegments: string[] = [];

  if (tipo) urlSegments.push(slugifyString(tipo));
  if (cidade) urlSegments.push(slugifyString(cidade.nome));
  if (bairro) urlSegments.push(slugifyString(bairro));

  if (empreendimento) {
    urlSegments.push(slugifyString(String(empreendimento.nome)));
  }

  const formatSegment = (value: number, singular: string, plural: string) => {
    return value === 1 ? `${value}-${singular}` : `${value}-${plural}`;
  };

  if (suítes && Number(suítes) > 0) {
    const suiteNumber = Number(suítes);
    urlSegments.push(formatSegment(suiteNumber, "suite", "suites"));
  }

  if (dormitórios && Number(dormitórios) > 0) {
    const dormitorioNumber = Number(dormitórios);
    urlSegments.push(formatSegment(dormitorioNumber, "dormitório", "dormitórios"));
  }

  if (vagas && Number(vagas) > 0) {
    const vagasNumber = Number(vagas);
    urlSegments.push(formatSegment(vagasNumber, "vaga", "vagas"));
  }

  if (codigo) {
    urlSegments.push(slugifyString(String(codigo)));
  }

  const url = `/imovel/${urlSegments.join("/")}`;

  return url;
};