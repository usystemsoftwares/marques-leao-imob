import { Imóvel } from "smart-imob-types";

/**
 * Gera uma descrição rica e otimizada para SEO de um imóvel
 * com no mínimo 300 palavras focando em características de alto padrão
 */
export function generateRichDescription(imovel: Imóvel): string {
  const sections: string[] = [];
  
  // Introdução elegante
  const intro = generateIntroduction(imovel);
  sections.push(intro);
  
  // Localização privilegiada
  if (imovel.bairro || imovel.cidade) {
    const location = generateLocationSection(imovel);
    sections.push(location);
  }
  
  // Características do imóvel
  const features = generateFeaturesSection(imovel);
  sections.push(features);
  
  // Diferenciais de luxo
  if (imovel.caracteristicas && imovel.caracteristicas.length > 0) {
    const luxury = generateLuxurySection(imovel);
    sections.push(luxury);
  }
  
  // Conforto e praticidade
  const comfort = generateComfortSection(imovel);
  sections.push(comfort);
  
  // Call to action
  const cta = generateCallToAction(imovel);
  sections.push(cta);
  
  return sections.join('\n\n');
}

function generateIntroduction(imovel: Imóvel): string {
  const tipo = imovel.tipo || 'Imóvel';
  const transacao = imovel.venda ? 'à venda' : imovel.locação ? 'para locação' : '';
  
  const intros = [
    `Apresentamos esta magnífica ${tipo.toLowerCase()} ${transacao}, uma verdadeira obra-prima arquitetônica que redefine o conceito de moradia de alto padrão em Novo Hamburgo.`,
    `Esta exclusiva ${tipo.toLowerCase()} ${transacao} representa o ápice do luxo e sofisticação, oferecendo um estilo de vida incomparável em uma das regiões mais nobres da cidade.`,
    `Descubra esta espetacular ${tipo.toLowerCase()} ${transacao}, onde cada detalhe foi meticulosamente planejado para proporcionar uma experiência residencial única e inesquecível.`
  ];
  
  return intros[Math.floor(Math.random() * intros.length)];
}

function generateLocationSection(imovel: Imóvel): string {
  const bairro = imovel.bairro;
  const cidade = imovel.cidade?.nome || 'Novo Hamburgo';
  
  const locationTexts = {
    'Hamburgo Velho': `Localizada no prestigiado bairro Hamburgo Velho, uma das regiões mais tradicionais e valorizadas de ${cidade}, esta propriedade oferece o equilíbrio perfeito entre a tranquilidade residencial e a proximidade às principais conveniências urbanas. O bairro é conhecido por suas ruas arborizadas, arquitetura preservada e atmosfera exclusiva que atrai famílias que buscam qualidade de vida superior.`,
    'Lomba Grande': `Situada em Lomba Grande, um dos bairros mais exclusivos de ${cidade}, esta residência proporciona um refúgio de paz e privacidade sem abrir mão da praticidade urbana. A região é famosa por suas amplas áreas verdes, terrenos generosos e vizinhança selecionada, criando um ambiente ideal para quem valoriza espaço, natureza e segurança.`,
    'default': `Estrategicamente localizada em ${bairro || 'uma região nobre'} de ${cidade}, esta propriedade oferece fácil acesso aos principais pontos da cidade, incluindo centros comerciais, escolas de prestígio, hospitais e áreas de lazer. A vizinhança tranquila e bem estabelecida garante privacidade e segurança, elementos essenciais para uma vida familiar harmoniosa.`
  };
  
  return locationTexts[bairro as keyof typeof locationTexts] || locationTexts.default;
}

function generateFeaturesSection(imovel: Imóvel): string {
  const features: string[] = [];
  
  // Área
  if (imovel.area_privativa || imovel.area_terreno) {
    const area = imovel.area_privativa || imovel.area_terreno;
    features.push(`Com impressionantes ${area}m² de área ${imovel.area_privativa ? 'privativa' : 'de terreno'}, este imóvel oferece espaços amplos e bem distribuídos que proporcionam conforto excepcional para toda a família.`);
  }
  
  // Dormitórios e suítes
  if (imovel.dormitórios && !imovel.não_mostrar_dormítorios) {
    let dormText = `A residência conta com ${imovel.dormitórios} dormitórios espaçosos`;
    if (imovel.suítes) {
      dormText += `, sendo ${imovel.suítes} suíte${imovel.suítes > 1 ? 's' : ''} master com acabamento premium, closet e banheiro privativo com hidromassagem`;
    }
    dormText += `. Cada ambiente foi projetado para maximizar o conforto e a privacidade, com excelente iluminação natural e ventilação cruzada.`;
    features.push(dormText);
  }
  
  // Vagas de garagem
  if (imovel.vagas) {
    features.push(`Para sua comodidade, o imóvel dispõe de ${imovel.vagas} vaga${imovel.vagas > 1 ? 's' : ''} de garagem cobertas, com espaço adicional para visitantes e área de manobra confortável.`);
  }
  
  // Banheiros
  if (imovel.banheiros) {
    features.push(`Os ${imovel.banheiros} banheiros apresentam acabamento em mármore importado, metais e louças de grife, além de box em vidro temperado e design contemporâneo que une funcionalidade e elegância.`);
  }
  
  return features.join(' ');
}

