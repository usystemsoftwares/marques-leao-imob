import slugify from 'slugify';
import { Imóvel, Empresa } from "smart-imob-types";

/**
 * Generate SEO-friendly URL slug for property
 */
export function generatePropertySlug(imovel: Imóvel): string {
  const parts = [];
  
  // Tipo do imóvel
  if (imovel.tipo) {
    parts.push(slugify(imovel.tipo, { lower: true, strict: true, locale: 'pt' }));
  }
  
  // Transação (venda/locacao)
  if (imovel.venda) {
    parts.push('venda');
  } else if (imovel.locação) {
    parts.push('locacao');
  }
  
  // Bairro
  if (imovel.bairro) {
    parts.push(slugify(imovel.bairro, { lower: true, strict: true, locale: 'pt' }));
  }
  
  // Cidade
  if (imovel.cidade?.nome) {
    parts.push(slugify(imovel.cidade.nome, { lower: true, strict: true, locale: 'pt' }));
  }
  
  // Características principais para diferenciação
  if (imovel.dormitórios) {
    parts.push(`${imovel.dormitórios}-quartos`);
  }
  
  if (imovel.area_privativa || imovel.area_terreno) {
    const area = imovel.area_privativa || imovel.area_terreno;
    parts.push(`${area}m2`);
  }
  
  // Código único no final
  parts.push(imovel.codigo);
  
  return parts.join('-');
}

/**
 * Generate optimized meta title for property
 */
export function generatePropertyTitle(imovel: Imóvel, empresa: Empresa): string {
  const parts = [];
  
  // Tipo e características principais
  if (imovel.tipo) {
    parts.push(imovel.tipo);
  }
  
  if (imovel.dormitórios && !imovel.não_mostrar_dormítorios) {
    parts.push(`${imovel.dormitórios} dormitórios`);
  }
  
  // Localização
  if (imovel.bairro && imovel.cidade?.nome) {
    parts.push(`em ${imovel.bairro}, ${imovel.cidade.nome}`);
  }
  
  // Marca
  parts.push('| MARQUES & LEÃO');
  
  const title = parts.join(' ');
  
  // Limitar a 60 caracteres conforme recomendação SEO
  return title.length > 60 ? title.substring(0, 57) + '...' : title;
}

/**
 * Generate optimized meta description for property
 */
export function generatePropertyDescription(imovel: Imóvel): string {
  const features = [];
  
  // Tipo e transação
  if (imovel.tipo) {
    const transaction = imovel.venda ? 'à venda' : imovel.locação ? 'para locação' : '';
    features.push(`${imovel.tipo} ${transaction}`);
  }
  
  // Localização
  if (imovel.bairro && imovel.cidade?.nome) {
    features.push(`em ${imovel.bairro}, ${imovel.cidade.nome}`);
  }
  
  // Características principais
  const specs = [];
  if (imovel.dormitórios && !imovel.não_mostrar_dormítorios) {
    specs.push(`${imovel.dormitórios} quartos`);
  }
  if (imovel.suítes) {
    specs.push(`${imovel.suítes} suítes`);
  }
  if (imovel.vagas) {
    specs.push(`${imovel.vagas} vagas`);
  }
  if (imovel.area_privativa) {
    specs.push(`${imovel.area_privativa}m²`);
  }
  
  if (specs.length > 0) {
    features.push(`com ${specs.join(', ')}`);
  }
  
  // Diferenciais para imóveis de alto padrão
  const luxuryFeatures: any = [];
  if (imovel.caracteristicas) {
    const luxuryKeywords = ['piscina', 'churrasqueira', 'lareira', 'closet', 'spa', 'sauna', 'home theater'];
    imovel.caracteristicas.forEach(carac => {
      if (luxuryKeywords.some(keyword => carac.nome.toLowerCase().includes(keyword))) {
        luxuryFeatures.push(carac.nome);
      }
    });
  }
  
  if (luxuryFeatures.length > 0) {
    features.push(`Diferenciais: ${luxuryFeatures.slice(0, 3).join(', ')}`);
  }
  
  const description = features.join('. ') + '. Agende sua visita!';
  
  // Limitar a 160 caracteres conforme recomendação SEO
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
}

