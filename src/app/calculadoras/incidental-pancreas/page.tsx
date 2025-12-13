"use client"

import { useMemo, useState } from "react"

type Worrisome = {
  mainDuct: boolean
  muralNodule: boolean
  solid: boolean
  jaundice: boolean
}

export default function IncidentalPancreasPage() {
  const [diametro, setDiametro] = useState<string>("")
  const [multiplas, setMultiplas] = useState<boolean>(false)
  const [w, setW] = useState<Worrisome>({ mainDuct: false, muralNodule: false, solid: false, jaundice: false })

  const sizeCm = useMemo(() => Number(diametro.replace(",", ".")), [diametro])
  const temWorrisome = w.mainDuct || w.muralNodule || w.solid || w.jaundice

  const plano = useMemo(() => {
    const s = Number.isFinite(sizeCm) ? sizeCm : NaN
    if (Number.isNaN(s)) return { cat: "Informe o tamanho (cm)", conduta: "Preencha o maior diâmetro." }

    if (temWorrisome) {
      return {
        cat: "Sinais de alto/alerta",
        conduta: "RM/MRCP ou TC de protocolo pancreático + avaliação em centro especializado; considerar ecoendoscopia."
      }
    }

    if (s < 1.5) {
      return {
        cat: "<1,5 cm sem sinais",
        conduta: "Cisto presumidamente seroso/BD-IPMN de baixo risco → imagem em 2 anos; se estável, alta."
      }
    }

    if (s >= 1.5 && s < 2.5) {
      return {
        cat: "1,5–2,4 cm sem sinais",
        conduta: "RM/MRCP em 1 ano; se estável, seguir a cada 2 anos por até 5 anos."
      }
    }

    if (s >= 2.5 && s < 3) {
      return {
        cat: "2,5–2,9 cm sem sinais",
        conduta: "RM/MRCP ou TC em 6–12 meses; considerar ecoendoscopia para cisto mucinoso."
      }
    }

    return {
      cat: "≥3,0 cm sem sinais",
      conduta: "RM/TC + ecoendoscopia; avaliação multidisciplinar (cisto mucinoso de maior risco)."
    }
  }, [sizeCm, temWorrisome])

  const resumo = useMemo(() => {
    const sTxt = Number.isFinite(sizeCm) ? `${sizeCm.toFixed(1)} cm` : "tamanho não informado"
    const wTxt = temWorrisome ? "com sinal de alarme" : "sem sinais de alarme"
    return `Cisto pancreático incidental ${sTxt}, ${wTxt}${multiplas ? ", múltiplos cistos" : ""}. Plano: ${plano.conduta}`
  }, [sizeCm, temWorrisome, multiplas, plano])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Cisto pancreático incidental (ACR/consensos)</h1>
        <p className="text-sm text-gray-400">Simplificado para cistos assintomáticos em exame não dedicado.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Tamanho e número</p>
            <input
              placeholder="Maior diâmetro (cm)"
              value={diametro}
              onChange={(e) => setDiametro(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={multiplas} onChange={(e) => setMultiplas(e.target.checked)} />
              Múltiplos cistos
            </label>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-100">Sinais de alarme</p>
            {[
              { key: "mainDuct", label: "Dilatação do ducto principal" },
              { key: "muralNodule", label: "Nódulo mural" },
              { key: "solid", label: "Componente sólido" },
              { key: "jaundice", label: "Icterícia relacionada" }
            ].map((item) => (
              <label key={item.key} className="inline-flex items-center gap-2 text-gray-200">
                <input
                  type="checkbox"
                  checked={w[item.key as keyof Worrisome]}
                  onChange={(e) => setW((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>&lt;1,5 cm sem sinais → imagem em 2 anos; se estável, alta.</li>
            <li>1,5–2,4 cm → RM/MRCP em 1 ano; depois cada 2 anos até 5 anos.</li>
            <li>≥2,5 cm → RM/TC em 6–12m; considerar EUS e avaliação especializada.</li>
            <li>Qualquer sinal de alarme → RM/TC + EUS, discussão multidisciplinar.</li>
          </ul>
          <p className="text-[11px] text-gray-500">Simplificado; confirmar diretrizes completas e contexto clínico.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{plano.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {plano.conduta}</span>
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
              setDiametro("")
              setMultiplas(false)
              setW({ mainDuct: false, muralNodule: false, solid: false, jaundice: false })
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
