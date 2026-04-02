import { MetadataRoute } from 'next';
import { generatePropertySlug } from '@/utils/seo-utils';

async function getProperties() {
  const uri = process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id = process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  
  try {
    const params = new URLSearchParams({
      empresa_id: empresa_id as string,
      limit: '100', // Limitar a 100 imóveis principais para performance
      startAt: '0',
    });
    
    const response = await fetch(
      `${uri}/imoveis/site/paginado?${params.toString()}`,
      { next: { revalidate: 3600 } } // Revalidar a cada hora
    );
    
    if (!response.ok) {
      console.error('Failed to fetch properties for sitemap');
      return [];
    }
    
    const data = await response.json();
    return data.nodes || [];
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
}

async function getCities() {
  const uri = process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
  const empresa_id = process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  
  try {
    const params = new URLSearchParams({
      empresa_id: empresa_id as string,
      site: '1',
    });
    
    const response = await fetch(
      `${uri}/cidades?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch cities for sitemap');
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cities for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marqueseleao.com.br';
  
  // Páginas estáticas principais
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/equipe`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/anunciar-imovel`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // Buscar imóveis dinamicamente
  const properties = await getProperties();
  const propertyPages: MetadataRoute.Sitemap = properties.map((property: any) => ({
    url: `${baseUrl}/imovel/${generatePropertySlug(property)}`,
    lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Buscar cidades para páginas de busca
  const cities = await getCities();
  const cityPages: MetadataRoute.Sitemap = cities.slice(0, 10).map((city: any) => ({
    url: `${baseUrl}/imoveis?cidade=${encodeURIComponent(city.nome)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));
  
  return [
    ...staticPages,
    ...propertyPages,
    ...cityPages,
  ];
}