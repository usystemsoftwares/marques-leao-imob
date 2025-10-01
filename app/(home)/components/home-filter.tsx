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
  estados: any[];
  cidades: any[];
  codigos: any[];
  bairros: any[];
  tipos: any[];
  caracteristicas: any[];
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

  const responseEstados = await fetch(`${uri}/estados?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const responseBairros = await fetch(`${uri}/imoveis/bairros-por-cidade?${params.toString()}`, {
    next: { tags: ["imoveis-info"], revalidate: 3600 },
  });


  const paramsCidades = new URLSearchParams({
    empresa_id,
    site: '1',
  });

  const cidades = await fetch(
    `${uri}/cidades?${paramsCidades.toString()}`,
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

  // Fetch Tipos
  const responseTipos = await fetch(
    `${uri}/imoveis/tipos-empresa?${params.toString()}`,
    {
      next: { tags: ["imoveis-info"], revalidate: 3600 },
    }
  );

  // Fetch Características
  const responseCaracteristicas = await fetch(
    `${uri}/caracteristicas?${params.toString()}`,
    {
      next: { tags: ["caracteristicas"], revalidate: 3600 },
    }
  );

  if (
    !responseEstados.ok ||
    !cidades.ok
  ) {
    throw new Error("Failed to fetch data");
  }


  return {
    imoveis,
    bairros: await responseBairros.json(),
    estados: await responseEstados.json(),
    cidades: await cidades.json(),
    codigos: await responseCodigos.json(),
    tipos: responseTipos.ok ? await responseTipos.json() : [],
    caracteristicas: responseCaracteristicas.ok ? await responseCaracteristicas.json() : [],
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
  const { estados, cidades, bairros, codigos, tipos, caracteristicas } = await getData(
    searchParams
  );
  return (
    <div>
      <SearchPropertyFilter
        className={className}
        estados={estados}
        cidades={cidades}
        bairros={bairros}
        codigos={codigos}
        tipos={tipos}
        caracteristicas={caracteristicas}
        searchParams={searchParams}
      />
    </div>
  );
}
