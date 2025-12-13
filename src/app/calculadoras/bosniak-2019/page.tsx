"use client"

import { useMemo, useState } from "react"

type Classe = "I" | "II" | "IIF" | "III" | "IV" | "Indeterminado"

export default function BosniakPage() {
  const [septo, setSepto] = useState(false)
  const [numeroSeptos, setNumeroSeptos] = useState<number>(0)
  const [espesso, setEspesso] = useState(false)
  const [nodulo, setNodulo] = useState(false)
  const [calcGruesa, setCalcGruesa] = useState(false)
  const [realce, setRealce] = useState<boolean>(true)
  const [homogeneo, setHomogeneo] = useState<boolean>(false)
  const [tamanho, setTamanho] = useState<string>("")

  const sizeCm = useMemo(() => Number(tamanho.replace(",", ".")), [tamanho])

  const classe = useMemo((): { cat: Classe; detalhe: string; conduta: string } => {
    const s = Number.isFinite(sizeCm) ? sizeCm : NaN

    // Lesões claramente simples
    if (!realce && !septo && !nodulo && !calcGruesa) {
      if (!Number.isNaN(s) && s > 0 && s <= 3) {
        return { cat: "I", detalhe: "Cisto simples fino, sem realce.", conduta: "Sem seguimento." }
      }
      return { cat: "II", detalhe: "Cisto minimamente complexo sem realce.", conduta: "Sem seguimento." }
    }

    if (!nodulo && !espesso && septo && numeroSeptos <= 3 && !calcGruesa) {
      return { cat: "II", detalhe: "Poucos septos finos com realce discreto.", conduta: "Sem seguimento." }
    }

    if (calcGruesa && !nodulo && !espesso && !septo) {
      return { cat: "II", detalhe: "Calcificação grosseira sem partes moles realçadas.", conduta: "Sem seguimento." }
    }

    if (septo && numeroSeptos > 3 && !nodulo && !espesso && !calcGruesa) {
      return { cat: "IIF", detalhe: "Vários septos finos com realce discreto, sem nódulo/espessamento.", conduta: "TC/RM em 6–12m, depois anual até 5 anos." }
    }

    if (espesso && !nodulo) {
      return { cat: "III", detalhe: "Parede/septo espessos com realce.", conduta: "Avaliação cirúrgica ou vigilância especializada." }
    }

    if (nodulo) {
      return { cat: "IV", detalhe: "Nódulo/parênquima realçado na parede ou septo.", conduta: "Alta suspeição → considerar ressecção/avaliação urológica." }
    }

    return { cat: "Indeterminado", detalhe: "Combinação não clássica.", conduta: "Revisar imagens e critérios completos Bosniak v2019." }
  }, [calcGruesa, espesso, nodulo, septo, numeroSeptos, sizeCm, realce])

  const resumo = useMemo(() => {
    const tamTxt = Number.isFinite(sizeCm) ? `${sizeCm.toFixed(1)} cm` : "tamanho não informado"
    const septoTxt = septo ? `${numeroSeptos} septo(s)` : "sem septos"
    const espTxt = espesso ? "espessados" : "finos"
    const nodTxt = nodulo ? "nódulo presente" : "sem nódulo"
    const calcTxt = calcGruesa ? "calcificação grosseira" : "sem calcificação grosseira"
    return `Cisto renal ${tamTxt}, ${septoTxt} (${espTxt}), ${nodTxt}, ${calcTxt}. Bosniak ${classe.cat}. ${classe.detalhe} Conduta: ${classe.conduta}`
  }, [sizeCm, septo, numeroSeptos, espesso, nodulo, calcGruesa, classe])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Bosniak v2019 (cisto renal)</h1>
        <p className="text-sm text-gray-400">Classificação simplificada — confirme no laudo completo.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Caracterização</p>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={realce} onChange={(e) => setRealce(e.target.checked)} />
              Realce perceptível
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={septo} onChange={(e) => setSepto(e.target.checked)} />
              Septos
            </label>
            {septo && (
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center justify-between">
                  <span className="text-gray-200">Nº de septos</span>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={numeroSeptos}
                    onChange={(e) => setNumeroSeptos(Math.max(0, Number(e.target.value) || 0))}
                    className="w-20 rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-2 py-1 text-right"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-gray-200">
                  <input type="checkbox" checked={espesso} onChange={(e) => setEspesso(e.target.checked)} />
                  Espessos
                </label>
              </div>
            )}
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={calcGruesa} onChange={(e) => setCalcGruesa(e.target.checked)} />
              Calcificação grosseira
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={nodulo} onChange={(e) => setNodulo(e.target.checked)} />
              Nódulo/parênquima realçando
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
            <li>I/II: sem realce nodular; poucos septos finos ou calcificações grosseiras isoladas → sem seguimento.</li>
            <li>IIF: múltiplos septos finos, realce discreto, sem nódulo/espessamento → TC/RM 6–12m, depois anual até 5a.</li>
            <li>III: septos/parede espessos com realce; IV: nódulo/parênquima realçando.</li>
          </ul>
          <p className="text-[11px] text-gray-500">Simplificado; confirmar com critérios completos e correlacionar com URO/oncologia.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Bosniak {classe.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{classe.detalhe}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {classe.conduta}</span>
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
              setSepto(false)
              setNumeroSeptos(0)
              setEspesso(false)
              setNodulo(false)
              setCalcGruesa(false)
              setRealce(true)
              setHomogeneo(false)
              setTamanho("")
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
