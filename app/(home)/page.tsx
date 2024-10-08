import Header from "@/components/header";
import SearchPropertyFilter from "./components/search-property-filter";
import { WhatsappButton } from "@/components/whatsapp-btn";
import Image from "next/legacy/image";
import Link from "next/link";
import MarquesELeao from "/public/marqueseleao/marques-leao.webp";
import Lancamentos from "/public/marqueseleao/lancamentos.webp";
import Media from "/public/marqueseleao/media.webp";
import Ellipse from "/public/marqueseleao/ellipse4.webp";
import MarquesInstagram from "/public/marqueseleao/marques-instagram.webp";
import MarquesFacebook from "/public/marqueseleao/marques-facebook.webp";
import MarquesYoutube from "/public/marqueseleao/marques-youtube.webp";
import FacebookIcon from "/public/marqueseleao/facebook-icon.svg";
import InstagramIcon from "/public/marqueseleao/instagram-icon.svg";
import YoutubeIcon from "/public/marqueseleao/youtube-icon.svg";
import HandshakeIcon from "/public/marqueseleao/handshake-icon.svg";
import WhatsappPurpleIcon from "/public/marqueseleao/whatsapp-purple-icon.svg";
import WhiteSearchIcon from "/public/marqueseleao/white-search-icon.svg";
import CitiesCarousel from "./components/cities-carousel";
import TestimonialsCarousel from "./components/testimonials-carousel";
import MarquesLeaoMidiaCarousel from "./components/marques-leao-midia-carousel";
import Carousel from "../../components/carousel";
import MarquesAndLeaoImg from "./components/marques-and-leao-img";
import processarFiltros from "@/utils/processar-filtros-backend";
import EstateAgents from "./components/estate-agents";
import { Post } from "smart-imob-types";
import HomeFilter from "./components/home-filter";

async function getData() {
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const uri =
    process.env.BACKEND_API_URI ??
    (process.env.NEXT_PUBLIC_BACKEND_API_URI as string);
  const PAGE_SIZE = "12";
  const params_imoveis = new URLSearchParams({
    empresa_id,
    limit: PAGE_SIZE,
    startAt: "0",
    filtros: JSON.stringify(
      processarFiltros({
        ["imovel.destaque"]: true,
        ["imovel.venda"]: true,
      })
    ),
  });
  const imoveisDestaqueResponse = await fetch(
    `${uri}/imoveis/site/paginado?${params_imoveis.toString()}`,
    {
      next: { tags: ["imoveis-paginado"], revalidate: 3600 },
    }
  );

  if (!imoveisDestaqueResponse.ok) {
    throw new Error("Failed to fetch data");
  }

  const params_imoveis_novidades = new URLSearchParams({
    empresa_id,
    limit: PAGE_SIZE,
    startAt: "0",
    filtros: JSON.stringify(
      processarFiltros({
        ["caracteristicas"]: "Água Quente",
      })
    ),
  });
  const imoveisNovidadeResponse = await fetch(
    `${uri}/imoveis/site/paginado?${params_imoveis_novidades.toString()}`,
    {
      next: { tags: ["imoveis-paginado"], revalidate: 3600 },
    }
  );

  if (!imoveisNovidadeResponse.ok) {
    throw new Error("Failed to fetch data");
  }

  const params = new URLSearchParams({
    empresa_id,
    filtros: JSON.stringify(
      processarFiltros({
        ["corretor.aparecer_site"]: "1",
      })
    ),
  });
  const corretores = await fetch(`${uri}/corretores?${params.toString()}`, {
    next: { tags: ["corretores"], revalidate: 3600 },
  });

  if (!corretores.ok) {
    throw new Error("Failed to fetch data");
  }

  const params_depoimentos = new URLSearchParams({
    empresa_id,
  });
  const depoimentos = await fetch(
    `${uri}/depoimentos?${params_depoimentos.toString()}`,
    {
      next: { tags: ["depoimentos"], revalidate: 3600 },
    }
  );

  if (!depoimentos.ok) {
    throw new Error("Failed to fetch data");
  }

  const operadoresEspecificos = {
    banner: "isNotNull",
  };
  const params_posts = new URLSearchParams({
    empresa_id,
    filtros: JSON.stringify(
      processarFiltros(
        {
          ["banner"]: "1",
        },
        operadoresEspecificos
      )
    ),
  });
  const posts = await fetch(`${uri}/blogs?${params_posts.toString()}`, {
    next: { tags: ["posts"], revalidate: 3600 },
  });

  if (!posts.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    imoveisDestaque: await imoveisDestaqueResponse.json(),
    imoveisNovidade: await imoveisNovidadeResponse.json(),
    corretores: await corretores.json(),
    depoimentos: await depoimentos.json(),
    posts: await posts.json(),
  };
}

