"use client"

import { useMemo, useState } from "react"

const opcoes = {
  composicao: [
    { label: "Cística (0)", valor: 0, texto: "nódulo cístico" },
    { label: "Espongiforme (0)", valor: 0, texto: "nódulo espongiforme" },
    { label: "Misto (1)", valor: 1, texto: "nódulo misto sólido-cístico" },
    { label: "Sólido (2)", valor: 2, texto: "nódulo sólido" }
  ],
  ecogenicidade: [
    { label: "Anecoico (0)", valor: 0, texto: "anecoico" },
    { label: "Iso/Hiperecogênico (1)", valor: 1, texto: "isoecogênico ou hiperecogênico" },
    { label: "Hipoecogênico (2)", valor: 2, texto: "hipoecogênico" },
    { label: "Muito hipoecogênico (3)", valor: 3, texto: "muito hipoecogênico" }
  ],
  margens: [
    { label: "Lisas (0)", valor: 0, texto: "margens lisas" },
    { label: "Mal definidas (0)", valor: 0, texto: "margens mal definidas" },
    { label: "Lobuladas/Irregulares (2)", valor: 2, texto: "margens lobuladas/irregulares" },
    { label: "Extensão extratireoidiana (3)", valor: 3, texto: "extensão extratireoidiana" }
  ],
  forma: [
    { label: "Larga > Alta (0)", valor: 0, texto: "mais largo que alto" },
    { label: "Alta > Larga (3)", valor: 3, texto: "mais alto que largo" }
  ]
}

const focos = [
  { key: "comet", label: "Cauda de cometa (0)", valor: 0, texto: "cauda de cometa" },
  { key: "macro", label: "Macrocalc. (1)", valor: 1, texto: "macrocalcificações" },
  { key: "rim", label: "Periférica (2)", valor: 2, texto: "calcificação periférica" },
  { key: "micro", label: "Microcalc. (3)", valor: 3, texto: "microcalcificações" }
]

function categoriaPorPontos(pontos) {
  if (pontos === 0) return "TR1"
  if (pontos <= 2) return "TR2"
  if (pontos === 3) return "TR3"
  if (pontos <= 6) return "TR4"
  return "TR5"
}

function conduta(tr, tamanhoCm) {
  const s = Number((tamanhoCm || "").toString().replace(",", "."))
  const mapa = {
    TR1: { fna: Infinity, fu: Infinity, plano: "" },
    TR2: { fna: Infinity, fu: Infinity, plano: "" },
    TR3: { fna: 2.5, fu: 1.5, plano: "US em 1, 3 e 5 anos" },
    TR4: { fna: 1.5, fu: 1.0, plano: "US em 1, 2, 3 e 5 anos" },
    TR5: { fna: 1.0, fu: 0.5, plano: "US em 1, 2, 3 e 5 anos" }
  }
  const cfg = mapa[tr] || mapa.TR2
  if (!isFinite(cfg.fna)) return { tipo: "Sem seguimento rotineiro", detalhe: "Categoria de baixo risco." }
  if (isNaN(s)) return { tipo: "Informar tamanho", detalhe: "Informe o maior diâmetro para sugerir conduta." }
  if (s >= cfg.fna) return { tipo: "PAAF recomendada", detalhe: `Maior diâmetro ${s.toFixed(1)} cm (limiar ${cfg.fna} cm).` }
  if (s >= cfg.fu) return { tipo: "Seguimento por ultrassom", detalhe: `${cfg.plano} (tamanho ${s.toFixed(1)} cm).` }
  return { tipo: "Sem seguimento rotineiro", detalhe: "Abaixo dos limiares de seguimento." }
}

