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
      <main className="w-[min(90%,68rem)] mt-14 mx-auto">
        <div className="text-center">
          <h1 className={`text-4xl ${baskervville.className} mb-3`}>Interessado em anunciar seu imóvel?</h1>
          <p className="text-2xl font-light border-b-2 mx-auto pb-1 w-fit border-b-mainPurple">Veja se ele se encaixa em nossos <span className="font-semibold">pré-requisitos...</span></p>
        </div>
        <section className="flex justify-between gap-8">
          <div className="w-1/2">
            <h2>
              <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Para anunciar conosco, </span>
              <span className={`${baskervville.className}`}>seu imóvel precisa:</span>
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
          <div className="w-1/2">
            <h2>
              <span>Se o seu imóvel cumpre esses quesitos</span>
              Preencha seus dados abaixo
            </h2>
            <form className="max-w-[23.75rem] flex flex-col *:font-semibold gap-4 bg-mainPurple py-5 px-4 rounded-[.625rem]" action="">
              <label>
                Nome Completo
                <input
                  placeholder="Nome completo"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-2 px-4"
                  type="text" />
              </label>
              <label>
                Telefone
                <input
                  placeholder="(00) 9 0000-0000"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-2 px-4"
                  type="tel" />
              </label>
              <label>
                Localização
                <input
                  placeholder="Nome completo"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-2 px-4"
                  type="text" />
              </label>
              <label>
                Valor
                <input
                  placeholder="Nome completo"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-2 px-4"
                  type="text" />
              </label>
              <label className="mt-3">
                Empreendimento
                <input
                  placeholder="Nome completo"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-2 px-4"
                  type="text" />
              </label>
              <label>
                Fotos
                <input
                  placeholder="Nome completo"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-2 px-4"
                  type="text" />
              </label>
              <button className="bg-[#108d10] mt-2 py-2 rounded-[.625rem]" type="submit">Enviar informações</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdvertiseEstate