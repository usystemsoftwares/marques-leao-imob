// CDN completely removed - no getCdnUrl function needed

const API_URL = "https://api.smtximob.com"
let EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID

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
  let normalized = domain.replace(/^https?:\/\//, '')
  // Remove www se houver
  normalized = normalized.replace(/^www\./, '')
  // Remove porta se houver
  normalized = normalized.split(':')[0]
  // Remove barra final se houver
  normalized = normalized.replace(/\/$/, '')
  return normalized
}

async function getEmpresaIdFromDomain(): Promise<string | null> {
  // Esta função só funciona no cliente
  if (typeof window === 'undefined') {
    console.warn('getEmpresaIdFromDomain chamado no servidor. Use api-server.ts para renderização server-side.')
    return null
  }
  
  const rawDomain = window.location.hostname
  const domain = normalizeDomain(rawDomain)
  try {
    console.log('Buscando empresa para o domínio:', domain)
    const site = await fetchAPI(`/site/domain/${encodeURIComponent(domain)}`)
    if (site?.empresa_id) {
      EMPRESA_ID = site.empresa_id
      // Salvar no sessionStorage para uso posterior
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('empresa_id', site.empresa_id)
      }
      console.log('Empresa encontrada:', site.empresa_id)
      return site.empresa_id
    }
    console.warn('Nenhuma empresa encontrada para o domínio:', domain)
    return null
  } catch (error) {
    console.error('Erro ao buscar empresa por domínio:', error)
    return null
  }
}

// Tentar recuperar do sessionStorage se disponível
if (typeof window !== 'undefined' && !EMPRESA_ID) {
  const savedEmpresaId = sessionStorage.getItem('empresa_id')
  if (savedEmpresaId) {
    EMPRESA_ID = savedEmpresaId
  }
}

// Função auxiliar para garantir que temos empresa_id
async function ensureEmpresaId(): Promise<string> {
  if (EMPRESA_ID) {
    return EMPRESA_ID
  }
  
  // Tentar recuperar do sessionStorage
  if (typeof window !== 'undefined') {
    const savedEmpresaId = sessionStorage.getItem('empresa_id')
    if (savedEmpresaId) {
      EMPRESA_ID = savedEmpresaId
      return savedEmpresaId
    }
  }
  
  // Buscar por domínio
  const empresaId = await getEmpresaIdFromDomain()
  if (!empresaId) {
    throw new Error("Não foi possível identificar a empresa. Configure NEXT_PUBLIC_EMPRESA_ID ou use um domínio cadastrado.")
  }
  
  EMPRESA_ID = empresaId
  return empresaId
}

export async function getEmpresaData() {
  const empresaId = await ensureEmpresaId()
  return fetchAPI(`/empresas/site/${empresaId}`, { next: { tags: ["empresas"] } })
}

export async function getImoveis(params: URLSearchParams) {
  const empresaId = await ensureEmpresaId()
  params.set("empresa_id", empresaId)
  
  // Se há código, buscar por código específico
  const codigo = params.get('codigo')
  if (codigo) {
    // Limitar a 1 resultado quando busca por código
    params.set('limit', '1')
    params.set('codigo', codigo)
  }
  
  return fetchAPI(`/imoveis/site/paginado?${params.toString()}`, {
    next: { tags: ["imoveis"], revalidate: 3600 },
  })
}

export async function getCodigosDisponiveis(empresaId: string) {
  return fetchAPI(`/imoveis/codigos-disponiveis?empresa_id=${empresaId}`, {
    next: { tags: ["imoveis-codigos"], revalidate: 3600 },
  })
}

export async function getImovelByCodigo(codigo: string) {
  const empresaId = await ensureEmpresaId()
  return fetchAPI(`/imoveis/site/codigo/${codigo}?empresa_id=${empresaId}&ocultarPendentes=true`, {
    next: { tags: [`imovel-${codigo}`], revalidate: 3600 },
  })
}

export async function getFilterData() {
  const empresaId = await ensureEmpresaId()
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
  const empresaId = await ensureEmpresaId()
  return fetchAPI(`/corretores?empresa_id=${empresaId}`, { next: { tags: ["corretores"], revalidate: 3600 } })
}

export async function getCorretor(corretorId: string) {
  console.log("Buscando corretor ID:", corretorId);
  try {
    const response = await fetchAPI(`/corretores/${corretorId}`, { 
      next: { 
        tags: [`corretor-${corretorId}`], 
        revalidate: 3600 
      } 
    });
    console.log("Resposta da API para corretor:", response);
    return response;
  } catch (error) {
    console.error("Erro na função getCorretor:", error);
    throw error;
  }
}

