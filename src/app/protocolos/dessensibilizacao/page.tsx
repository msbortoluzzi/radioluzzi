"use client";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Protocolo de Dessensibilização</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Para:</h2>

        <h3 className="text-lg font-semibold">Receituário Médico</h3>
        <p className="italic">Uso interno</p>

        <div className="space-y-4 mt-4">
          <div>
            <p className="font-semibold">Prednisona 20 mg VO — 4 comprimidos</p>
            <p>
              Tome 2 comprimidos via oral 12 horas antes e 2 comprimidos 2 horas
              antes do exame.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Cloridrato de Fexofenadina 60 mg — 2 comprimidos
            </p>
            <p>
              Tome 1 comprimido via oral 12 horas antes e 1 comprimido 2 horas
              antes do exame.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
