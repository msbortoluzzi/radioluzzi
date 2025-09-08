"use client";

import React, { useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type BiradsCat = "0" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "";

type Achado = {
  tipo: "nódulo" | "cisto";
  mama: string;
  hora: string;            // "4" -> "4h"
  medidas: string[];       // até 3 medidas (cm)
  distPele: string;        // cm
  distPapila: string;      // cm
  forma: string;           // oval/redonda/irregular
  orientacao: string;      // paralela/não paralela
  margens: string[];       // circunscritas/indistintas/angular/microlobuladas/espiculadas ou regulares (cisto)
  ecogenicidade: string;   // hipoecoico/isoecoico/hiperecoico/heterogêneo/complexo/anecoico/...
  acustica: string;        // sem alterações/reforço/atenuação/misto
  calcificacoes: string;   // sem calcificações/micro/macro/ductais/estroma
  observacao: string;      // "estável" | "novo" | ""
  birads: BiradsCat;
  associados: { lnSus: boolean; distorcao: boolean; espDuctal: boolean };
  axila: { cortical: boolean; hilo: boolean; arredondado: boolean };
  correlacaoMammo: string;
};

/* ---------------- Defaults ---------------- */
const defaultFibroadenoma = (): Achado => ({
  tipo: "nódulo",
  mama: "",
  hora: "",
  medidas: ["", "", ""],
  distPele: "",
  distPapila: "",
  forma: "oval",
  orientacao: "paralela",
  margens: ["circunscritas"],
  ecogenicidade: "isoecoico",
  acustica: "sem alterações acústicas posteriores",
  calcificacoes: "sem calcificações",
  observacao: "",
  birads: "",
  associados: { lnSus: false, distorcao: false, espDuctal: false },
  axila: { cortical: false, hilo: false, arredondado: false },
  correlacaoMammo: "",
});

/* ---------------- UI: Chip ---------------- */
interface ChipProps {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}
const Chip: React.FC<ChipProps> = ({ active, onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-2 py-1 text-xs border rounded ${
      active ? "bg-blue-500 text-white" : "bg-gray-100"
    }`}
  >
    {children}
  </button>
);

/* ---------------- Heurística p/ sugestão ---------------- */
function sugerirBirads(a: Achado): BiradsCat {
  const isCyst = a.tipo === "cisto";
  const margens = new Set(a.margens || []);
  const eco = (a.ecogenicidade || "").toLowerCase();
  const calc = (a.calcificacoes || "").toLowerCase();
  const forma = (a.forma || "").toLowerCase();
  const orient = (a.orientacao || "").toLowerCase();
  const acust = (a.acustica || "").toLowerCase();
  const { lnSus, distorcao, espDuctal } = a.associados || {};
  const lnFlags = a.axila || {};
  const corr = (a.correlacaoMammo || "").toLowerCase();

  // Cisto simples clássico → 2
  const cistoSimples =
    isCyst &&
    eco.includes("aneco") &&
    (margens.has("regulares") || margens.has("circunscritas")) &&
    (acust.includes("reforço") || acust.includes("sem alterações") || acust === "");
  if (cistoSimples) return "2";

  // Cisto complicado → 2 se estável, senão 3
  if (isCyst && (eco.includes("espesso") || eco.includes("complicado"))) {
    return a.observacao === "estável" ? "2" : "3";
  }
  // Complexo cístico-sólido → >=4A
  if (isCyst && (eco.includes("complexo") || eco.includes("cístico-sólido"))) {
    return "4A";
  }

  // Massa sólida: somatório de sinais suspeitos
  let sus = 0;
  if (forma === "irregular") sus += 1;
  if (orient === "não paralela") sus += 1;
  if (margens.has("indistintas")) sus += 1;
  if (margens.has("angular")) sus += 1;
  if (margens.has("microlobuladas")) sus += 1;
  if (margens.has("espiculadas")) sus += 2; // mais peso
  if (eco === "hipoecoico" || eco === "heterogêneo" || eco === "complexo") sus += 1;
  if (acust.includes("atenuação") || acust.includes("sombra") || acust.includes("misto")) sus += 1;
  if (calc.includes("micro")) sus += 1;

  // Achados associados / axila
  if (lnSus) sus += 2;
  if (distorcao) sus += 2;
  if (espDuctal) sus += 1;
  if (lnFlags.cortical) sus += 1;
  if (lnFlags.hilo) sus += 1;
  if (lnFlags.arredondado) sus += 1;

  // Correlação mammo
  if (corr.includes("calcificações suspeitas") || corr.includes("segmentar") || corr.includes("pleomórficas")) sus += 1;

  if (margens.has("espiculadas") && (orient === "não paralela" || forma === "irregular")) return "5";
  if (sus >= 4) return "4C";
  if (sus === 3) return "4B";
  if (sus === 2) return "4A";

  const benignoProv =
    (forma === "oval" || forma === "redonda") &&
    margens.has("circunscritas") &&
    (orient === "paralela" || orient === "") &&
    (a.ecogenicidade === "isoecoico" || a.ecogenicidade === "hiperecoico") &&
    !calc.includes("micro") &&
    sus === 0;

  if (benignoProv) return "3";
  return "3"; // fallback conservador
}

/* ---------------- Condutas ---------------- */
function condutaPorBirads(cat: BiradsCat): string {
  switch (cat) {
    case "0":
      return "Incompleto — correlacionar com mamografia/US adicional/RM.";
    case "2":
      return "Benigno — rastreamento de rotina conforme idade/risco.";
    case "3":
      return "Provavelmente benigno — seguimento US ~6, 12 e 24 meses (ajuste local).";
    case "4A":
      return "Suspeito baixo — recomendar biópsia por agulha.";
    case "4B":
      return "Suspeito intermediário — biópsia.";
    case "4C":
      return "Suspeito alto — biópsia.";
    case "5":
      return "Altamente sugestivo de malignidade — biópsia e encaminhamento.";
    default:
      return "Selecionar categoria BI-RADS.";
  }
}

/* ---------------- Utils ---------------- */
function medidasStr(meds: string[] = []): string {
  const xs = meds.filter((m) => (m || "").trim() !== "");
  return xs.length ? `${xs.join(" x ")} cm` : "";
}

function copyFormattedOrPlain(html: string, plainFallback: string) {
  // tenta html; se falhar, copia texto puro
  const supportsClipboardItem = typeof window !== "undefined" && "ClipboardItem" in window;
  if (supportsClipboardItem) {
    try {
      const blob = new Blob([html], { type: "text/html" });
      const item = new ClipboardItem({ "text/html": blob });
      // @ts-ignore
      return navigator.clipboard.write([item]);
    } catch {
      return navigator.clipboard.writeText(plainFallback);
    }
  }
  return navigator.clipboard.writeText(plainFallback);
}

/* ---------------- Page ---------------- */
export default function BiradsUsPage() {
  const [achados, setAchados] = useState<Achado[]>([defaultFibroadenoma()]);

  /* Mutators */
  const upd = (idx: number, patch: Partial<Achado>) => {
    setAchados((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  };
  const toggleArray = (idx: number, key: keyof Pick<Achado, "margens">, value: string) => {
    setAchados((prev) =>
      prev.map((a, i) =>
        i === idx
          ? {
              ...a,
              [key]: (a[key] as string[]).includes(value)
                ? (a[key] as string[]).filter((m) => m !== value)
                : [...(a[key] as string[]), value],
            }
          : a
      )
    );
  };

  /* Template: Cisto simples (one-click) */
  const tplCistoSimples = (idx: number) => {
    upd(idx, {
      tipo: "cisto",
      ecogenicidade: "anecoico",
      margens: ["regulares"],
      acustica: "reforço posterior",
      calcificacoes: "sem calcificações",
      birads: "2",
      forma: "",
      orientacao: "",
      observacao: "",
    });
  };

  /* Frase principal do achado */
  function fraseAchado(a: Achado): string {
    const partes: string[] = [];

    if (a.tipo === "cisto") {
      const margem = a.margens.length ? a.margens.join(", ") : "regulares";
      const conteudo = a.ecogenicidade || "anecoico";
      partes.push(`Cisto de margens ${margem}, conteúdo ${conteudo}${a.acustica ? `, ${a.acustica}` : ""}`);
    } else {
      const inicio = `Nódulo ${a.forma || ""}`.trim();
      if (inicio) partes.push(inicio);
      if (a.ecogenicidade) partes.push(a.ecogenicidade);
      if (a.margens.length) partes.push(`margens ${a.margens.join(", ")}`);
      if (a.orientacao) partes.push(`orientação ${a.orientacao}`);
      if (a.calcificacoes) partes.push(a.calcificacoes);
      if (a.acustica) partes.push(a.acustica);
    }

    // Localização
    const loc: string[] = [];
    if (a.mama) loc.push(`na mama ${a.mama}`);
    if (a.hora) loc.push(`às ${a.hora}h`);
    if (loc.length) partes.push(`localizado ${loc.join(" ")}`);

    // Medidas + (observação) logo após as medidas
    const mStr = medidasStr(a.medidas);
    if (mStr) {
      partes.push(`medindo ${mStr}${a.observacao ? ` (${a.observacao})` : ""}`);
    }

    // Distâncias após medidas
    if (a.distPele) partes.push(`distando ${a.distPele} cm da pele`);
    if (a.distPapila) partes.push(`e ${a.distPapila} cm da papila`);

    // Se não houve medidas mas há observação, coloca no fim
    if (!mStr && a.observacao) partes.push(`(${a.observacao})`);

    // Categoria (se atribuída)
    if (a.birads) partes.push(`BI-RADS ${a.birads}`);

    return partes.join(", ") + ".";
  }

  /* Frases extras: associados / axila / correlação mammo */
  function frasesExtras(a: Achado): string[] {
    const extras: string[] = [];

    // Achados associados (exceto lnSus — esse compõe a frase da axila)
    if (a.associados.distorcao) extras.push("Presença de distorção arquitetural.");
    if (a.associados.espDuctal) extras.push("Presença de espessamento ductal.");

    // Axila (inclui o flag de suspeito + descritores)
    const ax: string[] = [];
    if (a.axila.cortical) ax.push("cortical espessada");
    if (a.axila.hilo) ax.push("hilo apagado");
    if (a.axila.arredondado) ax.push("forma arredondada");

    if (a.associados.lnSus || ax.length) {
      const suspeito = a.associados.lnSus ? " suspeito" : "";
      const descr = ax.length ? ` com ${ax.join(", ")}` : "";
      extras.push(`Na axila, linfonodo${suspeito}${descr}.`);
    }

    // Correlação mamográfica
    if ((a.correlacaoMammo || "").trim()) {
      extras.push(`Exame correlacionado com mamografia realizada no mesmo dia, que mostrou ${a.correlacaoMammo.trim()}.`);
    }

    return extras;
  }

  function blocoAchadoCompleto(a: Achado): string {
    const base = fraseAchado(a);
    const extra = frasesExtras(a);
    return [base, ...extra].join("\n");
  }

  const textoPreview = useMemo(() => achados.map(blocoAchadoCompleto).join("\n\n"), [achados]);

  const condutasTexto = useMemo(
    () =>
      achados
        .map((a, i) => {
          const cat = a.birads || sugerirBirads(a);
          return `Achado ${i + 1}: BI-RADS ${cat} — ${condutaPorBirads(cat)}`;
        })
        .join("\n"),
    [achados]
  );

  /* -------- Render -------- */
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">BI-RADS (Ultrassom)</h1>

      {achados.map((a, idx) => (
        <div key={idx} className="border rounded p-4 mb-6 bg-gray-50 space-y-3">
          {/* Linha 1 — ação rápida (apenas cisto simples) */}
          <div className="flex flex-wrap gap-1">
            <Chip active={false} onClick={() => tplCistoSimples(idx)} title="Marca cisto simples clássico">
              Cisto simples (one-click)
            </Chip>
          </div>

          {/* Linha 2 — Mama / Relógio / Medidas em UMA linha + distâncias */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-gray-600">Mama:</span>
            {["direita", "esquerda"].map((op) => (
              <Chip key={op} active={a.mama === op} onClick={() => upd(idx, { mama: a.mama === op ? "" : op })}>
                {op}
              </Chip>
            ))}

            <span className="ml-3 text-[11px] text-gray-600">Relógio:</span>
            <input
              className="border p-1.5 rounded w-20 text-xs"
              placeholder="ex.: 4"
              value={a.hora}
              onChange={(e) => upd(idx, { hora: e.target.value })}
            />

            <div className="flex flex-wrap items-center gap-2 ml-3">
              {["1ª", "2ª", "3ª"].map((lab, iM) => (
                <input
                  key={lab}
                  className="border p-1.5 rounded w-28 text-xs"
                  placeholder={`${lab} medida (cm)`}
                  value={a.medidas[iM] || ""}
                  onChange={(e) => {
                    const novas = [...a.medidas];
                    novas[iM] = e.target.value;
                    upd(idx, { medidas: novas });
                  }}
                />
              ))}
              <input
                className="border p-1.5 rounded w-28 text-xs"
                placeholder="Dist. pele (cm)"
                value={a.distPele}
                onChange={(e) => upd(idx, { distPele: e.target.value })}
              />
              <input
                className="border p-1.5 rounded w-28 text-xs"
                placeholder="Dist. papila (cm)"
                value={a.distPapila}
                onChange={(e) => upd(idx, { distPapila: e.target.value })}
              />
            </div>
          </div>

          {/* Tipo do achado */}
          <div className="flex flex-wrap gap-1">
            <span className="text-[11px] text-gray-600">Tipo:</span>
            {["nódulo", "cisto"].map((t) => (
              <Chip key={t} active={a.tipo === t} onClick={() => upd(idx, { tipo: t as Achado["tipo"] })}>
                {t}
              </Chip>
            ))}
          </div>

          {/* NÓDULO — descritores (pré-selecionados benignos) */}
          {a.tipo === "nódulo" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-semibold">Forma</div>
                  <div className="flex flex-wrap gap-1">
                    {["oval", "redonda", "irregular"].map((op) => (
                      <Chip key={op} active={a.forma === op} onClick={() => upd(idx, { forma: op })}>
                        {op}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold">Orientação</div>
                  <div className="flex flex-wrap gap-1">
                    {["paralela", "não paralela"].map((op) => (
                      <Chip key={op} active={a.orientacao === op} onClick={() => upd(idx, { orientacao: op })}>
                        {op}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold">Ecogenicidade</div>
                  <div className="flex flex-wrap gap-1">
                    {["hipoecoico", "isoecoico", "hiperecoico", "heterogêneo", "complexo"].map((op) => (
                      <Chip key={op} active={a.ecogenicidade === op} onClick={() => upd(idx, { ecogenicidade: op })}>
                        {op}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs font-semibold">Margens</div>
                  <div className="flex flex-wrap gap-1">
                    {["circunscritas", "indistintas", "angular", "microlobuladas", "espiculadas"].map((m) => (
                      <Chip key={m} active={a.margens.includes(m)} onClick={() => toggleArray(idx, "margens", m)}>
                        {m}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold">Acústica posterior</div>
                  <div className="flex flex-wrap gap-1">
                    {["sem alterações acústicas posteriores", "reforço posterior", "atenuação posterior", "misto"].map(
                      (op) => (
                        <Chip key={op} active={a.acustica === op} onClick={() => upd(idx, { acustica: op })}>
                          {op}
                        </Chip>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold">Calcificações</div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "sem calcificações",
                      "microcalcificações",
                      "macrocalcificações",
                      "calcificações ductais",
                      "calcificações no estroma",
                    ].map((op) => (
                      <Chip key={op} active={a.calcificacoes === op} onClick={() => upd(idx, { calcificacoes: op })}>
                        {op}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CISTO */}
          {a.tipo === "cisto" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold">Conteúdo</div>
                <div className="flex flex-wrap gap-1">
                  {["anecoico", "conteúdo espesso (complicado)", "complexo cístico-sólido"].map((op) => (
                    <Chip key={op} active={a.ecogenicidade === op} onClick={() => upd(idx, { ecogenicidade: op })}>
                      {op}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold">Margens do cisto</div>
                <div className="flex flex-wrap gap-1">
                  {["regulares", "irregulares"].map((m) => (
                    <Chip key={m} active={a.margens.includes(m)} onClick={() => toggleArray(idx, "margens", m)}>
                      {m}
                    </Chip>
                  ))}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-semibold">Acústica posterior</div>
                  <div className="flex flex-wrap gap-1">
                    {["reforço posterior", "sem alterações acústicas posteriores"].map((op) => (
                      <Chip key={op} active={a.acustica === op} onClick={() => upd(idx, { acustica: op })}>
                        {op}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achados associados / Axila / Correlação mammo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="text-xs font-semibold">Achados associados</div>
              <div className="flex flex-wrap gap-1">
                <Chip
                  active={a.associados.distorcao}
                  onClick={() => upd(idx, { associados: { ...a.associados, distorcao: !a.associados.distorcao } })}
                >
                  Distorção arquitetural
                </Chip>
                <Chip
                  active={a.associados.espDuctal}
                  onClick={() => upd(idx, { associados: { ...a.associados, espDuctal: !a.associados.espDuctal } })}
                >
                  Espessamento ductal
                </Chip>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold">Axila (linfonodo)</div>
              <div className="flex flex-wrap gap-1">
                <Chip
                  active={a.associados.lnSus}
                  onClick={() => upd(idx, { associados: { ...a.associados, lnSus: !a.associados.lnSus } })}
                >
                  Marcar como suspeito
                </Chip>
                <Chip active={a.axila.cortical} onClick={() => upd(idx, { axila: { ...a.axila, cortical: !a.axila.cortical } })}>
                  Cortical espessada
                </Chip>
                <Chip active={a.axila.hilo} onClick={() => upd(idx, { axila: { ...a.axila, hilo: !a.axila.hilo } })}>
                  Hilo apagado
                </Chip>
                <Chip
                  active={a.axila.arredondado}
                  onClick={() => upd(idx, { axila: { ...a.axila, arredondado: !a.axila.arredondado } })}
                >
                  Arredondado
                </Chip>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold">Correlação mamográfica</div>
              <input
                className="border p-1.5 rounded w-full text-xs"
                placeholder="ex.: sem correlação suspeita / calcificações suspeitas correlatas / padrão benigno"
                value={a.correlacaoMammo}
                onChange={(e) => upd(idx, { correlacaoMammo: e.target.value })}
              />
            </div>
          </div>

          {/* Observação e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="text-xs font-semibold">Observação</div>
              <div className="flex flex-wrap gap-1">
                {["estável", "novo"].map((op) => (
                  <Chip key={op} active={a.observacao === op} onClick={() => upd(idx, { observacao: op })}>
                    {op}
                  </Chip>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">(Será exibido entre parênteses após as medidas.)</p>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs font-semibold">Categoria BI-RADS</div>
              <div className="flex flex-wrap gap-1">
                {["0", "2", "3", "4A", "4B", "4C", "5"].map((cat) => (
                  <Chip key={cat} active={a.birads === cat} onClick={() => upd(idx, { birads: a.birads === cat ? "" : (cat as BiradsCat) })}>
                    {cat}
                  </Chip>
                ))}
                <Chip active={false} onClick={() => upd(idx, { birads: sugerirBirads(a) })} title="Sugestão automática">
                  Sugerir
                </Chip>
              </div>
              {a.birads && <p className="text-[11px] text-gray-700 mt-1">Conduta: {condutaPorBirads(a.birads)}</p>}
            </div>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
        type="button"
        onClick={() => setAchados((prev) => [...prev, defaultFibroadenoma()])}
      >
        + Adicionar achado
      </button>

      {/* Pré-visualização */}
      <div className="mt-6">
        <div className="text-sm font-semibold">Pré-visualização</div>
        <textarea className="w-full border p-3 rounded h-40 mt-2" value={textoPreview} readOnly />
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => navigator.clipboard.writeText(textoPreview)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm"
        >
          Copiar texto puro
        </button>
        <button
          onClick={() =>
            copyFormattedOrPlain(
              `<div style="font-family: Arial; font-size: 11pt; white-space: pre-line;">${textoPreview}</div>`,
              textoPreview
            )
          }
          className="bg-green-500 text-white px-3 py-1.5 rounded text-sm"
        >
          Copiar formatado (Arial 11)
        </button>
      </div>

      {/* Condutas */}
      <div className="mt-6 border rounded p-4 bg-gray-50">
        <h3 className="font-semibold mb-2 text-sm">Condutas (por categoria atribuída ou sugerida):</h3>
        <pre className="whitespace-pre-wrap text-xs">{condutasTexto}</pre>
        <button
          onClick={() => navigator.clipboard.writeText(condutasTexto)}
          className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
        >
          Copiar condutas
        </button>
        <p className="text-[11px] text-gray-600 mt-2">
          * Ajuste ao contexto (idade, risco, correlação mamográfica, achados associados, etc.).
        </p>
      </div>
    </div>
  );
}
