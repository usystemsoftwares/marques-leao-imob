import EstateAgents from "@/components/estate-agents";
import Header from "@/components/header";
import NewsOfTheW from "@/components/news-of-the-w-carousel";
import SearchPropertyFilter from "@/components/search-property-filter";
import { WhatsappButton } from "@/components/whatsapp-btn";
import { Baskervville, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import MarquesELeao from "/public/marqueseleao/marques-leao.webp"
import BackgroundMenu from "/public/marqueseleao/background-menu.webp"
import Ellipse from "/public/marqueseleao/ellipse4.webp"
import SelectedForYou from "@/components/selected-for-you-carousel";

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
        className="bg-[rgb(0,0,0,.65)] absolute top-0 w-full h-full max-h-[280px] before:absolute before:bg-gradient-to-t before:from-[#0a0a0a] before:w-full before:h-full before:left-0 before:bottom-0"
      >
        <Image
          className="absolute top-0 -z-20 w-full h-full"
          src={BackgroundMenu}
          alt="Background"
        />
      </div>
      <Header />
      <main className="w-[min(90%,80rem)] mx-auto">
        <Image
          className="absolute -z-10 top-[-25%] opacity-45 right-[-12.5%] w-[27.5%]"
          src={Ellipse}
          alt="Ellipse blur"
        />
        <Image
          className="absolute -z-10 bottom-[-50%] opacity-60 left-[-35%] w-[75%]"
          src={Ellipse}
          alt="Ellipse blur"
        />
        <section className="min-h-screen relative">
          <h1 className={`text-[clamp(.75rem,9vw,2.25rem)] ${montserrat.className} relative z-10 font-extralight leading-none max-w-[23ch] pt-80 md:pt-40`}>
            Conectamos<br /> <span className={`text-[clamp(3rem,12.5vw,5rem)] md:text-[6rem] leading-[.75] ${baskervville.className} md:pr-11`}><strong>pessoas</strong></span> a imóveis
            <span className={`flex items-center text-[clamp(3rem,12.5vw,5rem)] md:text-[6rem] leading-[1] ${baskervville.className} before:inline-block before:w-[clamp(50%,10vw,100%)] before:h-[1px] before:bg-[#530944]`}>
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
          <div className="flex items-center justify-between">
            <div>
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Destaques</span>
              <h2 className={`text-3xl font-extrabold ${baskervville.className}`}>Selecionados para você</h2>
            </div>
            <Link href="" className="none md:block bg-[#530944] text-sm py-3 px-5 rounded-lg">Ver todos os imóveis</Link>
          </div>
          <SelectedForYou />
        </section>
        <section>
          <span>Filtre por</span>
          <h2>Cidades que atendemos</h2>
          <div>

          </div>
        </section>
        <section>
          <div>
            <span>Novidades</span>
            <h2>Novidades da semana</h2>
            <Link href="">Ver todos os imóveis</Link>
          </div>
          <NewsOfTheW />
        </section>
        <section>
          <article>
            <div>
              <h2>Pensando em Projetos e lançamentos?</h2>
              <p>Conheça aqui as novidades do mercado.</p>
              <Link href="">Conhecer Lançamentos</Link>
            </div>
            <div>
              {/* <Image /> */}
            </div>
          </article>
        </section>
        <section>
          <div>
            {/* <Image /> */}
          </div>
          <div>
            <span>Por que</span>
            <h2>Por que a Marques&Leão</h2>
            <p>Somos a maior vitrine imobiliária da região, investindo em vídeos, anúncios e inovação.</p>
            <div>
              <div>
                Anuncie seu imóvel conosco
              </div>
              <div>
                Fale com nossos corretores
              </div>
              <div>
                Seja parceiro Marques&Leão
              </div>
            </div>
          </div>
        </section>
        <section>
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
        <section>
          <span>Nosso time</span>
          <h2>Corretores Marques</h2>
          <EstateAgents />
        </section>
        <section>
          <span>Na mídia</span>
          <h2>O que falam da Marques&Leão na mídia</h2>

        </section>
        <section>
          <span>Depoimentos</span>
          <h2>Veja alguns comentários dos nossos clientes</h2>
          <ul></ul>
        </section>
      </main>
      <WhatsappButton />
    </div>
  );
}
