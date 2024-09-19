import Header from "@/components/header"
import { equipe, imoveis } from "@/data"
import Image from "next/image"
import Link from "next/link"
import Whatsapp from "/public/marqueseleao/white-wpp-icon.svg"
import Instagram from "/public/marqueseleao/instagram-icon.svg"
import Carousel from "@/components/carousel"

const Membro = ({
  params: { link }
}: {
  params: { link: string }
}) => {
  const [membro] = equipe.filter((membro) => membro.link === link)
  const imoveisDoCorretor = imoveis.filter(imovel => imovel.corretor === membro.link)

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="mt-28 mb-20">
        <section className="w-[min(90%,75rem)] mx-auto flex flex-col md:flex-row items-center md:justify-center gap-14">
          <div>
            <Image
              className="rounded-[.625rem]"
              src={membro.imagem}
              alt={membro.nome}
              width={411}
              height={524}
            />
          </div>
          <div className="md:w-1/2">
            <div className="flex items-end justify-between">
              <h1 className={`text-5xl font-bold uppercase font-baskervville`}>{membro.nome}</h1>
              <span className="hidden lg:inline text-[#707070]">CRECI: {membro.creci}</span>
            </div>
            <p className="mt-3 mb-4 text-[#d6d6d6]">{membro.texto1}</p>
            <p className="text-[#d6d6d6]">{membro.texto2}</p>
            <div className="flex mt-7 items-center gap-6">
              <p><span className="text-3xl block font-bold">+{membro.imoveisCarteira}</span> imóveis <br /> em carteira</p>
              <p><span className="text-3xl block font-bold">+{membro.anosExperiencia}</span> anos de <br /> experiência</p>
            </div>
            <div className="lg:mr-28 mt-4 flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 *:flex *:gap-2 *:items-center *:justify-center *:text-[1.0625rem] *:border-2 *:py-2 *:px-11 lg:px-0 lg:*:w-full *:rounded-lg">
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
        <section className="w-full md:w-[min(90%,80rem)] mx-auto mt-20 relative">
          <div className="w-[min(90%,75rem)] mx-auto">
            <span className="flex gap-4 items-center text-[#898989] after:inline-block after:w-28 after:h-[2px] after:bg-[#898989]">Do corretor</span>
            <h2 className={`text-3xl font-baskervville`}>Imóveis do Corretor</h2>
          </div>
          <div>
            <Carousel
              estates={imoveisDoCorretor}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Membro