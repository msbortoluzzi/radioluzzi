"use client";

import { useState } from "react";

export default function Page() {
  const [tab, setTab] = useState<"gerais" | "usg" | "rx">("gerais");

  const parseNum = (v: string) => parseFloat(v.replace(",", "."));

  const copiar = (texto: string) => {
    const html = `<div style="font-family: Arial; font-size: 11pt; white-space: pre-line;">${texto}</div>`;
    const blob = new Blob([html], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob })];
    navigator.clipboard.write(data);
    alert("Copiado (Arial 11)!");
  };

  // -------- Volume Elipsoide --------
  const [volA, setVolA] = useState("");
  const [volB, setVolB] = useState("");
  const [volC, setVolC] = useState("");

  const calcElipsoide = (a: string, b: string, c: string) => {
    const A = parseNum(a);
    const B = parseNum(b);
    const C = parseNum(c);
    if (!isNaN(A) && !isNaN(B) && !isNaN(C)) {
      return 0.52 * A * B * C;
    }
    return undefined;
  };

  const fraseElipsoide = (a: string, b: string, c: string) => {
    const vol = calcElipsoide(a, b, c);
    if (vol !== undefined) {
      return `${a} x ${b} x ${c} cm (volume estimado em ${vol.toFixed(
        1
      )} mL).`;
    }
    return "";
  };

  // -------- Volume TC --------
  const [tcA, setTcA] = useState("");
  const [tcB, setTcB] = useState("");
  const [tcC, setTcC] = useState("");

  const fraseTC = () => {
    if (tcA && tcB && tcC) {
      return `${tcA} x ${tcB} x ${tcC} cm (APxLLxCC)`;
    }
    return "";
  };

  // -------- Calculadora interativa --------
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [op, setOp] = useState<"+" | "-" | "*" | "/">("+");
  const [stage, setStage] = useState<"n1" | "n2" | "resultado">("n1");
  const [resultado, setResultado] = useState("");

  const calcular = () => {
    const a = parseNum(n1);
    const b = parseNum(n2);
    if (isNaN(a) || isNaN(b)) return "";
    let res = "";
    switch (op) {
      case "+": res = (a + b).toString(); break;
      case "-": res = (a - b).toString(); break;
      case "*": res = (a * b).toString(); break;
      case "/": res = b !== 0 ? (a / b).toString() : "Divisão por zero"; break;
    }
    setResultado(res);
    setN1(res);
    setN2("");
    setStage("resultado");
  };

  const handleButton = (btn: string) => {
    if (btn === "C") {
      setN1("");
      setN2("");
      setResultado("");
      setStage("n1");
      setOp("+");
      return;
    }

    if (["/", "*", "-", "+"].includes(btn)) {
      if (n2 !== "") {
        const a = parseNum(n1);
        const b = parseNum(n2);
        let res = "";
        switch (op) {
          case "+": res = (a + b).toString(); break;
          case "-": res = (a - b).toString(); break;
          case "*": res = (a * b).toString(); break;
          case "/": res = b !== 0 ? (a / b).toString() : "Divisão por zero"; break;
        }
        setN1(res);
        setN2("");
        setResultado(res);
      }
      setOp(btn as any);
      setStage("n2");
      return;
    }

    if (btn === "=") {
      if (n1 !== "" && n2 !== "") {
        calcular();
      }
      return;
    }

    if (stage === "resultado") {
      setN1(btn);
      setN2("");
      setResultado("");
      setStage("n1");
      return;
    }

    if (stage === "n1") {
      setN1((prev) => prev + btn);
    } else {
      setN2((prev) => prev + btn);
    }
  };

  // -------- Volume Próstata --------
  const [proA, setProA] = useState("");
  const [proB, setProB] = useState("");
  const [proC, setProC] = useState("");

  // -------- Índice Cardiotorácico --------
  const [ictCard, setIctCard] = useState("");
  const [ictTorax, setIctTorax] = useState("");

  const calcICT = () => {
    const c = parseNum(ictCard);
    const t = parseNum(ictTorax);
    if (!isNaN(c) && !isNaN(t) && t > 0) {
      return (100 * c / t).toFixed(1);
    }
    return "";
  };

  // -------- Razão C/L --------
  const [clLongo, setClLongo] = useState("");
  const [clCurto, setClCurto] = useState("");

  const calcCL = () => {
    const L = parseNum(clLongo);
    const C = parseNum(clCurto);
    if (!isNaN(L) && !isNaN(C) && C > 0) {
      return (L / C).toFixed(2);
    }
    return "";
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-blue-900">FÓRMULAS</h1>

      {/* Abas */}
      <div className="flex gap-2">
        {[
          { chave: "gerais", label: "Gerais" },
          { chave: "usg", label: "USG" },
          { chave: "rx", label: "RX" },
        ].map((t) => (
          <button
            key={t.chave}
            className={`px-4 py-2 rounded ${
              tab === t.chave
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab(t.chave as typeof tab)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "gerais" && (
        <div className="space-y-6">
          {/* Calculadora interativa (agora vem primeiro) */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-4">Calculadora</h3>
            <div className="bg-gray-100 p-4 rounded mb-4 text-right text-2xl font-mono tracking-widest">
              {stage === "resultado"
                ? resultado
                : stage === "n1"
                ? n1 || "0"
                : n2 || "0"}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","C","+"].map((btn) => (
                <button key={btn} onClick={() => handleButton(btn)} className="bg-gray-200 rounded py-3 font-bold hover:bg-gray-300 text-lg">
                  {btn === "*" ? "×" : btn === "/" ? "÷" : btn}
                </button>
              ))}
              <button onClick={() => handleButton("=")} className="col-span-3 bg-blue-600 text-white rounded py-3 font-bold hover:bg-blue-700 text-lg">
                =
              </button>
              <button onClick={() => resultado && copiar(resultado)} className="bg-green-600 text-white rounded py-3 font-bold hover:bg-green-700 text-lg">
                Copiar resultado
              </button>
            </div>
          </div>

          {/* Volume elipsoide */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Volume (0,52 × A × L × P)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 rounded w-24" placeholder="A (cm)" value={volA} onChange={(e) => setVolA(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="L (cm)" value={volB} onChange={(e) => setVolB(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="P (cm)" value={volC} onChange={(e) => setVolC(e.target.value)} />
            </div>
            {fraseElipsoide(volA, volB, volC) && (
              <div className="bg-gray-100 p-3 rounded">
                <p>{fraseElipsoide(volA, volB, volC)}</p>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => copiar(fraseElipsoide(volA, volB, volC))}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          {/* Volume TC */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Volume TC (AP × LL × CC)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 rounded w-24" placeholder="AP (cm)" value={tcA} onChange={(e) => setTcA(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="LL (cm)" value={tcB} onChange={(e) => setTcB(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="CC (cm)" value={tcC} onChange={(e) => setTcC(e.target.value)} />
            </div>
            {fraseTC() && (
              <div className="bg-gray-100 p-3 rounded">
                <p>{fraseTC()}</p>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => copiar(fraseTC())}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          {/* Razão C/L */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Razão C/L (Comprimento ÷ Largura)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 rounded w-24" placeholder="Eixo longo (cm)" value={clLongo} onChange={(e) => setClLongo(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="Eixo curto (cm)" value={clCurto} onChange={(e) => setClCurto(e.target.value)} />
            </div>
            {calcCL() && (
              <div className="bg-gray-100 p-3 rounded">
                <p>Razão C/L = {calcCL()}</p>
                <p>
                  {parseFloat(calcCL()) >= 2 ? "Alongado (≥2)" : "Oval (<2)"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "usg" && (
        <div className="space-y-6">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Volume da Próstata (0,52 × A × L × P)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 rounded w-24" placeholder="A (cm)" value={proA} onChange={(e) => setProA(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="L (cm)" value={proB} onChange={(e) => setProB(e.target.value)} />
              <input className="border p-2 rounded w-24" placeholder="P (cm)" value={proC} onChange={(e) => setProC(e.target.value)} />
            </div>
            {fraseElipsoide(proA, proB, proC) && (
              <div className="bg-gray-100 p-3 rounded">
                <p>{fraseElipsoide(proA, proB, proC)}</p>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => copiar(fraseElipsoide(proA, proB, proC))}>
                  Copiar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "rx" && (
        <div className="space-y-6">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Índice Cardiotorácico (ICT)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border p-2 rounded w-40" placeholder="Diâmetro cardíaco (cm)" value={ictCard} onChange={(e) => setIctCard(e.target.value)} />
              <input className="border p-2 rounded w-40" placeholder="Diâmetro torácico (cm)" value={ictTorax} onChange={(e) => setIctTorax(e.target.value)} />
            </div>
            {calcICT() && (
              <div className="bg-gray-100 p-3 rounded">
                <p>ICT = {calcICT()}%</p>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => copiar(`ICT = ${calcICT()}%`)}>
                  Copiar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