export default function TiradsPage() {
  const [selecoes, setSelecoes] = useState({
    composicao: null,
    ecogenicidade: null,
    margens: null,
    forma: null,
    focos: { comet: false, macro: false, rim: false, micro: false },
    tamanho: "",
    lobo: "",
    istmo: "",
    observacao: ""
  })

  const pontos = useMemo(() => {
    let soma = 0
    const { composicao, ecogenicidade, margens, forma, focos: f } = selecoes
    soma += composicao?.valor ?? 0
    soma += ecogenicidade?.valor ?? 0
    soma += margens?.valor ?? 0
    soma += forma?.valor ?? 0
    Object.keys(f).forEach((k) => {
      if (f[k]) soma += focos.find((foco) => foco.key === k)?.valor ?? 0
    })
    return soma
  }, [selecoes])

  const categoria = useMemo(() => categoriaPorPontos(pontos), [pontos])
  const condutaSug = useMemo(() => conduta(categoria, selecoes.tamanho), [categoria, selecoes.tamanho])

  const resumo = useMemo(() => {
    const descr = []
    if (selecoes.composicao) descr.push(selecoes.composicao.texto)
    if (selecoes.ecogenicidade) descr.push(selecoes.ecogenicidade.texto)
    if (selecoes.margens) descr.push(selecoes.margens.texto)
    if (selecoes.forma) descr.push(selecoes.forma.texto)
    const focosMarcados = focos.filter((f) => selecoes.focos[f.key])
    if (focosMarcados.length) descr.push(focosMarcados.map((f) => f.texto).join(", "))
    const loc = selecoes.lobo ? `no lobo ${selecoes.lobo}` : selecoes.istmo ? "no istmo" : ""
    const tam = selecoes.tamanho ? `, medindo ${selecoes.tamanho} cm` : ""
    const obs = selecoes.observacao ? ` ${selecoes.observacao}` : ""
    return `Nódulo ${descricaoVazia(descr)} ${loc}${tam}. ${obs}`.replace("  ", " ").trim()
  }, [selecoes])

  function descricaoVazia(descr) {
    const txt = descr.filter(Boolean).join(", ")
    return txt || "tireoidiano"
  }

  const copiar = () => {
    const texto = `${resumo} Categoria ${categoria} (total ${pontos} pontos). ${condutaSug.tipo}. ${condutaSug.detalhe}`
    void navigator.clipboard.writeText(texto)
  }

  const toggleFoco = (key) => {
    setSelecoes((prev) => ({
      ...prev,
      focos: { ...prev.focos, [key]: !prev.focos[key] }
    }))
  }

  const Card = ({ title, children }) => (
    <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2">
      <p className="text-sm font-semibold text-gray-100">{title}</p>
      {children}
    </div>
  )

  const Chip = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-md border ${
        active ? "bg-blue-600 text-white border-blue-500" : "border-[#1f1f1f] text-gray-100"
      }`}
    >
      {children}
    </button>
  )

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-100">TI-RADS</h1>
        <p className="text-sm text-gray-400">Some pontos, veja a categoria e conduta sugerida.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Composição">
          <div className="flex flex-wrap gap-2">
            {opcoes.composicao.map((o) => (
              <Chip key={o.label} active={selecoes.composicao?.label === o.label} onClick={() => setSelecoes((p) => ({ ...p, composicao: o }))}>
                {o.label}
              </Chip>
            ))}
          </div>
        </Card>

        <Card title="Ecogenicidade">
          <div className="flex flex-wrap gap-2">
            {opcoes.ecogenicidade.map((o) => (
              <Chip key={o.label} active={selecoes.ecogenicidade?.label === o.label} onClick={() => setSelecoes((p) => ({ ...p, ecogenicidade: o }))}>
                {o.label}
              </Chip>
            ))}
          </div>
        </Card>

        <Card title="Margens">
          <div className="flex flex-wrap gap-2">
            {opcoes.margens.map((o) => (
              <Chip key={o.label} active={selecoes.margens?.label === o.label} onClick={() => setSelecoes((p) => ({ ...p, margens: o }))}>
                {o.label}
              </Chip>
            ))}
          </div>
        </Card>

        <Card title="Forma">
          <div className="flex flex-wrap gap-2">
            {opcoes.forma.map((o) => (
              <Chip key={o.label} active={selecoes.forma?.label === o.label} onClick={() => setSelecoes((p) => ({ ...p, forma: o }))}>
                {o.label}
              </Chip>
            ))}
          </div>
        </Card>

        <Card title="Focos ecogênicos">
          <div className="flex flex-wrap gap-2">
            {focos.map((f) => (
              <Chip key={f.key} active={selecoes.focos[f.key]} onClick={() => toggleFoco(f.key)}>
                {f.label}
              </Chip>
            ))}
          </div>
        </Card>

        <Card title="Localização e tamanho">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <input
              placeholder="Lobo (D/E)"
              value={selecoes.lobo}
              onChange={(e) => setSelecoes((p) => ({ ...p, lobo: e.target.value }))}
              className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            <input
              placeholder="Istmo (sim/não)"
              value={selecoes.istmo}
              onChange={(e) => setSelecoes((p) => ({ ...p, istmo: e.target.value }))}
              className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
            <input
              placeholder="Tamanho (cm)"
              value={selecoes.tamanho}
              onChange={(e) => setSelecoes((p) => ({ ...p, tamanho: e.target.value }))}
              className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2"
            />
          </div>
          <input
            placeholder="Observação (opcional)"
            value={selecoes.observacao}
            onChange={(e) => setSelecoes((p) => ({ ...p, observacao: e.target.value }))}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-sm w-full"
          />
        </Card>
      </div>

      <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-100">
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Pontos: {pontos}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Categoria: {categoria}</span>
          <span className="px-3 py-1 rounded-md border border-[#1f1f1f]">Conduta: {condutaSug.tipo}</span>
        </div>
        <p className="text-xs text-gray-400">{condutaSug.detalhe}</p>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">Pré-laudo</p>
          <textarea
            value={`${resumo} Categoria ${categoria} (total ${pontos} pontos). ${condutaSug.tipo}. ${condutaSug.detalhe}`}
            onChange={() => {}}
            className="w-full min-h-[120px] rounded-md border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 px-3 py-2 text-sm"
            readOnly
          />
        </div>
        <div className="flex gap-2">
          <button onClick={copiar} className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
            Copiar
          </button>
          <button
            onClick={() =>
              setSelecoes({
                composicao: null,
                ecogenicidade: null,
                margens: null,
                forma: null,
                focos: { comet: false, macro: false, rim: false, micro: false },
                tamanho: "",
                lobo: "",
                istmo: "",
                observacao: ""
              })
            }
            className="px-4 py-2 rounded-md border border-[#1f1f1f] text-gray-100 text-sm"
          >
            Limpar
          </button>
        </div>
      </div>
    </main>
  )
}
