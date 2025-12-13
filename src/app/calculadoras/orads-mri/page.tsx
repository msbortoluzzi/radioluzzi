"use client"

import { useMemo, useState } from "react"

type Tic = "1" | "2" | "3"
type Morfologia = "cisto_simples" | "hemorragico" | "endometrioma" | "solido_enh" | "mural"

export default function OradsMriPage() {
  const [morf, setMorf] = useState<Morfologia>("cisto_simples")
  const [restricao, setRestricao] = useState<boolean>(false)
  const [tic, setTic] = useState<Tic>("2")
  const [tamanho, setTamanho] = useState<string>("")
  const [papilas, setPapilas] = useState<number>(0)
  const [muralEnh, setMuralEnh] = useState<boolean>(false)

  const sizeCm = useMemo(() => Number(tamanho.replace(",", ".")), [tamanho])

  const categoria = useMemo(() => {
    const s = Number.isFinite(sizeCm) ? sizeCm : NaN

    // Benignos clássicos
    if (morf === "cisto_simples") return { cat: "O-RADS MRI 2", detalhe: "Cisto simples sem realce.", conduta: "Seguimento de rotina." }
    if (morf === "hemorragico") return { cat: "O-RADS MRI 2", detalhe: "Cisto hemorrágico típico (T1 alto, sem realce sólido).", conduta: "Seguimento de rotina." }
    if (morf === "endometrioma") return { cat: "O-RADS MRI 3", detalhe: "Endometrioma típico (T1 alto, T2 shading).", conduta: "Seguimento ou avaliação ginecológica." }

    // Lesão sólida ou com realce mural
    const altoRisco =
      (restricao && (tic === "3" || papilas >= 3 || muralEnh)) ||
      (morf === "solido_enh" && (tic === "3" || restricao))

    if (altoRisco) {
      return { cat: "O-RADS MRI 5", detalhe: "Sólido realçando + restrição/TIC3/papilas numerosas.", conduta: "Encaminhar gineco oncológica / cirurgia." }
    }

    const riscoIntermediario =
      morf === "solido_enh" ||
      morf === "mural" ||
      restricao ||
      tic === "3" ||
      papilas > 0 ||
      (!Number.isNaN(s) && s >= 10)

    if (riscoIntermediario) {
      return {
        cat: "O-RADS MRI 4",
        detalhe: "Realce sólido/mural ou restrição/TIC3 sem critérios francos de alto risco.",
        conduta: "Avaliação especializada; considerar cirurgia."
      }
    }

    return { cat: "O-RADS MRI 3", detalhe: "Achado provavelmente benigno, mas com realce leve/mural discreto.", conduta: "Seguimento ou referência." }
  }, [morf, restricao, tic, papilas, muralEnh, sizeCm])

  const resumo = useMemo(() => {
    const tamTxt = Number.isFinite(sizeCm) ? `${sizeCm.toFixed(1)} cm` : "tamanho não informado"
    const papTxt = papilas > 0 ? `${papilas} papila(s)` : "sem papilas"
    const resTxt = restricao ? "restrição difusão" : "sem restrição marcada"
    const ticTxt = `TIC tipo ${tic}`
    const muralTxt = muralEnh ? "realce mural focal" : "sem realce mural"
    return `Massa ${morf.replace("_", " ")}, ${tamTxt}, ${papTxt}, ${resTxt}, ${muralTxt}, ${ticTxt}. ${categoria.cat}. ${categoria.detalhe} Conduta: ${categoria.conduta}`
  }, [morf, sizeCm, papilas, restricao, muralEnh, tic, categoria])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">O-RADS MRI</h1>
        <p className="text-sm text-gray-400">Versão simplificada para apoio na estratificação de risco de massa anexial.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Morfologia / realce</p>
            <select
              value={morf}
              onChange={(e) => setMorf(e.target.value as Morfologia)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="cisto_simples">Cisto simples (sem realce)</option>
              <option value="hemorragico">Cisto hemorrágico típico</option>
              <option value="endometrioma">Endometrioma típico</option>
              <option value="mural">Cisto com realce mural focal</option>
              <option value="solido_enh">Lesão sólida realçando</option>
            </select>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={muralEnh} onChange={(e) => setMuralEnh(e.target.checked)} />
              Realce mural/papilar focal
            </label>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Difusão / TIC</p>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={restricao} onChange={(e) => setRestricao(e.target.checked)} />
              Restrição de difusão (alto b / ADC baixo)
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-200">TIC (1–3)</span>
              <select
                value={tic}
                onChange={(e) => setTic(e.target.value as Tic)}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1"
              >
                <option value="1">Tipo 1 (ascendente lenta)</option>
                <option value="2">Tipo 2 (platô)</option>
                <option value="3">Tipo 3 (washout rápido)</option>
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Papilas / Tamanho</p>
            <label className="flex items-center justify-between">
              <span className="text-gray-200">Número de papilas</span>
              <input
                type="number"
                min={0}
                max={5}
                value={papilas}
                onChange={(e) => setPapilas(Math.max(0, Number(e.target.value) || 0))}
                className="w-20 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1 text-right"
              />
            </label>
            <input
              placeholder="Maior diâmetro (cm)"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>Cistos simples/hemorrágicos típicos → O-RADS MRI 2.</li>
            <li>Endometrioma típico → O-RADS MRI 3 (baixo risco).</li>
            <li>Realce sólido/mural + restrição/TIC3 ou papilas numerosas → O-RADS MRI 5.</li>
            <li>Realce sólido/mural isolado ou restrição/TIC3 isolados → O-RADS MRI 4.</li>
          </ul>
          <p className="text-[11px] text-gray-500">
            Simplificado para apoio. Confirmar curva TIC, ADC, morfologia e critérios completos O-RADS MRI antes de decisão.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{categoria.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{categoria.detalhe}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {categoria.conduta}</span>
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
              setMorf("cisto_simples")
              setRestricao(false)
              setTic("2")
              setTamanho("")
              setPapilas(0)
              setMuralEnh(false)
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
