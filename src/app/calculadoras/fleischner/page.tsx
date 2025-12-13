"use client"

import { useMemo, useState } from "react"

type Tipo = "solido" | "vidro-fosco" | "part-solido"

export default function FleischnerPage() {
  const [tipo, setTipo] = useState<Tipo>("solido")
  const [diametro, setDiametro] = useState<string>("")
  const [solidoComp, setSolidoComp] = useState<string>("")
  const [altoRisco, setAltoRisco] = useState<boolean>(false)

  const size = useMemo(() => Number(diametro.replace(",", ".")), [diametro])
  const sizeSolido = useMemo(() => Number(solidoComp.replace(",", ".")), [solidoComp])

  const conduta = useMemo(() => {
    const s = Number.isFinite(size) ? size : NaN
    const ss = Number.isFinite(sizeSolido) ? sizeSolido : NaN
    const risco = altoRisco ? "alto risco" : "baixo risco"

    if (tipo === "solido") {
      if (Number.isNaN(s)) return { cat: "Preencha o tamanho", texto: "Informe diâmetro em mm para classificar." }
      if (s < 6) {
        return {
          cat: "Sólido <6 mm",
          texto: altoRisco ? "Sem seguimento ou TC em 12 meses (opcional) para alto risco." : "Sem seguimento (risco baixo)."
        }
      }
      if (s >= 6 && s <= 8) {
        return {
          cat: "Sólido 6–8 mm",
          texto: altoRisco ? "TC em 6–12 e 18–24 meses." : "TC em 6–12 meses; considerar 18–24 meses."
        }
      }
      if (s > 8) {
        return { cat: "Sólido >8 mm", texto: "TC em ~3 meses; considerar PET/TC, biópsia ou ressecção." }
      }
    }

    if (tipo === "vidro-fosco") {
      if (Number.isNaN(s)) return { cat: "Preencha o tamanho", texto: "Informe diâmetro em mm para classificar." }
      if (s < 6) {
        return { cat: "GGO <6 mm", texto: "Sem seguimento específico." }
      }
      return { cat: "GGO ≥6 mm", texto: "TC em 6–12 meses; se persistente, TC a cada 2 anos até 5 anos." }
    }

    if (tipo === "part-solido") {
      if (Number.isNaN(s)) return { cat: "Preencha o tamanho", texto: "Informe diâmetro total em mm." }
      if (Number.isNaN(ss)) return { cat: "Informe componente sólido", texto: "Preencha o componente sólido (mm)." }
      if (ss >= 6) {
        return { cat: "Part-sólido c/ sólido ≥6 mm", texto: "TC em 3–6 meses; se persistente, considerar ressecção ou biópsia." }
      }
      if (s >= 6) {
        return { cat: "Part-sólido sólido <6 mm", texto: "TC em 3–6 meses; se persistente e sólido <6 mm, TC anual por 5 anos." }
      }
      return { cat: "Part-sólido <6 mm", texto: "TC em 3–6 meses para confirmar; se resolvido, alta." }
    }

    return { cat: "Indeterminado", texto: "Verificar entradas." }
  }, [tipo, size, sizeSolido, altoRisco])

  const resumo = useMemo(() => {
    const sTxt = Number.isFinite(size) ? `${size.toFixed(1)} mm` : "tamanho não informado"
    const solidTxt = tipo === "part-solido" ? `; sólido ${Number.isFinite(sizeSolido) ? `${sizeSolido.toFixed(1)} mm` : "N/D"}` : ""
    const riscoTxt = altoRisco ? "alto risco" : "baixo risco"
    const tipoTxt = tipo === "solido" ? "sólido" : tipo === "vidro-fosco" ? "vidro fosco" : "part-sólido"
    return `Nódulo ${tipoTxt} ${sTxt}${solidTxt}, ${riscoTxt}. ${conduta.cat}. Conduta: ${conduta.texto}`
  }, [tipo, size, sizeSolido, altoRisco, conduta])

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto text-gray-100">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Fleischner (2017) — nódulo incidental</h1>
        <p className="text-sm text-gray-400">Simplificado para nódulo único. Ajustar para múltiplos conforme diretriz.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-gray-100">Tipo e medidas</p>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipo)}
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
          <label className="inline-flex items-center gap-2 text-gray-200">
            <input type="checkbox" checked={altoRisco} onChange={(e) => setAltoRisco(e.target.checked)} />
            Paciente de alto risco (fumante pesado, histórico oncológico)
          </label>
        </div>

        <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2 text-sm">
          <p className="font-semibold text-gray-100">Regras resumidas</p>
          <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
            <li>Sólido: &lt;6 mm → 2 (sem seguimento); 6–8 → 3 (6–12m); 8–14.9 → 4A (3m/PET); ≥15 → 4B.</li>
            <li>Part-sólido: sólido &lt;4 mm → 3 (6m); 4–5.9 → 4A (3m); ≥6 → 4B (investigar).</li>
            <li>Vidro fosco puro: &lt;30 mm → 2; ≥30 mm → 3 (6–12m, depois 2/ano até 5a).</li>
          </ul>
          <p className="text-[11px] text-gray-500">Aplicar contexto clínico e avaliação de múltiplos nódulos conforme o documento completo.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">{conduta.cat}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {conduta.texto}</span>
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
              setAltoRisco(false)
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
