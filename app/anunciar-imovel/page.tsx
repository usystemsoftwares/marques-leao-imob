import Header from "@/components/header"
import { Baskervville } from "next/font/google";
import Image from "next/image";
import CheckIcon from "/public/marqueseleao/check-icon.svg"

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"]
});

const AdvertiseEstate = () => {
  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="w-[min(90%,68rem)] mx-auto">
        <div className="text-center">
          <h1 className={`text-4xl ${baskervville.className}`}>Interessado em anunciar seu imóvel?</h1>
          <p className="text-2xl">Veja se ele se encaixa em nossos <span className="font-semibold">pré-requisitos...</span></p>
        </div>
        <section>
          <div>
            <h2>
              <span className="flex">Para anunciar conosco, </span>
              seu imóvel precisa:
            </h2>
            <ul className="*:flex *:gap-3">
              <li>
                <Image
                  src={CheckIcon}
                  alt="Ícone de verificado"
                />
                <div>
                  <h3 className="font-semibold text-xl">Localização</h3>
                  <p className="font-light">Estar localizado em Novo Hamburgo, Campo Bom ou Estância Velha no Rio Grande do Sul. Caso seja em Santa Catarina, é necessário estar situado na região de Itapema;</p>
                </div>
              </li>
              <li>
                <Image
                  src={CheckIcon}
                  alt="Ícone de verificado"
                />
                <div>
                  <h3 className="font-semibold text-xl">Valor mínimo</h3>
                  <p>Ter um ticket médio de entrada - acima de R$500,00 mil;</p>
                </div>
              </li>
              <li>
                <Image
                  src={CheckIcon}
                  alt="Ícone de verificado"
                />
                <div>
                  <h3 className="font-semibold text-xl">Tipo de empreendimento</h3>
                  <p className="font-light">SSer apartamento, casa, terreno ou área (não trabalhamos com comercial nem aluguel);</p>
                </div>
              </li>
              <li>
                <Image
                  src={CheckIcon}
                  alt="Ícone de verificado"
                />
                <div>
                  <h3 className="font-semibold text-xl">Lançamentos</h3>
                  <p className="font-light">Ser lançamento (imóvel na planta).</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <form action=""></form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdvertiseEstate