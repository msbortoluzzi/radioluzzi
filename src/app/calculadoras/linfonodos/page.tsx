"use client";
import { useState } from "react";

export default function Page() {
  const [achados, setAchados] = useState<
    {
      tipo: "linfonodo" | "glandula" | "massa";
      criterios: Record<string, string>;
      medidas: string[];
      texto?: string;
    }[]
  >([]);

  function adicionar(tipo: "linfonodo" | "glandula" | "massa") {
    setAchados([
      ...achados,
      { tipo, criterios: {}, medidas: ["", "", ""], texto: "" },
    ]);
  }

  function atualizar(index: number, campo: string, valor: string) {
    const novos = [...achados];
    novos[index].criterios[campo] = valor;
    setAchados(novos);
  }

  function atualizarMedida(index: number, i: number, valor: string) {
    const novos = [...achados];
    novos[index].medidas[i] = valor;
    setAchados(novos);
  }

  function gerarTextoPadrao(a: typeof achados[0]) {
    if (a.tipo === "linfonodo") {
      const [longo, curto] = a.medidas.map(parseFloat);
      let clRatio = 0;
      if (!isNaN(longo) && !isNaN(curto) && curto !== 0) clRatio = longo / curto;

      const forma = clRatio >= 2 ? "alongado" : "oval";
      const hilo =
        a.criterios.hilo_estado === "preservado" ? "preservado" : "ausente";
      const microcalc =
        a.criterios.microcalc === "sim"
          ? "com microcalcificações"
          : "sem microcalcificações";
      const necrose =
        a.criterios.necrose === "sim" ? "com necrose ou aspecto cístico" : "";
      const margens =
        a.criterios.margens === "irregulares" ? "irregulares" : "regulares";
      const vasc = a.criterios.vasc_tipo || "hilar";

      const local = a.criterios.nivel
        ? `nível cervical ${a.criterios.nivel}${
            a.criterios.lado ? " " + a.criterios.lado : ""
          }`
        : "";

      const medidasTxt = a.medidas.filter((x) => x).join(" x ") + " cm";

      return `Linfonodo ${forma} com hilo ecogênico ${hilo}, hipoecogênico, ${microcalc}${
        necrose ? ", " + necrose : ""
      }, margens ${margens} e vascularização ${vasc} ao estudo Doppler localizado no ${local} medindo ${medidasTxt}.`;
    }

    if (a.tipo === "glandula") {
      const gland = a.criterios.glandula || "parótida";
      const lado = a.criterios.lado || "";
      const tipo = a.criterios.tipo || "sólida";
      const eco = a.criterios.eco || "";
      const margens = a.criterios.margens || "";
      const medidas = a.medidas.filter((x) => x);
      let medidasTxt = "";
      if (medidas.length === 3) {
        medidasTxt = `, medindo ${medidas.join(" x ")} cm`;
      }
      return `Lesão ${tipo} ${eco} na glândula ${gland} ${lado}, ${margens}${medidasTxt}.`;
    }

    return "";
  }

  function atualizarTexto(index: number, texto: string) {
    const novos = [...achados];
    novos[index].texto = texto;
    setAchados(novos);
  }

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 text-gray-100 text-gray-100">
        Achados ultrassom cervical
      </h1>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => adicionar("linfonodo")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar linfonodo
        </button>
        <button
          onClick={() => adicionar("glandula")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar glândula
        </button>
        <button
          onClick={() => adicionar("massa")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar massa
        </button>
      </div>

      {achados.map((a, idx) => {
        const textoGerado = gerarTextoPadrao(a);
        const textoMostrado =
          a.texto !== "" && a.texto !== undefined ? a.texto : textoGerado;

        return (
          <div key={idx} className="border border-[#222222] p-4 rounded space-y-4">
            {a.tipo === "linfonodo" && (
              <>
                <h3 className="font-semibold">Características</h3>
                {[
                  { chave: "forma", label: "arredondado" },
                  { chave: "cortical", label: "cortical espessada" },
                ].map((c) => (
                  <button
                    key={c.chave}
                    className={`border rounded px-3 py-1 ${
                      a.criterios[c.chave] === "sim"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      atualizar(
                        idx,
                        c.chave,
                        a.criterios[c.chave] === "sim" ? "" : "sim"
                      )
                    }
                  >
                    {c.label}
                  </button>
                ))}

                <h3 className="font-semibold">Detalhes adicionais</h3>
                <div className="flex flex-wrap gap-2">
                  {["preservado", "ausente"].map((estado) => (
                    <button
                      key={estado}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.hilo_estado === estado
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "hilo_estado", estado)}
                    >
                      hilo {estado}
                    </button>
                  ))}

                  <button
                    className={`border rounded px-3 py-1 ${
                      a.criterios.microcalc === "sim"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      atualizar(
                        idx,
                        "microcalc",
                        a.criterios.microcalc === "sim" ? "" : "sim"
                      )
                    }
                  >
                    microcalcificações
                  </button>

                  <button
                    className={`border rounded px-3 py-1 ${
                      a.criterios.necrose === "sim"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      atualizar(
                        idx,
                        "necrose",
                        a.criterios.necrose === "sim" ? "" : "sim"
                      )
                    }
                  >
                    necrose/cístico
                  </button>

                  {["regulares", "irregulares"].map((m) => (
                    <button
                      key={m}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.margens === m
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "margens", m)}
                    >
                      margens {m}
                    </button>
                  ))}

                  {["hilar", "periférica", "mista"].map((v) => (
                    <button
                      key={v}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.vasc_tipo === v
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "vasc_tipo", v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <h3 className="font-semibold">Localização</h3>
                <div className="flex flex-wrap gap-2">
                  {["I", "II", "III", "IV", "V", "VI"].map((n) => (
                    <button
                      key={n}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.nivel === n
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "nivel", n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className={`border rounded px-3 py-1 ${
                      a.criterios.local === "intraparotideo"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() =>
                      atualizar(idx, "local", "intraparotideo")
                    }
                  >
                    intraparotídeo
                  </button>
                </div>

                <div className="flex gap-2 mt-2">
                  {["direito", "esquerdo"].map((l) => (
                    <button
                      key={l}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.lado === l
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "lado", l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <h3 className="font-semibold">Medidas (cm)</h3>
                <div className="flex gap-2">
                  {a.medidas.slice(0, 3).map((m, i) => (
                    <input
                      key={i}
                      value={m}
                      onChange={(e) =>
                        atualizarMedida(idx, i, e.target.value)
                      }
                      className="border border-[#222222] p-2 rounded w-24"
                    />
                  ))}
                </div>

                {/* Mostrar razão C/L */}
                {(() => {
                  const [longo, curto] = a.medidas.map(parseFloat);
                  if (!isNaN(longo) && !isNaN(curto) && curto !== 0) {
                    const ratio = (longo / curto).toFixed(2);
                    return (
                      <p className="text-sm text-gray-400 mt-1">
                        Razão C/L: {ratio}
                      </p>
                    );
                  }
                  return null;
                })()}
              </>
            )}

            {a.tipo === "glandula" && (
              <>
                <h3 className="font-semibold">Glândula</h3>
                <div className="flex flex-wrap gap-2">
                  {["parótida", "submandibular"].map((g) => (
                    <button
                      key={g}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.glandula === g
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "glandula", g)}
                    >
                      {g}
                    </button>
                  ))}
                  {["direita", "esquerda"].map((l) => (
                    <button
                      key={l}
                      className={`border rounded px-3 py-1 ${
                        a.criterios.lado === l
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => atualizar(idx, "lado", l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <h3 className="font-semibold">Características</h3>
                <input
                  placeholder="Tipo (sólido/cístico)" className="placeholder-gray-500" className="placeholder-gray-500"
                  className="border border-[#222222] p-2 rounded w-40"
                  value={a.criterios.tipo || ""}
                  onChange={(e) => atualizar(idx, "tipo", e.target.value)}
                />
                <input
                  placeholder="Ecogenicidade" className="placeholder-gray-500" className="placeholder-gray-500"
                  className="border border-[#222222] p-2 rounded w-40"
                  value={a.criterios.eco || ""}
                  onChange={(e) => atualizar(idx, "eco", e.target.value)}
                />
                <input
                  placeholder="Margens" className="placeholder-gray-500" className="placeholder-gray-500"
                  className="border border-[#222222] p-2 rounded w-40"
                  value={a.criterios.margens || ""}
                  onChange={(e) =>
                    atualizar(idx, "margens", e.target.value)
                  }
                />
                <h3 className="font-semibold">Medidas (cm)</h3>
                <div className="flex gap-2">
                  {a.medidas.map((m, i) => (
                    <input
                      key={i}
                      value={m}
                      onChange={(e) =>
                        atualizarMedida(idx, i, e.target.value)
                      }
                      className="border border-[#222222] p-2 rounded w-24"
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pré-laudo editável */}
            <div>
              <h3 className="font-semibold mt-4">Pré-laudo (editável)</h3>
              <textarea
                value={textoMostrado}
                onChange={(e) => atualizarTexto(idx, e.target.value)}
                className="border border-[#222222] p-2 rounded w-full h-24"
              />
            </div>
          </div>
        );
      })}

      {achados.length > 0 && (
        <div className="border border-[#222222] p-4 rounded bg-[#111111]">
          <h3 className="font-semibold mb-2">Copiar todas as frases:</h3>
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() =>
              navigator.clipboard.writeText(
                achados
                  .map((a) =>
                    a.texto && a.texto.trim() !== ""
                      ? a.texto
                      : gerarTextoPadrao(a)
                  )
                  .join("\n")
              )
            }
          >
            Copiar todas
          </button>
        </div>
      )}
    </main>
  );
}
