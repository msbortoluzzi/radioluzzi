"use client"

import { useMemo, useState } from "react"

type Hematoma = "nenhum" | "subcapsular<10" | "subcapsular10-50" | "subcapsular>50/expansivo" | "intraparenquimatoso"
type Laceracao = "nenhuma" | "<1" | "1-3" | ">3"
type Disrupcao = "nenhuma" | "25-75" | ">75" | "avulsao"

export default function AastFigadoTraumaPage() {
  const [hematoma, setHematoma] = useState<Hematoma>("nenhum")
  const [laceracao, setLaceracao] = useState<Laceracao>("nenhuma")
  const [extravasamento, setExtravasamento] = useState(false)
  const [disrupcao, setDisrupcao] = useState<Disrupcao>("nenhuma")
  const [lesaoVascular, setLesaoVascular] = useState(false)

  const resultado = useMemo(() => {
    // AAST fígado (simplificado)
    if (disrupcao === "avulsao" || disrupcao === ">75" || lesaoVascular) {
      return {
        grau: "AAST V/VI",
        detalhe: disrupcao === "avulsao" ? "Avulsão hepática / desvascularização maciça." : "Disrupção >75% ou lesão vascular/hilar.",
        conduta: "Trauma grave: equipe multidisciplinar, possível cirurgia/IR emergente."
      }
    }

    if (disrupcao === "25-75") {
      return {
        grau: "AAST IV",
        detalhe: "Disrupção parenquimatosa envolvendo 25–75% de um lobo ou >1 segmento dentro de um lobo.",
        conduta: "Avaliação especializada; manejo não operatório com vigilância, considerar IR."
      }
    }

    if (laceracao === ">3" || extravasamento || hematoma === "subcapsular>50/expansivo") {
      return {
        grau: "AAST III",
        detalhe: "Laceração >3 cm de profundidade ou hematoma subcapsular >50%/expansivo.",
        conduta: "Manejo conservador se estável; TC/IR se sangramento."
      }
    }

    if (laceracao === "1-3" || hematoma === "subcapsular10-50" || hematoma === "intraparenquimatoso") {
      return {
        grau: "AAST II",
        detalhe: "Laceração 1–3 cm ou hematoma subcapsular 10–50% ou intraparenquimatoso 1–10 cm.",
        conduta: "Conservador; observação/TC conforme protocolo."
      }
    }

    if (laceracao === "<1" || hematoma === "subcapsular<10") {
      return {
        grau: "AAST I",
        detalhe: "Laceração superficial <1 cm ou hematoma subcapsular <10% sem expansão.",
        conduta: "Observação; sem intervenção."
      }
    }

    return { grau: "Indeterminado", detalhe: "Preencha os achados para classificar.", conduta: "Adicionar achados." }
  }, [disrupcao, lesaoVascular, laceracao, extravasamento, hematoma])

  const resumo = useMemo(() => {
    const partes: string[] = []
    if (hematoma !== "nenhum") partes.push(`hematoma ${hematoma}`)
    if (laceracao !== "nenhuma") partes.push(`laceração ${laceracao} cm`)
    if (extravasamento) partes.push("extravasamento ativo")
    if (disrupcao !== "nenhuma") partes.push(`disrupção ${disrupcao}`)
    if (lesaoVascular) partes.push("lesão vascular/hilar")
    const achados = partes.length ? partes.join("; ") : "achados não informados"
    return `${achados}. ${resultado.grau}. ${resultado.detalhe} Conduta: ${resultado.conduta}`
  }, [hematoma, laceracao, extravasamento, disrupcao, lesaoVascular, resultado])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">AAST fígado — trauma</h1>
        <p className="text-sm text-gray-400">Classificação simplificada (I–VI) para lesão hepática.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Hematoma</p>
            <select
              value={hematoma}
              onChange={(e) => setHematoma(e.target.value as Hematoma)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="nenhum">Nenhum</option>
              <option value="subcapsular<10">Subcapsular &lt;10%</option>
              <option value="subcapsular10-50">Subcapsular 10–50%</option>
              <option value="subcapsular>50/expansivo">Subcapsular &gt;50%/expansivo</option>
              <option value="intraparenquimatoso">Intraparenquimatoso</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Laceração</p>
            <select
              value={laceracao}
              onChange={(e) => setLaceracao(e.target.value as Laceracao)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="nenhuma">Nenhuma</option>
              <option value="<1">&lt;1 cm</option>
              <option value="1-3">1–3 cm</option>
              <option value=">3">&gt;3 cm</option>
            </select>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={extravasamento} onChange={(e) => setExtravasamento(e.target.checked)} />
              Extravasamento ativo
            </label>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Disrupção / vascular</p>
            <select
              value={disrupcao}
              onChange={(e) => setDisrupcao(e.target.value as Disrupcao)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="nenhuma">Nenhuma</option>
              <option value="25-75">Disrupção 25–75% lobo / &gt;1 segmento</option>
              <option value=">75">Disrupção &gt;75% lobo</option>
              <option value="avulsao">Avulsão / desvascularização</option>
            </select>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={lesaoVascular} onChange={(e) => setLesaoVascular(e.target.checked)} />
              Lesão vascular/hilar
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>I: hematoma &lt;10% ou laceração &lt;1 cm.</li>
            <li>II: hematoma 10–50% ou intraparenquimatoso pequeno; laceração 1–3 cm sem extravasamento.</li>
            <li>III: hematoma &gt;50%/expansivo ou laceração &gt;3 cm; extravasamento.</li>
            <li>IV: disrupção 25–75% de um lobo ou &gt;1 segmento em um lobo.</li>
            <li>V/VI: disrupção &gt;75%, lesão hilar/vascular, ou avulsão.</li>
          </ul>
          <p className="text-[11px] text-gray-500">Simplificado; correlacionar com hemodinâmica e protocolo de trauma.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{resultado.grau}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{resultado.detalhe}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {resultado.conduta}</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">Pré-laudo</p>
          <textarea
            value={resumo}
            readOnly
            className="w-full min-h-[120px] rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void navigator.clipboard.writeText(resumo)}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Copiar
          </button>
          <button
            onClick={() => {
              setHematoma("nenhum")
              setLaceracao("nenhuma")
              setExtravasamento(false)
              setDisrupcao("nenhuma")
              setLesaoVascular(false)
            }}
            className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100 text-sm"
          >
            Limpar
          </button>
        </div>
      </section>
    </main>
  )
}
