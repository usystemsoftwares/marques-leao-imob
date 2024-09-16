import Header from "@/components/header"
import { WhatsappButton } from "@/components/whatsapp-btn"
import Image from "next/image"
import PropertyFilter from "@/components/property-filter"
import { imoveis } from "@/data"

import EstateImage from "/public/marqueseleao/imovel-1.webp"
import Bed from "/public/marqueseleao/cama.svg"
import ResizeIcon from "/public/marqueseleao/resize-icon.svg"

import Link from "next/link"
import GoogleMap from "./components/google-map"

const PropertyPage = () => {
  /* TODO: CREATE ANOTHER SEARCH PROPERTY FILTER COMPONENT FOR THIS PAGE */

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="mt-28 mb-20">
        <section className="relative overflow-y-hidden">
          <div className="md:max-w-[57.5vw]">
            <div className="w-[min(90%,80rem)] mb-20 mx-auto">
              <PropertyFilter />
            </div>
            <div className="bg-white h-[2px] mt-10 mb-6"></div>
            <ul className="w-[min(90%,80rem)] mx-auto grid grid-cols-2 gap-4">
              {imoveis.map((estate) => (
                <li
                  className="w-[min(100%,28.125rem)]"
                  key={estate.id}>
                  <Link
                    className="group block relative"
                    href={`/imoveis/${estate.id}`}
                  >
                    <div className="pt-5">
                      {estate.exclusividade &&
                        <div className="absolute top-0 bg-[#530944] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">EXCLUSIVIDADE</div>
                      }
                      {estate.desconto &&
                        <div className="absolute -top-4 bg-[#095310] py-[.35rem] px-4 rounded-r-lg rounded-tl-lg">imóvel COM DESCONTO</div>
                      }
                      <Image
                        className="w-full rounded-lg"
                        src={EstateImage}
                        alt={estate.titulo}
                      />
                      <div className="flex items-center justify-between rounded-b-lg bg-[#666666] bg-opacity-60 py-2 px-2 md:px-8 absolute bottom-0 w-full left-0 group-hover:opacity-0 transition-opacity">
                        <p className="font-semibold text-sm md:text-base">R$ {estate.valores.precoVenda}</p>
                        <p className="text-[.75rem]">{estate.bairro} / {estate.cidade}</p>
                      </div>
                      <div className="absolute flex items-stretch rounded-b-lg overflow-hidden w-full bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity *:py-2">
                        <div className="w-[65%] bg-white flex pl-2 md:pl-4 gap-2 md:gap-7 text-black text-[.75rem]">
                          <span className="inline-flex gap-3 items-center">
                            <Image
                              src={ResizeIcon}
                              alt="Seta que indica tamanho"
                            />
                            125,14m
                          </span>
                          <span className="inline-flex gap-3 items-center">
                            <Image
                              src={Bed}
                              alt="Cama"
                            /> 3 quartos
                          </span>
                        </div>
                        <div className="w-[35%] flex items-center md:block text-center bg-mainPurple px-3">Conhecer</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-[42.5vw] md:h-full fixed right-0 top-0 bg-black z-20">
            <GoogleMap />
          </div>
          <WhatsappButton />
        </section>
      </main>
    </div>
  )
}

export default PropertyPage