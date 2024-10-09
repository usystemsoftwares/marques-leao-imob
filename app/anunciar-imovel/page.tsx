"use client";
import Header from "@/components/header";
import Image from "next/image";
import CheckIcon from "/public/marqueseleao/check-icon.svg";
import Link from "next/link";

import MarquesInstagram from "/public/marqueseleao/marques-instagram.webp";
import MarquesFacebook from "/public/marqueseleao/marques-facebook.webp";
import MarquesYoutube from "/public/marqueseleao/marques-youtube.webp";
import FacebookIcon from "/public/marqueseleao/facebook-icon.svg";
import InstagramIcon from "/public/marqueseleao/instagram-icon.svg";
import YoutubeIcon from "/public/marqueseleao/youtube-icon.svg";
import { useState } from "react";

const AdvertiseEstate = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [valor, setValor] = useState("");
  const [empreendimento, setEmpreendimento] = useState("");
  const [fotos, setFotos] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const cleaned = ("" + value).replace(/\D/g, "");
    const part1 = cleaned.substring(0, 2);
    const part2 = cleaned.substring(2, 7);
    const part3 = cleaned.substring(7, 11);
    let formatted = "";
    if (part1) formatted += `(${part1}`;
    if (part2) formatted += `) ${part2}`;
    if (part3) formatted += `-${part3}`;
    return formatted;
  };

  const handlePhoneChange = (e: any) => {
    let value = e.target.value;
    if (value.length <= 15) {
      const formattedNumber = formatPhoneNumber(value);
      setTelefone(formattedNumber);
    }
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const sendContact = async () => {
    try {
      setLoading(true);
      if (!nome || !telefone || !localizacao || !valor || !empreendimento) {
        setLoading(false);
        return alert("Preencha todos os campos obrigatórios.");
      }

      if (!telefone.match(/^\([0-9]{2}(?:\))\s?[0-9]{5}(?:-)[0-9]{4}$/)) {
        setLoading(false);
        return alert("Insira um telefone válido!");
      }

      const cliente = {
        nome,
        telefone: telefone.replace(/\D/g, ""),
        localizacao,
        valor,
        empreendimento,
        fotos,
      };

      // A função EnviarContato deve ser similar ao que você implementou anteriormente
      const uri =
        process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;

      const response = await fetch(`${uri}/imoveis`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      const res = await response.json();

      if (res.success) {
        alert("Informações enviadas com sucesso!");
        setNome("");
        setTelefone("");
        setLocalizacao("");
        setValor("");
        setEmpreendimento("");
        setFotos("");
      } else {
        alert("Ocorreu um erro ao enviar as informações.");
      }

      setLoading(false);
    } catch (error) {
      console.log("Erro ao enviar o contato:", error);
      setLoading(false);
      alert("Ocorreu um erro inesperado.");
    }
  };

  return (
    <div className="bg-menu bg-no-repeat">
      <Header />
      <main className="w-[min(90%,68rem)] mt-14 mx-auto">
        <div className="text-center">
          <h1 className={`text-4xl font-baskervville mb-3`}>
            Interessado em anunciar seu imóvel?
          </h1>
          <p className="text-2xl font-light border-b-2 mx-auto pb-1 w-fit border-b-mainPurple">
            Veja se ele se encaixa em nossos{" "}
            <span className="font-semibold">pré-requisitos...</span>
          </p>
        </div>
        <section className="mt-28 mb-20 flex flex-col lg:flex-row justify-center lg:justify-between">
          <div className="max-w-[31.25rem] lg:max-w-full mx-auto lg:mx-0">
            <div className="lg:w-[85%] flex justify-between lg:after:bg-[#898989] lg:after:w-[1px]">
              <div className="lg:w-[83%]">
                <h2>
                  <span className="flex gap-2 items-center text-[#898989] after:inline-block after:w-20 after:h-[2px] after:bg-[#898989]">
                    Para anunciar conosco,{" "}
                  </span>
                  <span className={`font-baskervville text-4xl`}>
                    seu imóvel precisa:
                  </span>
                </h2>
                <ul className="*:mt-5 pb-10 *:flex *:gap-3">
                  <li>
                    <Image
                      src={CheckIcon}
                      alt="Ícone de verificado"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    <div>
                      <h3 className="font-semibold text-xl">Localização</h3>
                      <p className="font-light text-[#707070]">
                        Estar localizado em Novo Hamburgo, Campo Bom ou Estância
                        Velha no Rio Grande do Sul. Caso seja em Santa Catarina,
                        é necessário estar situado na região de Itapema;
                      </p>
                    </div>
                  </li>
                  <li>
                    <Image
                      src={CheckIcon}
                      alt="Ícone de verificado"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    <div>
                      <h3 className="font-semibold text-xl">Valor mínimo</h3>
                      <p className="font-light text-[#707070]">
                        Ter um ticket médio de entrada - acima de R$500 mil;
                      </p>
                    </div>
                  </li>
                  <li>
                    <Image
                      src={CheckIcon}
                      alt="Ícone de verificado"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    <div>
                      <h3 className="font-semibold text-xl">
                        Tipo de empreendimento
                      </h3>
                      <p className="font-light text-[#707070]">
                        Ser apartamento, casa, terreno ou área (não trabalhamos
                        com comercial nem aluguel);
                      </p>
                    </div>
                  </li>
                  <li>
                    <Image
                      src={CheckIcon}
                      alt="Ícone de verificado"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    <div>
                      <h3 className="font-semibold text-xl">Lançamentos</h3>
                      <p className="font-light text-[#707070]">
                        Ser lançamento (imóvel na planta).
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <ul className="hidden lg:mt-16 lg:flex lg:flex-wrap gap-y-6 gap-x-4 *:flex *:items-center *:gap-5">
              <li>
                <div>
                  <Image
                    className="w-[4.5rem]"
                    src={MarquesInstagram}
                    alt="Foto de Pablo Marques e Gabriel Leão"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                </div>
                <div>
                  <p className="mb-3">@marqueseleao</p>
                  <Link
                    className="flex items-center font-semibold text-[.75rem] gap-2 bg-mainPurple rounded-[.635rem] py-3 px-5"
                    href="https://www.instagram.com/marqueseleao/"
                    target="_blank"
                  >
                    <Image
                      src={InstagramIcon}
                      alt="Instagram"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    Seguir no Instagram
                  </Link>
                </div>
              </li>
              <li>
                <div>
                  <Image
                    className="w-[4.5rem]"
                    src={MarquesYoutube}
                    alt="Foto de Pablo Marques e Gabriel Leão"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                </div>
                <div>
                  <p className="mb-3">@ImobiliariaMarquesLeao</p>
                  <Link
                    className="flex items-center font-semibold text-[.75rem] gap-2 max-w-[24ch] bg-mainPurple rounded-[.635rem] py-3 px-5"
                    href="https://www.youtube.com/c/ImobiliariaMarquesLeao/"
                    target="_blank"
                  >
                    <Image
                      className="w-[1.0625rem]"
                      src={YoutubeIcon}
                      alt="Youtube"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    Se inscreva no canal
                  </Link>
                </div>
              </li>
              <li>
                <div>
                  <Image
                    className="w-[4.5rem]"
                    src={MarquesFacebook}
                    alt="Foto de Pablo Marques e Gabriel Leão"
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }} />
                </div>
                <div>
                  <p className="mb-3">@marqueseleao</p>
                  <Link
                    className="flex items-center font-semibold text-[.75rem] gap-2 bg-mainPurple rounded-[.635rem] py-3 px-5"
                    href="https://web.facebook.com/marqueseleao"
                    target="_blank"
                  >
                    <Image
                      src={FacebookIcon}
                      alt="Facebook"
                      style={{
                        maxWidth: "100%",
                        height: "auto"
                      }} />
                    Seguir no Facebook
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="lg:w-4/6 mt-16 lg:mt-10">
            <h2 className="text-center lg:text-start">
              <span className="flex justify-center lg:justify-normal gap-2 items-center text-[#898989] after:inline-block after:w-20 after:h-[2px] after:bg-[#898989]">
                Se o seu imóvel cumpre esses quesitos
              </span>
              <div className={`font-baskervville text-3xl`}>
                Preencha seus dados abaixo
              </div>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendContact();
              }}
              className="max-w-[28.125rem] lg:max-w-[21.875rem] mx-auto lg:mx-0 mt-6 flex flex-col gap-4 bg-mainPurple p-5 rounded-[.625rem]"
            >
              <label>
                Nome Completo
                <input
                  placeholder="Nome completo"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-3 px-4"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </label>
              <label>
                Telefone
                <input
                  placeholder="(00) 9 0000-0000"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-3 px-4"
                  type="tel"
                  value={telefone}
                  onChange={handlePhoneChange}
                />
              </label>
              <label>
                Localização
                <input
                  placeholder="Selecione"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-3 px-4"
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                />
              </label>
              <label>
                Valor
                <input
                  placeholder="Selecione"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-3 px-4"
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </label>
              <label className="mt-3">
                Empreendimento
                <input
                  placeholder="Selecione"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-3 px-4"
                  type="text"
                  value={empreendimento}
                  onChange={(e) => setEmpreendimento(e.target.value)}
                />
              </label>
              <label>
                Fotos
                <input
                  placeholder="Anexar fotos"
                  className="w-full outline-none text-black mt-1 text-sm rounded-[.625rem] py-3 px-4"
                  type="text"
                  value={fotos}
                  onChange={(e) => setFotos(e.target.value)}
                />
              </label>
              <button
                className="bg-[#108d10] mt-2 py-2 rounded-[.625rem] text-white flex items-center justify-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Enviar informações"
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdvertiseEstate;
