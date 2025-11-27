// src/app/calculadoras/tirads/page.jsx
"use client";
import { useEffect, useState } from "react";

const opcoes = {
  composição: [
    { label: "Cística (0)", valor: 0, texto: "nódulo cístico" },
    { label: "Espongiforme (0)", valor: 0, texto: "nódulo espongiforme" },
    { label: "Misto (1)", valor: 1, texto: "nódulo misto sólido-cístico" },
    { label: "Sólido (2)", valor: 2, texto: "nódulo sólido" },
  ],
  ecogenicidade: [
    { label: "Anecoico (0)", valor: 0, texto: "anecoico" },
    { label: "Iso/Hiperecogênico (1)", valor: 1, texto: "isoecogênico ou hiperecogênico" },
    { label: "Hipoecogênico (2)", valor: 2, texto: "hipoecogênico" },
    { label: "Muito hipoecogênico (3)", valor: 3, texto: "muito hipoecogênico" },
  ],
  margens: [
    { label: "Lisas (0)", valor: 0, texto: "com margens lisas" },
    { label: "Mal definidas (0)", valor: 0, texto: "com margens mal definidas" },
    { label: "Lobuladas/Irregulares (2)", valor: 2, texto: "com margens lobuladas/irregulares" },
    { label: "Extensão extratireoidiana (3)", valor: 3, texto: "com extensão extratireoidiana" },
  ],
  forma: [
    { label: "Larga > Alta (0)", valor: 0, texto: "mais largo que alto" },
    { label: "Alta > Larga (3)", valor: 3, texto: "mais alto que largo" },
  ],
};

const FOCOS = [
  { key: "comet", label: "Cauda de cometa (0)", valor: 0, texto: "cauda de cometa" },
  { key: "macro", label: "Macrocalc. (1)",       valor: 1, texto: "macrocalcificações" },
  { key: "rim",   label: "Periférica (2)",       valor: 2, texto: "calcificação periférica" },
  { key: "micro", label: "Microcalc. (3)",       valor: 3, texto: "microcalcificações" },
];

function getCategoria(pontos) {
  if (pontos === 0) return "TR1";
  if (pontos <= 2) return "TR2";          // 1–2
  if (pontos === 3) return "TR3";
  if (pontos <= 6) return "TR4";          // 4–6
  return "TR5";                            // ≥7
}

function condutaPorTR(tr, tamanhoCm) {
  const s = Number((tamanhoCm || "").toString().replace(",", "."));
  const TH = {
    TR1: { fna: Infinity, fu: Infinity, fuPlan: "" },
    TR2: { fna: Infinity, fu: Infinity, fuPlan: "" },
    TR3: { fna: 2.5, fu: 1.5, fuPlan: "US em 1, 3 e 5 anos" },
    TR4: { fna: 1.5, fu: 1.0, fuPlan: "US em 1, 2, 3 e 5 anos" },
    TR5: { fna: 1.0, fu: 0.5, fuPlan: "US em 1, 2, 3 e 5 anos" },
  };
  const cfg = TH[tr] || TH.TR2;

  if (s >= cfg.fna) return { tipo: "PAAF recomendada", detalhe: `Tamanho ${s.toFixed(1)} cm ≥ limiar PAAF (${cfg.fna} cm).` };
  if (s >= cfg.fu) {
    if (!isFinite(cfg.fu)) return { tipo: "Sem seguimento rotineiro", detalhe: "Categoria de baixo risco." };
    return { tipo: "Seguimento por ultrassom", detalhe: `${cfg.fuPlan} (tamanho ${s.toFixed(1)} cm).` };
  }
  return { tipo: "Sem seguimento rotineiro", detalhe: `Abaixo do limiar de seguimento (${isFinite(cfg.fu) ? `${cfg.fu} cm` : "—"}).` };
}

function maiorMedidaCm(medidas = []) {
  const nums = medidas
    .map((m) => parseFloat((m || "").toString().replace(",", ".")))
    .filter((v) => !Number.isNaN(v));
  if (nums.length === 0) return undefined;
  return Math.max(...nums);
}

function defaultNodulo() {
  return {
    criterios: { composição: 1, ecogenicidade: 1, forma: 0, margens: 0, focos: 0 },
    frases: {
      composição: "nódulo misto sólido-cístico",
      ecogenicidade: "isoecogênico ou hiperecogênico",
      forma: "mais largo que alto",
      margens: "com margens lisas",
      focos: "sem microcalcificações",
    },
    medidas: ["", "", ""], // cm
    lado: "",
    terco: "",
    istmo: false,
    focosSel: { micro: false },
  };
}