// Utility Functions
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "Consulte"
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getFotoDestaque(imovel: any, useSmallSize = false): string {
  if (!imovel?.fotos || !Array.isArray(imovel.fotos) || imovel.fotos.length === 0) {
    return "/placeholder.svg"
  }

  // Prioridade de seleção da foto:
  // 1. Foto com destaque = true
  // 2. Se não houver, foto com menor order (ordenar por order crescente)
  // 3. Se não houver order, primeira foto com URI válida
  
  let fotoEscolhida = imovel.fotos.find((foto: any) => foto.destaque === true)
  
  // Se não encontrou foto com destaque, buscar por order
  if (!fotoEscolhida) {
    // Cria cópia do array para não modificar o original
    const fotosOrdenadas = [...imovel.fotos].sort((a: any, b: any) => {
      // Se uma foto tem order e outra não, a que tem order vem primeiro
      const orderA = a.order !== undefined && a.order !== null ? a.order : 999999
      const orderB = b.order !== undefined && b.order !== null ? b.order : 999999
      return orderA - orderB
    })
    
    // Pega a primeira foto após ordenação (menor order ou primeira sem order)
    fotoEscolhida = fotosOrdenadas[0]
  }
  
  if (useSmallSize) {
    // Para imagens pequenas (cards, thumbnails), usar resized (410px) se disponível
    // Nota: resized é uma string direta com a URL, não um objeto
    if (fotoEscolhida?.resized && typeof fotoEscolhida.resized === 'string') {
      return fotoEscolhida.resized
    }
  }

  // Para imagens normais ou quando não há versão redimensionada
  if (fotoEscolhida?.source?.uri) {
    return optimizeImageForWhatsApp(fotoEscolhida.source.uri)
  }

  // Se a foto escolhida não tem URI válida, buscar primeira com URI válida
  const primeiraFotoComUri = imovel.fotos.find((foto: any) => foto.source?.uri)
  if (primeiraFotoComUri?.source?.uri) {
    return optimizeImageForWhatsApp(primeiraFotoComUri.source.uri)
  }

  return "/placeholder.svg"
}

// Função para gerar título do imóvel com fallback
export function getImovelTitulo(imovel: any): string {
  return (
    imovel.titulo ??
    (imovel.tipo || imovel.bairro || imovel.cidade?.nome
      ? `${imovel.tipo ? imovel.tipo : ""} ${imovel.bairro ? "no bairro " + imovel.bairro : ""} ${
          imovel.cidade?.nome ? "em " + imovel.cidade.nome : ""
        }`.trim()
      : `#${imovel.codigo}`)
  )
}

