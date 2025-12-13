'use client'

import { useMemo, useState } from 'react'

export default function VolumeFigadoPage() {
  const [ml, setMl] = useState('')
  const [cc, setCc] = useState('')
  const [ap, setAp] = useState('')

  const volume = useMemo(() => {
    const ML = Number(ml.replace(',', '.'))
    const CC = Number(cc.replace(',', '.'))
    const AP = Number(ap.replace(',', '.'))
    if (Number.isNaN(ML) || Number.isNaN(CC) || Number.isNaN(AP)) return null
    // elipsoide aproximado para fígado
    return 0.52 * ML * CC * AP
  }, [ml, cc, ap])

  return (
    <main className="p-6 space-y-4 max-w-3xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Volume hepático estimado</h1>
        <p className="text-sm text-gray-400">Elipsoide aproximado: 0,52 × ML × CC × AP (cm → mL).</p>
      </div>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            placeholder="ML (cm)"
            value={ml}
            onChange={(e) => setMl(e.target.value)}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          />
          <input
            placeholder="CC (cm)"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          />
          <input
            placeholder="AP (cm)"
            value={ap}
            onChange={(e) => setAp(e.target.value)}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          />
        </div>
        <div className="text-sm text-gray-100">
          <p>Volume estimado: {volume !== null ? `${volume.toFixed(0)} mL` : '—'}</p>
          <p className="text-[11px] text-gray-500">Usar medidas máximas ortogonais em TC/RM; estimativa, não substitui volumetria segmentada.</p>
        </div>
      </section>
    </main>
  )
}
