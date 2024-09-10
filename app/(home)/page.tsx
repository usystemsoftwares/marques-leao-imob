import EstateAgents from "./components/estate-agents";
import Header from "@/components/header";
import NewsOfTheW from "./components/news-of-the-w-carousel";
import SearchPropertyFilter from "./components/search-property-filter";
import { WhatsappButton } from "@/components/whatsapp-btn";
import { Baskervville, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import MarquesELeao from "/public/marqueseleao/marques-leao.webp"
import Lancamentos from "/public/marqueseleao/lancamentos.webp"
import Media from "/public/marqueseleao/media.webp"
import BackgroundMenu from "/public/marqueseleao/background-menu.webp"
import Ellipse from "/public/marqueseleao/ellipse4.webp"
import SelectedForYou from "./components/selected-for-you-carousel";
import CitiesCarousel from "./components/cities-carousel";

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"]
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "400"]
});

export default function Home() {
  return (
    <div>
      <div
        className="bg-[rgb(0,0,0,.55)] absolute top-0 w-full h-full max-h-[280px] before:absolute before:bg-gradient-to-t before:from-[#141414] before:w-full before:h-full before:left-0 before:bottom-0"
      >
        <Image
          className="absolute top-0 -z-20 w-full h-full"
          src={BackgroundMenu}
          alt="Background"
        />
      </div>
      <Header />
      <main className="">
        <Image
          draggable={false}
          className="absolute top-[-30%] opacity-50 right-[-15%] w-[35%]"
          src={Ellipse}
          alt="Ellipse blur"
        />
        <Image
          draggable={false}
          className="absolute bottom-[-50%] opacity-60 left-[-35%] w-[75%]"
          src={Ellipse}
          alt="Ellipse blur"
        />
        <section className="min-h-screen relative w-[min(90%,80rem)] mx-auto">
          <h1 className={`text-[clamp(.75rem,9vw,2.25rem)] ${montserrat.className} relative z-10 font-extralight leading-none max-w-[23ch] pt-80 md:pt-40`}>
            Conectamos<br /> <span className={`text-[clamp(3rem,12.5vw,5rem)] md:text-[6rem] leading-[.75] ${baskervville.className} md:pr-11`}><strong>pessoas</strong></span> a imóveis
            <span className={`flex items-center text-[clamp(3rem,12.5vw,5rem)] md:text-[6rem] leading-[1] ${baskervville.className} before:inline-block before:w-[clamp(50%,10vw,100%)] before:h-[1px] before:bg-mainPurple`}>
              <strong className="pl-5">incríveis</strong>
            </span>
            <span className="text-[clamp(.75rem,3.75vw,1.5rem)]">que refletem seus <span className="font-medium">ideais</span> e sua <span className="font-medium">personalidade</span></span>
          </h1>
          <Image
            className="absolute top-0 md:top-[-5rem] md:w-[min(100%,45rem)] right-0"
            src={MarquesELeao}
            alt="Marques e Leão"
          />
          <SearchPropertyFilter />
        </section>
        <section>
          <div className="w-[min(90%,80rem)] mx-auto flex items-center justify-between">
            <div className="relative">
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Destaques</span>
              <h2 className={`text-3xl font-extrabold ${baskervville.className}`}>Selecionados para você</h2>
            </div>
            <Link href="" className="none md:block bg-mainPurple hover:bg-white hover:text-black transition-colors text-sm py-3 px-5 rounded-lg">Ver todos os imóveis</Link>
          </div>
          <SelectedForYou />
        </section>
        <section className="mt-5">
          <div className="grid place-items-center">
            <span className="flex gap-4 items-center text-[#898989] before:inline-block before:w-28 before:h-[2px] before:bg-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Filtre por</span>
            <h2 className={`text-4xl font-extrabold ${baskervville.className}`}>Cidades que atendemos</h2>
          </div>
          <div>
            <CitiesCarousel />
          </div>
        </section>
        <section className="mt-20">
          <div className="w-[min(90%,80rem)] mx-auto flex items-center justify-between">
            <div>
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Novidades</span>
              <h2 className={`text-3xl font-extrabold ${baskervville.className}`}>Novidades da semana</h2>
            </div>
            <Link className="none md:block bg-mainPurple hover:bg-white hover:text-black transition-colors text-sm py-3 px-5 rounded-lg" href="">Ver todos os imóveis</Link>
          </div>
          <NewsOfTheW />
        </section>
        <section className="w-[min(90%,80rem)] mx-auto">
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
                <h2 className={`text-3xl tracking-wide md:tracking-normal md:leading-[3.25rem] md:text-5xl ${baskervville.className}`}>Pensando em Projetos e lançamentos?</h2>
                <p className="mt-3 mb-2 md:mb-2 max-w-[22ch]">Conheça aqui as novidades do mercado.</p>
                <Link
                  className="bg-mainPurple hover:scale-110 md:hover:scale-100 inline-block hover:bg-white hover:text-black transition-all text-sm py-3 px-5 rounded-lg"
                  href=""
                >Conhecer Lançamentos</Link>
                <svg className="svg_filter" xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <defs>
                    <filter id="round">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </article>
        </section>
        <section className="w-[min(90%,80rem)] my-24 mx-auto md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <Image
              className="rounded-xl w-[min(100%,34.375rem)]"
              src={Media}
              alt="Gabriel Leão de costa para foto, de frente para uma casa"
            />
          </div>
          <div>
            <span className="flex items-center gap-2 text-[#898989] after:inline-block after:w-28 after:h-[1.75px] after:bg-[#898989]">Por que</span>
            <h2 className={`text-3xl tracking-wide ${baskervville.className}`}>Por que a Marques&Leão?</h2>
            <p className="mt-3 mb-6 max-w-[40ch] text-[#a7a7a7] leading-5">Somos <span className="text-white">a maior vitrine imobiliária</span> da região, investindo em vídeos, anúncios e inovação.</p>
            <ul className="grid  md:grid-cols-3 md:*:w-[min(100%,12.5rem)] md:*:aspect-square *:flex *:flex-col *:justify-between *:font-bold lg:*:text-lg *:rounded-[.625rem] md:*:py-8 *:px-4 gap-3">
              <li className="bg-mainPurple">
                <div className="w-4 aspect-square"></div>
                <p>Anuncie seu imóvel conosco</p>
              </li>
              <li className="bg-white text-mainPurple">
                <div className="w-4 bg-black aspect-square"></div>
                <p>Fale com nossos corretores</p>
              </li>
              <li className="bg-white text-mainPurple">
                <div className="w-4 bg-black aspect-square"></div>
                <p>Seja parceiro Marques&Leão</p>
              </li>
            </ul>
          </div>
        </section>
        <section className="w-[min(90%,80rem)] mx-auto">
          <div>
            {/* <Image /> */}
          </div>
          <div>
            <h2>Pablo Marques & Gabriel Leão</h2>
            <p>Nosso trabalho tem como foco a conexão entre tecnologia e atendimento de alta performance, com o objetivo de otimizar a jornada e melhorar experiência do cliente.</p>
            <ul>
              <li>
                <div>{/* <Image /> */}</div>
                <div>
                  <p>@marqueseleao</p>
                  <Link href="">Seguir no Instagram</Link>
                </div>
              </li>
              <li>
                <div>{/* <Image /> */}</div>
                <div>
                  <p>@ImobiliariaMarquesLeao</p>
                  <Link href="">Se inscreva no canal</Link>
                </div>
              </li>
              <li>
                <div>{/* <Image /> */}</div>
                <div>
                  <p>@marqueseleao</p>
                  <Link href="">Seguir no Facebook</Link>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className="w-[min(90%,80rem)] mx-auto">
          <span>Nosso time</span>
          <h2>Corretores Marques</h2>
          <EstateAgents />
        </section>
        <section className="w-[min(90%,80rem)] mx-auto">
          <span>Na mídia</span>
          <h2>O que falam da Marques&Leão na mídia</h2>

        </section>
        <section className="w-[min(90%,80rem)] mx-auto">
          <span>Depoimentos</span>
          <h2>Veja alguns comentários dos nossos clientes</h2>
          <ul></ul>
        </section>
      </main>
      <WhatsappButton />
    </div>
  );
}