export default async function Home() {
  const { imoveisDestaque, imoveisNovidade, corretores, depoimentos, posts } =
    await getData();

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <Image
        draggable={false}
        className="absolute -bottom-1/2 opacity-60 left-[-35%] w-[75%]"
        src={Ellipse}
        alt="Ellipse blur"
      />
      <main>
        <section className="min-h-[100svh] relative w-[min(90%,80rem)] mx-auto">
          <h1 className="text-[clamp(.75rem,4.5vw,2.25rem)] md:text-[clamp(.75rem,9vw,2rem)] relative z-10 font-extralight leading-none max-w-[26ch] md:max-w-[24ch] mx-auto md:mx-0 pt-[23rem] md:pt-40">
            Conectamos
            <br />{" "}
            <span
              className={`text-[clamp(2.5rem,12vw,5rem)] tracking-tighter md:tracking-normal md:text-[5.5rem] font-bold leading-[.75] font-baskervville md:pr-8`}
            >
              <strong>pessoas</strong>
            </span>{" "}
            <span className="text-[clamp(.75rem,6vw,2.25rem)] ml-1 md:ml-0">
              a imóveis
            </span>
            <span
              className={`flex items-center text-[clamp(2.5rem,12vw,5rem)] md:text-[5.5rem] leading-[1] font-baskervville before:inline-block before:w-[clamp(50%,10vw,100%)] font-bold before:h-[1px] before:bg-mainPurple`}
            >
              <strong className="pl-5 tracking-tighter md:tracking-normal">
                incríveis
              </strong>
            </span>
            <span className="text-[clamp(.7425rem,3vw,1.375rem)]">
              que refletem seus <span className="font-medium">ideais</span> e
              sua <span className="font-medium">personalidade</span>
            </span>
          </h1>
          <Image
            className="absolute top-0 md:top-[-5rem] md:w-[min(100%,45rem)] right-0"
            src={MarquesELeao}
            alt="Marques e Leão"
            priority
          />
          <HomeFilter className="absolute bottom-[17.5%] translate-x-1/2 z-50 right-1/2" />
        </section>
        <section className="w-full md:w-[min(90%,80rem)] mx-auto relative">
          <div className="w-[min(90%,68rem)] mx-auto flex items-center justify-center md:justify-between">
            <div className="relative">
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">
                Destaques
              </span>
              <h2
                className={`text-3xl text-center md:text-start font-baskervville`}
              >
                Selecionados para você
              </h2>
            </div>
            <Link
              href="/imoveis"
              className="hidden md:block bg-mainPurple hover:bg-white hover:text-black transition-colors text-sm py-3 px-5 rounded-lg"
            >
              Ver todos os imóveis
            </Link>
          </div>
          <Carousel estates={imoveisDestaque.nodes} />
        </section>
        <section className="w-[min(90%,80rem)] mx-auto mt-20">
          <div className="grid place-items-center">
            <span className="flex gap-4 items-center text-[#898989] before:inline-block before:w-28 before:h-[2px] before:bg-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">
              Filtre por
            </span>
            <h2
              className={`text-3xl lg:text-4xl text-center md:text-start font-baskervville`}
            >
              Cidades que atendemos
            </h2>
          </div>
          <div>
            <CitiesCarousel />
          </div>
        </section>
        <section className="w-full md:w-[min(90%,80rem)] mx-auto mt-20 mb-28 relative">
          <div className="w-[min(90%,68rem)] mb-8 mx-auto flex items-center justify-center md:justify-between">
            <div>
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">
                Novidades
              </span>
              <h2
                className={`text-3xl text-center md:text-start font-baskervville`}
              >
                Novidades da semana
              </h2>
            </div>
            <Link
              className="hidden md:block bg-mainPurple hover:bg-white hover:text-black transition-colors text-sm py-3 px-5 rounded-lg"
              href="/imoveis"
            >
              Ver todos os imóveis
            </Link>
          </div>
          <Carousel estates={imoveisNovidade.nodes} />
        </section>
        <section className="w-[min(90%,68rem)] mx-auto">
          <article className="w-[min(100%,20rem)] md:w-auto mx-auto md:mx-0 md:flex md:flex-row-reverse">
            <div className="lancamentos-wrapper">
              <Image
                className="lancamentos-img rounded-lg md:rounded-2xl"
                src={Lancamentos}
                alt="Varanda de prédios"
              />
            </div>
            <div className="projects-wrapper w-[min(100%,25rem)]">
              <div className="bg-mainPurple md:h-full md:bg-transparent before:bg-gradient-to-t before:absolute before:inset-0 before:-z-20 before:from-[#141414] md:before:content-none md:bg-gradient-to-b translate-y-[-.5rem] md:translate-y-0 md:translate-x-[.75rem] lg:translate-x-[1.25rem] md:from-mainPurple rounded-lg md:rounded-xl px-6 py-8 md:p-8 projects">
                <h2
                  className={`text-3xl tracking-wide md:tracking-normal md:leading-[2.75rem] md:text-[2.5rem] font-baskervville`}
                >
                  Pensando em Projetos e lançamentos?
                </h2>
                <p className="mt-3 mb-2 md:mb-2 max-w-[22ch]">
                  Conheça aqui as novidades do mercado.
                </p>
                <Link
                  className="bg-mainPurple hover:scale-110 md:hover:scale-100 inline-block hover:bg-white hover:text-black transition-all text-sm py-3 px-5 rounded-lg"
                  href="/imoveis?caracteristicas=Água Quente"
                >
                  Conhecer Lançamentos
                </Link>
                <svg
                  className="svg_filter"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                >
                  <defs>
                    <filter id="round">
                      <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="4"
                        result="blur"
                      />
                      <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                        result="goo"
                      />
                      <feComposite
                        in="SourceGraphic"
                        in2="goo"
                        operator="atop"
                      />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </article>
        </section>
        <section className="relative">
          <div className="hidden lg:block absolute overflow-hidden right-0 bottom-1/2 translate-y-[65%] -z-10 w-[50%] aspect-square">
            <Image
              draggable={false}
              className="absolute opacity-70 w-full right-[-40%] h-full"
              src={Ellipse}
              alt="Ellipse blur"
            />
          </div>
          <div className="w-[min(90%,75rem)] mt-24 mb-12 mx-auto flex flex-col items-center md:flex-row md:items-center md:justify-between md:gap-20">
            <div className="relative w-[min(100%,30rem)] ml-4 sm:ml-0">
              <Image
                className="rounded-xl mx-auto md:mx-0"
                src={Media}
                alt="Gabriel Leão de costa para foto, de frente para uma casa"
              />
              <div className="text-sm lg:text-base absolute translate-x-[-15%] md:right-0 md:translate-x-[35%] bottom-[35.5%] sm:bottom-[40%] md:bottom-[60%] px-3 py-3 md:px-2 md:py-2 lg:px-4 lg:py-4 translate-y-[50%] backdrop-blur-2xl rounded-[.625rem]">
                <span className="text-xl lg:text-[clamp(1rem,3vw,1.875rem)] font-bold block text-center">
                  +22mil
                </span>{" "}
                nas redes sociais
              </div>
              <div className="text-sm lg:text-base absolute translate-x-[-15%] md:right-0 md:translate-x-[50%] bottom-[57%] sm:bottom-[60%] md:bottom-[37.5%] px-3 py-3 md:px-2 md:py-2 lg:px-3 lg:py-3 translate-y-1/2 backdrop-blur-2xl rounded-[.625rem]">
                <span className="text-xl lg:text-[clamp(1rem,3vw,1.875rem)] font-bold block text-center">
                  +1000
                </span>{" "}
                imóveis vendidos
              </div>
              <div className="text-sm lg:text-base absolute translate-x-[-15%] md:right-0 md:translate-x-[40%] bottom-[78.5%] md:bottom-[15%] px-3 py-3 md:px-2 md:py-2 lg:px-4 lg:py-4 translate-y-1/2 backdrop-blur-2xl rounded-[.625rem]">
                <span className="text-xl lg:text-[clamp(1rem,3vw,1.875rem)] font-bold block">
                  +100 mil
                </span>{" "}
                de alcance mensal
              </div>
            </div>
            <div className="mt-16 md:mt-0">
              <span className="flex items-center gap-2 text-[#898989] after:inline-block after:w-28 after:h-[1.75px] after:bg-[#898989]">
                Por que
              </span>
              <h2 className={`text-3xl tracking-wide font-baskervville`}>
                Por que a Marques&Leão?
              </h2>
              <p className="mt-3 mb-6 max-w-[40ch] text-[#a7a7a7] leading-5">
                Somos{" "}
                <span className="text-white">a maior vitrine imobiliária</span>{" "}
                da região, investindo em vídeos, anúncios e inovação.
              </p>
              <ul className="grid md:grid-cols-3 *:min-w-fit md:*:min-w-0 md:*:w-[min(100%,12.5rem)] md:*:h-full md:*:aspect-square *:inline-flex md:*:flex-col *:items-center md:*:items-start md:*:justify-between *:gap-2 sm:gap-4 md*:gap-0 *:font-bold md:*:font-medium xl:*:font-bold text-[.813rem] md:text-[clamp(.75rem,1.75vw,1rem)] lg:*:text-lg *:rounded-[.625rem] *:px-2 sm:px-4 md:*:px-1 lg:*:px-4 *:py-2 md:*:py-2 lg:*:py-8 gap-2 sm:gap-x-3 gap-y-3 marques_leao">
                <li className="bg-mainPurple *:min-w-fit md:*:w-[min(100%,12.5rem)] md:*:h-full md:*:aspect-square *:inline-flex md:*:flex-col *:items-center md:*:items-start md:*:justify-between *:gap-4 md*:gap-0 *:font-medium xl:*:font-bold *:rounded-[.625rem] !px-4 md:!px-1 lg:!px-2 xl:!px-4">
                  <Link
                    className="!py-0 md:!py-0 lg:!py-0 !px-0 !text-[.9375rem] md:!text-[clamp(.75rem,1.75vw,1rem)] lg:!text-base xl:!text-lg"
                    href="/anunciar-imovel"
                  >
                    <div className="w-5 lg:w-auto">
                      <Image src={WhiteSearchIcon} alt="Ícone de pesquisa" />
                    </div>
                    <p className="xl:leading-[1.5rem]">
                      Anuncie seu imóvel conosco
                    </p>
                  </Link>
                </li>
                <li className="bg-white text-mainPurple">
                  <div className="w-5 lg:w-auto">
                    <Image src={WhatsappPurpleIcon} alt="Whatsapp" />
                  </div>
                  <p className="max-w-[15ch] leading-[1rem] lg:leading-[1.5rem] md:max-w-auto">
                    Fale com nossos corretores
                  </p>
                </li>
                <li className="bg-white text-mainPurple">
                  <div className="w-5 lg:w-auto">
                    <Image src={HandshakeIcon} alt="Ícones de aperto de mãos" />
                  </div>
                  <p className="max-w-[15ch] leading-[1rem] lg:leading-[1.5rem] md:max-w-auto">
                    Seja parceiro Marques&Leão
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="relative mt-12 lg:mt-36">
          <div className="hidden lg:block absolute overflow-hidden right-0 bottom-[-30%] -z-10 w-[35%] aspect-square">
            <Image
              draggable={false}
              className="absolute right-[-40%] bottom-0 opacity-75 -z-10 w-full h-full"
              src={Ellipse}
              alt="Ellipse blur"
            />
          </div>
          <div className="w-[min(90%,80rem)] mx-auto flex flex-col lg:flex-row items-center gap-[clamp(1rem,2.5vw,2.5rem)]">
            <div className="w-[min(100%,37.5rem)] relative lg:flex-1">
              <MarquesAndLeaoImg />
            </div>
            <div className="w-[min(100%,37.5rem)] sm:mt-4 lg:mt-0 lg:flex-1 flex flex-row-reverse lg:flex-row gap-[clamp(1rem,2vw,2.5rem)]">
              <div className="w-full lg:max-w-[32ch]">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2rem,3vw,3rem)] font-bold lg:!leading-[clamp(2rem,4vw,3.5rem)] font-baskervville">
                  Pablo Marques & Gabriel Leão
                </h2>
                <p className="sm:text-lg lg:text-lg text-[#d2d2d2] !leading-6 mt-2">
                  Nosso trabalho tem como foco a{" "}
                  <span className="text-white font-semibold">
                    conexão entre tecnologia e atendimento de alta performance
                  </span>
                  , com o objetivo de otimizar a jornada e melhorar experiência
                  do cliente.
                </p>
                <ul className="hidden lg:block *:flex *:items-center *:gap-5 *:mt-8">
                  <li>
                    <div>
                      <Image
                        className="w-[clamp(4.5rem,7vw,5.625rem)]"
                        src={MarquesInstagram}
                        alt="Foto de Pablo Marques e Gabriel Leão"
                      />
                    </div>
                    <div>
                      <p className="text-[clamp(.875rem,1.5vw,1.125rem)] mb-3">
                        @marqueseleao
                      </p>
                      <Link
                        className="flex items-center font-semibold text-sm gap-2 bg-mainPurple rounded-[.635rem] py-3 px-5"
                        href="https://www.instagram.com/marqueseleao/"
                        target="_blank"
                      >
                        <Image src={InstagramIcon} alt="Instagram" />
                        Seguir no Instagram
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Image
                        className="w-[clamp(4.5rem,7vw,5.625rem)]"
                        src={MarquesYoutube}
                        alt="Foto de Pablo Marques e Gabriel Leão"
                      />
                    </div>
                    <div>
                      <p className="text-[clamp(.875rem,1.5vw,1.125rem)] mb-3">
                        @ImobiliariaMarquesLeao
                      </p>
                      <Link
                        className="flex items-center font-semibold text-sm gap-2 max-w-[23ch] bg-mainPurple rounded-[.635rem] py-3 px-5"
                        href="https://www.youtube.com/c/ImobiliariaMarquesLeao/"
                        target="_blank"
                      >
                        <Image
                          className="w-[1.0625rem]"
                          src={YoutubeIcon}
                          alt="Youtube"
                        />
                        Se inscreva no canal
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div>
                      <Image
                        className="w-[clamp(4.5rem,7vw,5.625rem)]"
                        src={MarquesFacebook}
                        alt="Foto de Pablo Marques e Gabriel Leão"
                      />
                    </div>
                    <div>
                      <p className="text-[clamp(.875rem,1.5vw,1.125rem)] mb-3">
                        @marqueseleao
                      </p>
                      <Link
                        className="flex items-center font-semibold text-sm gap-2 bg-mainPurple rounded-[.635rem] py-3 px-5"
                        href="https://web.facebook.com/marqueseleao"
                        target="_blank"
                      >
                        <Image src={FacebookIcon} alt="Facebook" />
                        Seguir no Facebook
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex gap-[clamp(1rem,1.5vw,2rem)] after:bg-mainPurple after:w-[2px] after:inline-block after:h-48 lg:after:content-none lg:before:bg-mainPurple lg:before:w-[2px] lg:before:inline-block lg:before:h-48">
                <h3 className="sm:text-xl lg:text-[clamp(.875rem,4vw,1.5rem)] text-end lg:text-start text-[#707070] mt-6 leading-7 lg:max-w-[9ch]">
                  As mentes por trás do negócio
                </h3>
              </div>
            </div>
          </div>
        </section>
        <section className="w-[min(90%,80rem)] mt-14 mb-24 mx-auto">
          <span className="text-[#898989] flex gap-4 justify-center lg:justify-normal items-center after:w-[7.5rem] after:bg-[#898989] after:h-[2px]">
            Nosso time
          </span>
          <h2
            className={`text-3xl text-center lg:text-start font-baskervville`}
          >
            Corretores Marques
          </h2>
          <EstateAgents corretores={corretores} />
        </section>
        {posts && posts.filter((post: Post) => post.banner).length > 0 && (
          <section className="w-[min(90%,68rem)] relative mx-auto">
            <div className="lg:w-[min(90%,65.5rem)] mx-auto">
              <div className="max-w-[35ch] mx-auto md:mx-0">
                <span className="text-[#898989] flex gap-4 items-center after:w-[7.5rem] after:bg-[#898989] after:h-[2px]">
                  Na mídia
                </span>
                <h2 className={`text-3xl font-baskervville`}>
                  O que falam da Marques&Leão na mídia
                </h2>
              </div>
            </div>
            <MarquesLeaoMidiaCarousel posts={posts} />
          </section>
        )}
        <section className="lg:w-[min(90%,65.5rem)] mt-12 mb-8 mx-auto">
          <TestimonialsCarousel depoimentos={depoimentos} />
        </section>
      </main>
      <WhatsappButton />
    </div>
  );
}