function generateLuxurySection(imovel: Imóvel): string {
  const luxuryFeatures: string[] = [];
  const caracteristicas = imovel.caracteristicas || [];
  
  // Mapeamento de características para descrições elaboradas
  const featureDescriptions: { [key: string]: string } = {
    'piscina': 'piscina aquecida com sistema de tratamento automatizado e deck em madeira nobre',
    'churrasqueira': 'churrasqueira gourmet completa com forno de pizza e área de preparo',
    'lareira': 'lareira a lenha com revestimento em pedra natural, criando um ambiente acolhedor',
    'closet': 'closet planejado com iluminação especial e organização inteligente',
    'spa': 'spa privativo com hidromassagem e área de relaxamento',
    'sauna': 'sauna seca ou úmida com controle digital de temperatura',
    'home theater': 'home theater com isolamento acústico e sistema de som surround',
    'adega': 'adega climatizada com capacidade para coleções especiais',
    'academia': 'academia privativa equipada com aparelhos modernos',
    'jardim': 'jardim paisagístico com projeto de iluminação cênica',
    'energia solar': 'sistema de energia solar fotovoltaica para economia e sustentabilidade',
    'automação': 'sistema de automação residencial para controle inteligente de iluminação e climatização'
  };
  
  caracteristicas.forEach(carac => {
    const nome = carac.nome.toLowerCase();
    for (const [key, description] of Object.entries(featureDescriptions)) {
      if (nome.includes(key)) {
        luxuryFeatures.push(description);
        break;
      }
    }
  });
  
  if (luxuryFeatures.length > 0) {
    return `Entre os diferenciais exclusivos desta propriedade, destacam-se: ${luxuryFeatures.join(', ')}. Cada um desses elementos foi cuidadosamente integrado ao projeto para proporcionar uma experiência de vida verdadeiramente luxuosa e conveniente.`;
  }
  
  return 'Este imóvel apresenta acabamentos de altíssimo padrão, com materiais nobres selecionados criteriosamente, incluindo mármore italiano, madeiras de lei e metais com acabamento especial, garantindo durabilidade e sofisticação em cada detalhe.';
}

function generateComfortSection(imovel: Imóvel): string {
  const comfortTexts = [
    'O projeto arquitetônico privilegia a integração entre os ambientes, criando espaços fluidos e versáteis que se adaptam às diferentes necessidades do dia a dia. A iluminação natural abundante e a ventilação cruzada garantem conforto térmico e bem-estar em todas as estações do ano.',
    'Cada ambiente foi pensado para proporcionar o máximo de conforto e praticidade. Os acabamentos de primeira linha, aliados ao design inteligente, criam uma atmosfera de sofisticação discreta que encanta à primeira vista e surpreende nos detalhes.',
    'A disposição inteligente dos ambientes favorece tanto a convivência familiar quanto a privacidade individual. Os espaços generosos permitem múltiplas configurações de mobiliário, adaptando-se perfeitamente ao estilo de vida contemporâneo.'
  ];
  
  return comfortTexts[Math.floor(Math.random() * comfortTexts.length)];
}

function generateCallToAction(imovel: Imóvel): string {
  const ctas = [
    'Esta é uma oportunidade única de adquirir um imóvel de padrão excepcional em uma das localizações mais desejadas de Novo Hamburgo. Agende sua visita e permita-se vivenciar pessoalmente todos os detalhes que tornam esta propriedade verdadeiramente especial.',
    'Não perca a chance de conhecer este imóvel extraordinário que redefine os padrões de luxo e conforto. Entre em contato conosco para agendar uma visita exclusiva e descobrir como esta residência pode transformar seu estilo de vida.',
    'Venha descobrir pessoalmente por que este imóvel se destaca no mercado de alto padrão. Nossa equipe especializada está pronta para apresentar cada detalhe desta propriedade única e auxiliá-lo em todos os aspectos da negociação.'
  ];
  
  return ctas[Math.floor(Math.random() * ctas.length)];
}

/**
 * Gera meta description otimizada para SEO (até 160 caracteres)
 * focada em características de luxo
 */
export function generateLuxuryMetaDescription(imovel: Imóvel): string {
  const tipo = imovel.tipo || 'Imóvel';
  const bairro = imovel.bairro || '';
  const cidade = imovel.cidade?.nome || 'Novo Hamburgo';
  
  const features: string[] = [];
  
  if (imovel.dormitórios && !imovel.não_mostrar_dormítorios) {
    features.push(`${imovel.dormitórios} quartos`);
  }
  if (imovel.suítes) {
    features.push(`${imovel.suítes} suítes`);
  }
  if (imovel.area_privativa || imovel.area_terreno) {
    features.push(`${imovel.area_privativa || imovel.area_terreno}m²`);
  }
  
  // Buscar características de luxo
  const luxuryKeywords = ['piscina', 'churrasqueira', 'lareira', 'closet'];
  const hasLuxury = imovel.caracteristicas?.some(c => 
    luxuryKeywords.some(k => c.nome.toLowerCase().includes(k))
  );
  
  let description = `${tipo} de alto padrão`;
  if (features.length > 0) {
    description += ` com ${features.join(', ')}`;
  }
  if (bairro) {
    description += ` em ${bairro}`;
  }
  description += `, ${cidade}.`;
  
  if (hasLuxury) {
    description += ' Acabamento de luxo, localização privilegiada.';
  }
  
  description += ' Agende visita!';
  
  // Garantir que não ultrapasse 160 caracteres
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
}