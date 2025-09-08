"use client";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        PROTOCOLOS DE CONTRASTE – TOMOGRAFIA COMPUTADORIZADA
      </h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Observação geral (abdome):</h2>
        <p>
          Paciente deve beber 2–4 copos de água momentos antes de entrar na sala.
        </p>

        <h3 className="text-lg font-semibold">1. SEM CONTRASTE</h3>
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2">Código</th>
              <th className="border border-gray-400 p-2">Descrição</th>
              <th className="border border-gray-400 p-2">Observações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">1.S</td>
              <td className="border p-2">Sem contraste EV ou VO. Fase única.</td>
              <td className="border p-2">
                Pedido médico “sem contraste”<br />Recusa informada do paciente
                ou alergia (técnico justifica no verso)
              </td>
            </tr>
            <tr>
              <td className="border p-2">1.A</td>
              <td className="border p-2">
                Sem contraste EV ou VO + avaliação
              </td>
              <td className="border p-2">
                Fazer aquisição s/c e chamar residente/preceptor para avaliar.
              </td>
            </tr>
            <tr>
              <td className="border p-2">1.IE</td>
              <td className="border p-2">Sem contraste Insp-Exp</td>
              <td className="border p-2">
                • Supina, inspiração máxima<br />
                • Supina, expiração máxima<br />
                • Prona, inspiração máxima (aguardar 10 min)
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold">
          2. CONTRASTE TRIFÁSICO E VARIANTES
        </h3>
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2">Código</th>
              <th className="border border-gray-400 p-2">Nome</th>
              <th className="border border-gray-400 p-2">Fases</th>
              <th className="border border-gray-400 p-2">Indicações típicas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">2.TRI</td>
              <td className="border p-2">Trifásico visceral</td>
              <td className="border p-2">
                • Arterial visceral (sup.)<br />• Portal<br />• Tardio (3 min)
              </td>
              <td className="border p-2">TC abdome externo “padrão”</td>
            </tr>
            <tr>
              <td className="border p-2">2.TRI + SUP</td>
              <td className="border p-2">Trifásico visceral total</td>
              <td className="border p-2">
                • Arterial visceral (sup. e inf.)<br />• Portal<br />• Tardio (3
                min)
              </td>
              <td className="border p-2">TC entero</td>
            </tr>
            <tr>
              <td className="border p-2">2.PORTAL</td>
              <td className="border p-2">Portal “seco”</td>
              <td className="border p-2">• Portal</td>
              <td className="border p-2">
                TC abdome total pediátrico, suspeita de apendicite
                (paciente muito pequeno)
              </td>
            </tr>
            <tr>
              <td className="border p-2">2.SEM E PORTAL</td>
              <td className="border p-2">Sem e Portal</td>
              <td className="border p-2">
                • S/C<br />• Portal 1
              </td>
              <td className="border p-2">
                TC abdome total pediátrico (quando a s/c não é conclusiva)
              </td>
            </tr>
            <tr>
              <td className="border p-2">2.H</td>
              <td className="border p-2">Uro – hematúria</td>
              <td className="border p-2">
                • Arterial visceral (sup. e inf.)<br />• Portal<br />• Tardio (10
                min)
              </td>
              <td className="border p-2">TC abdome total/uro (hematúria)</td>
            </tr>
            <tr>
              <td className="border p-2">2.F</td>
              <td className="border p-2">Uro – fístula</td>
              <td className="border p-2">
                • Arterial visceral<br />• Portal<br />• Tardio (10 min) +
                avaliação
              </td>
              <td className="border p-2">TC abdome total/uro (fístula urinária)</td>
            </tr>
            <tr>
              <td className="border p-2">TC ENTERO</td>
              <td className="border p-2">TC Enterografia</td>
              <td className="border p-2">
                • Muvinlax oral (&gt; s/c) – técnico avalia distensão das alças;
                se dúvida, consultar radiologista
              </td>
              <td className="border p-2"></td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold">
          3. CONTRASTE ANGIOGRÁFICO
        </h3>
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2">Código</th>
              <th className="border border-gray-400 p-2">Nome</th>
              <th className="border border-gray-400 p-2">Fases</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">3.AA</td>
              <td className="border p-2">Angio Arterial</td>
              <td className="border p-2">• S/C<br />• Arterial vascular</td>
            </tr>
            <tr>
              <td className="border p-2">3.AP</td>
              <td className="border p-2">Angio Arterial + Portal</td>
              <td className="border p-2">
                • S/C<br />• Arterial vascular<br />• Portal
              </td>
            </tr>
            <tr>
              <td className="border p-2">3.V1</td>
              <td className="border p-2">Angio Venosa 1 fase</td>
              <td className="border p-2">• S/C<br />• Portal 1</td>
            </tr>
            <tr>
              <td className="border p-2">3.V2</td>
              <td className="border p-2">Angio Venosa “Cocket”</td>
              <td className="border p-2">
                • S/C<br />• Portal 1<br />• Portal 2
              </td>
            </tr>
            <tr>
              <td className="border p-2">3.TEP</td>
              <td className="border p-2">Angio TEP (pulmonar)</td>
              <td className="border p-2">
                • S/C<br />• Arterial vascular para artéria pulmonar
              </td>
            </tr>
            <tr>
              <td className="border p-2">3.AORTA</td>
              <td className="border p-2">Angio Aorta sem ECG</td>
              <td className="border p-2">
                • S/C<br />• Arterial vascular para aorta (sem ECG)
              </td>
            </tr>
            <tr>
              <td className="border p-2">3.TAVI</td>
              <td className="border p-2">Angio TAVI</td>
              <td className="border p-2">
                • S/C<br />• Arterial<br />• ECG no tórax<br />• Sem ECG no
                abdome
              </td>
            </tr>
            <tr>
              <td className="border p-2">3.ECD</td>
              <td className="border p-2">Angio Aorta com ECG</td>
              <td className="border p-2">
                • S/C<br />• Arterial vascular para aorta (com ECG)
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* As outras seções permanecem iguais */}
    </div>
  );
}
