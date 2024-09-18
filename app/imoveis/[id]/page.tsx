import Header from "@/components/header"
import { equipe, imoveis } from "@/data"
import Image from "next/image"
import Carousel from "@/components/carousel"
import { Baskervville } from "next/font/google"
import Link from "next/link"

import Ellipse from "/public/marqueseleao/ellipse4.webp"

import LocationIcon from "/public/marqueseleao/location-icon.svg"

import EstateBedIcon from "/public/marqueseleao/estate-bed-icon.svg"
import BathIcon from "/public/marqueseleao/bath-icon.svg"
import CarIcon from "/public/marqueseleao/car-icon.svg"
import DimensionIcon from "/public/marqueseleao/dimension-icon.svg"

import CheckIcon from "/public/marqueseleao/check-icon.svg"

import Whatsapp from "/public/marqueseleao/white-wpp-icon.svg"
import Instagram from "/public/marqueseleao/instagram-icon.svg"
import PropertyFilter from "@/components/property-filter"

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"]
});

const RealEstatePage = ({
  params: { id }
}: {
  params: { id: string }
}) => {
  const [estate] = imoveis.filter(imovel => imovel.id === id)
  const relatedEstates = imoveis.filter(imovel => estate.imoveisRelacionados.includes(imovel.id))
  const [estateAgent] = equipe.filter(agent => agent.link == estate.corretor)

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <PropertyFilter className="hidden lg:flex absolute mt-14 top-0 right-1/2 translate-x-[75%]" />
      <main className="mt-8">
        <section>
          <ul className="w-[calc(100%-2rem)] mx-auto grid gap-2 md:grid-cols-2">
            {estate.fotos.map((url, index) => {
              /* index começa como 0 e o método length não, então temos que adicionar 1 no index para a expressão fazer sentido */
              if (index + 1 != estate.fotos.length) {
                return (
                  <li key={url}>
                    <Image
                      className="rounded-[.625rem]"
                      src={url}
                      alt="Imóvel"
                      width={924}
                      height={598}
                    />
                  </li>
                )
              }
              return (
                <li
                  className="relative rounded-[.625rem] overflow-hidden after:absolute after:inset-0 after:backdrop-blur-sm"
                  key={url}>
                  <form
                    action=""
                    className="absolute w-[min(100%,19.875rem)] px-2 text-black right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 z-10"
                  >
                    <p className="lg:text-lg text-center font-medium">
                      <span className="block -mb-2 font-bold sm:text-3xl md:text-base lg:text-3xl">Acesso completo</span>
                      a todo o site em <strong>10 segundos</strong></p>
                    <div className="mt-2 flex flex-col items-center *:w-full md:*:w-[80%] lg:*:w-full *:outline-0 gap-2">
                      <input type="text" placeholder="Nome Completo" className="font-normal px-2 py-1 sm:px-3 sm:py-2 rounded-md" />
                      <input type="tel" placeholder="Telefone" className="font-normal px-2 py-1 sm:px-3 sm:py-2 rounded-md" />
                      <input type="email" placeholder="E-mail" className="font-normal px-2 py-1 sm:px-3 sm:py-2 rounded-md" />
                      <button
                        className="bg-mainPurple text-white rounded-full py-1 sm:py-2"
                        type="submit"
                      >Ver fotos</button>
                    </div>
                  </form>
                  <Image
                    className="rounded-[.625rem]"
                    src={url}
                    alt="Imóvel"
                    width={924}
                    height={598}
                  />
                </li>
              )
            })}
          </ul>
        </section>
        <section className="relative lg:pl-10 w-[min(90%,84.5rem)] mx-auto lg:ml-auto mt-16 lg:mr-28 lg:flex lg:justify-between lg:gap-28">
          <Image
            draggable={false}
            className="hidden lg:block absolute opacity-70 right-[-40%] -z-10 w-[75%]"
            src={Ellipse}
            alt="Ellipse blur"
          />
          <Image
            draggable={false}
            className="hidden lg:block absolute opacity-60 bottom-[-10%] left-[-45%] -z-10 w-[75%]"
            src={Ellipse}
            alt="Ellipse blur"
          />
          <div className="lg:w-[55%]">
            <div className="mb-8">
              <span className="text-[#707070]">Casa à venda · {estate.estado} · {estate.cidade} · Cód {estate.codigo}</span>
              <h1 className="text-4xl mt-6 font-bold">{estate.titulo}</h1>
              <div className="mt-4 flex items-center gap-3">
                {estate &&
                  <span className="inline-block bg-[#530944] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">EXCLUSIVIDADE</span>
                }
                {estate.desconto &&
                  <span className="bg-[#095310] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">imóvel COM DESCONTO</span>
                }
                <p className="text-[#707070]">casa para comprar em<br /></p>
              </div>
              <p className="mt-3 flex gap-3 underline"><Image src={LocationIcon} alt="Ícone de localização" /> {estate.bairro}, {estate.cidade}</p>
              <p className="text-5xl lg:text-[clamp(2.75rem,4.8vw,3.75rem)] font-semibold mt-5">R$ {estate.valores.precoVenda}</p>
              <p className="mt-4 text-[#707070]">Condomínio: R$ {estate.valores.condominio} · IPTU Anual: R$ {estate.valores.iptu}</p>
              <ul className="mt-12 flex text-[#E9E9E9] font-light items-center text-center text-sm gap-6 flex-wrap">
                <li><Image className="mx-auto mb-3" src={DimensionIcon} alt="Dimensão" /> Área do Terreno <br />{estate.informacoes.areaTerro} m</li>
                <li><Image className="mx-auto mb-3" src={DimensionIcon} alt="Dimensão" /> Área privativa <br />{estate.informacoes.areaPrivativa} m</li>
                <li><Image className="mx-auto mb-3" src={EstateBedIcon} alt="Cama" /> {estate.informacoes.dormitorios} dormitórios <br /> 1 suíte</li>
                <li><Image className="mx-auto mb-3" src={CarIcon} alt="Carro" />{estate.informacoes.vagasGaragem} vagas <br /> de garagem</li>
                <li><Image className="mx-auto mb-3" src={BathIcon} alt="Banheiro" /> {estate.informacoes.banheiros} banheiros</li>
              </ul>
            </div>
            <div className="pt-8 border-t border-[#707070]">
              <h2 className="text-3xl mb-6 font-semibold">Descrição do imóvel</h2>
              <p className="text-[#E9E9E9] text-lg font-light">{estate.descricao}</p>
            </div>
            <div className="mt-8">
              <h3 className={`text-3xl ${baskervville.className} tracking-wide`}>Informações adicionais</h3>
              <ul className="mt-3 grid font-light text-[#E9E9E9] gap-2 lg:grid-cols-2">{estate.informacoesAdicionais.map(info => (
                <li className="flex items-end gap-3" key={info}>
                  <Image
                    src={CheckIcon}
                    alt="Verificado"
                  />
                  {info}
                </li>
              ))}</ul>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-[45%]">
            <Link
              className="inline-block max-w-[23.125rem]"
              href={`/equipe/${estateAgent.link}`}
            >
              <Image
                className="rounded-[.625rem]"
                src={estateAgent.imagem}
                alt={estateAgent.nome}
                width={370}
                height={452}
              />
            </Link>
            <h2 className={`text-5xl lg:text-[clamp(3rem,5vw,3.75rem)] mt-5 ${baskervville.className}`}>{estateAgent.nome}</h2>
            <p className="mt-3 mb-5">{estateAgent.texto1}</p>
            <div className="lg:mr-10 flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 *:flex *:gap-2 *:items-center *:justify-center *:text-[1.0625rem] *:border-2 *:py-2 *:px-8 lg:px-0 lg:*:w-full *:rounded-lg">
              <Link
                className="bg-[#108D10] border-transparent"
                href="#">
                <Image
                  src={Whatsapp}
                  alt="Whatsapp"
                /> WhatsApp</Link>
              <Link
                className="border-white"
                href="#">
                <Image
                  src={Instagram}
                  alt="Instagram"
                /> Instagram</Link>
            </div>
          </div>
        </section>
        <section className="mt-12 mb-20">
          <div className="w-[min(90%,68rem)] mx-auto -mb-12">
            <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Relacionados</span>
            <h2 className={`text-3xl ${baskervville.className}`}>Imóveis Relacionados</h2>
          </div>
          <div className="w-full md:w-[min(90%,80rem)] mx-auto pt-12 relative">
            <Carousel estates={relatedEstates} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default RealEstatePage