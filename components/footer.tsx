import Image from "next/image";

import MarquesLeaoLogo from "/public/marqueseleao/Logo-Marques-Leao.webp";
import MarquesInstagram from "/public/marqueseleao/marques-instagram.webp";
import MarquesFacebook from "/public/marqueseleao/marques-facebook.webp";
import MarquesYoutube from "/public/marqueseleao/marques-youtube.webp";
import FacebookIcon from "/public/marqueseleao/facebook-icon.svg";
import InstagramIcon from "/public/marqueseleao/instagram-icon.svg";
import LinkedInIcon from "/public/marqueseleao/linkedin-icon.svg";
import YoutubeIcon from "/public/marqueseleao/youtube-icon.svg";
import EmailIcon from "/public/marqueseleao/email-icon.svg";
import PhoneIcon from "/public/marqueseleao/phone-icon.svg";
import LocationIcon from "/public/marqueseleao/location-icon.svg";

import Link from "next/link";
import { Empresa } from "smart-imob-types";
import { formatPhoneNumber } from "@/utils/formatarTelefoneParaWhatsApp";

const Footer = ({ empresa }: { empresa: Empresa }) => {
  return (
    <footer className="bg-gradient-to-t relative z-50 from-[#3a042f] to-[var(--background)] py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex lg:hidden justify-center flex-wrap gap-2">
          <Link
            className="border border-white text-[#530944] font-bold hover:text-white bg-white hover:bg-transparent transition-colors text-sm lg:text-lg py-3 px-6 rounded-lg"
            href={""}
          >
            Entrar em contato
          </Link>
          <Link
            className="border border-transparent lg:border-white bg-[#530944] lg:bg-transparent lg:hover:bg-white lg:hover:text-[#530944] font-bold transition-colors text-sm lg:text-lg py-3 px-6 rounded-lg"
            href={"/anunciar-imovel"}
          >
            Anunciar imóvel
          </Link>
        </div>
        <ul className="flex lg:hidden mt-6 max-w-[28rem] mx-auto items-center justify-between">
          <li className="text-center">
            <Image
              className="w-12 mx-auto"
              src={MarquesInstagram}
              alt="Marques&Leão"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <p className="text-[.5rem] my-1">@marqueseleao</p>
            <Link
              className="text-[.5rem] bg-[#530944] hover:bg-white hover:text-[#530944] px-3 py-2 rounded-lg"
              href="https://www.instagram.com/marqueseleao/"
              target="_blank"
            >
              Seguir no Instagram
            </Link>
          </li>
          <li className="text-center">
            <Image
              className="w-12 mx-auto"
              src={MarquesFacebook}
              alt="Marques&Leão"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <p className="text-[.5rem] my-1">@marqueseleao</p>
            <Link
              className="text-[.5rem] bg-[#530944] hover:bg-white hover:text-[#530944] px-3 py-2 rounded-lg"
              href="https://web.facebook.com/marqueseleao"
              target="_blank"
            >
              Seguir no Facebook
            </Link>
          </li>
          <li className="text-center">
            <Image
              className="w-12 mx-auto"
              src={MarquesYoutube}
              alt="Marques&Leão"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <p className="text-[.5rem] my-1">@ImobiliariaMarquesLeao</p>
            <Link
              className="text-[.5rem] bg-[#530944] hover:bg-white hover:text-[#530944] px-3 py-2 rounded-lg"
              href="https://www.youtube.com/c/ImobiliariaMarquesLeao/"
              target="_blank"
            >
              Se inscreva no canal
            </Link>
          </li>
        </ul>
        <div className="lg:flex lg:items-center lg:justify-between gap-2">
          <Image
            className="w-[7.188rem] mt-4 lg:mt-0 mx-auto lg:w-auto lg:mx-0"
            src={MarquesLeaoLogo}
            width={234}
            height={50}
            alt="Marques&Leão Logo"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
          {/* NAP - Nome, Endereço e Telefone para SEO Local */}
          <div className="hidden lg:block" itemScope itemType="https://schema.org/RealEstateAgent">
            <h3 className="font-bold text-lg mb-3" itemProp="name">Imobiliária Marques&Leão</h3>
            <ul className="*:flex *:items-center *:gap-2">
              <li itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <Image
                  src={LocationIcon}
                  alt="Endereço"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <span>
                  <span itemProp="streetAddress">{empresa.endereço || "Rua Principal, 123"}</span>, 
                  <span itemProp="addressLocality"> Novo Hamburgo</span>, 
                  <span itemProp="addressRegion"> RS</span>
                  <meta itemProp="addressCountry" content="BR" />
                </span>
              </li>
              <li className="mt-3">
                <Image
                  src={EmailIcon}
                  alt="Email"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <span itemProp="email">{empresa.email || "contato@marqueseleao.com"}</span>
              </li>
              <li className="mt-3">
                <Image
                  src={PhoneIcon}
                  alt="Telefone"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <span itemProp="telephone">
                  {empresa.telefone
                    ? formatPhoneNumber(empresa.telefone)
                    : "(51) 9 3209-0377"}
                </span>
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-400">
              <strong>Horário de Funcionamento:</strong><br/>
              Segunda a Sexta: 09:30 às 11:30 - 13:00 às 17:30<br/>
              Horário no telefone 24 horas
            </p>
          </div>
          <div className="hidden lg:block">
            <p>Acompanhe-nos</p>
            <ul className="flex items-center mt-1 gap-2">
              <li>
                <Link
                  href="https://www.instagram.com/marqueseleao/"
                  target="_blank"
                >
                  <Image
                    src={InstagramIcon}
                    alt="Instagram"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="https://web.facebook.com/marqueseleao"
                  target="_blank"
                >
                  <Image
                    src={FacebookIcon}
                    alt="Facebook"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href={
                    "https://br.linkedin.com/company/imobiliária-marques-&-leão"
                  }
                  target="_blank"
                >
                  <Image
                    src={LinkedInIcon}
                    alt="LinkedIn"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/c/ImobiliariaMarquesLeao/"
                  target="_blank"
                >
                  <Image
                    src={YoutubeIcon}
                    alt="Youtube"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden lg:flex flex-col text-center gap-2">
            <Link
              className="border border-white text-[#530944] font-bold hover:text-white bg-white hover:bg-transparent transition-colors text-sm lg:text-base py-3 px-7 rounded-lg"
              href={
                "https://wa.me/5193209037"
              }
              target="_blank"
            >
              Entrar em contato
            </Link>
            <Link
              className="border border-transparent lg:border-white bg-[#530944] lg:bg-transparent lg:hover:bg-white lg:hover:text-[#530944] font-bold transition-colors text-sm lg:text-base py-3 px-7 rounded-lg"
              href={"/anunciar-imovel"}
            >
              Anunciar imóvel
            </Link>
          </div>
        </div>
        {/* NAP Information for Mobile */}
        <div className="lg:hidden text-center my-6 px-4" itemScope itemType="https://schema.org/RealEstateAgent">
          <h3 className="font-bold text-lg mb-2" itemProp="name">Imobiliária Marques&Leão</h3>
          <p className="text-sm mb-1" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span itemProp="streetAddress">{empresa.endereço || "Rua Principal, 123"}</span>, 
            <span itemProp="addressLocality"> Novo Hamburgo</span>, 
            <span itemProp="addressRegion"> RS</span>
            <meta itemProp="addressCountry" content="BR" />
          </p>
          <p className="text-sm mb-1">
            <span itemProp="telephone">{empresa.telefone ? formatPhoneNumber(empresa.telefone) : "(51) 9 3209-0377"}</span>
          </p>
          <p className="text-sm mb-4">
            <span itemProp="email">{empresa.email || "contato@marqueseleao.com"}</span>
          </p>
        </div>
        
        <p className="text-center lg:max-w-[20ch] ml-auto mr-2 my-4 lg:my-0 lg:mt-4 text-sm">
          Política de Privacidade Termos de Uso
        </p>
        <p className="text-center text-sm tracking-widest">
          Todos os direitos reservados para{" "}
          <strong className="whitespace-nowrap">
            Imobiliária Marques&Leão
          </strong>
        </p>
        <a href={"https://smtximob.com"} target="_blank">
          <p className="text-center text-sm tracking-widest">
            Desenvolvido por <strong className="whitespace-nowrap">SMTX</strong>
          </p>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