export default function Page() {
  const [nodulos, setNodulos] = useState([]);

  // cria N1 automaticamente com os padrões
  useEffect(() => {
    if (nodulos.length === 0) setNodulos([defaultNodulo()]);
  }, []); // eslint-disable-line

  function adicionar() {
    setNodulos((prev) => [...prev, defaultNodulo()]);
  }
  function atualizar(index, campo, valor) {
    setNodulos((prev) => {
      const novos = [...prev];
      novos[index][campo] = valor;
      return novos;
    });
  }
  function selecionar(index, criterio, valor, texto) {
    setNodulos((prev) => {
      const novos = [...prev];
      novos[index].criterios[criterio] = valor;
      novos[index].frases[criterio] = texto;
      return novos;
    });
  }

  function toggleFoco(index, foco) {
    setNodulos((prev) => {
      const novos = [...prev];
      const marcado = !!novos[index].focosSel[foco.key];
      novos[index].focosSel[foco.key] = !marcado;

      const ativos = FOCOS.filter((f) => novos[index].focosSel[f.key] && f.valor > 0);
      const soma = ativos.reduce((acc, f) => acc + f.valor, 0);
      novos[index].criterios["focos"] = soma;

      const nomes = FOCOS.filter((f) => novos[index].focosSel[f.key] && f.valor > 0).map((f) => f.texto);
      const temMicro = !!novos[index].focosSel["micro"];
      if (nomes.length && !temMicro) novos[index].frases["focos"] = `com focos ecogênicos: ${nomes.join(", ")}, sem microcalcificações`;
      else if (nomes.length)       novos[index].frases["focos"] = `com focos ecogênicos: ${nomes.join(", ")}`;
      else                         novos[index].frases["focos"] = "sem microcalcificações";
      return novos;
    });
  }

  function semMicro(index) {
    setNodulos((prev) => {
      const novos = [...prev];
      novos[index].focosSel["micro"] = false;

      const ativos = FOCOS.filter((f) => novos[index].focosSel[f.key] && f.valor > 0);
      const soma = ativos.reduce((acc, f) => acc + f.valor, 0);
      novos[index].criterios["focos"] = soma;

      const nomes = FOCOS.filter((f) => novos[index].focosSel[f.key] && f.valor > 0).map((f) => f.texto);
      novos[index].frases["focos"] = nomes.length
        ? `com focos ecogênicos: ${nomes.join(", ")}, sem microcalcificações`
        : "sem microcalcificações";
      return novos;
    });
  }

  function gerarFrase(n, i) {
    const valores = Object.values(n.criterios);
    const total = valores.length ? valores.reduce((acc, v) => acc + (Number(v) || 0), 0) : 0;
    const categoria = getCategoria(total);

    let medidas = "";
    const preenchidas = n.medidas.filter((m) => (m || "").trim() !== "");
    if (preenchidas.length > 0) medidas = preenchidas.join(" x ") + " cm";

    const partes = [];
    if (n.frases.composição)   partes.push(n.frases.composição);
    if (n.frases.ecogenicidade)partes.push(n.frases.ecogenicidade);
    if (n.frases.forma)        partes.push(n.frases.forma);
    if (n.frases.margens)      partes.push(n.frases.margens);
    if (n.frases.focos)        partes.push(n.frases.focos);

    let loc = "";
    if (n.istmo) loc = `<strong>ISTMO</strong> da tireoide`;
    else if (n.lado && n.terco)
      loc = `terço <strong>${n.terco.toUpperCase()}</strong> do lobo tireoidiano <strong>${n.lado.toUpperCase()}</strong>`;

    let frase = `<strong>N${i + 1}</strong>: ${partes.join(", ")}`;
    if (loc) frase += `, localizado no ${loc}`;
    if (medidas) frase += ` medindo ${medidas}`;
    if (valores.length > 0) {
      const num = categoria.replace("TR", "");
      frase += ` (<strong>ACR TI-RADS ${num}</strong>)`;
    }
    return frase + ".";
  }

  function condutaTexto(n, i) {
    const valores = Object.values(n.criterios);
    const total = valores.length ? valores.reduce((acc, v) => acc + (Number(v) || 0), 0) : 0;
    const tr = getCategoria(total);
    const sizeMaior = maiorMedidaCm(n.medidas);
    const c = condutaPorTR(tr, sizeMaior);
    const sizeStr = sizeMaior != null ? `${sizeMaior.toFixed(1)} cm` : "—";
    return `N${i + 1}: ${tr} | Maior diâmetro: ${sizeStr} | ${c.tipo}. ${c.detalhe}`;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-blue-800 text-gray-100 text-gray-100">TI-RADS (ACR)</h1>

      <button
        onClick={adicionar}
        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm"
      >
        Adicionar nódulo
      </button>

      {nodulos.map((n, idx) => (
        <div key={idx} className="border border-[#222222] p-4 rounded space-y-4">
          {/* 1) Medidas */}
          <div>
            <h3 className="font-semibold">Medidas (cm)</h3>
            <div className="flex gap-2">
              {n.medidas.map((m, i) => (
                <input
                  key={i}
                  value={m}
                  onChange={(e) => {
                    const novas = [...n.medidas];
                    novas[i] = e.target.value;
                    atualizar(idx, "medidas", novas);
                  }}
                  className="border border-[#222222] p-1.5 rounded w-20 text-sm"
                  placeholder={i === 0 ? "Maior" : i === 1 ? "2º" : "3º"}
                />
              ))}
            </div>
          </div>

          {/* 2) Localização */}
          <div>
            <h3 className="font-semibold">Localização</h3>
            <div className="flex flex-wrap gap-1">
              <button
                className={`border rounded px-2 py-1 text-xs ${n.istmo ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                onClick={() => {
                  atualizar(idx, "istmo", true);
                  atualizar(idx, "terco", "");
                  atualizar(idx, "lado", "");
                }}
              >
                ISTMO
              </button>
              {!n.istmo && (
                <>
                  {["SUPERIOR", "MÉDIO", "INFERIOR"].map((t) => (
                    <button
                      key={t}
                      className={`border rounded px-2 py-1 text-xs ${n.terco === t ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        atualizar(idx, "terco", t);
                        atualizar(idx, "istmo", false);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                  {["DIREITO", "ESQUERDO"].map((l) => (
                    <button
                      key={l}
                      className={`border rounded px-2 py-1 text-xs ${n.lado === l ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                      onClick={() => {
                        atualizar(idx, "lado", l);
                        atualizar(idx, "istmo", false);
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* 3) Características do nódulo */}
          {Object.entries(opcoes).map(([criterio, lista]) => (
            <div key={criterio}>
              <h3 className="font-semibold capitalize">{criterio}</h3>
              <div className="flex flex-wrap gap-1">
                {lista.map((opcao, i) => (
                  <button
                    key={i}
                    className={`px-2 py-1 text-xs border rounded ${
                      n.frases[criterio] === opcao.texto
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => selecionar(idx, criterio, opcao.valor, opcao.texto)}
                    title={opcao.label}
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 4) Focos ecogênicos (múltiplos) */}
          <div>
            <h3 className="font-semibold">Focos ecogênicos</h3>
            <div className="flex flex-wrap gap-1">
              {FOCOS.map((f) => {
                const ativo = !!n.focosSel[f.key];
                return (
                  <button
                    key={f.key}
                    className={`px-2 py-1 text-xs border rounded ${ativo ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    onClick={() => toggleFoco(idx, f)}
                    title={f.label}
                  >
                    {f.label}
                  </button>
                );
              })}
              <button
                className="px-2 py-1 text-xs border border-[#222222] rounded bg-[#222222]"
                onClick={() => semMicro(idx)}
                title="Desmarcar microcalcificações"
              >
                Sem microcalcificações
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              • Pontos dos focos são <strong>aditivos</strong> (macro +1, periférico +2, micro +3; “cauda de cometa” = 0).<br />
              • Nos demais critérios, selecione <strong>apenas uma</strong> opção.
            </p>
          </div>
        </div>
      ))}

      {/* Frases para laudo */}
      {nodulos.length > 0 && (
        <div className="border border-[#222222] p-4 rounded bg-[#111111] space-y-2">
          <h3 className="font-semibold">Frases para laudo:</h3>
          {nodulos.map((n, i) => (
            <p
              key={i}
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: gerarFrase(n, i) }}
            />
          ))}
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                nodulos.map((n, i) => gerarFrase(n, i)).join("\n").replace(/<[^>]+>/g, "")
              )
            }
            className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Copiar todas
          </button>
        </div>
      )}

      {/* Condutas — quadro separado */}
      {nodulos.length > 0 && (
        <div className="border border-[#222222] p-4 rounded bg-[#111111] space-y-2">
          <h3 className="font-semibold">Condutas sugeridas (ACR TI-RADS):</h3>
          {nodulos.map((n, i) => (
            <p key={i} className="text-sm">
              {condutaTexto(n, i)}
            </p>
          ))}
          <button
            onClick={() => navigator.clipboard.writeText(nodulos.map((n, i) => condutaTexto(n, i)).join("\n"))}
            className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Copiar condutas
          </button>
          <p className="text-[11px] text-gray-400">
            * Ajuste conforme contexto clínico (idade, fatores de risco, sintomas compressivos, gestação, etc.).
          </p>
        </div>
      )}
    </main>
  );
}