// Novas funções seguindo o padrão do side-filter-menu
export async function getTipos() {
  const empresaId = await ensureEmpresaId()
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

// Função para buscar tipos de imóveis específicos da empresa
export async function getTiposEmpresa() {
  const empresaId = await ensureEmpresaId()
  return fetchAPI(`/imoveis/tipos-empresa?empresa_id=${empresaId}`, {
    next: { tags: ["imoveis-tipos"], revalidate: 3600 },
  })
}

// Função para mapear tipos similares
export function mapTiposSimilares(tipos: string[]): Map<string, string[]> {
  const tiposMap = new Map<string, string[]>()

  // Padrões de similaridade para cada tipo principal
  const padroes = {
    apartamento: [
      "apartamento",
      "apto",
      "flat",
      "studio",
      "kitnet",
      "loft",
      "duplex",
      "triplex",
      "cobertura duplex",
      "garden",
    ],
    casa: ["casa", "sobrado", "vila", "chalé", "residência", "moradia"],
    cobertura: ["cobertura", "penthouse", "duplex cobertura", "triplex cobertura"],
    terreno: ["terreno", "lote", "área", "gleba"],
    sala: ["sala", "conjunto", "escritório", "consultório"],
    loja: ["loja", "ponto comercial", "box", "quiosque"],
    galpao: ["galpão", "barracão", "depósito", "armazém", "pavilhão"],
    chacara: ["chácara", "sítio", "fazenda", "rancho", "propriedade rural"],
    predio: ["prédio", "edifício", "prédio comercial", "prédio residencial"],
  }

  // Para cada tipo encontrado, verificar em qual categoria ele se encaixa
  tipos.forEach((tipo) => {
    const tipoLower = tipo.toLowerCase()

    for (const [categoria, palavrasChave] of Object.entries(padroes)) {
      if (palavrasChave.some((palavra) => tipoLower.includes(palavra))) {
        if (!tiposMap.has(categoria)) {
          tiposMap.set(categoria, [])
        }
        tiposMap.get(categoria)!.push(tipo)
        break // Tipo já foi categorizado, não precisa continuar
      }
    }
  })

  return tiposMap
}

export async function getCidades() {
  const empresaId = await ensureEmpresaId()
  const params = new URLSearchParams({
    empresa_id: empresaId,
    site: "1",
  })
  return fetchAPI(`/cidades?${params.toString()}`, {
    next: { tags: ["imoveis-info", "imoveis-cidades"], revalidate: 3600 },
  })
}

export async function getBairros(filtros: any[] = []) {
  const empresaId = await ensureEmpresaId()
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

export async function getBairrosPorCidade(cidadeId: string) {
  const empresaId = await ensureEmpresaId()
  console.log("[v0] Buscando bairros para cidade ID:", cidadeId)
  console.log("[v0] Empresa ID:", empresaId)

  const params = new URLSearchParams({
    empresa_id: empresaId,
    cidade_id: cidadeId,
  })

  try {
    const result = await fetchAPI(`/imoveis/bairros?${params.toString()}`, {
      next: { tags: ["bairros-cidade"], revalidate: 3600 },
    })
    console.log("[v0] Resultado da API bairros por cidade:", result)

    // Se não retornou dados, tentar busca alternativa
    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.log("[v0] Nenhum bairro encontrado, tentando busca alternativa...")

      // Buscar usando a API de bairros geral com filtro de cidade
      const filtros = [
        {
          field: "imovel.cidade_id",
          operator: "=",
          value: cidadeId,
        },
      ]

      const bairrosAlternativos = await getBairros(filtros)
      console.log("[v0] Resultado da busca alternativa:", bairrosAlternativos)
      return bairrosAlternativos
    }

    return result
  } catch (error) {
    console.error("[v0] Erro ao buscar bairros por cidade:", error)

    // Fallback: tentar busca alternativa em caso de erro
    try {
      console.log("[v0] Tentando fallback com getBairros...")
      const filtros = [
        {
          field: "imovel.cidade_id",
          operator: "=",
          value: cidadeId,
        },
      ]

      const bairrosFallback = await getBairros(filtros)
      console.log("[v0] Resultado do fallback:", bairrosFallback)
      return bairrosFallback
    } catch (fallbackError) {
      console.error("[v0] Erro no fallback:", fallbackError)
      return []
    }
  }
}

export async function getCaracteristicas() {
  const empresaId = await ensureEmpresaId()
  const params = new URLSearchParams({
    empresa_id: empresaId,
  })
  return fetchAPI(`/caracteristicas?${params.toString()}`, {
    next: { tags: ["imoveis-info", "caracteristicas"], revalidate: 3600 },
  })
}

// ========== FUNÇÕES DE BLOGS ==========

export async function getBlogs(params?: URLSearchParams) {
  const empresaId = await ensureEmpresaId()
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
  const empresaId = await ensureEmpresaId()
  const filtros = [
    { field: "blog.categoria_id", operator: "equal", value: categoriaId }
  ]
  
  const params = new URLSearchParams({
    empresa_id: empresaId,
    limit: limit.toString(),
    startAt: startAt.toString(),
    filtros: JSON.stringify(filtros),
    order: JSON.stringify([{ field: "blog.created_at", order: "DESC" }])
  })
  
  return fetchAPI(`/blogs/paginado?${params.toString()}`, {
    next: { tags: ["blogs-categoria"], revalidate: 1800 },
  })
}

export async function getBlogCategorias() {
  const empresaId = await ensureEmpresaId()
  const params = new URLSearchParams({
    empresa_id: empresaId,
    order: JSON.stringify([{ field: "nome", order: "ASC" }])
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
  const empresaId = await ensureEmpresaId()
  const params = new URLSearchParams({
    empresa_id: empresaId,
    limit: limit.toString(),
    startAt: "0",
    order: JSON.stringify([{ field: "blog.created_at", order: "DESC" }])
  })
  
  return fetchAPI(`/blogs/paginado?${params.toString()}`, {
    next: { tags: ["blogs-recentes"], revalidate: 1800 },
  })
}

function optimizeImageForWhatsApp(imageUrl: string): string {
  try {
    const url = new URL(imageUrl)

    // Remover parâmetros desnecessários que podem causar problemas
    const paramsToRemove = ["cache", "timestamp", "token", "auth"]
    paramsToRemove.forEach((param) => url.searchParams.delete(param))

    // Adicionar parâmetros de otimização para reduzir o tamanho
    // Usar dimensões menores mas que ainda funcionem no WhatsApp (mínimo 300x300)
    url.searchParams.set("w", "400")
    url.searchParams.set("h", "300")
    url.searchParams.set("q", "70") // Qualidade reduzida para menor tamanho
    url.searchParams.set("f", "jpg") // Forçar formato JPG que é menor

    return url.toString()
  } catch (error) {
    // Se houver erro ao processar a URL, retornar a original
    return imageUrl
  }
}
