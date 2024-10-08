import { Imóvel } from "smart-imob-types";
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
  bairros: string[];
  estados: {
    nodes: any[];
    total: number;
  };
  cidades: any[];
  tipos: any[];
  codigos: any[];
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

  const params_bairros = new URLSearchParams({
    empresa_id,
  });

  const bairrosResponse = await fetch(
    `${uri}/imoveis/bairros?${params_bairros.toString()}`,
    {
      next: { tags: ["imoveis-paginado"] },
    }
  );

  await checkFetchStatus(bairrosResponse, "bairros");
  const bairros = await bairrosResponse.json();

  const responseEstados = await fetch(`${uri}/estados`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!responseEstados.ok) {
    throw new Error(`Erro na requisição: ${responseEstados.status}`);
  }

  const responseCidades = await fetch(`${uri}/cidades`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!responseCidades.ok) {
    throw new Error(`Erro na requisição: ${responseCidades.status}`);
  }

  const responseTipos = await fetch(
    `${uri}/imoveis/tipos?${params_bairros.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!responseTipos.ok) {
    throw new Error(`Erro na requisição: ${responseTipos.status}`);
  }

  const responseCodigos = await fetch(
    `${uri}/imoveis/codigos?${params_bairros.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!responseCodigos.ok) {
    throw new Error(`Erro na requisição: ${responseCodigos.status}`);
  }

  return {
    imoveis,
    bairros,
    estados: await responseEstados.json(),
    cidades: await responseCidades.json(),
    tipos: await responseTipos.json(),
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
  const { imoveis, estados, cidades, bairros, tipos, codigos } = await getData(
    searchParams
  );
  return (
    <div>
      <SearchPropertyFilter
        className={className}
        imoveis={imoveis.nodes}
        estados={estados.nodes}
        cidades={cidades}
        bairros={bairros}
        tipos={tipos}
        codigos={codigos}
      />
    </div>
  );
}
