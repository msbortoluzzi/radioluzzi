"use client"

import { useMemo, useState } from "react"

type Tipo = "cisto" | "solido" | "indeterminado"

export default function IncidentalRenalPage() {
  const [tipo, setTipo] = useState<Tipo>("indeterminado")
  const [tamanho, setTamanho] = useState<string>("")
  const [realce, setRealce] = useState<boolean>(false)
  const [trombose, setTrombose] = useState<boolean>(false)
  const [metastatico, setMetastatico] = useState<boolean>(false)

  const sizeCm = useMemo(() => Number(tamanho.replace(",", ".")), [tamanho])

  const plano = useMemo(() => {
    const s = Number.isFinite(sizeCm) ? sizeCm : NaN

    if (metastatico) return { cat: "Contexto oncológico", conduta: "Seguimento/estadiamento conforme oncologia (não segue ACR incidental puro)." }
    if (trombose) return { cat: "Achado suspeito", conduta: "Encaminhar urologia/oncologia; estadiar." }

    if (tipo === "cisto" && !realce) {
      return { cat: "Cisto simples", conduta: "Sem seguimento." }
    }

    if (tipo === "solido" || realce) {
      if (Number.isNaN(s)) return { cat: "Preencha tamanho", conduta: "Informe o maior diâmetro (cm)." }
      if (s < 1) return { cat: "Sólido <1 cm", conduta: "TC/RM em 6–12 meses para crescimento." }
      if (s >= 1 && s <= 2) return { cat: "Sólido 1–2 cm", conduta: "RM/TC multiphase; considerar seguimento vs. biópsia." }
      if (s > 2 && s <= 4) return { cat: "Sólido 2–4 cm", conduta: "Avaliação urologia; ressecção parcial vs. biópsia." }
      return { cat: "Sólido >4 cm", conduta: "Alta suspeição: urologia oncológica, ressecção/estadiamento." }
    }

    if (tipo === "cisto" && realce) {
      if (Number.isNaN(s)) return { cat: "Cisto complexo", conduta: "Classificar Bosniak; considerar TC/RM contrastada." }
      if (s <= 2) return { cat: "Cisto complexo pequeno", conduta: "Bosniak conforme imagem; possivelmente seguimento." }
      return { cat: "Cisto complexo", conduta: "Classificar Bosniak; urologia se III/IV." }
    }

    return { cat: "Indeterminado", conduta: "Fazer TC/RM com contraste (fase corticomedular/nefrográfica) para caracterizar." }
  }, [tipo, sizeCm, realce, trombose, metastatico])

  const resumo = useMemo(() => {
    const tamTxt = Number.isFinite(sizeCm) ? `${sizeCm.toFixed(1)} cm` : "tamanho não informado"
    const realceTxt = realce ? "com realce" : "sem realce definido"
    const flags = []
    if (trombose) flags.push("trombo/veia dilatada")
    if (metastatico) flags.push("paciente oncológico")
    const flagTxt = flags.length ? ` (${flags.join(", ")})` : ""
    return `Massa renal incidental ${tamTxt}, ${tipo}, ${realceTxt}${flagTxt}. Categoria: ${plano.cat}. Conduta: ${plano.conduta}`
  }, [sizeCm, tipo, realce, trombose, metastatico, plano])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Massa renal incidental (ACR)</h1>
        <p className="text-sm text-gray-400">Simplificado para achados incidentais em TC/RM/US.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Tipo e realce</p>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipo)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="indeterminado">Indeterminado</option>
              <option value="cisto">Cisto</option>
              <option value="solido">Sólido</option>
            </select>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={realce} onChange={(e) => setRealce(e.target.checked)} />
              Realce perceptível
            </label>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Tamanho / bandeiras</p>
            <input
              placeholder="Maior diâmetro (cm)"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={trombose} onChange={(e) => setTrombose(e.target.checked)} />
              Trombo em veia renal/VCI
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={metastatico} onChange={(e) => setMetastatico(e.target.checked)} />
              Paciente oncológico (metástase possível)
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>Cisto simples: sem seguimento.</li>
            <li>Sólido &lt;1 cm: TC/RM 6–12m; 1–2 cm: caracterizar (RM/TC) e seguir vs. biópsia; 2–4 cm: urologia (parcial/biópsia); &gt;4 cm: onco-urologia.</li>
            <li>Contexto oncológico ou trombo: estadiar/encaminhar.</li>
          </ul>
          <p className="text-[11px] text-gray-500">Simplificado; use critérios Bosniak para cistos complexos e fases multiparamétricas para sólidos.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{plano.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {plano.conduta}</span>
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
              setTipo("indeterminado")
              setTamanho("")
              setRealce(false)
              setTrombose(false)
              setMetastatico(false)
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
