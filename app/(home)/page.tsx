import Header from "@/components/header";
import { WhatsappButton } from "@/components/whatsapp-btn";
import Image from "next/image";
import Link from "next/link";
import MarquesELeao from "/public/marqueseleao/marques-leao.webp";
import Lancamentos from "/public/marqueseleao/lancamentos.webp";
import Ellipse from "/public/marqueseleao/ellipse4.webp";
import MarquesInstagram from "/public/marqueseleao/marques-instagram.webp";
import MarquesFacebook from "/public/marqueseleao/marques-facebook.webp";
import MarquesYoutube from "/public/marqueseleao/marques-youtube.webp";
import FacebookIcon from "/public/marqueseleao/facebook-icon.svg";
import InstagramIcon from "/public/marqueseleao/instagram-icon.svg";
import YoutubeIcon from "/public/marqueseleao/youtube-icon.svg";
import CitiesCarousel from "./components/cities-carousel";
import TestimonialsCarousel from "./components/testimonials-carousel";
import MarquesLeaoMidiaCarousel from "./components/marques-leao-midia-carousel";
import Carousel from "../../components/carousel";
import MarquesAndLeaoImg from "./components/marques-and-leao-img";
import processarFiltros from "@/utils/processar-filtros-backend";
import EstateAgents from "./components/estate-agents";
import { Post } from "smart-imob-types";
import HomeFilter from "./components/home-filter";
import { notFound } from "next/navigation";
import SectionVideo from "@/components/section-video";

