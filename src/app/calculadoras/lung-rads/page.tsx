"use client"

import { useMemo, useState } from "react"

type TipoNodulo = "solido" | "part-solido" | "vidro-fosco"

export default function LungRadsPage() {
  const [tipo, setTipo] = useState<TipoNodulo>("solido")
  const [diametro, setDiametro] = useState<string>("")
  const [solidoComp, setSolidoComp] = useState<string>("") // para part-sólido
  const [novo, setNovo] = useState<boolean>(false)
  const [cresceu, setCresceu] = useState<boolean>(false) // crescimento >=1.5 mm

  const size = useMemo(() => Number(diametro.replace(",", ".")), [diametro])
  const sizeSolido = useMemo(() => Number(solidoComp.replace(",", ".")), [solidoComp])

  const categoria = useMemo(() => {
    const s = Number.isFinite(size) ? size : NaN
    const ss = Number.isFinite(sizeSolido) ? sizeSolido : NaN
    const flagCresc = novo || cresceu

    // Ground-glass
    if (tipo === "vidro-fosco") {
      if (!Number.isNaN(s) && s >= 30) {
        return { cat: "Lung-RADS 3", detalhe: "Vidro fosco ≥30 mm.", conduta: "LDCT em 6 meses." }
      }
      return { cat: "Lung-RADS 2", detalhe: "Vidro fosco <30 mm.", conduta: "LDCT anual." }
    }

    // Part-sólido
    if (tipo === "part-solido") {
      if (!Number.isNaN(ss) && ss >= 6) {
        return { cat: "Lung-RADS 4B", detalhe: "Componente sólido ≥6 mm.", conduta: "LDCT em 3 meses ou PET/TC/biópsia." }
      }
      if (!Number.isNaN(ss) && ss >= 4) {
        return { cat: "Lung-RADS 4A", detalhe: "Componente sólido 4–5.9 mm.", conduta: "LDCT em 3 meses." }
      }
      return { cat: "Lung-RADS 3", detalhe: "Part-sólido com componente sólido <4 mm.", conduta: "LDCT em 6 meses." }
    }

    // Sólido
    if (!Number.isNaN(s)) {
      if (s < 6 && !flagCresc) return { cat: "Lung-RADS 2", detalhe: "Sólido <6 mm estável.", conduta: "LDCT anual." }
      if (s >= 6 && s < 8 && !flagCresc) return { cat: "Lung-RADS 3", detalhe: "Sólido 6–7.9 mm estável.", conduta: "LDCT em 6 meses." }
      if (s >= 8 && s < 15 && !flagCresc) return { cat: "Lung-RADS 4A", detalhe: "Sólido 8–14.9 mm estável.", conduta: "LDCT em 3 meses; considerar PET/TC." }
      if (s >= 15 && !flagCresc) return { cat: "Lung-RADS 4B", detalhe: "Sólido ≥15 mm estável.", conduta: "Avaliação diagnóstica (PET/TC, biópsia)." }

      if (flagCresc) {
        if (s < 6) return { cat: "Lung-RADS 3", detalhe: "Sólido <6 mm novo/cresceu.", conduta: "LDCT em 6 meses." }
        if (s >= 6 && s < 8) return { cat: "Lung-RADS 4A", detalhe: "Sólido 6–7.9 mm novo/cresceu.", conduta: "LDCT em 3 meses; considerar PET/TC." }
        if (s >= 8) return { cat: "Lung-RADS 4B", detalhe: "Sólido ≥8 mm novo/cresceu.", conduta: "PET/TC e/ou biópsia." }
      }
    }

    return { cat: "Indeterminado", detalhe: "Preencha tamanho.", conduta: "Informar diâmetro e tipo." }
  }, [tipo, size, sizeSolido, novo, cresceu])

  const resumo = useMemo(() => {
    const tamTxt = Number.isFinite(size) ? `${size.toFixed(1)} mm` : "tamanho não informado"
    const solTxt = tipo === "part-solido" ? `; sólido ${Number.isFinite(sizeSolido) ? `${sizeSolido.toFixed(1)} mm` : "N/D"}` : ""
    const flags = []
    if (novo) flags.push("nódulo novo")
    if (cresceu) flags.push("crescimento ≥1.5 mm")
    const flagTxt = flags.length ? ` (${flags.join(", ")})` : ""
    const tipoTxt = tipo === "solido" ? "sólido" : tipo === "part-solido" ? "part-sólido" : "vidro fosco"
    return `Nódulo ${tipoTxt} ${tamTxt}${solTxt}${flagTxt}. ${categoria.cat}. ${categoria.detalhe} Conduta: ${categoria.conduta}`
  }, [tipo, size, sizeSolido, novo, cresceu, categoria])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Lung-RADS (LDCT)</h1>
        <p className="text-sm text-gray-400">Versão simplificada (baseada em v2022) para triagem de câncer de pulmão.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Tipo e tamanhos</p>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoNodulo)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            >
              <option value="solido">Sólido</option>
              <option value="part-solido">Part-sólido</option>
              <option value="vidro-fosco">Vidro fosco (puro)</option>
            </select>
            <input
              placeholder="Maior diâmetro (mm)"
              value={diametro}
              onChange={(e) => setDiametro(e.target.value)}
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            {tipo === "part-solido" && (
              <input
                placeholder="Componente sólido (mm)"
                value={solidoComp}
                onChange={(e) => setSolidoComp(e.target.value)}
                className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Comportamento</p>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={novo} onChange={(e) => setNovo(e.target.checked)} />
              Nódulo novo
            </label>
            <label className="inline-flex items-center gap-2 text-gray-200">
              <input type="checkbox" checked={cresceu} onChange={(e) => setCresceu(e.target.checked)} />
              Cresceu ≥ 1,5 mm
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>Sólido: &lt;6 mm → 2; 6–7.9 → 3; 8–14.9 → 4A; ≥15 → 4B (novo/cresceu → subir).</li>
            <li>Part-sólido: componente sólido &lt;4 mm → 3; 4–5.9 → 4A; ≥6 → 4B.</li>
            <li>Vidro fosco: &lt;30 mm → 2; ≥30 mm → 3.</li>
          </ul>
          <p className="text-[11px] text-gray-500">Simplificado; ver Lung-RADS v2022 para cenários múltiplos/níveis de suspeição adicionais.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{categoria.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{categoria.detalhe}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {categoria.conduta}</span>
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
              setTipo("solido")
              setDiametro("")
              setSolidoComp("")
              setNovo(false)
              setCresceu(false)
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
