// ListingStayPage.tsx
import { Empresa, ImoveisInfoType, Imóvel } from "smart-imob-types";
import processarFiltros from "@/utils/processar-filtros-backend";
import checkFetchStatus from "@/utils/checkFetchStatus";
import ordenacoesBackend from "@/utils/processar-ordenacoes-backend";
import PropertyList from "./components/property-list";
import { notFound } from "next/navigation";

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
  tipos: any[];
  codigos: any[];
  empresa: Empresa;
  info: ImoveisInfoType;
}> {
  const { pagina = 1, ordem = 1, ...rest } = filtros;
  const uri =
    process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

  const params_imoveis = new URLSearchParams({
    limit: PAGE_SIZE.toString(),
    startAt: (((pagina ?? 1) - 1) * PAGE_SIZE).toString(),
    filtros: JSON.stringify(processarFiltros(rest)),
    order: JSON.stringify(
      ordem && ordem > 0 ? [ordenacoesBackend[ordem ?? 1]] : []
    ),
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

  if (!responseEstados.ok) {
    throw new Error(`Erro na requisição: ${responseEstados.status}`);
  }

  const responseTipos = await fetch(
    `${uri}/imoveis/tipos?${params.toString()}`,
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

  const cidades = await fetch(
    `${uri}/imoveis/cidades/contagem?${params.toString()}`,
    {
      next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
    }
  );

  if (!responseEstados.ok || !info.ok || !cidades.ok) {
    throw new Error("Failed to fetch data");
  }

  const empresa = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"], revalidate: 3600 },
  });

  if (!empresa.ok) {
    notFound();
  }

  return {
    imoveis,
    info: await info.json(),
    estados: await responseEstados.json(),
    cidades: await cidades.json(),
    tipos: await responseTipos.json(),
    codigos: await responseCodigos.json(),
    empresa: await empresa.json(),
  };
}

export default async function ListingStayPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { imoveis, estados, cidades, tipos, codigos, empresa, info } =
    await getData(searchParams);

  const totalPages = Math.ceil(imoveis.total / PAGE_SIZE);
  const pagina = Number(searchParams.pagina ?? "1");

  return (
    <div>
      <PropertyList
        imoveis={imoveis.nodes}
        estados={estados.nodes}
        cidades={Object.keys(cidades ?? {})}
        bairros={info.bairros_disponiveis}
        tipos={tipos}
        codigos={codigos}
        pages={totalPages}
        page={pagina}
        query={searchParams}
        pathname={"imoveis"}
        empresa={empresa}
      />
    </div>
  );
}
