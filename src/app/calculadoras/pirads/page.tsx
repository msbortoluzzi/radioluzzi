"use client"

import { useMemo, useState } from "react"

type Zona = "periferica" | "transicional"

export default function PiradsPage() {
  const [zona, setZona] = useState<Zona>("periferica")
  const [t2, setT2] = useState<number>(3)
  const [dwi, setDwi] = useState<number>(3)
  const [dce, setDce] = useState<boolean>(false)
  const [tamanho, setTamanho] = useState<string>("")
  const [local, setLocal] = useState<string>("")

  const sizeMm = useMemo(() => Number(tamanho.replace(",", ".")), [tamanho])

  const categoria = useMemo(() => {
    let cat = 3
    const s = Number.isFinite(sizeMm) ? sizeMm : NaN
    if (zona === "periferica") {
      if (dwi === 5) cat = 5
      else if (dwi === 4) cat = 4
      else if (dwi === 3) cat = dce ? 4 : 3
      else cat = dwi
    } else {
      // transicional: T2 domina
      if (t2 === 5) cat = 5
      else if (t2 === 4) cat = 4
      else if (t2 === 3) cat = 3
      else cat = t2
      if (dwi === 5) cat = 5
      else if (dwi === 4 && cat < 4) cat = 4
    }
    if (!Number.isNaN(s) && s >= 15 && cat === 4) {
      // PI-RADS considera >=1.5 cm com critérios forte como 5
      cat = 5
    }
    return Math.min(Math.max(cat, 1), 5)
  }, [zona, t2, dwi, dce, sizeMm])

  const conduta =
    categoria <= 2
      ? "Provavelmente benigno. Seguir protocolo clínico/histórico."
      : categoria === 3
        ? "Indeterminado. Considerar seguimento curto ou biópsia conforme risco."
        : "Suspeito para câncer. Considerar biópsia direcionada / fusão."

  const resumo = useMemo(() => {
    const zonaTxt = zona === "periferica" ? "zona periférica" : "zona transicional"
    const tamTxt = Number.isFinite(sizeMm) ? `${sizeMm.toFixed(1)} mm` : "tamanho não informado"
    const dceTxt = dce ? "DCE focal positivo" : "DCE negativo/indeterminado"
    return `Lesão em ${zonaTxt}${local ? ` (${local})` : ""}, ${tamTxt}. T2=${t2}, DWI/ADC=${dwi}, ${dceTxt}. PI-RADS ${categoria}. ${conduta}`
  }, [zona, local, sizeMm, t2, dwi, dce, categoria, conduta])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">PI-RADS (RM próstata)</h1>
        <p className="text-sm text-gray-400">Simplificado: zona dominante, escores T2/DWI/ADC e DCE.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Localização e tamanho</p>
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value as Zona)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="periferica">Zona periférica (DWI domina)</option>
              <option value="transicional">Zona transicional (T2 domina)</option>
            </select>
            <input
              placeholder="Segmento/relógio (ex.: 4h PZ esquerda)"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            <input
              placeholder="Tamanho máximo (mm)"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Escores dominantes</p>
            <label className="flex items-center justify-between">
              <span className="text-gray-200">T2 (1–5)</span>
              <input
                type="number"
                min={1}
                max={5}
                value={t2}
                onChange={(e) => setT2(Math.min(5, Math.max(1, Number(e.target.value) || 1)))}
                className="w-20 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1 text-right"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-200">DWI/ADC (1–5)</span>
              <input
                type="number"
                min={1}
                max={5}
                value={dwi}
                onChange={(e) => setDwi(Math.min(5, Math.max(1, Number(e.target.value) || 1)))}
                className="w-20 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1 text-right"
              />
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={dce} onChange={(e) => setDce(e.target.checked)} />
              DCE focal positivo
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras (resumo)</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>PZ: DWI domina. DWI 3 + DCE+ → PI-RADS 4. DWI 4/5 → PI-RADS 4/5.</li>
            <li>TZ: T2 domina. DWI 5 sobe para PI-RADS 5; DWI 4 pode subir para 4.</li>
            <li>Lesão &ge;15 mm e categoria 4 → tratar como 5.</li>
          </ul>
          <p className="text-[11px] text-gray-500">
            Para uso assistivo. Confirmar achados (ADC, b alto, morfologia) antes de fechar a categoria.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">PI-RADS {categoria}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{conduta}</span>
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
              setZona("periferica")
              setT2(3)
              setDwi(3)
              setDce(false)
              setTamanho("")
              setLocal("")
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
