"use client"

import React, { useMemo, useState } from "react"

type BiradsCat = "0" | "2" | "3" | "4A" | "4B" | "4C" | "5" | ""

type Achado = {
  tipo: "nódulo" | "cisto"
  mama: string
  hora: string
  medidas: string[]
  distPele: string
  distPapila: string
  forma: string
  orientacao: string
  margens: string[]
  ecogenicidade: string
  acustica: string
  calcificacoes: string
  observacao: string
  birads: BiradsCat
  associados: { lnSus: boolean; distorcao: boolean; espDuctal: boolean }
  axila: { cortical: boolean; hilo: boolean; arredondado: boolean }
  correlacaoMammo: string
}

const defaultAchado = (): Achado => ({
  tipo: "nódulo",
  mama: "",
  hora: "",
  medidas: ["", "", ""],
  distPele: "",
  distPapila: "",
  forma: "oval",
  orientacao: "paralela",
  margens: ["circunscritas"],
  ecogenicidade: "isoecogênico",
  acustica: "sem alterações acústicas posteriores",
  calcificacoes: "sem calcificações",
  observacao: "",
  birads: "",
  associados: { lnSus: false, distorcao: false, espDuctal: false },
  axila: { cortical: false, hilo: false, arredondado: false },
  correlacaoMammo: ""
})

const margensOpcoes = ["circunscritas", "indistintas", "angular", "microlobuladas", "espiculadas", "regulares"]

