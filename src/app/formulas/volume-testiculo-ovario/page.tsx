'use client'

import { useMemo, useState } from 'react'

type Org = 'testiculo' | 'ovario'

export default function VolumeTesticuloOvarioPage() {
  const [orgao, setOrgao] = useState<Org>('testiculo')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')

  const volume = useMemo(() => {
    const A = Number(a.replace(',', '.'))
    const B = Number(b.replace(',', '.'))
    const C = Number(c.replace(',', '.'))
    if (Number.isNaN(A) || Number.isNaN(B) || Number.isNaN(C)) return null
    return 0.523 * A * B * C
  }, [a, b, c])

  const range = useMemo(() => {
    if (orgao === 'testiculo') return 'Normal ~12–30 mL (adulto).'
    return 'Volume de referência varia com idade/menopausa; correlacionar com ovulação/folículos.'
  }, [orgao])

  return (
    <main className="p-6 space-y-4 max-w-3xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Volume testicular/ovariano</h1>
        <p className="text-sm text-gray-400">Fórmula elipsoide: 0,523 × A × B × C.</p>
      </div>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
        <label className="space-y-1">
          <span className="text-gray-200">Órgão</span>
          <select
            value={orgao}
            onChange={(e) => setOrgao(e.target.value as Org)}
            className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          >
            <option value="testiculo">Testículo</option>
            <option value="ovario">Ovário</option>
          </select>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            placeholder="A (cm)"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          />
          <input
            placeholder="B (cm)"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          />
          <input
            placeholder="C (cm)"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
          />
        </div>

        <div className="text-sm text-gray-100">
          <p>Volume: {volume !== null ? `${volume.toFixed(1)} mL` : '—'}</p>
          <p className="text-xs text-gray-400">{range}</p>
          <p className="text-[11px] text-gray-500">Use ROI em maior eixo longitudinal (A), transversal (B) e AP (C).</p>
        </div>
      </section>
    </main>
  )
}
