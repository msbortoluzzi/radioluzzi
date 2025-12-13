"use client";

import Link from "next/link";
import { useState } from "react";

type Operator = "+" | "-" | "*" | "/";

export default function Page() {
  const parseNum = (v: string) => parseFloat(v.replace(",", "."));

  const copiar = (texto: string) => {
    const html = `<div style="font-family: Arial; font-size: 11pt; white-space: pre-line;">${texto}</div>`;
    const blob = new Blob([html], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob })];
    navigator.clipboard.write(data);
    alert("Copiado (Arial 11)!");
  };

  const links = [
    { href: "/formulas/volume-testiculo-ovario", title: "Volume testicular/ovariano", desc: "0,523 x A x B x C (mL)." },
    { href: "/formulas/volume-figado", title: "Volume hepatico (estimativa)", desc: "Passo a passo para estimar volume hepatico." }
  ];

  // Calculadora simples (sticky)
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [op, setOp] = useState<Operator>("+");
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
      case "/": res = b !== 0 ? (a / b).toString() : "Divisao por zero"; break;
    }
    setResultado(res);
    setN1(res);
    setN2("");
    setStage("resultado");
    return res;
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
        const res = calcular();
        if (res !== "") setN1(res);
        setN2("");
      }
      setOp(btn as Operator);
      setStage("n2");
      return;
    }

    if (btn === "=") {
      if (n1 !== "" && n2 !== "") calcular();
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

  // Volume elipsoide
  const [volA, setVolA] = useState("");
  const [volB, setVolB] = useState("");
  const [volC, setVolC] = useState("");
  const [volUnit, setVolUnit] = useState<"cm3" | "ml">("cm3");

  const calcElipsoide = (a: string, b: string, c: string) => {
    const A = parseNum(a);
    const B = parseNum(b);
    const C = parseNum(c);
    if (!isNaN(A) && !isNaN(B) && !isNaN(C)) {
      return 0.52 * A * B * C;
    }
    return undefined;
  };

  const formatVolume = (v: number) => v.toFixed(1).replace(".", ",");

  const fraseElipsoide = (a: string, b: string, c: string) => {
    const vol = calcElipsoide(a, b, c);
    if (vol !== undefined) {
      const unitLabel = volUnit === "ml" ? "mL" : "cm3";
      return `${a} x ${b} x ${c} cm (AP x LL x CC - volume estimado em ${formatVolume(vol)} ${unitLabel}).`;
    }
    return "";
  };

  // Variacao percentual (1 a 3 medidas)
  const [percNumMedidas, setPercNumMedidas] = useState<1 | 2 | 3>(1);
  const [percBase1, setPercBase1] = useState("");
  const [percBase2, setPercBase2] = useState("");
  const [percBase3, setPercBase3] = useState("");
  const [percAtual1, setPercAtual1] = useState("");
  const [percAtual2, setPercAtual2] = useState("");
  const [percAtual3, setPercAtual3] = useState("");

  const calcPorcentagem = () => {
    let somaBase = 0;
    let somaAtual = 0;
    let valido = true;

    if (percNumMedidas >= 1) {
      const b1 = parseNum(percBase1);
      const a1 = parseNum(percAtual1);
      if (isNaN(b1) || isNaN(a1)) valido = false;
      somaBase += b1;
      somaAtual += a1;
    }

    if (percNumMedidas >= 2) {
      const b2 = parseNum(percBase2);
      const a2 = parseNum(percAtual2);
      if (isNaN(b2) || isNaN(a2)) valido = false;
      somaBase += b2;
      somaAtual += a2;
    }

    if (percNumMedidas >= 3) {
      const b3 = parseNum(percBase3);
      const a3 = parseNum(percAtual3);
      if (isNaN(b3) || isNaN(a3)) valido = false;
      somaBase += b3;
      somaAtual += a3;
    }

    if (valido && somaBase > 0) {
      const variacao = ((somaAtual - somaBase) / somaBase) * 100;
      return { variacao, somaBase, somaAtual };
    }
    return undefined;
  };

  const frasePorcentagem = () => {
    const resultado = calcPorcentagem();
    if (resultado) {
      const { variacao, somaBase, somaAtual } = resultado;
      const sinal = variacao > 0 ? "+" : "";
      return `Base: ${somaBase.toFixed(1)} | Atual: ${somaAtual.toFixed(1)} | Variacao: ${sinal}${variacao.toFixed(1)}%`;
    }
    return "";
  };

  // Regra de tres
  const [r3A, setR3A] = useState("");
  const [r3B, setR3B] = useState("");
  const [r3C, setR3C] = useState("");

  const calcRegraTres = () => {
    const a = parseNum(r3A);
    const b = parseNum(r3B);
    const c = parseNum(r3C);
    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0) {
      return ((b * c) / a).toFixed(2);
    }
    return "";
  };

  const fraseRegraTres = () => {
    const resultado = calcRegraTres();
    if (resultado) {
      return `${r3A} esta para ${r3B}, assim como ${r3C} esta para ${resultado}`;
    }
    return "";
  };

  // Razao C/L
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

  // RECIST 1.1
  const [recistBase, setRecistBase] = useState("");
  const [recistAtual, setRecistAtual] = useState("");

  const calcRECIST = () => {
    const base = parseNum(recistBase);
    const atual = parseNum(recistAtual);
    if (!isNaN(base) && !isNaN(atual) && base > 0) {
      const variacao = ((atual - base) / base) * 100;
      return variacao;
    }
    return undefined;
  };

  const fraseRECIST = () => {
    const variacao = calcRECIST();
    if (variacao !== undefined) {
      const sinal = variacao > 0 ? "+" : "";
      let interpretacao = "";
      if (variacao >= 20) interpretacao = "Progressao (>=20%)";
      else if (variacao <= -30) interpretacao = "Resposta parcial (<=-30%)";
      else interpretacao = "Doenca estavel";
      return `Variacao: ${sinal}${variacao.toFixed(1)}% (${interpretacao})`;
    }
    return "";
  };

  // ICT
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

  // BSA (Mosteller)
  const [bsaPeso, setBsaPeso] = useState("");
  const [bsaAltura, setBsaAltura] = useState("");

  const calcBSA = () => {
    const peso = parseNum(bsaPeso);
    const altura = parseNum(bsaAltura);
    if (!isNaN(peso) && !isNaN(altura) && peso > 0 && altura > 0) {
      return Math.sqrt((peso * altura * 100) / 3600);
    }
    return undefined;
  };

  const fraseBSA = () => {
    const bsa = calcBSA();
    if (bsa !== undefined) {
      return `ASC (Mosteller) = ${bsa.toFixed(2)} m2`;
    }
    return "";
  };

  // IMC
  const [imcPeso, setImcPeso] = useState("");
  const [imcAltura, setImcAltura] = useState("");

  const calcIMC = () => {
    const peso = parseNum(imcPeso);
    const altura = parseNum(imcAltura);
    if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
      return peso / (altura * altura);
    }
    return undefined;
  };

  const fraseIMC = () => {
    const imc = calcIMC();
    if (imc !== undefined) {
      let classificacao = "";
      if (imc < 18.5) classificacao = "Baixo peso";
      else if (imc < 25) classificacao = "Peso normal";
      else if (imc < 30) classificacao = "Sobrepeso";
      else if (imc < 35) classificacao = "Obesidade I";
      else if (imc < 40) classificacao = "Obesidade II";
      else classificacao = "Obesidade III";
      return `IMC = ${imc.toFixed(1)} kg/m2 (${classificacao})`;
    }
    return "";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">FORMULAS</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-[#222222] bg-[#111111] p-3 rounded hover:border-blue-600 transition-colors block"
            >
              <p className="text-sm font-semibold text-gray-100">{link.title}</p>
              <p className="text-xs text-gray-400 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Volume (0,52 x A x L x P)</h3>
            <div className="flex gap-2 mb-2 flex-wrap">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-24" placeholder="AP (cm)" value={volA} onChange={(e) => setVolA(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-24" placeholder="LL (cm)" value={volB} onChange={(e) => setVolB(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-24" placeholder="CC (cm)" value={volC} onChange={(e) => setVolC(e.target.value)} />
              <select
                className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-28"
                value={volUnit}
                onChange={(e) => setVolUnit(e.target.value as "cm3" | "ml")}
              >
                <option value="cm3">cm3</option>
                <option value="ml">mL</option>
              </select>
            </div>
            {fraseElipsoide(volA, volB, volC) && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm text-gray-100">{fraseElipsoide(volA, volB, volC)}</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(fraseElipsoide(volA, volB, volC))}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Variacao percentual</h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`px-3 py-1 rounded text-sm ${percNumMedidas === n ? "bg-blue-600 text-white" : "bg-[#222222] text-gray-100"}`}
                  onClick={() => setPercNumMedidas(n as 1 | 2 | 3)}
                >
                  {n} medida{n > 1 ? "s" : ""}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-2">Medidas iniciais:</p>
            <div className="space-y-2 mb-3">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-full" placeholder="Base 1" value={percBase1} onChange={(e) => setPercBase1(e.target.value)} />
              {percNumMedidas >= 2 && (
                <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-full" placeholder="Base 2" value={percBase2} onChange={(e) => setPercBase2(e.target.value)} />
              )}
              {percNumMedidas >= 3 && (
                <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-full" placeholder="Base 3" value={percBase3} onChange={(e) => setPercBase3(e.target.value)} />
              )}
            </div>

            <p className="text-xs text-gray-400 mb-2">Medidas atuais:</p>
            <div className="space-y-2">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-full" placeholder="Atual 1" value={percAtual1} onChange={(e) => setPercAtual1(e.target.value)} />
              {percNumMedidas >= 2 && (
                <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-full" placeholder="Atual 2" value={percAtual2} onChange={(e) => setPercAtual2(e.target.value)} />
              )}
              {percNumMedidas >= 3 && (
                <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-full" placeholder="Atual 3" value={percAtual3} onChange={(e) => setPercAtual3(e.target.value)} />
              )}
            </div>

            {frasePorcentagem() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded mt-2">
                <p className="text-sm font-semibold text-gray-100">{frasePorcentagem()}</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(frasePorcentagem())}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Regra de tres</h3>
            <p className="text-xs text-gray-400 mb-2">A esta para B, assim como C esta para X</p>
            <div className="flex gap-2 mb-2">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-20" placeholder="A" value={r3A} onChange={(e) => setR3A(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-20" placeholder="B" value={r3B} onChange={(e) => setR3B(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded w-20" placeholder="C" value={r3C} onChange={(e) => setR3C(e.target.value)} />
            </div>
            {calcRegraTres() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm text-gray-100">X = {calcRegraTres()}</p>
                <p className="text-xs mt-1 text-gray-300">{fraseRegraTres()}</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(`Resultado: ${calcRegraTres()}`)}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Razao C/L (Comprimento / Largura)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Eixo longo (cm)" value={clLongo} onChange={(e) => setClLongo(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Eixo curto (cm)" value={clCurto} onChange={(e) => setClCurto(e.target.value)} />
            </div>
            {calcCL() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm text-gray-100">Razao C/L = {calcCL()}</p>
                <p className="text-sm text-gray-100">{parseFloat(calcCL()) >= 2 ? "Alongado (>=2)" : "Oval (<2)"}</p>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">RECIST 1.1 - Variacao tumoral</h3>
            <p className="text-xs text-gray-400 mb-2">Soma dos diametros das lesoes-alvo</p>
            <div className="flex gap-2 mb-2">
              <input
                className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1"
                placeholder="Medida basal (cm)"
                value={recistBase}
                onChange={(e) => setRecistBase(e.target.value)}
              />
              <input
                className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1"
                placeholder="Medida atual (cm)"
                value={recistAtual}
                onChange={(e) => setRecistAtual(e.target.value)}
              />
            </div>
            {fraseRECIST() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm font-semibold text-gray-100">{fraseRECIST()}</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(fraseRECIST())}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Indice Cardiotoracico (ICT)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Diametro cardiaco (cm)" value={ictCard} onChange={(e) => setIctCard(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Diametro toracico (cm)" value={ictTorax} onChange={(e) => setIctTorax(e.target.value)} />
            </div>
            {calcICT() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm text-gray-100">ICT = {calcICT()}%</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(`ICT = ${calcICT()}%`)}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Area de superficie corporal (ASC)</h3>
            <p className="text-xs text-gray-400 mb-2">Formula de Mosteller</p>
            <div className="flex gap-2 mb-2">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Peso (kg)" value={bsaPeso} onChange={(e) => setBsaPeso(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Altura (cm)" value={bsaAltura} onChange={(e) => setBsaAltura(e.target.value)} />
            </div>
            {fraseBSA() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm text-gray-100">{fraseBSA()}</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(fraseBSA())}>
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="border border-[#222222] bg-[#111111] p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-100">Indice de Massa Corporal (IMC)</h3>
            <div className="flex gap-2 mb-2">
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Peso (kg)" value={imcPeso} onChange={(e) => setImcPeso(e.target.value)} />
              <input className="border border-[#333333] bg-[#0a0a0a] text-gray-100 p-2 rounded flex-1" placeholder="Altura (m)" value={imcAltura} onChange={(e) => setImcAltura(e.target.value)} />
            </div>
            {fraseIMC() && (
              <div className="bg-[#0f0f0f] border border-[#222222] p-3 rounded">
                <p className="text-sm text-gray-100">{fraseIMC()}</p>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors" onClick={() => copiar(fraseIMC())}>
                  Copiar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-64 lg:sticky lg:top-6 lg:self-start">
        <div className="border border-[#222222] p-3 rounded bg-[#111111] shadow-md">
          <h3 className="font-semibold mb-2 text-sm text-gray-100">Calculadora</h3>
          <div className="bg-[#0a0a0a] border border-[#333333] p-2 rounded mb-2 text-right text-lg font-mono text-gray-100">
            {stage === "resultado" ? resultado : stage === "n1" ? n1 || "0" : n2 || "0"}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButton(btn)}
                className="bg-[#222222] text-gray-100 rounded py-2 text-sm font-bold hover:bg-[#333333] transition-colors"
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleButton("=")}
              className="col-span-4 bg-blue-600 text-white rounded py-2 text-sm font-bold hover:bg-blue-700 transition-colors mt-1"
            >
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