async function getData() {
  const empresa_id: any =
    process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;
  const uri =
    process.env.BACKEND_API_URI ??
    (process.env.NEXT_PUBLIC_BACKEND_API_URI as string);
  const PAGE_SIZE = "25";
  const params_imoveis = new URLSearchParams({
    empresa_id,
    limit: PAGE_SIZE,
    startAt: "0",
    filtros: JSON.stringify(
      processarFiltros({
        ["imovel.destaque"]: true,
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
    // filtros: JSON.stringify(
    //   processarFiltros({
    //     ["caracteristicas"]: "Imoveis Lancamentos",
    //   })
    // ),
    order: JSON.stringify([{ field: "imovel.created_at", order: "DESC" }]),
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

  const empresa = await fetch(`${uri}/empresas/site/${empresa_id}`, {
    next: { tags: ["empresas"], revalidate: 3600 },
  });

  if (!empresa.ok) {
    notFound();
  }

  return {
    imoveisDestaque: await imoveisDestaqueResponse.json(),
    imoveisNovidade: await imoveisNovidadeResponse.json(),
    corretores: await corretores.json(),
    depoimentos: await depoimentos.json(),
    posts: await posts.json(),
    empresa: await empresa.json(),
  };
}

export default async function Home() {
  const {
    imoveisDestaque,
    imoveisNovidade,
    corretores,
    depoimentos,
    posts,
    empresa,
  } = await getData();
  return (
    <div className="bg-menu bg-no-repeat overflow-x-hidden">
      <Image
        draggable={false}
        className="absolute -bottom-1/2 opacity-60 left-[-35%] w-[75%]"
        src={Ellipse}
        alt="Ellipse blur"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <main>
        <section className="min-h-[100svh] relative w-full overflow-x-hidden overflow-y-visible">
          {/* TODO: Descomentar quando necessário - Imagens e vídeos da hero section */}

          {/* Imagem placeholder desktop */}
          {/* <Image
            src="/marqueseleao/FOTO SITE HORIZONTAL.jpg"
            alt="Background"
            fill
            priority
            className="hidden md:block object-cover z-1"
          /> */}

          {/* Imagem placeholder mobile */}
          {/* <Image
            src="/marqueseleao/FOTO SITE VERTICAL.jpg"
            alt="Background"
            fill
            priority
            className="md:hidden object-cover z-1"
          /> */}

          {/* Vídeo desktop */}
          {/* <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="hidden md:block absolute inset-0 w-full h-full object-cover z-1"
              style={{ width: '100%', height: '100%' }}
            >
              <source
                src="https://firebasestorage.googleapis.com/v0/b/smartimob-dev-test.appspot.com/o/empresas%2F4IYSm7WrQ8naKm28ArY7%2FVIDEO%20TAMBNAIL%20ajustado%202.mp4?alt=media&token=69cc3b36-cfc6-43c2-86e0-c97847a9af91"
                type="video/mp4"
              />
            </video> */}

          {/* Vídeo mobile */}
          {/* <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="md:hidden absolute inset-0 w-full h-full object-cover z-1"
              style={{ width: '100%', height: '100%' }}
            >
              <source
                src="https://firebasestorage.googleapis.com/v0/b/smartimob-dev-test.appspot.com/o/empresas%2F4IYSm7WrQ8naKm28ArY7%2Fsite%20vertical%202.mp4?alt=media&token=24368d4c-3c40-45ed-86a9-89a7d5970869"
                type="video/mp4"
              />
            </video> */}

          <Header hideLogo />

          {/* Conteúdo hero - título e imagem Marques e Leão */}
          <div className="relative w-[min(90%,80rem)] mx-auto">
            <h1 className="text-[clamp(.75rem,4.5vw,2.25rem)] md:text-[clamp(.75rem,9vw,2rem)] relative z-10 font-extralight leading-none max-w-[26ch] md:max-w-[24ch] mx-auto md:mx-0 pt-[23rem] md:pt-40">
              Conectamos
              <br />{" "}
              <span
                className={`text-[clamp(2.5rem,12vw,5rem)] tracking-tighter md:tracking-normal md:text-[5.5rem] font-extrabold leading-[.75] font-baskervville md:pr-3`}
              >
                <strong>pessoas</strong>
              </span>{" "}
              <span className="text-[clamp(.75rem,6vw,2.25rem)] ml-1 md:ml-0">
                a imóveis
              </span>
              <span
                className={`flex items-center text-[clamp(2.5rem,12vw,5rem)] md:text-[5.5rem] leading-[1] font-extrabold before:inline-block before:w-[clamp(50%,10vw,100%)] font-baskervville before:h-[1px] before:bg-mainPurple`}
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
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>

          {/* <HomeFilter className="absolute bottom-[17.5%] translate-x-1/2 z-50 right-1/2" /> */}
          <HomeFilter className="absolute bottom-[17.5%] left-1/2 -translate-x-1/2 z-50" />

        </section>
        <section className="w-full md:w-[min(90%,110rem)] mx-auto relative mt-20">
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
          <Carousel
            estates={imoveisDestaque.nodes}
            logo={empresa?.logo || ""}
          />
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
        <section className="w-full md:w-[min(90%,110rem)] mx-auto mt-20 mb-28 relative">
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
          <Carousel
            estates={imoveisNovidade.nodes}
            logo={empresa?.logo || ""}
          />
        </section>
        <section className="w-[min(90%,68rem)] mx-auto">
          <article className="w-[min(100%,20rem)] md:w-auto mx-auto md:mx-0 md:flex md:flex-row-reverse">
            <div className="lancamentos-wrapper">
              <Image
                className="lancamentos-img rounded-lg md:rounded-2xl"
                src={Lancamentos}
                alt="Varanda de prédios"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
                priority
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
                  href="/imoveis/caracteristicas-Imoveis%20Lancamentos"
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
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
              priority
            />
          </div>
          <SectionVideo />
        </section>
        <section className="relative mt-12 lg:mt-36">
          <div className="hidden lg:block absolute overflow-hidden right-0 bottom-[-30%] -z-10 w-[35%] aspect-square">
            <Image
              draggable={false}
              className="absolute right-[-40%] bottom-0 opacity-75 -z-10 w-full h-full"
              src={Ellipse}
              alt="Ellipse blur"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        priority
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
                        <Image
                          src={InstagramIcon}
                          alt="Instagram"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                          priority
                        />
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        priority
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
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                          priority
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        priority
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
                        <Image
                          src={FacebookIcon}
                          alt="Facebook"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                          priority
                        />
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
            Equipe Marques&Leão
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
      <WhatsappButton empresa={empresa} />
    </div>
  );
}