const Chip: React.FC<{
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}> = ({ active, onClick, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-3 py-1 text-xs rounded-md border ${
      active ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
    }`}
  >
    {children}
  </button>
)

function sugerirBirads(a: Achado): BiradsCat {
  const isCyst = a.tipo === "cisto"
  const margens = new Set(a.margens || [])
  const eco = (a.ecogenicidade || "").toLowerCase()
  const calc = (a.calcificacoes || "").toLowerCase()
  const forma = (a.forma || "").toLowerCase()
  const orient = (a.orientacao || "").toLowerCase()
  const acust = (a.acustica || "").toLowerCase()
  const { lnSus, distorcao, espDuctal } = a.associados || {}
  const lnFlags = a.axila || {}
  const corr = (a.correlacaoMammo || "").toLowerCase()

  if (isCyst && eco.includes("aneco")) return "2"
  if (isCyst && (eco.includes("complicado") || eco.includes("espesso"))) return "2"
  if (isCyst && eco.includes("complexo")) return "4A"

  let sus = 0
  if (forma === "irregular") sus += 1
  if (orient === "não paralela") sus += 1
  if (margens.has("indistintas")) sus += 1
  if (margens.has("angular")) sus += 1
  if (margens.has("microlobuladas")) sus += 1
  if (margens.has("espiculadas")) sus += 2
  if (eco.includes("hipoeco") || eco.includes("heterog") || eco.includes("complex")) sus += 1
  if (acust.includes("atenua") || acust.includes("sombra")) sus += 1
  if (calc.includes("micro")) sus += 1
  if (lnSus) sus += 2
  if (distorcao) sus += 2
  if (espDuctal) sus += 1
  if (lnFlags.cortical || lnFlags.hilo || lnFlags.arredondado) sus += 1
  if (corr.includes("suspeita")) sus += 1

  if (sus === 0) return "2"
  if (sus === 1) return "3"
  if (sus === 2) return "4A"
  if (sus === 3) return "4B"
  if (sus === 4) return "4C"
  return "5"
}

function gerarFrase(a: Achado) {
  const textoCustom = (a as any).texto
  if (textoCustom && typeof textoCustom === "string" && textoCustom.trim()) {
    return textoCustom.trim()
  }

  const lado = a.mama ? ` ${a.mama}` : ""
  const hora = a.hora ? `, eixo ${a.hora}h` : ""
  const medidas = a.medidas.filter(Boolean)
  const medidasTxt = medidas.length ? `, medindo ${medidas.join(" x ")} cm` : ""
  const distPele = a.distPele ? `, a ${a.distPele} cm da pele` : ""
  const distPapila = a.distPapila ? ` e ${a.distPapila} cm da papila` : ""
  const margensTxt = a.margens.length ? a.margens.join("/") : "regulares"
  const axila: string[] = []
  if (a.axila.cortical) axila.push("linfonodo com cortical espessada")
  if (a.axila.hilo) axila.push("linfonodo sem hilo")
  if (a.axila.arredondado) axila.push("linfonodo arredondado")
  const associados: string[] = []
  if (a.associados.lnSus) associados.push("linfonodo suspeito")
  if (a.associados.distorcao) associados.push("distorção arquitetural")
  if (a.associados.espDuctal) associados.push("ectasia/espessamento ductal")
  const obs = a.observacao ? ` ${a.observacao}` : ""
  const corMammo = a.correlacaoMammo ? ` Correlação mamográfica: ${a.correlacaoMammo}.` : ""

  const textoBase =
    a.tipo === "cisto"
      ? `Cisto na mama${lado}${hora}${medidasTxt}${distPele}${distPapila}, conteúdo anecoico e margens ${margensTxt}.`
      : `Nódulo ${a.forma} ${a.orientacao} na mama${lado}${hora}${medidasTxt}${distPele}${distPapila}, margens ${margensTxt}, ecogenicidade ${a.ecogenicidade}, efeito acústico ${a.acustica}, calcificações ${a.calcificacoes}.${obs}`

  const extras = [
    associados.length ? ` Achados associados: ${associados.join(", ")}.` : "",
    axila.length ? ` Axila: ${axila.join(", ")}.` : "",
    corMammo
  ].join("")

  const bi = a.birads || sugerirBirads(a)
  const biradsTxt = bi ? ` BI-RADS ${bi}.` : ""

  return `${textoBase}${extras}${biradsTxt}`
}

export default function BiradsPage() {
  const [achados, setAchados] = useState<Achado[]>([defaultAchado()])

  const atualizarAchado = (i: number, patch: any) => {
    setAchados((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], ...patch }
      return next
    })
  }

  const toggleMargem = (i: number, margem: string) => {
    setAchados((prev) => {
      const next = [...prev]
      const set = new Set(next[i].margens)
      set.has(margem) ? set.delete(margem) : set.add(margem)
      next[i].margens = Array.from(set)
      return next
    })
  }

  const remover = (i: number) => {
    setAchados((prev) => prev.filter((_, idx) => idx !== i))
  }

  const copiarTudo = () => {
    const texto = achados.map((a) => gerarFrase(a)).join("\n")
    void navigator.clipboard.writeText(texto)
  }

  return (
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-100">BIRADS - mamografia/US</h1>
        <p className="text-sm text-gray-400">Monte achados de mama e gere BI-RADS rapidamente.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setAchados((prev) => [...prev, defaultAchado()])}
          className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100"
        >
          + Adicionar achado
        </button>
        <button
          onClick={() => setAchados([defaultAchado()])}
          className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100"
        >
          Limpar
        </button>
      </div>

      {achados.map((a, idx) => {
        const sugestao = sugerirBirads(a)
        const frase = gerarFrase(a)
        return (
          <div key={idx} className="border border-[#1f1f1f] bg-[#0f0f0f] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-100">Achado {idx + 1}</h3>
              <button
                onClick={() => remover(idx)}
                className="text-xs text-red-400 hover:text-red-200 px-3 py-1 rounded-md border border-[#1f1f1f]"
              >
                Remover
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <select
                value={a.tipo}
                onChange={(e) => atualizarAchado(idx, { tipo: e.target.value as Achado["tipo"] })}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              >
                <option value="nódulo">Nódulo</option>
                <option value="cisto">Cisto</option>
              </select>
              <input
                placeholder="Mama (D/E)"
                value={a.mama}
                onChange={(e) => atualizarAchado(idx, { mama: e.target.value })}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              />
              <input
                placeholder="Relógio (ex: 4h)"
                value={a.hora}
                onChange={(e) => atualizarAchado(idx, { hora: e.target.value })}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              />
              <input
                placeholder="Distância pele (cm)"
                value={a.distPele}
                onChange={(e) => atualizarAchado(idx, { distPele: e.target.value })}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              />
              <input
                placeholder="Distância papila (cm)"
                value={a.distPapila}
                onChange={(e) => atualizarAchado(idx, { distPapila: e.target.value })}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
              />
              {a.medidas.map((m, i) => (
                <input
                  key={i}
                  placeholder={`Medida ${i + 1} (cm)`}
                  value={m}
                  onChange={(e) => {
                    const med = [...a.medidas]
                    med[i] = e.target.value
                    atualizarAchado(idx, { medidas: med })
                  }}
                  className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
                />
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Forma / Orientação</p>
              <div className="flex flex-wrap gap-2">
                {["oval", "redonda", "irregular"].map((f) => (
                  <Chip key={f} active={a.forma === f} onClick={() => atualizarAchado(idx, { forma: f })}>
                    {f}
                  </Chip>
                ))}
                {["paralela", "não paralela"].map((o) => (
                  <Chip key={o} active={a.orientacao === o} onClick={() => atualizarAchado(idx, { orientacao: o })}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Margens</p>
              <div className="flex flex-wrap gap-2">
                {margensOpcoes.map((m) => (
                  <Chip key={m} active={a.margens.includes(m)} onClick={() => toggleMargem(idx, m)}>
                    {m}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Ecogenicidade / acústica / calcificações</p>
              <div className="flex flex-wrap gap-2">
                {["isoecogênico", "hipoecoico", "hiperecogênico", "heterogêneo", "complexo"].map((e) => (
                  <Chip key={e} active={a.ecogenicidade === e} onClick={() => atualizarAchado(idx, { ecogenicidade: e })}>
                    {e}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["sem alterações acústicas posteriores", "reforço", "atenuação", "misto"].map((e) => (
                  <Chip key={e} active={a.acustica === e} onClick={() => atualizarAchado(idx, { acustica: e })}>
                    {e}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["sem calcificações", "microcalcificações", "macrocalcificações", "calcificações ductais"].map((c) => (
                  <Chip key={c} active={a.calcificacoes === c} onClick={() => atualizarAchado(idx, { calcificacoes: c })}>
                    {c}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Observação / mamografia</p>
              <div className="flex flex-wrap gap-2">
                {["estável", "novo", "em crescimento"].map((o) => (
                  <Chip key={o} active={a.observacao === o} onClick={() => atualizarAchado(idx, { observacao: o })}>
                    {o}
                  </Chip>
                ))}
              </div>
              <input
                placeholder="Correlação mamográfica (opcional)"
                value={a.correlacaoMammo}
                onChange={(e) => atualizarAchado(idx, { correlacaoMammo: e.target.value })}
                className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 w-full text-sm"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Achados associados / axila</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "lnSus", label: "Linfonodo suspeito" },
                  { key: "distorcao", label: "Distorção arquitetural" },
                  { key: "espDuctal", label: "Espessamento ductal" }
                ].map((flag) => (
                  <Chip
                    key={flag.key}
                    active={a.associados[flag.key as keyof Achado["associados"]]}
                    onClick={() =>
                      atualizarAchado(idx, {
                        associados: {
                          ...a.associados,
                          [flag.key]: !a.associados[flag.key as keyof Achado["associados"]]
                        }
                      })
                    }
                  >
                    {flag.label}
                  </Chip>
                ))}
                {[
                  { key: "cortical", label: "Axila cortical" },
                  { key: "hilo", label: "Axila sem hilo" },
                  { key: "arredondado", label: "Axila arredondado" }
                ].map((flag) => (
                  <Chip
                    key={flag.key}
                    active={a.axila[flag.key as keyof Achado["axila"]]}
                    onClick={() =>
                      atualizarAchado(idx, {
                        axila: {
                          ...a.axila,
                          [flag.key]: !a.axila[flag.key as keyof Achado["axila"]]
                        }
                      })
                    }
                  >
                    {flag.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Sugestão automática</p>
                <div className="px-3 py-2 rounded-md border border-[#1f1f1f] text-sm text-gray-100">BI-RADS {sugestao || "—"}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Definir BI-RADS</label>
                <select
                  value={a.birads}
                  onChange={(e) => atualizarAchado(idx, { birads: e.target.value as BiradsCat })}
                  className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-sm"
                >
                  {["", "0", "2", "3", "4A", "4B", "4C", "5"].map((c) => (
                    <option key={c} value={c}>
                      {c === "" ? "Usar sugestão" : `BI-RADS ${c}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-400">Pré-laudo</p>
              <textarea
                value={frase}
                onChange={(e) => atualizarAchado(idx, { texto: e.target.value })}
                className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-sm min-h-[120px]"
              />
            </div>
          </div>
        )
      })}

      {achados.length > 0 && (
        <div className="border border-[#1f1f1f] rounded-md bg-[#0f0f0f] p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-100">Copiar todas as frases</h3>
          <button
            onClick={copiarTudo}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Copiar tudo
          </button>
        </div>
      )}
    </main>
  )
}
