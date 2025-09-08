"use client";

export default function Page() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        PROTOCOLOS DE TOMOGRAFIA – UOPECCAN
      </h1>

      {/* Observação geral */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Observação geral</h2>
        <p>
          Todos os exames de abdome:{" "}
          <span className="font-medium">
            Beber dois copos de água ao entrar na sala.
          </span>
        </p>
      </section>

      {/* Tabela principal */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Tabela de protocolos</h3>
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 w-20">Nº</th>
              <th className="border border-gray-400 p-2">Exame</th>
              <th className="border border-gray-400 p-2">Fases / Observações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">0</td>
              <td className="border p-2">Sem contraste</td>
              <td className="border p-2">Sem contraste</td>
            </tr>
            <tr>
              <td className="border p-2">1</td>
              <td className="border p-2">Rotina</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sem contraste</li>
                  <li>Arterial</li>
                  <li>Portal</li>
                  <li>Tardio (3 min)</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border p-2">2</td>
              <td className="border p-2">Tumor gástrico</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Rotina</li>
                  <li>+ 800 mL VO água 10 min antes</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border p-2">3</td>
              <td className="border p-2">Angio abdome</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sem contraste</li>
                  <li>Arterial (precoce)</li>
                  <li>Portal</li>
                  <li>Tardio (3 min)</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border p-2">4</td>
              <td className="border p-2">Angio tórax TEP</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sem contraste</li>
                  <li>Arterial (artéria pulmonar)</li>
                  <li>Portal</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border p-2">5</td>
              <td className="border p-2">Baixa dose pediatria</td>
              <td className="border p-2">Portal apenas</td>
            </tr>
            <tr>
              <td className="border p-2">7</td>
              <td className="border p-2">Fístula urinária</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sem contraste</li>
                  <li>Arterial</li>
                  <li>Portal</li>
                  <li>Tardio (15 min)</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border p-2">8</td>
              <td className="border p-2">Tumor retal</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sem contraste</li>
                  <li>Arterial</li>
                  <li>Portal</li>
                  <li>Tardio (3 min)</li>
                  <li>Sonda + soro fisiológico retal</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td className="border p-2">9</td>
              <td className="border p-2">Fístula retovaginal / colovaginal</td>
              <td className="border p-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Sem contraste</li>
                  <li>Arterial</li>
                  <li>Portal</li>
                  <li>Tardio (3 min)</li>
                  <li>Contraste iodado via retal</li>
                </ul>
              </td>
            </tr>
            {/* ...continue no mesmo padrão para os demais (10–20) */}
          </tbody>
        </table>
      </section>

      {/* Orientações adicionais */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Orientações adicionais</h3>

        <div>
          <p className="font-semibold">Dose de contraste iodado endovenoso</p>
          <ul className="list-disc pl-6">
            <li>Adultos:
              <ul className="list-disc pl-6">
                <li>Até 75 kg: 100 mL</li>
                <li>De 75 a 90 kg: 120 mL</li>
                <li>Acima de 90 kg: 150 mL</li>
              </ul>
            </li>
            <li>Crianças: 1,5 mL/kg</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">Protocolo de exame para TEP</p>
          <ul className="list-disc pl-6">
            <li>Pedir para o paciente parar de respirar antes da aquisição.</li>
            <li>Realizar aquisição de baixo para cima.</li>
            <li>80 mL de contraste é suficiente para adultos.</li>
            <li>Acesso venoso 18 G.</li>
            <li>Fluxo no mínimo 5,0 mL/s.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
