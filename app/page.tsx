import EstateAgents from "@/components/estate-agents";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import NewsOfTheW from "@/components/news-of-the-w-carousel";
import SelectedByYou from "@/components/selected-by-you-carousel";
import { WhatsappButton } from "@/components/whatsapp-btn";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="">
        <section>
          <h1>Conectamos pessoas a imóveis incríveis que refletem seus ideais e sua personalidade</h1>
        </section>
        <section>
          <div>
            <span>Destaques</span>
            <h2>Selecionados para você</h2>
            <Link href="" className="none md:block">Ver todos os imóveis</Link>
          </div>
          <SelectedByYou />
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
      <Footer />
      <WhatsappButton />
    </>
  );
}
