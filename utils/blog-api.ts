import checkFetchStatus from "./checkFetchStatus";

const API_URI = process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
const EMPRESA_ID = process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

export interface BlogCategoria {
  id: string;
  nome: string;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  empresa_id?: string;
}

export interface Blog {
  id: string;
  titulo: string;
  conteudo: string;
  banner?: string;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  corretor_responsavel_id?: string;
  empresa_id?: string;
  categoria_id?: string;
  categoria?: BlogCategoria;
}

export interface BlogsResponse {
  nodes: Blog[];
  total: number;
}

// Buscar blogs paginados
export async function getBlogs(params?: URLSearchParams): Promise<BlogsResponse> {
  const defaultParams = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
    limit: "12",
    startAt: "0",
  });

  // Merge with provided params
  if (params) {
    params.forEach((value, key) => {
      defaultParams.set(key, value);
    });
  }

  const response = await fetch(
    `${API_URI}/blogs/paginado?${defaultParams.toString()}`,
    {
      next: { tags: ["blogs"], revalidate: 3600 },
    }
  );

  await checkFetchStatus(response, "blogs");
  return await response.json();
}

// Buscar blog por ID
export async function getBlogById(id: string): Promise<Blog> {
  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
  });

  const response = await fetch(
    `${API_URI}/blogs/${id}?${params.toString()}`,
    {
      next: { tags: ["blog-detail"], revalidate: 3600 },
    }
  );

  await checkFetchStatus(response, `blog/${id}`);
  return await response.json();
}

// Buscar categorias de blog
export async function getBlogCategorias(): Promise<BlogCategoria[]> {
  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
  });

  const response = await fetch(
    `${API_URI}/blog-categorias?${params.toString()}`,
    {
      next: { tags: ["blog-categorias"], revalidate: 3600 },
    }
  );

  await checkFetchStatus(response, "blog-categorias");
  return await response.json();
}

// Buscar blogs por categoria
export async function getBlogsByCategoria(
  categoriaId: string,
  limit = 12,
  startAt = 0
): Promise<BlogsResponse> {
  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
    limit: limit.toString(),
    startAt: startAt.toString(),
    filtros: JSON.stringify([
      { field: "blog.categoria_id", operator: "equal", value: categoriaId },
    ]),
  });

  return getBlogs(params);
}

// Buscar blogs relacionados
export async function getBlogsRelacionados(
  blogId: string,
  categoriaId?: string,
  limit = 4
): Promise<Blog[]> {
  const filtros: any[] = [
    { field: "blog.id", operator: "not_equal", value: blogId },
  ];

  if (categoriaId) {
    filtros.push({
      field: "blog.categoria_id",
      operator: "equal",
      value: categoriaId,
    });
  }

  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
    limit: limit.toString(),
    startAt: "0",
    filtros: JSON.stringify(filtros),
  });

  const response = await getBlogs(params);
  return response.nodes;
}

// Buscar blogs mais recentes
export async function getBlogsRecentes(limit = 6): Promise<Blog[]> {
  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
    limit: limit.toString(),
    startAt: "0",
    order: JSON.stringify([{ field: "blog.created_at", direction: "desc" }]),
  });

  const response = await getBlogs(params);
  return response.nodes;
}

// Buscar blogs com busca de texto
export async function searchBlogs(
  searchTerm: string,
  limit = 12,
  startAt = 0
): Promise<BlogsResponse> {
  const params = new URLSearchParams({
    empresa_id: EMPRESA_ID || "",
    limit: limit.toString(),
    startAt: startAt.toString(),
    search: searchTerm,
  });

  return getBlogs(params);
}

// Função para formatar data do blog
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Função para criar excerpt do conteúdo
export function createExcerpt(content: string, maxLength = 150): string {
  // Remove HTML tags se houver
  const textContent = content.replace(/<[^>]*>/g, "");
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).trim() + "...";
}

// Função para gerar slug do blog
export function generateBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}