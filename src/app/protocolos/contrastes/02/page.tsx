"use client"

export default function Page() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-100">Protocolos de TC – Contraste</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">5. Exame 1 – Rotina</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial</li>
          <li>Portal</li>
          <li>Tardio 3 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">6. Exame 2 – Tumor Gástrico</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Rotina</li>
          <li>
            <span className="font-semibold">800 mL de água VO</span> em 10 minutos antes do exame
          </li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">7. Exame 3 – Angio Abdome</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial precoce</li>
          <li>Portal</li>
          <li>Tardio 3 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">8. Exame 4 – Angio Tórax TEP</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial (artéria pulmonar)</li>
          <li>Portal</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">
          9. Exame 5 – Baixa Dose (Seguimento Tardio / Pediatria)
        </h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Portal apenas</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">10. Exame 6 – Tumor de Cavidade Oral</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li className="font-semibold italic">Colocar afastador na boca</li>
          <li>Sem contraste</li>
          <li>Portal</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">11. Exame 7 – Fístula Urinária</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial</li>
          <li>Portal</li>
          <li>Tardio 15 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">12. Estadiamento Retal</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-100">Tumor Retal – Estadiamento</h3>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li className="font-semibold italic">Introduzir sonda retal</li>
            <li className="font-semibold italic">Injetar SF via retal após fase sem contraste</li>
            <li>Sem contraste</li>
            <li>Arterial</li>
            <li>Portal</li>
            <li>Tardio 3 min</li>
          </ul>
        </div>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-100">13. Fístulas – Avaliação</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-100">Retovaginal / Colovaginal / Deiscência Colorretal</h3>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li className="font-semibold italic">Introduzir sonda retal</li>
            <li className="font-semibold italic">Injetar contraste iodado via retal após fase sem contraste</li>
            <li>Sem contraste</li>
            <li>Arterial</li>
            <li>Portal</li>
            <li>Tardio 3 min</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-100">Fístula / Pós-operatório Recente</h3>
          <p className="text-sm text-gray-400">
            Se houver radiologista ou residente, avaliar antes de liberar paciente.
          </p>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>SC apenas</li>
            <li>SC EV + contraste VO</li>
            <li>Portal</li>
            <li>Tardio 3 min</li>
          </ul>
        </div>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">14. Crânio / Tórax / Pescoço / Tumor Ósseo</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Portal</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">15. Pelve</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Portal</li>
          <li>Tardio 5 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">16. Bexiga – Estadiamento</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial (incluir abdome todo)</li>
          <li>Portal</li>
          <li>Tardio 5 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">17. Urotomografia</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial</li>
          <li>Portal</li>
          <li>Tardio 10 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">18. Hepatopata</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial</li>
          <li>Segunda fase arterial (retornar imediatamente após arterial)</li>
          <li>Portal</li>
          <li>Tardio 5 min</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">19. Baixa Dose – Tórax</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">20. Paratireoide 4D</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial 25 s</li>
          <li>Portal 80 s</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">21. Angio TC Arterial Angiográfica (Inclui Pelve)</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">22. Angio TC Pescoço (Microcirurgia de Fíbula)</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Arterial</li>
          <li>Portal</li>
        </ul>
      </section>

      <hr className="border-t border-gray-700" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-100">23. Supressão de Metal</h2>
        <ul className="list-disc pl-6 text-gray-200 space-y-1">
          <li>Sem contraste</li>
          <li>Reconstruções: coronal, sagital, axial 3D</li>
        </ul>
      </section>
    </div>
  )
}
