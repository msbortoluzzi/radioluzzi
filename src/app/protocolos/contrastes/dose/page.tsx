'use client'

import { useMemo, useState } from 'react'

export default function DoseContrastePage() {
  const [peso, setPeso] = useState('')
  const [fator, setFator] = useState('1.5')

  const dose = useMemo(() => {
    const p = Number(peso.replace(',', '.'))
    const f = Number(fator.replace(',', '.'))
    if (Number.isNaN(p) || Number.isNaN(f)) return null
    return p * f
  }, [peso, fator])

  return (
    <main className="p-6 space-y-6 max-w-3xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Dose de contraste</h1>
        <p className="text-sm text-gray-400">Cálculo simples: peso (kg) × fator (mL/kg).</p>
      </div>

      <section className="p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f] space-y-3">
        <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
          <input
            placeholder="Peso (kg)"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-lg"
          />
          <input
            placeholder="Fator"
            value={fator}
            onChange={(e) => setFator(e.target.value)}
            className="w-24 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-lg text-center"
          />
        </div>
        <div className="text-sm text-gray-100">
          <p>Dose: {dose !== null ? `${dose.toFixed(1)} mL` : '—'}</p>
          <p className="text-[11px] text-gray-500">Ajuste o fator conforme o protocolo do serviço (ex.: 1,2–2 mL/kg).</p>
        </div>
      </section>
    </main>
  )
}
