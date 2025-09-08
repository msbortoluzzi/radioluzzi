"use client";

import { useState } from "react";

export default function Page() {
  const textoInicial = `Fui chamado pela técnica de enfermagem __________ para avaliação de intercorrência ocorrida durante exame de tomografia computadorizada, por volta das ___ horas, caracterizada por extravasamento de contraste para as partes moles do antebraço ____. No atendimento, constatado aumento discreto/moderado de volume no local, estimado em cerca de ___ ml de extravasamento, com leve rubor, sem calor. Paciente relatou desconforto leve no momento do extravasamento e encontrava-se, na avaliação, sem dor, sem alterações motoras ou sensitivas, com pulsos distais presentes e preservados.

Foi considerada complicação leve. Foram instituídas medidas conservadoras, incluindo elevação do membro, aplicação de compressas frias e observação local, com orientação da equipe de enfermagem para monitoramento. A paciente foi orientada quanto aos sinais de alerta e liberada do setor (ou encaminhada ao pronto atendimento para acompanhamento, conforme o caso).`;

  const [texto, setTexto] = useState(textoInicial);

  const copiarTexto = () => {
    navigator.clipboard.writeText(texto);
    alert("Texto copiado!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Protocolo – Extravasamento de Contraste</h1>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="w-full h-96 border rounded p-3 text-base"
      />

      <button
        onClick={copiarTexto}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Copiar texto puro
      </button>
    </div>
  );
}