/**
 * Generate structured data for property listing
 */
export function generatePropertyStructuredData(imovel: Imóvel, empresa: Empresa) {
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": imovel.titulo || generatePropertyTitle(imovel, empresa),
    "description": imovel.descrição || generatePropertyDescription(imovel),
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.marqueseleao.com.br'}/imovel/${generatePropertySlug(imovel)}`
  };
  
  // Preço
  if (imovel.venda && imovel.preço_venda && imovel.venda_exibir_valor_no_site !== false) {
    structuredData.offers = {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": imovel.preço_venda_desconto || imovel.preço_venda,
      "availability": "https://schema.org/InStock"
    };
  }
  
  // Endereço
  if (imovel.cidade || imovel.bairro) {
    structuredData.address = {
      "@type": "PostalAddress",
      "addressLocality": imovel.cidade?.nome,
      "addressRegion": imovel.estado?.nome || "RS",
      "addressCountry": "BR",
      "neighborhood": imovel.bairro
    };
  }
  
  // Características do imóvel
  const accommodation: any = {
    "@type": "Accommodation"
  };
  
  if (imovel.dormitórios && !imovel.não_mostrar_dormítorios) {
    accommodation.numberOfRooms = imovel.dormitórios;
  }
  
  if (imovel.banheiros) {
    accommodation.numberOfBathroomsTotal = imovel.banheiros;
  }
  
  if (imovel.area_privativa || imovel.area_terreno) {
    accommodation.floorSize = {
      "@type": "QuantitativeValue",
      "value": imovel.area_privativa || imovel.area_terreno,
      "unitCode": "MTK"
    };
  }
  
  structuredData.accommodation = accommodation;
  
  // Imagens
  if (imovel.fotos && imovel.fotos.length > 0) {
    structuredData.image = imovel.fotos.map(foto => foto.source?.uri).filter(Boolean);
  }
  
  // Agente/Corretor
  if (empresa) {
    structuredData.seller = {
      "@type": "RealEstateAgent",
      "name": "MARQUES & LEÃO Imobiliária",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.marqueseleao.com.br",
      "telephone": empresa.telefone || empresa.telefone_empresa || "",
    };
  }
  
  return structuredData;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate keywords for luxury real estate
 */
export function generateLuxuryKeywords(cidade?: string, bairro?: string): string[] {
  const baseKeywords = [
    "casas de alto padrão",
    "imóveis de luxo",
    "residências exclusivas",
    "casas com piscina",
    "imóveis premium",
    "mansões",
    "casas de luxo à venda",
    "imóveis alto padrão",
    "condomínio fechado",
    "casa com acabamento em mármore",
    "imóvel com design moderno",
    "casa com lareira",
    "residência com churrasqueira",
    "casa com closet",
    "imóvel com localização privilegiada"
  ];
  
  const keywords = [...baseKeywords];
  
  if (cidade) {
    keywords.push(
      `casas de luxo em ${cidade}`,
      `imóveis de alto padrão em ${cidade}`,
      `casas à venda em ${cidade}`,
      `comprar casa em ${cidade}`
    );
  }
  
  if (bairro) {
    keywords.push(
      `casas no bairro ${bairro}`,
      `imóveis em ${bairro}`,
      `residências em ${bairro}`
    );
  }
  
  // Bairros específicos de Novo Hamburgo mencionados no PDF
  if (cidade === "Novo Hamburgo") {
    keywords.push(
      "Hamburgo Velho",
      "Lomba Grande",
      "casas em Hamburgo Velho",
      "imóveis em Lomba Grande",
      "residências de luxo em Hamburgo Velho",
      "casas de alto padrão em Lomba Grande"
    );
  }
  
  return keywords;
}