"use client"

import { useState } from "react"

type TipoAchado = "linfonodo" | "glandula" | "massa"

type Achado = {
  tipo: TipoAchado
  criterios: Record<string, string>
  medidas: string[]
  texto?: string
}

export default function Page() {
  const [achados, setAchados] = useState<Achado[]>([])

  const adicionar = (tipo: TipoAchado) => {
    setAchados((prev) => [...prev, { tipo, criterios: {}, medidas: ["", "", ""], texto: "" }])
  }

  const atualizar = (index: number, campo: string, valor: string) => {
    setAchados((prev) => {
      const next = [...prev]
      next[index].criterios[campo] = valor
      return next
    })
  }

  const atualizarMedida = (index: number, i: number, valor: string) => {
    setAchados((prev) => {
      const next = [...prev]
      next[index].medidas[i] = valor
      return next
    })
  }

  const gerarTextoPadrao = (a: Achado) => {
    if (a.tipo === "linfonodo") {
      const [longo, curto] = a.medidas.map(parseFloat)
      const clRatio = !isNaN(longo) && !isNaN(curto) && curto !== 0 ? longo / curto : 0

      const forma = clRatio >= 2 ? "alongado" : "oval"
      const hilo = a.criterios.hilo_estado === "preservado" ? "preservado" : "ausente"
      const microcalc = a.criterios.microcalc === "sim" ? "com microcalcificações" : "sem microcalcificações"
      const necrose = a.criterios.necrose === "sim" ? "com necrose ou área cística" : ""
      const margens = a.criterios.margens === "irregulares" ? "irregulares" : "regulares"
      const vasc = a.criterios.vasc_tipo || "hilar"

      const local = (() => {
        const nivel = a.criterios.nivel ? `nível cervical ${a.criterios.nivel}` : ""
        const lado = a.criterios.lado ? ` ${a.criterios.lado}` : ""
        if (nivel) return `${nivel}${lado}`
        if (a.criterios.local === "intraparotideo") return "intraparotídeo"
        return ""
      })()

      const medidas = a.medidas.filter((x) => x)
      const medidasTxt = medidas.length ? `${medidas.join(" x ")} cm` : "medidas não informadas"

      return `Linfonodo ${forma} com hilo ecogênico ${hilo}, hipoecogênico, ${microcalc}${
        necrose ? ", " + necrose : ""
      }, margens ${margens} e vascularização ${vasc} ao Doppler${local ? ` no ${local}` : ""}, medindo ${medidasTxt}.`
    }

    if (a.tipo === "glandula") {
      const gland = a.criterios.glandula || "parótida"
      const lado = a.criterios.lado || ""
      const tipo = a.criterios.tipo || "sólida"
      const eco = a.criterios.eco || "hipoecoica"
      const margens = a.criterios.margens || "regulares"
      const medidas = a.medidas.filter((x) => x)
      const medidasTxt = medidas.length ? `, medindo ${medidas.join(" x ")} cm` : ""
      return `Lesão ${tipo} ${eco} na glândula ${gland} ${lado}, margens ${margens}${medidasTxt}.`
    }

    const medidas = a.medidas.filter((x) => x)
    const medidasTxt = medidas.length ? ` Medidas: ${medidas.join(" x ")} cm.` : ""
    return `Massa/lesão inespecífica.${medidasTxt}`
  }

  const atualizarTexto = (index: number, texto: string) => {
    setAchados((prev) => {
      const next = [...prev]
      next[index].texto = texto
      return next
    })
  }

  const copiarTudo = () => {
    const texto = achados
      .map((a) => {
        if (a.texto && a.texto.trim() !== "") return a.texto
        return gerarTextoPadrao(a)
      })
      .join("\n")
    void navigator.clipboard.writeText(texto)
  }

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-100">Linfonodos e glândulas cervicais</h1>
        <p className="text-sm text-gray-400">Monte frases rápidas para laudos de US cervical.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => adicionar("linfonodo")} className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100">
          + Linfonodo
        </button>
        <button onClick={() => adicionar("glandula")} className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100">
          + Glândula
        </button>
        <button onClick={() => adicionar("massa")} className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100">
          + Massa
        </button>
      </div>

      {achados.map((a, idx) => {
        const textoGerado = gerarTextoPadrao(a)
        const textoMostrado = a.texto !== undefined && a.texto !== "" ? a.texto : textoGerado

        return (
          <div key={idx} className="border border-[#1f1f1f] p-4 rounded-lg space-y-4 bg-[#0f0f0f]">
            {a.tipo === "linfonodo" && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-100">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { chave: "forma", label: "arredondado" },
                      { chave: "cortical", label: "cortical espessada" }
                    ].map((c) => (
                      <button
                        key={c.chave}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios[c.chave] === "sim"
                            ? "bg-blue-600 text-white border-blue-500"
                            : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, c.chave, a.criterios[c.chave] === "sim" ? "" : "sim")}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-100">Detalhes adicionais</h3>
                  <div className="flex flex-wrap gap-2">
                    {["preservado", "ausente"].map((estado) => (
                      <button
                        key={estado}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.hilo_estado === estado
                            ? "bg-blue-600 text-white border-blue-500"
                            : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "hilo_estado", estado)}
                      >
                        hilo {estado}
                      </button>
                    ))}

                    <button
                      className={`px-3 py-1 rounded-md text-sm border ${
                        a.criterios.microcalc === "sim"
                          ? "bg-blue-600 text-white border-blue-500"
                          : "border-[#1f1f1f] text-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "microcalc", a.criterios.microcalc === "sim" ? "" : "sim")}
                    >
                      microcalcificações
                    </button>

                    <button
                      className={`px-3 py-1 rounded-md text-sm border ${
                        a.criterios.necrose === "sim"
                          ? "bg-blue-600 text-white border-blue-500"
                          : "border-[#1f1f1f] text-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "necrose", a.criterios.necrose === "sim" ? "" : "sim")}
                    >
                      necrose/cístico
                    </button>

                    {["regulares", "irregulares"].map((m) => (
                      <button
                        key={m}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.margens === m ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "margens", m)}
                      >
                        margens {m}
                      </button>
                    ))}

                    {["hilar", "periférica", "mista"].map((v) => (
                      <button
                        key={v}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.vasc_tipo === v ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "vasc_tipo", v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-100">Localização</h3>
                  <div className="flex flex-wrap gap-2">
                    {["I", "II", "III", "IV", "V", "VI"].map((n) => (
                      <button
                        key={n}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.nivel === n ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "nivel", n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className={`px-3 py-1 rounded-md text-sm border ${
                        a.criterios.local === "intraparotideo"
                          ? "bg-blue-600 text-white border-blue-500"
                          : "border-[#1f1f1f] text-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "local", "intraparotideo")}
                    >
                      intraparotídeo
                    </button>
                    {["direito", "esquerdo"].map((l) => (
                      <button
                        key={l}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.lado === l ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "lado", l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-100">Medidas (cm)</h3>
                  <div className="flex gap-2">
                    {a.medidas.slice(0, 3).map((m, i) => (
                      <input
                        key={i}
                        value={m}
                        placeholder={i === 0 ? "Compr." : i === 1 ? "Larg." : "Esp."}
                        onChange={(e) => atualizarMedida(idx, i, e.target.value)}
                        className="border border-[#1f1f1f] bg-[#0a0a0a] p-2 rounded w-24 text-sm text-gray-100"
                      />
                    ))}
                  </div>
                  {(() => {
                    const [longo, curto] = a.medidas.map(parseFloat)
                    if (!isNaN(longo) && !isNaN(curto) && curto !== 0) {
                      const ratio = (longo / curto).toFixed(2)
                      return <p className="text-xs text-gray-400 mt-1">Razão C/L: {ratio}</p>
                    }
                    return null
                  })()}
                </div>
              </>
            )}

            {a.tipo === "glandula" && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-100">Glândula</h3>
                  <div className="flex flex-wrap gap-2">
                    {["parótida", "submandibular"].map((g) => (
                      <button
                        key={g}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.glandula === g ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "glandula", g)}
                      >
                        {g}
                      </button>
                    ))}
                    {["direita", "esquerda"].map((l) => (
                      <button
                        key={l}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          a.criterios.lado === l ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
                        }`}
                        onClick={() => atualizar(idx, "lado", l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-100">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    <input
                      placeholder="Tipo (sólido/cístico)"
                      className="placeholder-gray-500 border border-[#1f1f1f] bg-[#0a0a0a] p-2 rounded w-44 text-sm text-gray-100"
                      value={a.criterios.tipo || ""}
                      onChange={(e) => atualizar(idx, "tipo", e.target.value)}
                    />
                    <input
                      placeholder="Ecogenicidade"
                      className="placeholder-gray-500 border border-[#1f1f1f] bg-[#0a0a0a] p-2 rounded w-44 text-sm text-gray-100"
                      value={a.criterios.eco || ""}
                      onChange={(e) => atualizar(idx, "eco", e.target.value)}
                    />
                    <input
                      placeholder="Margens"
                      className="placeholder-gray-500 border border-[#1f1f1f] bg-[#0a0a0a] p-2 rounded w-44 text-sm text-gray-100"
                      value={a.criterios.margens || ""}
                      onChange={(e) => atualizar(idx, "margens", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-100">Medidas (cm)</h3>
                  <div className="flex gap-2">
                    {a.medidas.map((m, i) => (
                      <input
                        key={i}
                        value={m}
                        placeholder={i === 0 ? "Compr." : i === 1 ? "Larg." : "Prof."}
                        onChange={(e) => atualizarMedida(idx, i, e.target.value)}
                        className="border border-[#1f1f1f] bg-[#0a0a0a] p-2 rounded w-24 text-sm text-gray-100"
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-100">Pré-laudo (editável)</h3>
              <textarea
                value={textoMostrado}
                onChange={(e) => atualizarTexto(idx, e.target.value)}
                className="border border-[#1f1f1f] bg-[#0a0a0a] p-3 rounded w-full h-28 text-sm text-gray-100"
              />
            </div>
          </div>
        )
      })}

      {achados.length > 0 && (
        <div className="border border-[#1f1f1f] p-4 rounded bg-[#0f0f0f] space-y-2">
          <h3 className="text-sm font-semibold text-gray-100">Copiar todas as frases</h3>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            onClick={copiarTudo}
          >
            Copiar todas
          </button>
        </div>
      )}
    </main>
  )
}
