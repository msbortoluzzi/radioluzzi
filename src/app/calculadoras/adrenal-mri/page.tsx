'use client'

import { useMemo, useState } from 'react'

const fmt = (n: number | null, digs = 1) => (n === null || Number.isNaN(n) ? '—' : n.toFixed(digs))

export default function AdrenalMriPage() {
  const [inPhase, setInPhase] = useState('')
  const [opPhase, setOpPhase] = useState('')
  const [huNoContraste, setHuNoContraste] = useState('')
  const [huPortal, setHuPortal] = useState('')

  const inVal = useMemo(() => Number(inPhase.replace(',', '.')), [inPhase])
  const opVal = useMemo(() => Number(opPhase.replace(',', '.')), [opPhase])
  const nc = useMemo(() => Number(huNoContraste.replace(',', '.')), [huNoContraste])
  const portal = useMemo(() => Number(huPortal.replace(',', '.')), [huPortal])

  const drop = useMemo(() => {
    if (Number.isNaN(inVal) || Number.isNaN(opVal) || inVal === 0) return null
    return ((inVal - opVal) / inVal) * 100
  }, [inVal, opVal])

  const categoria = useMemo(() => {
    if (drop === null) return { texto: 'Informe sinais in/opposed-phase para calcular.', laudo: '' }
    if (drop >= 20) {
      return {
        texto: 'Queda de sinal >20% → compatível com adenoma rico em lipídios.',
        laudo: 'Massa adrenal com queda significativa de sinal em opposed-phase, compatível com adenoma lipídico.'
      }
    }
    if (drop >= 10) {
      return {
        texto: 'Queda 10–20% → provável adenoma; correlacionar com HU sem contraste.',
        laudo: 'Massa adrenal com queda moderada de sinal (10–20%); favorece adenoma, sugerir correlação com HU inicial ou CT washout.'
      }
    }
    return {
      texto: 'Queda <10% → sem gordura intracelular relevante; indeterminado.',
      laudo: 'Massa adrenal sem queda significativa em opposed-phase, indeterminada para adenoma. Considerar CT washout ou RM adicional.'
    }
  }, [drop])

  const resumoCt = useMemo(() => {
    const okNc = !Number.isNaN(nc)
    const okPortal = !Number.isNaN(portal)
    if (!okNc && !okPortal) return ''
    if (okNc && okPortal) {
      if (nc <= 10) return 'HU sem contraste ≤10 favorece adenoma lipídico.'
      return 'HU >10 sugere caracterização adicional (washout).'
    }
    if (okNc) {
      return nc <= 10 ? 'HU sem contraste ≤10 favorece adenoma lipídico.' : 'HU >10 sugere caracterização adicional (washout).'
    }
    return ''
  }, [nc, portal])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-100">Adrenal RM (Chemical Shift)</h1>
        <p className="text-sm text-gray-400">Queda de sinal in/opposed-phase e, opcional, HU da TC para correlação.</p>
      </div>

      <section className="space-y-3 p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f]">
        <h2 className="text-base font-semibold text-gray-100">Sinal in/opposed-phase</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">In-phase (SI)</span>
            <input
              value={inPhase}
              onChange={(e) => setInPhase(e.target.value)}
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
              placeholder="ROI média"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">Opposed-phase (SI)</span>
            <input
              value={opPhase}
              onChange={(e) => setOpPhase(e.target.value)}
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
              placeholder="ROI média"
            />
          </label>
        </div>
        <div className="text-sm text-gray-100">
          <p>Queda de sinal: {fmt(drop)}%</p>
          <p className="text-xs text-gray-400">Fórmula: (In - Opposed) / In × 100.</p>
        </div>
      </section>

      <section className="space-y-3 p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f]">
        <h2 className="text-base font-semibold text-gray-100">Correlação com TC (opcional)</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">HU sem contraste</span>
            <input
              value={huNoContraste}
              onChange={(e) => setHuNoContraste(e.target.value)}
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">HU fase portal (opcional)</span>
            <input
              value={huPortal}
              onChange={(e) => setHuPortal(e.target.value)}
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
            />
          </label>
        </div>
        {resumoCt && <p className="text-sm text-gray-100">{resumoCt}</p>}
      </section>

      <section className="p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f] space-y-2">
        <h2 className="text-base font-semibold text-gray-100">Interpretação</h2>
        <p className="text-sm text-gray-100">{categoria.texto}</p>
        <p className="text-sm text-gray-100">{categoria.laudo}</p>
      </section>
    </main>
  )
}
