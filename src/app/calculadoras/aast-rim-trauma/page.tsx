"use client"

import { useMemo, useState } from "react"

type Hematoma = "nenhum" | "subcapsular" | "perirrenal"
type LacProf = "<1" | "1-10" | ">10"

export default function AastRimTraumaPage() {
  const [hematoma, setHematoma] = useState<Hematoma>("nenhum")
  const [hematomaExpansivo, setHematomaExpansivo] = useState(false)
  const [laceracao, setLaceracao] = useState<boolean>(false)
  const [profundidade, setProfundidade] = useState<LacProf>("1-10")
  const [extravasamento, setExtravasamento] = useState(false)
  const [coletor, setColetor] = useState(false)
  const [segmentar, setSegmentar] = useState(false)
  const [hilob, setHilob] = useState(false)
  const [rimDestro, setRimDestro] = useState(false)

  const resultado = useMemo(() => {
    // AAST renal (simplificado v2018)
    // Grade V prioritário
    if (rimDestro || hilob) {
      return {
        grau: "AAST V",
        detalhe: "Rim destroçado ou lesão hilar com devascularização.",
        conduta: "Avaliação urológica urgente; considerar abordagem cirúrgica/intervencionista."
      }
    }

    if (segmentar || coletor) {
      return {
        grau: "AAST IV",
        detalhe: segmentar
          ? "Infarto segmentar / lesão vascular segmentar."
          : "Laceração com extravasamento do sistema coletor.",
        conduta: "Tratamento conservador vs. intervenção; urologia/IR."
      }
    }

    if (laceracao && extravasamento) {
      return {
        grau: "AAST IV",
        detalhe: "Laceração com extravasamento ativo.",
        conduta: "Avaliar embolização / tratamento cirúrgico conforme hemodinâmica."
      }
    }

    if (laceracao) {
      if (profundidade === ">10") {
        return {
          grau: "AAST III",
          detalhe: "Laceração cortical >1 cm sem extravasamento.",
          conduta: "Manejo conservador com vigilância; TC de controle conforme protocolo."
        }
      }
      if (profundidade === "1-10") {
        return {
          grau: "AAST III",
          detalhe: "Laceração cortical >1 cm sem extravasamento.",
          conduta: "Manejo conservador; urologia."
        }
      }
      return {
        grau: "AAST II",
        detalhe: "Laceração cortical <1 cm, sem extravasamento.",
        conduta: "Conservador; TC controle se sintomas/instabilidade."
      }
    }

    if (hematoma !== "nenhum") {
      if (hematoma === "perirrenal" || hematomaExpansivo) {
        return {
          grau: "AAST II",
          detalhe: "Hematoma perirrenal confinado (não expansivo).",
          conduta: "Conservador; TC controle se dúvida clínica."
        }
      }
      return {
        grau: "AAST I",
        detalhe: "Hematoma subcapsular não expansivo ou contusão.",
        conduta: "Sem intervenção; observação clínica."
      }
    }

    return { grau: "Indeterminado", detalhe: "Preencha os achados para classificar.", conduta: "Adicionar achados." }
  }, [rimDestro, hilob, segmentar, coletor, laceracao, extravasamento, profundidade, hematoma, hematomaExpansivo])

  const resumo = useMemo(() => {
    const parts: string[] = []
    if (hematoma !== "nenhum") parts.push(`hematoma ${hematoma}${hematomaExpansivo ? " expansivo" : ""}`)
    if (laceracao) parts.push(`laceração (${profundidade} cm)${extravasamento ? " com extravasamento" : ""}`)
    if (coletor) parts.push("lesão do sistema coletor")
    if (segmentar) parts.push("lesão/infarto segmentar")
    if (hilob) parts.push("lesão hilar")
    if (rimDestro) parts.push("rim destroçado")
    const achados = parts.length ? parts.join("; ") : "achados não informados"
    return `${achados}. ${resultado.grau}. ${resultado.detalhe} Conduta: ${resultado.conduta}`
  }, [hematoma, hematomaExpansivo, laceracao, profundidade, extravasamento, coletor, segmentar, hilob, rimDestro, resultado])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">AAST Rim — trauma (v2018)</h1>
        <p className="text-sm text-gray-400">Classificação simplificada de lesão renal traumática.</p>
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
              <option value="subcapsular">Subcapsular</option>
              <option value="perirrenal">Perirrenal confinado</option>
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
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={laceracao} onChange={(e) => setLaceracao(e.target.checked)} />
              Laceração cortical
            </label>
            {laceracao && (
              <>
                <select
                  value={profundidade}
                  onChange={(e) => setProfundidade(e.target.value as LacProf)}
                  className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
                >
                  <option value="<1">&lt;1 cm</option>
                  <option value="1-10">1–10 cm</option>
                  <option value=">10">&gt;10 cm / profundo</option>
                </select>
                <label className="inline-flex items-center gap-2 text-gray-200">
                  <input type="checkbox" checked={extravasamento} onChange={(e) => setExtravasamento(e.target.checked)} />
                  Extravasamento ativo
                </label>
              </>
            )}
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Coletor / vascular</p>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={coletor} onChange={(e) => setColetor(e.target.checked)} />
              Lesão do sistema coletor (urinoma/uréter)
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={segmentar} onChange={(e) => setSegmentar(e.target.checked)} />
              Infarto/lesão vascular segmentar
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={hilob} onChange={(e) => setHilob(e.target.checked)} />
              Lesão hilar (devascularização)
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={rimDestro} onChange={(e) => setRimDestro(e.target.checked)} />
              Rim destroçado
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>I: contusão/hematoma subcapsular não expansivo.</li>
            <li>II: hematoma perirrenal confinado ou laceração &lt;1 cm sem extravasamento.</li>
            <li>III: laceração &gt;1 cm sem extravasamento.</li>
            <li>IV: laceração com extravasamento/lesão coletor ou infarto segmentar.</li>
            <li>V: rim destroçado ou lesão hilar com devascularização.</li>
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
              setLaceracao(false)
              setExtravasamento(false)
              setColetor(false)
              setSegmentar(false)
              setHilob(false)
              setRimDestro(false)
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
