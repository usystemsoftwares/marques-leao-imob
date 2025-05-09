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

  const validateEmail = (email: string) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email.toLowerCase()
    );

  const removerMascaraTelefone = (t: string) => t.replace(/\D/g, "");

  const EnviarContato = async (config: {
    empresa_id: string;
    cliente: Cliente;
  }): Promise<string | null> => {
    try {
      const uri =
        process.env.BACKEND_API_URI ?? process.env.NEXT_PUBLIC_BACKEND_API_URI;

      const {
        nome,
        telefone,
        DDD,
        email: rawEmail,
        ...restoCliente
      } = config.cliente;

      const email = rawEmail.toLowerCase();

      if (!nome?.trim() || !email || !telefone || !DDD) {
        alert(
          "Algum campo no formulário de cadastro não foi preenchido corretamente"
        );
        return null;
      }

      const response = await fetch(`${uri}/clientes`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...restoCliente,
          nome,
          telefone,
          DDD,
          empresa_id: config.empresa_id,
          email,
        }),
      });

      if (!response.ok) {
        console.error("Falha na criação do cliente:", await response.text());
        return null;
      }

      const res = await response.json();

      if (res.visitante_id) {
        localStorage.setItem("visitante_id", res.visitante_id);
      }
      localStorage.setItem("uid", res.id);

      return res.id as string;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Um erro inesperado ocorreu ao tentar enviar um contato!");
      return null;
    }
  };

  const onConfirm = async () => {
    if (verificando) return;

    setVerificando(true);

    if (!nome.trim()) {
      alert("Informe seu nome completo!");
      return setVerificando(false);
    }
    if (!validateEmail(email)) {
      alert("O email enviado é inválido!");
      return setVerificando(false);
    }
    if (!telefone.match(/^\([0-9]{2}\)\s?[0-9]{5}-[0-9]{4}$/)) {
      alert("Insira um telefone válido!");
      return setVerificando(false);
    }

    const telefoneSemMascara = removerMascaraTelefone(telefone);
    const DDD = telefoneSemMascara.slice(0, 2);
    const numeroTelefone = telefoneSemMascara.slice(2);

    const utmData = getUtms();

    const cliente: Cliente = {
      foto: null,
      nome: nome.trim(),
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
      imovel_origem_id: imovel_id || null,
      visitante_id: localStorage.getItem("visitante_id") || '',
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
      cliente.timeline.push({
        descrição: `Cliente cadastrado no imóvel #${imovel_codigo}`,
        titulo: "Cadastrado em imóvel!",
        data: new Date(),
        empresa_id,
      });
    }

    const uid = await EnviarContato({ empresa_id, cliente });

    setVerificando(false);

    if (!uid) return;

    // GTM somente após criação bem-sucedida do cliente
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "gtm.formSubmit",
        formName: "FormContact",
        uid,
        imovel_id,
      });
    }

    setNome("");
    setEmail("");
    setTelefone("");
    alert("Contato enviado para a imobiliária com sucesso!");

    window.location.replace(
      `/imovel${window.location.pathname.slice(7)}${window.location.search}`
    );
  };

  return (
    <li
      key={index}
      className="relative rounded-[.625rem] overflow-hidden after:absolute after:inset-0 after:backdrop-blur-sm"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="absolute w-[min(100%,19.875rem)] px-2 text-black right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 z-10"
      >
        <p className="lg:text-lg text-center font-medium">
          <span className="block -mb-2 font-bold sm:text-3xl md:text-base lg:text-3xl">
            Acesso completo
          </span>
          a todo o site em <strong>10 segundos</strong>
        </p>

        <div className="mt-2 flex flex-col items-center gap-2 *:w-full md:*:w-[80%] lg:*:w-full *:outline-0">
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
            type="button"
            className="bg-mainPurple text-white rounded-full py-1 sm:py-2"
            disabled={verificando}
            onClick={onConfirm}
          >
            {verificando ? "Enviando..." : "Ver fotos"}
          </button>
        </div>
      </form>

      <Image
        src={source.uri || resized || ""}
        alt="Imóvel"
        width={924}
        height={598}
        className="rounded-[.625rem]"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </li>
  );
}
