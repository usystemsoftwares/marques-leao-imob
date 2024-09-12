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
import PabloEGabriel from "/public/marqueseleao/foto-pablo-e-gabriel.webp"
import MarquesInstagram from "/public/marqueseleao/marques-instagram.webp"
import MarquesFacebook from "/public/marqueseleao/marques-facebook.webp"
import MarquesYoutube from "/public/marqueseleao/marques-youtube.webp"
import FacebookIcon from "/public/marqueseleao/facebook-icon.svg"
import InstagramIcon from "/public/marqueseleao/instagram-icon.svg"
import YoutubeIcon from "/public/marqueseleao/youtube-icon.svg"
import HandshakeIcon from "/public/marqueseleao/handshake-icon.svg"
import WhatsappPurpleIcon from "/public/marqueseleao/whatsapp-purple-icon.svg"
import SearchIcon from "/public/marqueseleao/search-icon.svg"
import SelectedForYou from "./components/selected-for-you-carousel";
import CitiesCarousel from "./components/cities-carousel";
import TestimonialsCarousel from "./components/testimonials-carousel";
import MarquesLeaoMidiaCarousel from "./components/marques-leao-midia-carousel";

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
            priority
          />
          <SearchPropertyFilter />
        </section>
        <section className="w-[min(90%,80rem)] mx-auto relative">
          <div className="flex items-center justify-between">
            <div className="relative">
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Destaques</span>
              <h2 className={`text-3xl font-extrabold ${baskervville.className}`}>Selecionados para você</h2>
            </div>
            <Link href="" className="hidden md:block bg-mainPurple hover:bg-white hover:text-black transition-colors text-sm py-3 px-5 rounded-lg">Ver todos os imóveis</Link>
          </div>
          <SelectedForYou />
        </section>
        <section className="w-[min(90%,80rem)] mx-auto mt-20">
          <div className="grid place-items-center">
            <span className="flex gap-4 items-center text-[#898989] before:inline-block before:w-28 before:h-[2px] before:bg-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Filtre por</span>
            <h2 className={`text-4xl font-extrabold ${baskervville.className}`}>Cidades que atendemos</h2>
          </div>
          <div>
            <CitiesCarousel
              baskervville={baskervville.className}
            />
          </div>
        </section>
        <section className="w-[min(90%,80rem)] mx-auto mt-20 relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Novidades</span>
              <h2 className={`text-3xl font-extrabold ${baskervville.className}`}>Novidades da semana</h2>
            </div>
            <Link className="hidden md:block bg-mainPurple hover:bg-white hover:text-black transition-colors text-sm py-3 px-5 rounded-lg" href="">Ver todos os imóveis</Link>
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
        <section className="w-[min(90%,75rem)] relative mt-24 mb-12 mx-auto flex flex-col items-center md:flex-row md:items-center md:justify-between md:gap-8">
          <Image
            draggable={false}
            className="hidden lg:block absolute bottom-[50%] translate-y-[50%] opacity-70 right-[-75%] -z-10 w-[85%]"
            src={Ellipse}
            alt="Ellipse blur"
          />
          <div>
            <Image
              className="rounded-xl mx-auto md:mx-0 w-[min(100%,34.375rem)]"
              src={Media}
              alt="Gabriel Leão de costa para foto, de frente para uma casa"
            />
          </div>
          <div className="mt-16 md:mt-0">
            <span className="flex items-center gap-2 text-[#898989] after:inline-block after:w-28 after:h-[1.75px] after:bg-[#898989]">Por que</span>
            <h2 className={`text-3xl tracking-wide ${baskervville.className}`}>Por que a Marques&Leão?</h2>
            <p className="mt-3 mb-6 max-w-[40ch] text-[#a7a7a7] leading-5">Somos <span className="text-white">a maior vitrine imobiliária</span> da região, investindo em vídeos, anúncios e inovação.</p>
            <ul className="grid md:grid-cols-3 md:*:w-[min(100%,12.5rem)] md:*:h-full md:*:aspect-square *:inline-flex md:*:flex-col *:items-center md:*:items-start md:*:justify-between *:gap-4 md*:gap-0 *:font-bold text-[.813rem] md:text-sm lg:*:text-lg *:rounded-[.625rem] *:px-4 *:py-2 md:*:py-6 lg:*:py-8 md:*:px-2 lg:*:px-4 gap-3 marques_leao">
              <li className="bg-mainPurple !py-3 md:!py-6 lg:!py-8 !text-[.9375rem] md:!text-sm lg:!text-lg">
                <div className="w-5 lg:w-auto">
                  <Image
                    src={SearchIcon}
                    alt="Ícone de pesquisa"
                  />
                </div>
                <p>Anuncie seu imóvel conosco</p>
              </li>
              <li className="bg-white text-mainPurple">
                <div className="w-5 lg:w-auto">
                  <Image
                    src={WhatsappPurpleIcon}
                    alt="Whatsapp"
                  />
                </div>
                <p className="max-w-[15ch] md:max-w-auto">Fale com nossos corretores</p>
              </li>
              <li className="bg-white text-mainPurple">
                <div className="w-5 lg:w-auto">
                  <Image
                    src={HandshakeIcon}
                    alt="Ícones de aperto de mãos"
                  />
                </div>
                <p className="max-w-[15ch] md:max-w-auto">Seja parceiro Marques&Leão</p>
              </li>
            </ul>
          </div>
        </section>
        <section className="w-[min(90%,80rem)] relative mt-36 mx-auto flex flex-col lg:flex-row items-center gap-[clamp(1rem,2.5vw,2.5rem)]">
          <Image
            draggable={false}
            className="hidden lg:block absolute bottom-[-40%] opacity-75 right-[-40%] -z-10 w-[45%]"
            src={Ellipse}
            alt="Ellipse blur"
          />
          <div className="w-[min(100%,37.5rem)] lg:flex-1">
            <Image
              className="rounded-[.635rem]"
              src={PabloEGabriel}
              alt="Pablo Marques e Gabriel Leão"
            />
          </div>
          <div className="w-[min(100%,37.5rem)] sm:mt-4 lg:mt-0 lg:flex-1 flex flex-row-reverse lg:flex-row gap-[clamp(1rem,2vw,2.5rem)]">
            <div className="w-full lg:max-w-[32ch]">
              <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2rem,3vw,3rem)] font-bold lg:!leading-[clamp(2rem,4vw,3.5rem)] ${baskervville.className}`}>Pablo Marques & Gabriel Leão</h2>
              <p className="sm:text-lg lg:text-lg text-[#d2d2d2] !leading-6 mt-2">Nosso trabalho tem como foco a <span className="text-white font-semibold">conexão entre tecnologia e atendimento de alta performance</span>, com o objetivo de otimizar a jornada e melhorar experiência do cliente.</p>
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
                    <p className="text-[clamp(.875rem,1.5vw,1.125rem)] mb-3">@marqueseleao</p>
                    <Link
                      className="flex items-center font-semibold text-sm gap-2 bg-mainPurple rounded-[.635rem] py-3 px-5"
                      href=""
                    >
                      <Image
                        src={InstagramIcon}
                        alt="Instagram"
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
                    />
                  </div>
                  <div>
                    <p className="text-[clamp(.875rem,1.5vw,1.125rem)] mb-3">@ImobiliariaMarquesLeao</p>
                    <Link
                      className="flex items-center font-semibold text-sm gap-2 max-w-[23ch] bg-mainPurple rounded-[.635rem] py-3 px-5"
                      href=""
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
                    <p className="text-[clamp(.875rem,1.5vw,1.125rem)] mb-3">@marqueseleao</p>
                    <Link
                      className="flex items-center font-semibold text-sm gap-2 bg-mainPurple rounded-[.635rem] py-3 px-5"
                      href=""
                    >
                      <Image
                        src={FacebookIcon}
                        alt="Facebook"
                      />
                      Seguir no Facebook
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex gap-[clamp(1rem,1.5vw,2rem)] after:bg-mainPurple after:w-[2px] after:inline-block after:h-48 lg:after:content-none lg:before:bg-mainPurple lg:before:w-[2px] lg:before:inline-block lg:before:h-48">
              <h3 className="sm:text-xl lg:text-[clamp(.875rem,4vw,1.5rem)] text-end lg:text-start text-[#707070] mt-6 leading-7 lg:max-w-[9ch]">As mentes por trás do negócio</h3>
            </div>
          </div>
        </section>
        <section className="w-[min(90%,80rem)] mt-14 mb-24 mx-auto">
          <span className="text-[#898989] flex gap-4 items-center after:w-[7.5rem] after:bg-[#898989] after:h-[2px]">Nosso time</span>
          <h2 className={`text-3xl ${baskervville.className}`}>Corretores Marques</h2>
          <EstateAgents
            baskervville={baskervville.className}
          />
        </section>
        <section className="w-[min(90%,68rem)] relative mx-auto">
          <div className="max-w-[35ch]">
            <span className="text-[#898989] flex gap-4 items-center after:w-[7.5rem] after:bg-[#898989] after:h-[2px]">Na mídia</span>
            <h2 className={`text-3xl ${baskervville.className}`}>O que falam da Marques&Leão na mídia</h2>
          </div>
          <MarquesLeaoMidiaCarousel />
        </section>
        <section className="w-[min(90%,68rem)] mt-12 mb-8 mx-auto">
          <TestimonialsCarousel />
        </section>
      </main>
      <WhatsappButton />
    </div>
  );
}
