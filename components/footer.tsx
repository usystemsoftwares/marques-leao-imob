import Image from "next/image"
import MarquesLeaoLogo from "/public/marqueseleao/Logo-Marques-Leao.webp"
import MarquesInstagram from "/public/marqueseleao/marques-instagram.webp"
import MarquesFacebook from "/public/marqueseleao/marques-facebook.webp"
import MarquesYoutube from "/public/marqueseleao/marques-youtube.webp"
import Link from "next/link"
import { Baskervville } from "next/font/google"

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: "400"
});

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#3a042f] to-transparent mx-auto py-8">
      <div className="w-[min(90%,80rem)] mx-auto">
        <div className="flex lg:hidden justify-center flex-wrap gap-2">
          <Link className="border border-white text-[#530944] font-bold hover:text-white bg-white hover:bg-transparent transition-colors text-sm lg:text-lg py-3 px-6 rounded-lg" href={""}>Entrar em contato</Link>
          <Link className="border border-transparent lg:border-white bg-[#530944] lg:bg-transparent lg:hover:bg-white lg:hover:text-[#530944] font-bold transition-colors text-sm lg:text-lg py-3 px-6 rounded-lg" href={""}>Anunciar imóvel</Link>
        </div>
        <ul className="flex lg:hidden mt-6 max-w-[28rem] mx-auto items-center justify-between">
          <li className="text-center">
            <Image
              className="w-12 mx-auto"
              src={MarquesInstagram}
              alt="Marques e Leão"
            />
            <p className="text-[.5rem] my-1">@marqueseleao</p>
            <Link className="text-[.5rem] bg-[#530944] hover:bg-white hover:text-[#530944] px-3 py-2 rounded-lg" href={""}>Seguir no Instagram</Link>
          </li>
          <li className="text-center">
            <Image
              className="w-12 mx-auto"
              src={MarquesFacebook}
              alt="Marques e Leão"
            />
            <p className="text-[.5rem] my-1">@marqueseleao</p>
            <Link className="text-[.5rem] bg-[#530944] hover:bg-white hover:text-[#530944] px-3 py-2 rounded-lg" href={""}>Seguir no Facebook</Link>
          </li>
          <li className="text-center">
            <Image
              className="w-12 mx-auto"
              src={MarquesYoutube}
              alt="Marques e Leão"
            />
            <p className="text-[.5rem] my-1">@ImobiliariaMarquesLeao</p>
            <Link className="text-[.5rem] bg-[#530944] hover:bg-white hover:text-[#530944] px-3 py-2 rounded-lg" href={""}>Se inscreva no canal</Link>
          </li>
        </ul>
        <div className="lg:flex lg:items-center lg:justify-between gap-2">
          <Image
            className="w-[7.188rem] mt-4 lg:mt-0 mx-auto lg:w-auto lg:mx-0"
            src={MarquesLeaoLogo}
            width={234}
            height={50}
            alt="Marques & Leão Logo"
          />
          <ul className="hidden lg:block">
            <li>contato@marqueseleao.com</li>
            <li>00 9 0000-0000</li>
          </ul>
          <div className="hidden lg:block">
            <p>Acompanhe-nos</p>
            <ul className="flex">
              {/* <li><Image src={""} alt="Instagram" /></li>
              <li><Image src={""} alt="Facebook" /></li>
              <li><Image src={""} alt="LinkedIn" /></li>
              <li><Image src={""} alt="Youtube" /></li> */}
              <div className="w-12"></div>
              <div className="w-12"></div>
              <div className="w-12"></div>
              <div className="w-12"></div>
            </ul>
          </div>
          <div className="hidden lg:flex flex-col text-center gap-2">
            <Link
              className="border border-white text-[#530944] font-bold hover:text-white bg-white hover:bg-transparent transition-colors text-sm lg:text-base py-3 px-7 rounded-lg"
              href={""}
            >Entrar em contato</Link>
            <Link
              className="border border-transparent lg:border-white bg-[#530944] lg:bg-transparent lg:hover:bg-white lg:hover:text-[#530944] font-bold transition-colors text-sm lg:text-base py-3 px-7 rounded-lg"
              href={""}
            >Anunciar imóvel</Link>
          </div>
        </div>
        <p className="text-center lg:max-w-[20ch] ml-auto mr-2 my-4 lg:my-0 lg:mt-4 text-sm">Política de Privacidade Termos de Uso</p>
        <p className={`text-center text-sm tracking-widest`}>Todos os direitos reservados para <strong>Imobiliária Marques & Leão</strong></p>
      </div>
    </footer>
  )
}

export default Footer