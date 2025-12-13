'use client'

import { useMemo, useState } from 'react'

type Sexo = 'M' | 'F'

function calcEgfr(creat: number, age: number, sexo: Sexo) {
  // CKD-EPI 2021 (sem fator raça)
  const k = sexo === 'F' ? 0.7 : 0.9
  const a = sexo === 'F' ? -0.241 : -0.302
  const minScr = Math.min(creat / k, 1)
  const maxScr = Math.max(creat / k, 1)
  const sexCoeff = sexo === 'F' ? 1.012 : 1
  return 142 * Math.pow(minScr, a) * Math.pow(maxScr, -1.200) * Math.pow(0.9938, age) * sexCoeff
}

export default function GfrContrastePage() {
  const [creatinina, setCreatinina] = useState('')
  const [idade, setIdade] = useState('')
  const [sexo, setSexo] = useState<Sexo>('F')

  const creat = useMemo(() => Number(creatinina.replace(',', '.')), [creatinina])
  const age = useMemo(() => Number(idade), [idade])

  const egfr = useMemo(() => {
    if (Number.isNaN(creat) || Number.isNaN(age) || age <= 0 || creat <= 0) return null
    return calcEgfr(creat, age, sexo)
  }, [creat, age, sexo])

  const risco = useMemo(() => {
    if (egfr === null) return { nivel: 'Informe dados', plano: 'Preencha creatinina, idade e sexo.' }
    if (egfr >= 60) return { nivel: 'Baixo', plano: 'Risco baixo para nefropatia por contraste. Proceder conforme rotina.' }
    if (egfr >= 30) return { nivel: 'Moderado', plano: 'Avaliar hidratação, limitar dose; considerar profilaxia conforme protocolo local.' }
    return { nivel: 'Alto', plano: 'Evitar contraste iodado se possível; discutir benefícios/risco, hidratação e alternativa de imagem.' }
  }, [egfr])

  return (
    <main className="p-6 space-y-6 max-w-3xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">eGFR para contraste (CKD-EPI 2021)</h1>
        <p className="text-sm text-gray-400">Entrada: creatinina (mg/dL), idade e sexo. Saída: mL/min/1,73 m².</p>
      </div>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="space-y-1">
            <span className="text-gray-200">Creatinina (mg/dL)</span>
            <input
              value={creatinina}
              onChange={(e) => setCreatinina(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              placeholder="Ex.: 1.0"
            />
          </label>
          <label className="space-y-1">
            <span className="text-gray-200">Idade (anos)</span>
            <input
              value={idade}
              onChange={(e) => setIdade(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              placeholder="Ex.: 65"
            />
          </label>
          <label className="space-y-1">
            <span className="text-gray-200">Sexo</span>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value as Sexo)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
          </label>
        </div>

        <div className="text-sm text-gray-100">
          <p>eGFR: {egfr !== null ? `${egfr.toFixed(1)} mL/min/1,73 m²` : '—'}</p>
          <p className="text-xs text-gray-400">Fórmula CKD-EPI 2021 (sem raça). Usar valores laboratoriais confiáveis.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
        <p className="font-semibold text-gray-100">Risco para contraste iodado</p>
        <p className="text-sm text-gray-100">{risco.nivel}</p>
        <p className="text-sm text-gray-100">{risco.plano}</p>
        <p className="text-[11px] text-gray-500">Seguir protocolo institucional de profilaxia/hidratação e considerar contraste iso/baixa osmolaridade.</p>
      </section>
    </main>
  )
}
