"use client";

import { useMemo, useState } from "react";

function fmt(n: number | string | undefined, digs = 1) {
  if (n === undefined || n === null || n === "") return "";
  const v = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(v)) return "";
  return v.toLocaleString("pt-BR", { maximumFractionDigits: digs });
}

export default function Page() {
  const [diametro, setDiametro] = useState<string>("");
  const [huSem, setHuSem] = useState<string>("");
  const [homogeneo, setHomogeneo] = useState<boolean>(true);
  const [huPico, setHuPico] = useState<string>("");
  const [huTardio, setHuTardio] = useState<string>("");

  const inicial = useMemo(() => {
    const s = Number(huSem);
    const okS = !Number.isNaN(s);
    let status: "incompleto" | "nao_precisa" | "recomendado" = "incompleto";
    let texto = "Informe HU sem contraste para orientação inicial.";

    if (okS) {
      if (s <= 10 && homogeneo) {
        status = "nao_precisa";
        texto =
          "≤ 10 UH no sem contraste e homogêneo → típico de adenoma rico em lipídios. Washout NÃO é necessário.";
      } else if (s > 10 && s < 20) {
        status = "recomendado";
        texto =
          "11–20 UH no sem contraste → indeterminado. Recomenda-se caracterização com CT washout (ou RM CSI).";
      } else if (s >= 20) {
        status = "recomendado";
        texto =
          "≥ 20 UH no sem contraste → provável não lipídico. Recomenda-se washout CT e/ou RM CSI.";
      }
    }

    const d = Number(diametro);
    const avisoTamanho =
      !Number.isNaN(d) && d >= 4
        ? "Observação: lesões ≥ 4 cm têm maior risco de malignidade/atividade — correlacionar com contexto clínico e diretrizes."
        : "";

    return { s, okS, status, texto, avisoTamanho };
  }, [huSem, homogeneo, diametro]);

  const washout = useMemo(() => {
    const e = Number(huPico);
    const d = Number(huTardio);
    const okE = !Number.isNaN(e);
    const okD = !Number.isNaN(d);
    let aw: number | null = null;
    let rw: number | null = null;

    if (okE && okD) {
      const s = Number(huSem);
      const okS = !Number.isNaN(s);
      if (okS && e !== s) aw = ((e - d) / (e - s)) * 100;
      if (e !== 0) rw = ((e - d) / e) * 100;
    }

    let interpretacao = "Preencha as fases contrastadas para calcular APW/RPW.";
    let fraseFinal = "";
    if ((aw !== null && Number.isFinite(aw)) || (rw !== null && Number.isFinite(rw))) {
      const awOk = aw !== null && aw >= 60;
      const rwOk = rw !== null && rw >= 40;
      if (awOk || rwOk) {
        interpretacao =
          "Washout elevado (APW ≥ 60% ou RPW ≥ 40%) — compatível com adenoma pobre em lipídios.";
        fraseFinal =
          "Lesão adrenal com características compatíveis com adenoma pobre em lipídios. Sugere-se seguimento apenas se indicado clinicamente.";
      } else {
        interpretacao =
          "Washout baixo — indeterminado. Considerar RM CSI, evolução e correlação clínica.";
        fraseFinal =
          "Lesão adrenal de comportamento indeterminado ao método. Recomenda-se investigação complementar (RM CSI) ou seguimento conforme diretrizes.";
      }
    } else if (inicial.status === "nao_precisa") {
      fraseFinal =
        "Lesão adrenal com HU ≤ 10 e aspecto homogêneo, compatível com adenoma rico em lipídios. Não há indicação de caracterização adicional.";
    } else if (inicial.status === "recomendado" && !okE && !okD) {
      fraseFinal =
        "Lesão adrenal necessitando de caracterização com CT washout ou RM CSI, conforme critérios de atenuação inicial.";
    }

    return { okE, okD, aw, rw, interpretacao, fraseFinal };
  }, [huPico, huTardio, huSem, inicial.status]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Calculadora de Adrenal</h1>
      <p className="text-sm text-gray-600">
      </p>

      {/* ETAPA 1 */}
      <div className="space-y-4 p-4 border rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold">1) Avaliação inicial</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Maior diâmetro (cm)</span>
            <input
              type="number"
              step="0.1"
              className="border rounded-lg p-2"
              value={diametro}
              onChange={(e) => setDiametro(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Sem contraste (UH)</span>
            <input
              type="number"
              step="1"
              className="border rounded-lg p-2"
              value={huSem}
              onChange={(e) => setHuSem(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={homogeneo}
              onChange={(e) => setHomogeneo(e.target.checked)}
            />
            <span className="text-sm">Aspecto homogêneo</span>
          </label>
        </div>
        <div
          className={`p-3 rounded-xl border ${
            inicial.status === "nao_precisa"
              ? "bg-green-50 border-green-200"
              : inicial.status === "recomendado"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-gray-50"
          }`}
        >
          <div className="text-sm text-gray-500">Resultado inicial</div>
          <div className="text-base font-medium">{inicial.texto}</div>
          {inicial.avisoTamanho && (
            <div className="text-xs text-gray-600 mt-1">{inicial.avisoTamanho}</div>
          )}
        </div>
      </div>

      {/* ETAPA 2 */}
      {inicial.status === "recomendado" && (
        <div className="space-y-4 p-4 border rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold">2) Washout (se indicado)</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Realce máximo (UH)</span>
              <input
                type="number"
                step="1"
                className="border rounded-lg p-2"
                value={huPico}
                onChange={(e) => setHuPico(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Tardio 10–15 min (UH)</span>
              <input
                type="number"
                step="1"
                className="border rounded-lg p-2"
                value={huTardio}
                onChange={(e) => setHuTardio(e.target.value)}
              />
            </label>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-4 border rounded-2xl bg-white">
              <div className="text-sm text-gray-500">APW</div>
              <div className="text-2xl font-semibold">
                {washout.aw !== null && Number.isFinite(washout.aw)
                  ? `${fmt(Math.max(0, washout.aw))}%`
                  : "–"}
              </div>
            </div>
            <div className="p-4 border rounded-2xl bg-white">
              <div className="text-sm text-gray-500">RPW</div>
              <div className="text-2xl font-semibold">
                {washout.rw !== null && Number.isFinite(washout.rw)
                  ? `${fmt(Math.max(0, washout.rw))}%`
                  : "–"}
              </div>
            </div>
            <div className="p-4 border rounded-2xl bg-blue-50 border-blue-200">
              <div className="text-sm text-gray-500">Interpretação</div>
              <div className="text-base font-medium">{washout.interpretacao}</div>
            </div>
          </div>
        </div>
      )}

      {washout.fraseFinal && (
        <div className="p-4 border rounded-2xl bg-gray-50">
          <div className="text-sm text-gray-500">Frase final sugerida para laudo</div>
          <div className="text-base font-medium">{washout.fraseFinal}</div>
        </div>
      )}

      {/* NOTAS */}
      <details className="p-4 border rounded-2xl bg-gray-50">
        <summary className="cursor-pointer font-medium">
          Notas rápidas (Radiopaedia/ACR)
        </summary>
        <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
          <li>
            <b>Inicial:</b> ≤10 UH + homogêneo → típico adenoma rico em lipídios → sem
            washout. 11–20 UH → indeterminado → fazer washout CT ou RM CSI. ≥20 UH →
            sugerir washout/CSI.
          </li>
          <li>
            <b>Fórmulas:</b> APW = (Pico − Tardio) / (Pico − Sem contraste) × 100; RPW =
            (Pico − Tardio) / Pico × 100.
          </li>
          <li>
            <b>Cortes:</b> APW ≥ 60% ou RPW ≥ 40% favorece adenoma pobre em lipídios.
          </li>
          <li>
            <b>Tamanho:</b> ≥4 cm → maior atenção e discussão multidisciplinar; considerar
            diretrizes locais.
          </li>
        </ul>
      </details>
    </div>
  );
}
