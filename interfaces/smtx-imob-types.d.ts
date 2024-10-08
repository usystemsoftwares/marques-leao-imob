declare module "smart-imob-types" {
  type Foto = {
    resized?: string;
    resized_md?: string | null;
    resized_webp?: string | null;
    source: {
      uri: string;
      uri_webp?: string | null;
    };
    destaque: boolean | undefined;
    ordem: string | number | undefined;
  };
  interface Caracteristica {
    id: string;
    nome: string;
    value: boolean;
  }
  interface Tipo {
    id: string;
    nome: string;
  }
  interface Cidade {
    id: number;
    value: number;
    nome: string;
  }
  interface Estado {
    id: number;
    value: number;
    nome: string;
  }
  interface ImóvelCategorias {
    cor: TwMainColor;
    nome: string;
  }
  interface Imóvel {
    empresa_id: string;
    não_mostrar_dormítorios?: boolean;
    temporada?: boolean;
    CEP?: string | null;
    tipo_iptu?: string | null;
    padrao_taxa_servico?: number;
    padrao_taxa_limpeza?: number;
    padrao_diaria: number;
    padrao_diaria_promocional: number;
    IPTU?: string | number;
    aceita_permuta?: boolean;
    agenciador_id: string | null;
    alugado?: boolean;
    aluguel_imovel?: {
      fim_contrado: Date | { seconds: number };
      valor_mensal: number | null;
      inicio_contrado: Date | { seconds: number };
      observação: string | null;
      data: Date | { seconds: number };
      id_cliente: string | null;
      id_corretor: string | null;
    };
    categorias: ImóvelCategorias[];
    area_construída: number | string;
    area_privativa: number | string;
    area_terreno: number | string;
    area_total: number | string;
    area_útil: number | string;
    ativo?: 0 | 1;
    aut_visita?: any[];
    bairro: string;
    banheiros: number | null | string;
    bloqueio_fotos?: boolean;
    cadastrador_id?: string | null;
    caracteristicas: Caracteristica[];
    chave_desc?: string | null;
    created_at?: Date | string;
    cidade: Cidade;
    codigo: string;
    complemento: string;
    db_id: string;
    destaque: boolean;
    descrição: string | null;
    dormitórios: number | null | string;
    empreendimento_id: string | null;
    excluido: boolean;
    error?: boolean;
    estado: Estado;
    exibir_endereço_no_site?: boolean;
    foto_destaque_index?: number;
    fotos: Foto[];
    inativo: boolean;
    lat?: number | null;
    link_tour_virtual: string | null;
    long?: number | null;
    locação: boolean;
    locação_exibir_valor_no_site?: boolean;
    número: string | null | number;
    mostrar_permuta_no_site: boolean;
    ocultar_mapa: boolean;
    palavras_chaves: string | null;
    permuta_desc: string;
    preço_venda: number;
    preço_venda_desconto: number;
    preço_locação: number;
    preço_locação_desconto: number;
    preço_condominio?: number;
    propostas?: any[];
    proprietario_id: string;
    rua: string;
    suítes: null | number | string;
    tipo: string | null;
    tipo_area_construída: "m²" | string | "HA";
    tipo_area_privativa: "m²" | string | "HA";
    tipo_area_terreno: "m²" | string | "HA";
    tipo_area_total: "m²" | string | "HA";
    tipo_area_útil: "m²" | string | "HA";
    titulo?: string;
    vagas: number | string;
    venda: boolean;
    vendido?: boolean;
    venda_exibir_valor_no_site?: boolean;
    venda_imovel?: {
      porcentagem_corretor: number | null;
      porcentagem_empresa: number | null;
      valor_venda: number | null;
      observação: string | null;
      data: Date | { seconds: number };
      id_cliente: string | null;
      id_corretor: string | null;
      venda_com_parceiro?: true;
      parceiro_nome?: string;
      parceiro_comissao?: number;
      dividir_comissao?: string;
    };
    video_youtube: string | null;
    visualizações: number;
  }
  interface RedeSocial {
    nome:
      | "instagram"
      | "facebook"
      | "youtube"
      | "linkedin"
      | "tiktok"
      | "twitter"
      | "blog";
    url: string;
    cor_oficial?: boolean;
  }
  interface Post {
    id: string;
    titulo: string;
    conteudo: string;
    nome: string;
    banner?: string;
    created_at: string;
  }

  interface Depoimento {
    id: string;
    foto: string;
    nome: string;
    texto: string;
    profissao?: string;
    youtube?: string;
  }
  interface LocalDisponivel {
    bairro: string | null;
    cidade: number;
    estado: number;
  }
  interface BairroDisponivel extends LocalDisponivel {
    bairro: string;
  }
  interface LinkExtra {
    url: string;
    nome: string;
  }
  interface Empreendimento {
    andares: number;
    ativo: number;
    cep: string | null;
    bairro: string | null;
    caracteristicas: any[];
    cidade_id: null | string | number;
    created_at: Date;
    db_id: string;
    desc: string | null;
    destaque: boolean | null;
    dormitorios: string | null;
    edited_at: Date;
    endereco: string | null;
    estado_id: string | null;
    finalidade: string | null;
    fotos: any[];
    nome: string | null;
    numero: string | number | null;
    pais: "Brasil";
    preco_condominio: string | number | null;
    vagas: string | number | null;
    porcentage_vendas_feitas: string | number | null;
    referencia: string | number | null;
    situacao: null | string;
    unidades_por_andar: number;
    vendido: number;
    error?: boolean;
  }

  export interface Anuncios {
    link: string;
    imagem: string | null;
    imagem_webp: string | null;
    subtitulo: string;
    titulo: string;
  }

  interface ModeloGen {
    banner: {
      imagem: string;
      titulo: string;
      descricao: string;
    };
    sobre: {
      imagem: string;
      titulo: string;
      descricao: string;
    };
    beneficios_v1_titulo: string;
    beneficios_v1_descricao: string;
    beneficios_v1: {
      imagem: string;
      titulo: string;
      descricao: string;
    }[];
    beneficios_v2_titulo: string;
    beneficios_v2_descricao: string;
    beneficios_v2: {
      tag: string;
      titulo: string;
      descricao: string;
    }[];
    beneficios_v2_img: string;
    anuncios_v1: Anuncios[];
    anuncios_v1_titulo: string;
    anuncios_v1_descricao: string;
    anuncios_v2: Anuncios[];
    anuncios_v2_titulo: string;
    anuncios_v2_descricao: string;
    anuncios_v2_ocultar: boolean;
    anuncios_v3: Anuncios[];
    anuncios_v3_titulo: string;
    anuncios_v3_descricao: string;
    anuncios_v4_titulo: string;
    anuncios_v4_descricao: string;
    anuncios_v4_imagem: string;
    anuncios_v4_justify: boolean;
    imoveis: {
      imagem: string;
      titulo: string;
      descricao: string;
    };
    imovel_page: {
      justify_description: boolean;
    }
  }

  interface Empresa {
    bairros_disponiveis: BairroDisponivel[];
    banner: string[];
    modelo_gen_01: ModeloGen;
    banner_webp: string[];
    banner_mobile: string | null;
    banner_mobile_webp: string | null;
    bloqueio_de_fotos?: boolean;
    bloqueio_fotos_quantidade?: number;
    caracteristicas_disponiveis: Caracteristica[];
    cidade_padrao?: number;
    clientes_total?: number;
    clientes_total_datas?: object;
    config_dias_desatualizar?: number | undefined | null;
    config_dias_prestes_desatualizar?: number | undefined | null;
    contato_info?: boolean;
    cor_detalhe: string | null;
    CRECI?: string;
    CNPJ?: string;
    db_id: string;
    descrição: string | null;
    depoimentos: Depoimento[];
    endereço_link: string | null;
    envie_seu_imovel?: boolean;
    email?: string;
    email_notificado?: string;
    endereço: string | null;
    exibir_local_imovel?: boolean;
    estado_padrao?: number | null;
    exibir_visualizacoes?: boolean;
    exibir_mapa_imovel?: boolean;
    facebook_pixel?: string;
    favicon: string | null;
    frase_topo?: {
      frase?: string;
      size?: string | number;
      color?: string;
      weight?: number;
      max_width?: string | number;
    };
    videos: {
      imagem_url: string;
      url: string;
      destaque: boolean;
      ordem: number;
    }[];
    frase_site: string;
    frase_destaques: string;
    frase_lancamentos: string;
    footer_logo: string;
    font_body?: string;
    font_title?: string;
    google_code?: string;
    home_busca_preco?: boolean;
    horario_funcionamento: string | null;
    imovel_use_bg?: boolean;
    imoveis_total?: number;
    imoveis_total_tipos?: {};
    img_fixed?: {
      link?: string;
      img?: string;
    };
    granato_gen?: GranatoGen;
    info_gen?: InfoGen;
    links_extras?: {
      titulo: string;
    };
    locais_disponiveis?: LocalDisponivel[];
    logo: string | null;
    logo_escrita: string | null;
    logo_use_bg?: boolean;
    marca_da_agua?: Watermark;
    mensagem_whats?: string;
    mostrar_estados?: boolean;
    nav_bar_fixed?: boolean;
    nome_fantasia: string;
    nome: string;
    ocultar_equipe: boolean;
    ocultar_marca_agua: boolean;
    ocultar_corretor: boolean;
    ordem_decrescente: boolean;
    palleta: Palleta;
    palavras_chave?: string | null;
    possui_locacao: boolean;
    redes_sociais: RedeSocial[];
    roleta_cliente: boolean;
    scripts_extras?: string;
    scripts_body?: string;
    telefone_empresa?: string[];
    telefones_empresa?: {
      telefone: string;
      whatsapp: boolean;
      nome: string;
    }[];
    texto_whats?: string;
    tipos_disponiveis: Tipo[];
    titulo_site?: string | null;
    url: string[];
    url_compartilhamento?: string | null;
    ultimo_pagamento?: {
      seconds: number;
    };
    video_topo: string | null;
    whats_no_animation: boolean;

    imoveis_banner?: string;
    imoveis_mapa_banner?: string;
    imoveis_titulo?: string;
    imoveis_descricao?: string;
    corretores_titulo?: string;
    corretores_descricao?: string;
    construtoras_titulo?: string;
    construtoras_descricao?: string;
    videos_titulo?: string;
    videos_descricao?: string;
    depoimentos_titulo?: string;
    depoimentos_descricao?: string;
    estatisticas_titulo?: string;
    estatisticas_descricao?: string;
  }

  interface Watermark {
    url: string | null;
    posicao: string | number | null;
    ocultar: boolean;
    size: string | null;
    opacity: string | null;
  }

  interface InfoGen {
    busca_titulo: boolean;
    filo: string | null;
    atendimento: string | null;
    missao: string | null;
    sobre: string;
    titulo_sobre: string | null;
    header_sobre: string | null;
    foto_sobre: string | null;
    home: number | null;
    header: number | null;
    navbar: number | null;
    footer: number | null;
    ocultar_header_btn: boolean | null;
    ocultar_cadastro?: boolean;
    header_btn_extra?: {
      nome: string;
      link: string;
    };
    footer_frase: string | null;
    foto_header: string | null;
    subfrase_site: string | null;
    frase_tipo: string | null;
    corretor_foto: string | null;
    corretor_titulo: string | null;
    corretor_descricao: string | null;
    ads_titulo: string | null;
    ads_btn_text: string | null;
    ads_btn_link: string | null;
    social_bar?: boolean;
    image_container_h2: string;
    image_container_image: string;
    image_container_p: string;
    card_display_h2: string;
    card_display_p: string;
    card_display_list: {
      titulo: string;
      texto: string;
    }[];
    city_container_h2: string;
    city_container_p: string;
    city_container_list: string[];
    instagram: {
      followers: number;
      profile_pic: string;
      user: string;
      widget: string;
      bg?: string;
    };
    instagram_alt: {
      followers: number;
      profile_pic: string;
      user: string;
      widget: string;
      bg?: string;
    };
    tiktok: {
      followers: number;
      profile_pic: string;
      user: string;
      widget: string;
      bg?: string;
    };
    youtube: {
      bg?: string;
      profile_pic: string;
      followers: number;
      user: string;
      video: string;
    };
    search_order: number | null;
    sobre_v3_image: string;
    sobre_v3_bg: string;
    sobre_v3_name: string;
    sobre_v3_h2: string;
    sobre_v3_p: string;
    busca?: string[];
    header_rent_txt?: string;
    card_more_info?: boolean;
    video_sobre?: string;
    video_sobre_muted?: boolean;
    video_sobre_autoplay?: boolean;
    video_sobre_controls?: boolean;
  }

  interface GranatoGen {
    pilger: boolean;
    anuncios: {
      nome: string | null;
      sub_titulo: string | null;
      foto: string;
      foto_webp: string | null;
      link: string;
      outer_link?: boolean;
    }[];
    banner_no_cover: boolean;
    busca?: string[];
    busca_extra?: string[];
    busca_area_construida?: boolean;
    cadastro_imovel: boolean;
    cadastro_empreendimento: boolean;
    cadastro_contato: boolean;
    cidades_header_index: {
      foto: string | null;
      foto_webp?: string | null;
      link: string | null;
      link_txt: string | null;
      nome: string | null;
      subtitulo: string | null;
      titulo: string | null;
    }[];
    corretor_modal: boolean;
    exibir_cadastro_rodape: boolean;
    esconder_email: boolean;
    facebook: {
      profile_pic: string;
      user: string;
      followers: number;
    };
    frase_header: string;
    subfrase_header: string;
    frase_footer: string | null;
    filtro_imoveis: boolean | null;
    filtro_empreendimento: boolean | null;
    font_light?: boolean;
    font_heavy?: boolean;
    footer: number | null;
    footer_column_1: FooterColumn;
    footer_column_2: FooterColumn;
    footer_column_3: FooterColumn;
    footer_column_4: FooterColumn;
    header: number | null;
    header_nav: number | null;
    header_sell_txt: string | null;
    header_index_options: boolean;
    image_header_pages_img?: string | null;
    image_header_pages_img_webp?: string | null;
    imovel_single_bg: boolean;
    imovel_justify_text: boolean;
    instagram: {
      bg?: string;
      followers: number | null;
      profile_pic: string | null;
      user: string | null;
      widget: string | null;
    };
    no_imovel_title?: boolean;
    list_body?: number | null;
    menu_options: {
      nome: string | null;
      link: string | null;
      submenu_options: {
        nome: string | null;
        link: string | null;
      }[];
    }[];
    menu_options_mobile: {
      nome: string | null;
      link: string | null;
      target?: string | null;
    }[];
    menu_mobile_sm?: boolean;
    mostrar_area: boolean;
    mostrar_instagram: boolean;
    relacionados_valor: number;
    submenu: {
      titulo: string | null;
      link: string | null;
      sub_options: {
        link: string | null;
        nome: string | null;
      }[];
    }[];
    linkedin: {
      profile_pic: string | null;
      user: string | null;
      followers: number;
      image: string;
    };
    tiktok: {
      bg?: string;
      followers: number;
      image: string;
      profile_pic: string | null;
      user: string | null;
    };
    ocultar_galeria: boolean;
    ocultar_info_property: boolean;
    youtube: {
      bg?: string;
      profile_pic: string | null;
      subscribers: number;
      user: string | null;
      videos: string[] | null;
    };
    workwithusbg: boolean;
  }

  interface Palleta {
    cor_primaria: string | null;
    cor_secundaria: string | null;
    cor_auxiliar?: string | null;
    cor_header: string | null;
    cor_texto_header_1?: string | null;
    cor_footer?: string | null;
    cor_footer_2?: string | null;
    cor_texto_footer_1?: string | null;
    cor_texto_footer_2?: string | null;
    cor_texto_footer_3?: string | null;
    cor_rodape?: string | null;
    cor_rodape_2?: string | null;
    cor_texto_rodape_1?: string | null;
    cor_texto_rodape_2?: string | null;
    use_color?: boolean | null;
    cor_detalhe?: string | null;
    cor_body?: string | null;
    cor_background?: string | null; // REFAZER
    // velhas
    cor_topo?: string | null;
    cor_texto_topo?: string | null;
  }

  interface Construtora {
    created_at: Date;
    db_id: string;
    desc: string;
    edited_at: Date;
    error?: boolean;
    exibir_no_site: boolean;
    foto: string;
    nome: string;
  }

  interface Arquiteto {
    created_at: Date | { seconds: number } | string;
    db_id: string;
    desc: string | null;
    edited_at: Date | { seconds: number } | string;
    error: boolean;
    exibir_no_site: boolean;
    foto?: string;
    nome: string;
    instagram?: string;
    telefone?: string;
  }

  interface ItemTimeline {
    descrição;
    titulo;
    data;
    empresa_id?: string
  }

  interface Cliente {
    origem_temporada?: boolean;
    origem_site: boolean;
    foto: string | null;
    nome: string;
    email: string;
    created_at: Date;
    edited_at: Date;
    telefone: string;
    DDD: string | null;
    CPF: null;
    FGTS: null;
    conjuge_nome: string | "" | null;
    corretor_responsavel_id: string | null;
    corretor_responsavel?: Corretor;
    dependentes: null;
    entrada: 1;
    excluido: false;
    empreendimentos_cadastros?: string[];
    empreendimento_origem?: string | null;
    visitante_id: string | null;
    imoveis_cadastrados: string[];
    imoveis_visitados: [];
    imovel_origem_id: string | null;
    imovel_origem?: Imóvel;
    possui_emprestimo: false;
    renda: null;
    proprietario: false;
    status: "Cadastrado recentemente";
    timeline: ItemTimeline[];
    troca: false;
    utilizar_financiamento: false;
    registro_por_afiliado_id: string | null;
    registro_por_afiliado?: Corretor;
  }

  type FooterColumn = {
    titulo: string;
    opcoes: {
      nome: string;
      link: string;
    }[];
  };

  type ImoveisInfoType = {
    VGV: number;
    bairros_disponiveis: { bairro: string; info: any }[];
    caracteristicas_disponiveis: { nome: string; id: string }[];
    codigos: string[];
    tipos: string[];
    min_preco: number;
    max_preco: number;
    min_preco_locacao: number;
    max_preco_locacao: number;
    max_area: number;
    min_area: number;
    empreendimentos_disponiveis: {
      nome: string;
      codigo: string;
    }[];
    total_imoveis: number;
    tipos_array?: any;
    cidades_array?: any;
    bairros_array?: any;
    codigos_array?: any;
    caracteristicas_array?: any;
  };

  type EmpreendimentosInfoType = {
    bairros_disponiveis: { bairro: string; info: any }[];
    situacoes: string[];
    referencias: string[];
    finalidades: string[];
    categorias: string[];
    min_preco: number;
    max_preco: number;
  };

  interface PermissoesInterface {
    /**
     * @deprecated
     */
    clientes: boolean;
    /**
     * @deprecated
     */
    imóveis: boolean;

    agenda: boolean;
    /**
     * @description Permissão que define se o usuário é administrador
     */
    alterar_cadastro: boolean;
    equipes: boolean;
    /**
     * @deprecated
     */
    r_dados: boolean;
    financeiro: boolean;
    marketing: boolean;

    imovel_criar: boolean;
    imovel_editar: boolean;
    imovel_ver_todos: boolean;

    lead_criar: boolean;
    lead_editar: boolean;
    lead_ver_todos: boolean;

    pipeline_leads: boolean;

    empreendimentos: boolean;

    depoimentos: boolean;
  }
  interface Corretor {
    whatsapp_link: string | null;
    CPF: string;
    CRECI: string;
    aparecer_site: boolean;
    bio: string | null;
    cargo: string;
    contain_foto?: boolean;
    db_id: string;
    descricao: string | null;
    destaque: boolean;
    email: string;
    empresa: string;
    equipe_id: null | string;
    expo_tokens: [];
    foto: string | null;
    imoveis_salvos: [];
    instagram?: string;
    facebook?: string;
    nome: string;
    ocultar_foto?: boolean;
    permissões: PermissoesInterface;
    push_web_tokens: [];
    setor?: string | null;
    sobre: string | null;
    telefone: string | null;
    migração: true;
    whatsapp: boolean;
    error?: boolean;
    qtdImoveis: number;
    anos_de_experiencia: number | null;
  }

  interface IReserva {
    autorizado: boolean
    cliente_id: string
    comissao: number | null
    created_at: Date
    data_fim: Date
    data_inicio: Date
    imovel_id: string
    taxa_limpeza: number | null
    taxa_servico: number | null
    valor_diaria: number | null
  }
}
