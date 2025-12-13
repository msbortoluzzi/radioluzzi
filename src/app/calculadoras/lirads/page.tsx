'use client'

import { useMemo, useState } from 'react'

type Categoria = 'LR-1/2' | 'LR-3' | 'LR-4' | 'LR-5' | 'LR-M' | 'LR-TIV' | 'Indeterminado'

export default function LiradsPage() {
  const [tamanho, setTamanho] = useState('')
  const [aphe, setAphe] = useState(false)
  const [washout, setWashout] = useState(false)
  const [capsula, setCapsula] = useState(false)
  const [tgrowth, setTgrowth] = useState(false)
  const [benigno, setBenigno] = useState(false)
  const [targetoide, setTargetoide] = useState(false)
  const [tiv, setTiv] = useState(false)

  const sizeMm = useMemo(() => Number(tamanho.replace(',', '.')), [tamanho])

  const categoria: { cat: Categoria; detalhe: string; conduta: string } = useMemo(() => {
    if (benigno) return { cat: 'LR-1/2', detalhe: 'Achado inequivocamente benigno (cisto, hemangioma, HNF típica).', conduta: 'Sem seguimento específico.' }
    if (tiv) return { cat: 'LR-TIV', detalhe: 'Tumor em veia portal/hepática.', conduta: 'Tratar como doença avançada; estadiar.' }
    if (targetoide) return { cat: 'LR-M', detalhe: 'Realce alvo/restrição marcante sugere malignidade não HCC.', conduta: 'Considerar biópsia/estadiamento.' }

    const s = Number.isFinite(sizeMm) ? sizeMm : NaN
    if (Number.isNaN(s)) return { cat: 'Indeterminado', detalhe: 'Informe o maior diâmetro em mm.', conduta: 'Preencher tamanho para classificar.' }

    if (s < 10) return { cat: 'LR-3', detalhe: 'Lesão <10 mm em fígado de risco.', conduta: 'Imagem em 3–6 meses.' }

    // 10–19 mm
    if (s >= 10 && s < 20) {
      if (aphe && washout && (capsula || tgrowth)) return { cat: 'LR-5', detalhe: '10–19 mm com APHE + washout + cápsula/threshold growth.', conduta: 'Tratar como HCC (multidisciplinar).' }
      if (aphe && (washout || capsula || tgrowth)) return { cat: 'LR-4', detalhe: 'APHE + um maior adicional em 10–19 mm.', conduta: 'Curto seguimento ou biópsia.' }
      if (aphe) return { cat: 'LR-3', detalhe: 'APHE isolado em 10–19 mm.', conduta: 'Imagem em 3–6 meses.' }
      return { cat: 'LR-3', detalhe: 'Sem APHE em 10–19 mm.', conduta: 'Imagem em 3–6 meses.' }
    }

    // ≥20 mm
    if (aphe && (washout || capsula || tgrowth)) return { cat: 'LR-5', detalhe: '≥20 mm com APHE + washout/cápsula/threshold growth.', conduta: 'Tratar como HCC (multidisciplinar).' }
    if (aphe) return { cat: 'LR-4', detalhe: '≥20 mm com APHE isolado.', conduta: 'Biópsia ou seguimento curto.' }
    return { cat: 'LR-3', detalhe: '≥20 mm sem APHE.', conduta: 'Imagem em curto prazo; considerar avaliação adicional.' }
  }, [aphe, washout, capsula, tgrowth, benigno, targetoide, tiv, sizeMm])

  const texto = useMemo(() => {
    const partes: string[] = []
    if (aphe) partes.push('realce arterial não periférico')
    if (washout) partes.push('washout portal/tardio não periférico')
    if (capsula) partes.push('pseudocápsula tardia')
    if (tgrowth) partes.push('crescimento limiar')
    const feats = partes.length ? partes.join(', ') : 'sem critérios maiores marcantes'
    const tamTxt = Number.isFinite(sizeMm) ? `${sizeMm.toFixed(1)} mm` : 'tamanho não informado'
    return `Observação hepática ${tamTxt} com ${feats}. Categoria ${categoria.cat}. ${categoria.detalhe} Conduta: ${categoria.conduta}`
  }, [categoria, aphe, washout, capsula, tgrowth, sizeMm])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-100">LI-RADS (CT/RM)</h1>
        <p className="text-sm text-gray-400">Simplificado para fígado em risco de CHC (hepatopatia crônica).</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-100">Dados principais</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <input
              placeholder="Tamanho (mm)"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={aphe} onChange={(e) => setAphe(e.target.checked)} />
              APHE (hiperrealce arterial não periférico)
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={washout} onChange={(e) => setWashout(e.target.checked)} />
              Washout portal/tardio
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={capsula} onChange={(e) => setCapsula(e.target.checked)} />
              Cápsula tardia
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={tgrowth} onChange={(e) => setTgrowth(e.target.checked)} />
              Crescimento limiar
            </label>
          </div>
          <div className="text-[11px] leading-relaxed text-gray-500 space-y-1">
            <p>
              <strong>APHE:</strong> hiperrealce arterial maior que o parênquima, poupando periferia (não periférico, não “rim-like”).
            </p>
            <p>
              <strong>Washout:</strong> queda de sinal/atenuação portal/tardia versus fígado (não periférico; atenção à hipointensidade tardia em cirrose).
            </p>
            <p>
              <strong>Cápsula:</strong> realce periférico suave e tardio.
            </p>
            <p>
              <strong>Crescimento limiar:</strong> aumento ≥50% em até 6 meses ou ≥100% em 6–12 meses.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <h2 className="text-sm font-semibold text-gray-100">Situações especiais</h2>
          <label className="inline-flex items-center gap-2 text-gray-200">
            <input type="checkbox" checked={benigno} onChange={(e) => setBenigno(e.target.checked)} />
            Benigno: cisto simples, hemangioma, HNF típica
          </label>
          <p className="text-[11px] text-gray-500">Marca como LR-1/2 e dispensa seguimento.</p>

          <label className="inline-flex items-center gap-2 text-gray-200">
            <input type="checkbox" checked={targetoide} onChange={(e) => setTargetoide(e.target.checked)} />
            Realce alvo / restrição difusa marcada (LR-M)
          </label>
          <p className="text-[11px] text-gray-500">
            Realce periférico progressivo (“target”), difusão/ADC muito restritos ou hipossinal T2 marcado → malignidade não HCC → biópsia/estadiar.
          </p>

          <label className="inline-flex items-center gap-2 text-gray-200">
            <input type="checkbox" checked={tiv} onChange={(e) => setTiv(e.target.checked)} />
            Tumor em veia (LR-TIV)
          </label>
          <p className="text-[11px] text-gray-500">Realce intraluminal em veia portal/hepática ou trombo expansivo com realce → tratar como doença avançada.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Categoria: {categoria.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{categoria.detalhe}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {categoria.conduta}</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">Pré-laudo</p>
          <textarea
            value={texto}
            onChange={() => {}}
            readOnly
            className="w-full min-h-[120px] rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={() => void navigator.clipboard.writeText(texto)}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Copiar
        </button>
      </section>
    </main>
  )
}
