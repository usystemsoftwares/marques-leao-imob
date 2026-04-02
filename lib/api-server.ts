'use server'

import { headers } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.smtximob.com"
// IMPORTANTE: Não usar variável global para evitar cache entre domínios diferentes na Vercel
// Cada requisição deve buscar seu próprio empresa_id

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // Revalidate every hour
    ...options,
  }

  const response = await fetch(url, defaultOptions)

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText} for URL: ${url}`)
    try {
      const errorData = await response.json()
      console.error("Error details:", errorData)
      throw new Error(`Erro na API: ${errorData.message || response.statusText}`)
    } catch (e) {
      throw new Error(`Erro na API: ${response.statusText}`)
    }
  }

  return response.json()
}

// Função para normalizar domínio removendo protocolo, www e porta
function normalizeDomain(domain: string): string {
  // Remove protocolo se houver
  let normalized = domain.replace(/^https?:\/\//, "")
  // Remove www se houver
  normalized = normalized.replace(/^www\./, "")
  // Remove porta se houver
  normalized = normalized.split(":")[0]
  // Remove barra final se houver
  normalized = normalized.replace(/\/$/, "")
  return normalized
}

// Função para obter empresa_id sem cache global
async function getEmpresaIdFromDomain(): Promise<string | null> {
  // Se tem empresa_id configurada via env (para desenvolvimento ou deploy único), usar ela
  if (process.env.NEXT_PUBLIC_EMPRESA_ID) {
    return process.env.NEXT_PUBLIC_EMPRESA_ID
  }

  // Em ambiente servidor, pegar o host do header
  const headersList = await headers()
  const host = headersList.get("host") || headersList.get("x-forwarded-host")

  if (!host) {
    console.error("Não foi possível obter o host dos headers")
    return null
  }

  // Normalizar o domínio
  const domain = normalizeDomain(host)

  try {
    console.log("Buscando empresa para o domínio (server):", domain)
    const site = await fetchAPI(`/site/domain/${encodeURIComponent(domain)}`)
    if (site?.empresa_id) {
      console.log("Empresa encontrada (server):", site.empresa_id, "para domínio:", domain)
      // Não armazenar em variável global!
      return site.empresa_id
    }
    console.warn("Nenhuma empresa encontrada para o domínio (server):", domain)
    return null
  } catch (error) {
    console.error("Erro ao buscar empresa por domínio (server):", error)
    return null
  }
}

export async function getEmpresaData() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  // Forçar revalidação por empresa para evitar cache cruzado entre domínios
  try {
    const response = await fetchAPI(`/empresas/site/${empresaId}`, {
      next: {
        tags: [`empresa-${empresaId}`],
        revalidate: 60, // Revalidar a cada minuto para garantir dados frescos
      },
    })
    return response;
  } catch(error) {
    console.error("error: ", error);
  }
}

export async function getImoveis(params: URLSearchParams) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  params.set("empresa_id", empresaId)
  return fetchAPI(`/imoveis/site/paginado?${params.toString()}`, {
    next: { tags: [`imoveis-${empresaId}`], revalidate: 3600 },
  })
}

export async function getImovelByCodigo(codigo: string) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  return fetchAPI(`/imoveis/site/codigo/${codigo}?empresa_id=${empresaId}&ocultarPendentes=true`, {
    next: { tags: [`imovel-${empresaId}-${codigo}`], revalidate: 3600 },
  })
}

export async function getBairrosPorCidade(cidadeId: string) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  console.log("[api-server] Buscando bairros para cidade ID:", cidadeId)
  console.log("[api-server] Empresa ID:", empresaId)

  const params = new URLSearchParams({
    empresa_id: empresaId,
    cidade_id: cidadeId,
  })

  try {
    const result = await fetchAPI(`/imoveis/bairros?${params.toString()}`, {
      next: { tags: ["bairros-cidade"], revalidate: 3600 },
    })
    console.log("[api-server] Resultado da API bairros por cidade:", result)

    // Se não retornou dados, tentar busca alternativa
    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.log("[api-server] Nenhum bairro encontrado, tentando busca alternativa...")

      // Buscar usando a API de bairros geral com filtro de cidade
      const filtros = [
        {
          field: "imovel.cidade_id",
          operator: "=",
          value: cidadeId,
        },
      ]

      const bairrosAlternativos = await getBairros(filtros)
      console.log("[api-server] Resultado da busca alternativa:", bairrosAlternativos)
      return bairrosAlternativos
    }

    return result
  } catch (error) {
    console.error("[api-server] Erro ao buscar bairros por cidade:", error)

    // Fallback: tentar busca alternativa em caso de erro
    try {
      console.log("[api-server] Tentando fallback com getBairros...")
      const filtros = [
        {
          field: "imovel.cidade_id",
          operator: "=",
          value: cidadeId,
        },
      ]

      const bairrosFallback = await getBairros(filtros)
      console.log("[api-server] Resultado do fallback:", bairrosFallback)
      return bairrosFallback
    } catch (fallbackError) {
      console.error("[api-server] Erro no fallback:", fallbackError)
      return []
    }
  }
}

export async function getFilterData() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const [info, cidades, tipos] = await Promise.all([
    fetchAPI(`/imoveis/info?empresa_id=${empresaId}`, { next: { tags: ["imoveis-info"], revalidate: 3600 } }),
    fetchAPI(`/imoveis/cidades/contagem?empresa_id=${empresaId}`, {
      next: { tags: ["imoveis-cidades"], revalidate: 3600 },
    }),
    fetchAPI(`/imoveis/tipos-empresa?empresa_id=${empresaId}`, {
      next: { tags: ["imoveis-tipos"], revalidate: 3600 },
    }),
  ])
  return { info, cidades, tipos }
}

export async function getCorretores() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  return fetchAPI(`/corretores?empresa_id=${empresaId}`, { next: { tags: ["corretores"], revalidate: 3600 } })
}

export async function getCorretor(corretorId: string) {
  console.log("Buscando corretor ID:", corretorId)
  try {
    const response = await fetchAPI(`/corretores/${corretorId}`, {
      next: {
        tags: [`corretor-${corretorId}`],
        revalidate: 3600,
      },
    })
    console.log("Resposta da API para corretor:", response)
    return response
  } catch (error) {
    console.error("Erro na função getCorretor:", error)
    throw error
  }
}

// Adicionar funções de filtros que precisam do empresa_id
export async function getTipos() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const params = new URLSearchParams({
    empresa_id: empresaId,
    site: "1",
  })
  const data = await fetchAPI(`/tipos?${params.toString()}`, {
    next: { tags: ["imoveis-info", "imoveis-tipos"], revalidate: 3600 },
  })
  console.log("Tipos fetched:")
  return data
}

export async function getCidades() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const params = new URLSearchParams({
    empresa_id: empresaId,
    site: "1",
  })
  return fetchAPI(`/cidades?${params.toString()}`, {
    next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
  })
}

export async function getBairros(filtros: any[] = []) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const params = new URLSearchParams({
    limit: "50",
    startAt: "0",
    empresa_id: empresaId,
    filtros: JSON.stringify(filtros),
  })
  return fetchAPI(`/imoveis/bairros-por-cidade?${params.toString()}`, {
    next: { tags: ["imoveis-info"], revalidate: 3600 },
  })
}

export async function getCaracteristicas() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const params = new URLSearchParams({
    empresa_id: empresaId,
  })
  return fetchAPI(`/caracteristicas?${params.toString()}`, {
    next: { tags: ["imoveis-info", "caracteristicas"], revalidate: 3600 },
  })
}

// Funções de blog
export async function getBlogs(params?: URLSearchParams) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  if (!params) {
    params = new URLSearchParams()
  }

  // Adicionar empresa_id se não estiver presente
  if (!params.has("empresa_id")) {
    params.append("empresa_id", empresaId)
  }

  return fetchAPI(`/blogs/paginado?${params.toString()}`, {
    next: { tags: ["blogs"], revalidate: 1800 }, // Revalidate every 30 minutes
  })
}

export async function getBlog(id: string) {
  return fetchAPI(`/blogs/${id}`, {
    next: { tags: ["blog-detail"], revalidate: 1800 },
  })
}

export async function getBlogsByCategoria(categoriaId: string, limit = 12, startAt = 0) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const filtros = [{ field: "blog.categoria_id", operator: "equal", value: categoriaId }]

  const params = new URLSearchParams({
    empresa_id: empresaId,
    limit: limit.toString(),
    startAt: startAt.toString(),
    filtros: JSON.stringify(filtros),
    order: JSON.stringify([{ field: "blog.created_at", order: "DESC" }]),
  })

  return fetchAPI(`/blogs/paginado?${params.toString()}`, {
    next: { tags: ["blogs-categoria"], revalidate: 1800 },
  })
}

export async function getBlogCategorias() {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const params = new URLSearchParams({
    empresa_id: empresaId,
    order: JSON.stringify([{ field: "nome", order: "ASC" }]),
  })

  return fetchAPI(`/blog-categorias?${params.toString()}`, {
    next: { tags: ["blog-categorias"], revalidate: 3600 },
  })
}

export async function getBlogCategoria(id: string) {
  return fetchAPI(`/blog-categorias/${id}`, {
    next: { tags: ["blog-categoria-detail"], revalidate: 3600 },
  })
}

export async function getBlogsRecentes(limit = 6) {
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error(
      "Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.",
    )
  }

  const params = new URLSearchParams({
    empresa_id: empresaId,
    limit: limit.toString(),
    startAt: "0",
    order: JSON.stringify([{ field: "blog.created_at", order: "DESC" }]),
  })

  return fetchAPI(`/blogs/paginado?${params.toString()}`, {
    next: { tags: ["blogs-recentes"], revalidate: 1800 },
  })
}

// Re-export utility functions from main api.ts
export { formatPrice, getFotoDestaque, getImovelTitulo, mapTiposSimilares, getTiposEmpresa } from "./api"
