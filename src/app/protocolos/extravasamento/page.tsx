"use client";

import { useState } from "react";

export default function Page() {
  const textoInicial = `Fui chamado pela técnica de enfermagem __________ para avaliação de intercorrência ocorrida durante exame de tomografia computadorizada, por volta das ___ horas, caracterizada por extravasamento de contraste para as partes moles do antebraço ____. No atendimento, constatado aumento discreto/moderado de volume no local, estimado em cerca de ___ ml de extravasamento, com leve rubor, sem calor. Paciente relatou desconforto leve no momento do extravasamento e encontrava-se, na avaliação, sem dor, sem alterações motoras ou sensitivas, com pulsos distais presentes e preservados.

Foi considerada complicação leve. Foram instituídas medidas conservadoras, incluindo elevação do membro, aplicação de compressas frias e observação local, com orientação da equipe de enfermagem para monitoramento. A paciente foi orientada quanto aos sinais de alerta e liberada do setor (ou encaminhada ao pronto atendimento para acompanhamento, conforme o caso).`;

  const [texto, setTexto] = useState(textoInicial);

  const copiarTexto = () => {
    navigator.clipboard.writeText(texto);
    alert("Texto copiado!");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4 text-gray-100">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-400">Protocolos</p>
        <h1 className="text-2xl font-bold">Extravasamento de contraste</h1>
        <p className="text-sm text-gray-400">
          Ajuste o texto conforme o caso e copie em formato simples para o prontuário.
        </p>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4 space-y-3 shadow-lg">
        <label className="text-sm font-semibold text-gray-200" htmlFor="extravasamento">
          Texto do protocolo
        </label>
        <textarea
          id="extravasamento"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full h-96 bg-[#0a0a0a] text-gray-100 border border-[#222222] rounded-md p-3 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        />

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setTexto(textoInicial)}
            className="px-4 py-2 bg-[#1a1a1a] text-gray-200 rounded-md border border-[#222222] hover:bg-[#222222] transition-colors"
          >
            Restaurar texto inicial
          </button>
          <button
            onClick={copiarTexto}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Copiar texto puro
          </button>
        </div>
      </div>
    </div>
  );
}
