import { ImoveisInfoType, Imóvel } from "smart-imob-types";
import processarFiltros from "@/utils/processar-filtros-backend";
import checkFetchStatus from "@/utils/checkFetchStatus";
import ordenacoesBackend from "@/utils/processar-ordenacoes-backend";
import SearchPropertyFilter from "./search-property-filter";

const PAGE_SIZE = 12;

async function getData(filtros: any): Promise<{
  imoveis: {
    nodes: Imóvel[];
    total: number;
  };
  estados: {
    nodes: any[];
    total: number;
  };
  cidades: any[];
  codigos: any[];
  info: ImoveisInfoType;
}> {
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

  const params_imoveis = new URLSearchParams({
    limit: PAGE_SIZE.toString(),
    startAt: (0).toString(),
    filtros: JSON.stringify(processarFiltros(filtros)),
    order: JSON.stringify([ordenacoesBackend[1]]),
    empresa_id,
  });

  const imoveisResponse = await fetch(
    `${uri}/imoveis/site/paginado?${params_imoveis.toString()}`,
    {
      next: { tags: ["imoveis-paginado"] },
    }
  );

  await checkFetchStatus(imoveisResponse, "imoveis");
  const imoveis = await imoveisResponse.json();

  const params = new URLSearchParams({
    empresa_id,
  });

  const responseEstados = await fetch(`${uri}/estados`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const cidades = await fetch(
    `${uri}/imoveis/cidades/contagem?${params.toString()}`,
    {
      next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
    }
  );

  const responseCodigos = await fetch(
    `${uri}/imoveis/codigos?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const info = await fetch(`${uri}/imoveis/info?${params.toString()}`, {
    next: { tags: ["imoveis-info"], revalidate: 3600 },
  });

  if (
    !responseEstados.ok ||
    !info.ok ||
    !cidades.ok
  ) {
    throw new Error("Failed to fetch data");
  }


  return {
    imoveis,
    info: await info.json(),
    estados: await responseEstados.json(),
    cidades: await cidades.json(),
    codigos: await responseCodigos.json(),
  };
}

export default async function HomeFilter({
  className,
  params,
  searchParams,
}: {
  className?: string;
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { estados, cidades, info, codigos } = await getData(
    searchParams
  );
  return (
    <div>
      <SearchPropertyFilter
        className={className}
        cidades={Object.keys(cidades ?? {})}
        bairros={info.bairros_disponiveis}
        codigos={codigos}
        searchParams={searchParams}
      />
    </div>
  );
}
