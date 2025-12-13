'use client'

import { useMemo, useState } from 'react'

const fmt = (n: number | null, digs = 1) => (n === null || Number.isNaN(n) ? '—' : n.toFixed(digs))

export default function AdrenalPage() {
  const [diametro, setDiametro] = useState('')
  const [huSem, setHuSem] = useState('')
  const [homogeneo, setHomogeneo] = useState(true)
  const [huPico, setHuPico] = useState('')
  const [huTardio, setHuTardio] = useState('')

  const sizeCm = useMemo(() => Number(diametro.replace(',', '.')), [diametro])
  const hu0 = useMemo(() => Number(huSem.replace(',', '.')), [huSem])
  const huE = useMemo(() => Number(huPico.replace(',', '.')), [huPico])
  const huD = useMemo(() => Number(huTardio.replace(',', '.')), [huTardio])

  const inicial = useMemo(() => {
    const ok0 = !Number.isNaN(hu0)
    let status: 'incompleto' | 'nao_precisa' | 'recomendado' = 'incompleto'
    let texto = 'Informe a atenuação sem contraste.'

    if (ok0) {
      if (hu0 <= 10 && homogeneo) {
        status = 'nao_precisa'
        texto = '≤10 UH e homogêneo → típico adenoma rico em lipídios. Washout não é necessário.'
      } else if (hu0 > 10 && hu0 < 20) {
        status = 'recomendado'
        texto = '11–20 UH é indeterminado. Recomendar CT washout (ou RM CSI).'
      } else if (hu0 >= 20) {
        status = 'recomendado'
        texto = '≥20 UH sugere não lipídico. Fazer washout CT e/ou RM CSI.'
      }
    }

    const avisoTamanho =
      !Number.isNaN(sizeCm) && sizeCm >= 4
        ? 'Lesões ≥4 cm têm maior risco de malignidade/atividade → correlacionar com contexto clínico/diretrizes.'
        : ''

    return { status, texto, avisoTamanho }
  }, [hu0, homogeneo, sizeCm])

  const washout = useMemo(() => {
    const okE = !Number.isNaN(huE)
    const okD = !Number.isNaN(huD)
    const ok0 = !Number.isNaN(hu0)
    let apw: number | null = null
    let rpw: number | null = null

    if (okE && okD) {
      if (ok0 && huE !== hu0) apw = ((huE - huD) / (huE - hu0)) * 100
      if (huE !== 0) rpw = ((huE - huD) / huE) * 100
    }

    const awOk = apw !== null && Number.isFinite(apw) && apw >= 60
    const rwOk = rpw !== null && Number.isFinite(rpw) && rpw >= 40

    let interpretacao = 'Preencha HU pico e tardio para calcular.'
    let fraseFinal = ''

    if (awOk || rwOk) {
      interpretacao = 'Washout elevado (APW ≥60% ou RPW ≥40%) → compatível com adenoma pobre em lipídios.'
      fraseFinal =
        'Lesão adrenal compatível com adenoma (washout alto). Sugere-se seguimento apenas se clinicamente indicado.'
    } else if ((apw !== null || rpw !== null) && !awOk && !rwOk) {
      interpretacao = 'Washout baixo/indeterminado. Considerar RM CSI, evolução e correlação clínica.'
      fraseFinal = 'Lesão adrenal indeterminada ao método. Recomenda-se investigação adicional ou seguimento conforme diretriz.'
    } else if (inicial.status === 'nao_precisa') {
      fraseFinal = 'Lesão adrenal ≤10 UH, homogênea: adenoma rico em lipídios. Sem necessidade de caracterização adicional.'
    } else if (inicial.status === 'recomendado' && !okE && !okD) {
      fraseFinal = 'Lesão requer caracterização (washout CT ou RM CSI) conforme HU inicial.'
    }

    return { apw, rpw, interpretacao, fraseFinal }
  }, [hu0, huE, huD, inicial.status])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-100">Adrenal — washout CT</h1>
        <p className="text-sm text-gray-400">Atenuação sem contraste + washout (APW/RPW) para sugerir adenoma.</p>
      </div>

      <section className="space-y-3 p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f]">
        <h2 className="text-base font-semibold text-gray-100">1) Avaliação inicial</h2>
        <div className="grid md:grid-cols-4 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">Maior diâmetro (cm)</span>
            <input
              type="number"
              step="0.1"
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
              value={diametro}
              onChange={(e) => setDiametro(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">Sem contraste (HU)</span>
            <input
              type="number"
              step="1"
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
              value={huSem}
              onChange={(e) => setHuSem(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={homogeneo}
              onChange={(e) => setHomogeneo(e.target.checked)}
              className="h-4 w-4 rounded border-[#1f1f1f] bg-[#0a0a0a]"
            />
            Homogêneo
          </label>
        </div>
        <p className="text-sm text-gray-100">{inicial.texto}</p>
        {inicial.avisoTamanho ? <p className="text-xs text-amber-400">{inicial.avisoTamanho}</p> : null}
      </section>

      <section className="space-y-3 p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f]">
        <h2 className="text-base font-semibold text-gray-100">2) Washout (opcional)</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">Pico (HU)</span>
            <input
              type="number"
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
              value={huPico}
              onChange={(e) => setHuPico(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">Tardio (HU)</span>
            <input
              type="number"
              className="border border-[#1f1f1f] rounded-md p-2 bg-[#0a0a0a] text-gray-100"
              value={huTardio}
              onChange={(e) => setHuTardio(e.target.value)}
            />
          </label>
        </div>

        <div className="text-sm text-gray-100">
          <p>Interpretação: {washout.interpretacao}</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>APW: {fmt(washout.apw)}</span>
            <span>RPW: {fmt(washout.rpw)}</span>
          </div>
          <p className="text-[11px] text-gray-500">
            APW = (Pico − Tardio) / (Pico − Sem contraste) × 100. RPW = (Pico − Tardio) / Pico × 100. Padrões usuais: APW ≥60% ou RPW ≥40%
            → adenoma pobre em lipídios.
          </p>
        </div>
      </section>

      <section className="p-4 border border-[#1f1f1f] rounded-lg bg-[#0f0f0f] space-y-2">
        <h2 className="text-base font-semibold text-gray-100">Pré-laudo sugerido</h2>
        <p className="text-sm text-gray-100">{washout.fraseFinal || 'Preencha os campos para sugerir laudo.'}</p>
      </section>
    </main>
  )
}
