"use client";

import { getUtms } from "@/utils/get-utms";
import Image from "next/image";
import React, { useState } from "react";
import { Cliente } from "smart-imob-types";
import InputMask from "react-input-mask";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export default function FormContact({
  index,
  source,
  resized,
  afiliado_id,
  agenciador_id,
  imovel_id,
  imovel_codigo,
  temporada,
  empresa_id,
}: {
  index: number;
  source: any;
  resized: string | undefined;
  afiliado_id: string | undefined;
  agenciador_id: string | null;
  imovel_id: string;
  imovel_codigo: string;
  temporada: boolean;
  empresa_id: string;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [verificando, setVerificando] = useState(false);

  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function removerMascaraTelefone(telefone: string): string {
    return telefone.replace(/\D/g, "");
  }

  const EnviarContato = async (config: any) => {
    try {
      const uri =
        process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;
      const empresa_id: any =
        process.env.EMPRESA_ID ?? process.env.NEXT_PUBLIC_EMPRESA_ID;

      const { nome, telefone, DDD } = config.cliente;
      const email = config.cliente.email.toLowerCase();
      if (config.roleta && !config.cliente.registro_por_afiliado_id) {
        config.cliente.corretor_responsavel_id = null;
      }
      if (!nome || !email || !telefone || !DDD) {
        alert(
          "Algum campo no formulário de cadastro não foi preenchido corretamente"
        );
        return config.cliente;
      }
      if (telefone.length < 7) {
        alert("O número de telefone não está em um formato aceitavel!");
        return config.cliente;
      }
      const response = await fetch(`${uri}/clientes`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...config.cliente,
          empresa_id,
          email,
        }),
      });
      const res = await response.json();

      if (res.visitante_id) {
        localStorage.setItem("visitante_id", res.visitante_id);
        localStorage.setItem("uid", res.id);
      } else {
        localStorage.setItem("uid", res.id);
      }
      return res.id;
    } catch (error) {
      console.log("erro no cadastro:", error);
      alert("Um erro inesperado ocorreu ao tentar enviar um contato!");
      return config.cliente;
    }
  };

  async function onConfirm() {
    try {
      if (verificando) return;

      setVerificando(true);

      if (!validateEmail(email)) {
        setVerificando(false);
        return alert("O email enviado é inválido!");
      }

      if (!telefone.match(/^\([0-9]{2}(?:\))\s?[0-9]{5}(?:-)[0-9]{4}$/)) {
        setVerificando(false);
        return alert("Insira um telefone válido!");
      }

      const telefoneSemMascara = removerMascaraTelefone(telefone);
      const DDD = telefoneSemMascara.slice(0, 2);
      const numeroTelefone = telefoneSemMascara.slice(2);

      const utmData = getUtms();
      const cliente: Cliente = {
        foto: null,
        nome,
        created_at: new Date(),
        edited_at: new Date(),
        email,
        DDD,
        telefone: numeroTelefone,
        CPF: null,
        FGTS: null,
        conjuge_nome: "",
        corretor_responsavel_id: afiliado_id || agenciador_id || null,
        dependentes: null,
        entrada: 1,
        excluido: false,
        imoveis_cadastrados: imovel_id ? [imovel_id] : [],
        imoveis_visitados: [],
        imovel_origem_id: imovel_id ? imovel_id : null,
        visitante_id: localStorage.getItem("visitante_id"),
        possui_emprestimo: false,
        renda: null,
        registro_por_afiliado_id: afiliado_id || null,
        proprietario: false,
        status: "Cadastrado recentemente",
        timeline: [
          {
            descrição: "Parabéns! Mais um cliente na sua lista!",
            titulo: "Cliente cadastrado!",
            data: new Date(),
          },
        ],
        troca: false,
        utilizar_financiamento: false,
        origem_temporada: temporada,
        origem_site: true,
        ...utmData,
      };

      if (imovel_id) {
        cliente.timeline = [
          ...cliente.timeline,
          {
            descrição: `Cliente cadastrado no imóvel #${imovel_codigo}`,
            titulo: "Cadastrado em imóvel!",
            data: new Date(),
            empresa_id,
          },
        ];
      }

      const uid = await EnviarContato({
        empresa_id,
        cliente,
      });

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "gtm.formSubmit",
          formName: "FormContact",
          uid,
          imovel_id,
        });
      }

      if (typeof uid === "string") {
        localStorage.setItem("uid", uid);
        setNome("");
        setEmail("");
        setTelefone("");
        window.location.reload();
      }
      alert("Contato enviado para a imobiliária com sucesso!");

      setVerificando(false);

      window.location.pathname.slice(7, Infinity);
      window.location.replace(
        `/imovel` +
          window.location.pathname.slice(7, Infinity) +
          window.location.search
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <li
      className="relative rounded-[.625rem] overflow-hidden after:absolute after:inset-0 after:backdrop-blur-sm"
      key={index}
    >
      <form
        action=""
        className="absolute w-[min(100%,19.875rem)] px-2 text-black right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 z-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className="lg:text-lg text-center font-medium">
          <span className="block -mb-2 font-bold sm:text-3xl md:text-base lg:text-3xl">
            Acesso completo
          </span>
          a todo o site em <strong>10 segundos</strong>
        </p>
        <div className="mt-2 flex flex-col items-center *:w-full md:*:w-[80%] lg:*:w-full *:outline-0 gap-2">
          <input
            type="text"
            placeholder="Nome Completo"
            className="font-normal px-2 py-1 sm:px-3 sm:py-2 rounded-md"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <InputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="font-normal px-2 py-1 sm:px-3 sm:py-2 rounded-md"
            placeholder="Telefone"
          />
          <input
            type="email"
            placeholder="E-mail"
            className="font-normal px-2 py-1 sm:px-3 sm:py-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-mainPurple text-white rounded-full py-1 sm:py-2"
            disabled={verificando}
            onClick={() => onConfirm()}
          >
            {verificando ? "Enviando..." : "Ver fotos"}
          </button>
        </div>
      </form>
      <Image
        className="rounded-[.625rem]"
        src={source.uri || resized || ""}
        alt="Imóvel"
        width={924}
        height={598}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </li>
  );
}
