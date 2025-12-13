"use client"

import { useMemo, useState } from "react"

type Hematoma = "nenhum" | "subcapsular<10" | "subcapsular10-50" | "subcapsular>50/rupto" | "intraparenquimatoso<5" | "intraparenquimatoso>5"
type Laceracao = "nenhuma" | "<1" | "1-3" | ">3"

export default function AastBacoTraumaPage() {
  const [hematoma, setHematoma] = useState<Hematoma>("nenhum")
  const [hematomaExpansivo, setHematomaExpansivo] = useState(false)
  const [laceracao, setLaceracao] = useState<Laceracao>("nenhuma")
  const [extravasamento, setExtravasamento] = useState(false)
  const [segmentar, setSegmentar] = useState(false)
  const [hilar, setHilar] = useState(false)
  const [destroco, setDestroco] = useState(false)

  const resultado = useMemo(() => {
    // AAST baço (simplificado)
    if (hilar || destroco) {
      return {
        grau: "AAST V",
        detalhe: destroco ? "Baço destroçado / fragmentado." : "Lesão hilar com devascularização.",
        conduta: "Trauma grave: considerar esplenectomia ou manejo intervencionista urgente."
      }
    }

    if (segmentar) {
      return {
        grau: "AAST IV",
        detalhe: "Lesão vascular segmentar com infarto devascularizado.",
        conduta: "Avaliação com IR/cirurgia; manejo conforme hemodinâmica."
      }
    }

    if (extravasamento || hematoma === "subcapsular>50/rupto" || hematomaExpansivo || hematoma === "intraparenquimatoso>5" || laceracao === ">3") {
      return {
        grau: "AAST III",
        detalhe: "Hematoma subcapsular >50%/rupto ou intraparenquimatoso >5 cm ou expansivo; laceração >3 cm.",
        conduta: "Manejo não operatório se estável; considerar embolização/TC de controle."
      }
    }

    if (laceracao === "1-3" || hematoma === "subcapsular10-50" || hematoma === "intraparenquimatoso<5") {
      return {
        grau: "AAST II",
        detalhe: "Laceração 1–3 cm de profundidade; hematoma subcapsular 10–50% ou intraparenquimatoso <5 cm.",
        conduta: "Manejo conservador com observação."
      }
    }

    if (laceracao === "<1" || hematoma === "subcapsular<10") {
      return {
        grau: "AAST I",
        detalhe: "Laceração capsular <1 cm ou hematoma subcapsular <10% sem expansão.",
        conduta: "Observação; sem intervenção."
      }
    }

    return { grau: "Indeterminado", detalhe: "Preencha os achados para classificar.", conduta: "Adicionar achados." }
  }, [hilar, destroco, segmentar, extravasamento, hematoma, hematomaExpansivo, laceracao])

  const resumo = useMemo(() => {
    const partes: string[] = []
    if (hematoma !== "nenhum") partes.push(`hematoma ${hematoma}${hematomaExpansivo ? " expansivo" : ""}`)
    if (laceracao !== "nenhuma") partes.push(`laceração ${laceracao} cm`)
    if (extravasamento) partes.push("extravasamento ativo")
    if (segmentar) partes.push("lesão vascular segmentar / infarto")
    if (hilar) partes.push("lesão hilar")
    if (destroco) partes.push("baço destroçado")
    const achados = partes.length ? partes.join("; ") : "achados não informados"
    return `${achados}. ${resultado.grau}. ${resultado.detalhe} Conduta: ${resultado.conduta}`
  }, [hematoma, hematomaExpansivo, laceracao, extravasamento, segmentar, hilar, destroco, resultado])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">AAST baço — trauma</h1>
        <p className="text-sm text-gray-400">Classificação simplificada (I–V) para lesão esplênica.</p>
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
              <option value="subcapsular>50/rupto">Subcapsular &gt;50% ou roto</option>
              <option value="intraparenquimatoso<5">Intraparenquimatoso &lt;5 cm</option>
              <option value="intraparenquimatoso>5">Intraparenquimatoso &gt;5 cm/expansivo</option>
            </select>
            {hematoma !== "nenhum" && (
              <label className="inline-flex items-center gap-2 text-gray-200">
                <input type="checkbox" checked={hematomaExpansivo} onChange={(e) => setHematomaExpansivo(e.target.checked)} />
                Expansivo?
              </label>
            )}
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
            <p className="font-semibold text-gray-100">Vascular / hilar</p>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={segmentar} onChange={(e) => setSegmentar(e.target.checked)} />
              Lesão vascular segmentar / infarto
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={hilar} onChange={(e) => setHilar(e.target.checked)} />
              Lesão hilar com devascularização
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={destroco} onChange={(e) => setDestroco(e.target.checked)} />
              Baço destroçado
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>I: hematoma subcapsular &lt;10% ou laceração capsular &lt;1 cm.</li>
            <li>II: hematoma 10–50% ou intraparenquimatoso &lt;5 cm; laceração 1–3 cm.</li>
            <li>III: hematoma &gt;50%/roto/expansivo ou intraparenquimatoso &gt;5 cm; laceração &gt;3 cm ou extravasamento.</li>
            <li>IV: lesão vascular segmentar com infarto.</li>
            <li>V: baço destroçado ou lesão hilar com devascularização.</li>
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
              setHematomaExpansivo(false)
              setLaceracao("nenhuma")
              setExtravasamento(false)
              setSegmentar(false)
              setHilar(false)
              setDestroco(false)
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
