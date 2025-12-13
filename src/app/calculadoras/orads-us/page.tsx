"use client"

import { useMemo, useState } from "react"

type TipoCisto = "simples" | "unilocular" | "multilocular" | "complexo"

export default function OradsUsPage() {
  const [tipo, setTipo] = useState<TipoCisto>("simples")
  const [papilas, setPapilas] = useState<number>(0)
  const [solido, setSolido] = useState<boolean>(false)
  const [ascite, setAscite] = useState<boolean>(false)
  const [color, setColor] = useState<number>(2)
  const [tamanho, setTamanho] = useState<string>("")
  const [bilateral, setBilateral] = useState<boolean>(false)

  const sizeCm = useMemo(() => Number(tamanho.replace(",", ".")), [tamanho])

  const categoria = useMemo(() => {
    const s = Number.isFinite(sizeCm) ? sizeCm : NaN

    // Malignidade alta
    if (ascite || papilas >= 4 || color >= 4 || (solido && papilas >= 3)) {
      return { cat: "O-RADS 5", detalhe: "Alto risco: ascite, ≥4 papilas, cor 4 ou sólido marcado.", conduta: "Encaminhar para centro oncológico." }
    }

    // Lesões com componente sólido ou papilas (baixo número)
    if (solido || papilas > 0) {
      return { cat: "O-RADS 4", detalhe: "Médio/alto risco: componente sólido ou papilas.", conduta: "Avaliação por ginecologia oncológica / possível cirurgia." }
    }

    // Multilocular sem sólido/papila
    if (tipo === "multilocular" || tipo === "complexo") {
      if (!Number.isNaN(s) && s >= 10) {
        return { cat: "O-RADS 4", detalhe: "Cisto multilocular ≥10 cm.", conduta: "Encaminhar para avaliação especializada." }
      }
      return { cat: "O-RADS 3", detalhe: "Multilocular sem sólido/papila.", conduta: "Seguimento com especialista; considerar RM/CA-125 conforme idade." }
    }

    // Simples / unilocular sem papila/solido
    if (!Number.isNaN(s) && s >= 10) {
      return { cat: "O-RADS 3", detalhe: "Cisto simples/unilocular ≥10 cm.", conduta: "Seguimento ou referência para avaliação cirúrgica eletiva." }
    }
    return { cat: "O-RADS 2", detalhe: "Cisto simples/unilocular <10 cm, cor 1–2, sem papila/sólido.", conduta: "Seguimento de rotina (ex.: US em 12 meses)." }
  }, [ascite, papilas, color, solido, tipo, sizeCm])

  const resumo = useMemo(() => {
    const tamTxt = Number.isFinite(sizeCm) ? `${sizeCm.toFixed(1)} cm` : "tamanho não informado"
    const colorTxt = `Color score ${color}`
    const papilaTxt = papilas > 0 ? `${papilas} papila(s)` : "sem papilas"
    const solidoTxt = solido ? "com componente sólido" : "sem sólido"
    const asciteTxt = ascite ? "ascite presente" : "sem ascite"
    const bilatTxt = bilateral ? "bilateral" : "unilateral"
    return `Massa ${tipo}, ${tamTxt}, ${papilaTxt}, ${solidoTxt}, ${colorTxt}, ${asciteTxt}, ${bilatTxt}. ${categoria.cat}. ${categoria.detalhe} Conduta: ${categoria.conduta}`
  }, [tipo, sizeCm, papilas, solido, color, ascite, bilateral, categoria])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">O-RADS US</h1>
        <p className="text-sm text-gray-400">Versão simplificada (componentes principais). Uso assistivo.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Morfologia</p>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoCisto)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="simples">Cisto simples</option>
              <option value="unilocular">Unilocular (sem sólido)</option>
              <option value="multilocular">Multilocular (sem sólido)</option>
              <option value="complexo">Complexo (outros)</option>
            </select>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={solido} onChange={(e) => setSolido(e.target.checked)} />
              Componente sólido presente
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={ascite} onChange={(e) => setAscite(e.target.checked)} />
              Ascite
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={bilateral} onChange={(e) => setBilateral(e.target.checked)} />
              Bilateral
            </label>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Papilas / Color score</p>
            <label className="flex items-center justify-between">
              <span className="text-gray-200">Número de papilas</span>
              <input
                type="number"
                min={0}
                max={5}
                value={papilas}
                onChange={(e) => setPapilas(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1 text-right"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-200">Color score (1–4)</span>
              <input
                type="number"
                min={1}
                max={4}
                value={color}
                onChange={(e) => setColor(Math.min(4, Math.max(1, Number(e.target.value) || 1)))}
                className="w-24 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1 text-right"
              />
            </label>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Tamanho</p>
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
            <li>Simples/unilocular &lt;10 cm, color ≤2 → O-RADS 2 (baixo risco).</li>
            <li>Multilocular sem sólido/papila → O-RADS 3 (se &lt;10 cm) ou 4 (≥10 cm).</li>
            <li>Qualquer sólido/papila ou color ≥3 → O-RADS 4; se achados francamente suspeitos (ascite, ≥4 papilas, color 4) → O-RADS 5.</li>
          </ul>
          <div className="text-[11px] text-gray-500 space-y-1">
            <p>
              <strong>Papilas:</strong> projeções no interior do cisto. Quanto mais papilas (≥4) e vascularizadas, maior o risco.
            </p>
            <p>
              <strong>Color score:</strong> 1 = sem fluxo; 2 = escasso; 3 = moderado; 4 = abundante/central. Scores 3–4 aumentam a suspeição.
            </p>
            Simplificado para apoio. Confirmar com protocolo O-RADS US completo (septo, sombra, volume, idade/menopausa).
          </div>
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
              setTipo("simples")
              setPapilas(0)
              setSolido(false)
              setAscite(false)
              setColor(2)
              setTamanho("")
              setBilateral(false)
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
