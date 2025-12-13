// src/app/calculadoras/page.jsx
import Link from "next/link"
import { Calculator, ChevronRight } from "lucide-react"

const cards = [
  { slug: "birads", title: "BI-RADS", badge: "Mama", desc: "Classificação ACR para MG/US/RM — padroniza achados e seguimento." },
  { slug: "tirads", title: "TI-RADS", badge: "Tireoide", desc: "Estratificação ACR para nódulos tireoidianos (US)." },
  { slug: "linfonodos", title: "Linfadenopatia", badge: "Linfonodos", desc: "Critérios morfológicos/funcionais (US/TC/RM/PET)." },
  { slug: "adrenal", title: "Adrenal (incidentaloma)", badge: "Incidental", desc: "Algoritmo ACR (HU, washout, tamanho, risco oncológico)." },
  { slug: "adrenal-mri", title: "Adrenal RM (CSI)", badge: "Incidental", desc: "Queda de sinal in/opposed phase para adenoma lipídico." },
  { slug: "lirads", title: "LI-RADS (HCC)", badge: "Fígado", desc: "TC/RM em fígado de risco — LR-1 a LR-5, LR-M, LR-TIV." },
  { slug: "pirads", title: "PI-RADS (Próstata)", badge: "Próstata", desc: "RM multiparamétrica com escores por zona e categoria final." },
  { slug: "orads-us", title: "O-RADS US (Ovário)", badge: "Gineco", desc: "US adnexal com categorias de risco e manejo recomendado." },
  { slug: "orads-mri", title: "O-RADS MRI (Ovário)", badge: "Gineco", desc: "RM para massa anexial com score e conduta." },
  { slug: "lung-rads", title: "Lung-RADS (LDCT)", badge: "Tórax", desc: "Rastreamento de câncer de pulmão por LDCT — classificação e follow-up." },
  { slug: "fleischner", title: "Fleischner (nódulo pulmonar)", badge: "Tórax", desc: "Seguimento de nódulos incidentais por tamanho/risco." },
  { slug: "bosniak-2019", title: "Bosniak v2019 (cisto renal)", badge: "Urologia", desc: "TC/RM com classes I–IV e manejo correspondente." },
  { slug: "incidental-pancreas", title: "Cisto pancreático incidental", badge: "Abdome", desc: "ACR/consensos: manejo por tamanho e estigmas de risco." },
  { slug: "incidental-renal", title: "Massa renal incidental", badge: "Urologia", desc: "Algoritmo ACR para achados incidentais renais (TC/RM/US)." },
  { slug: "aast-rim-trauma", title: "AAST trauma renal", badge: "Trauma", desc: "Classificação AAST (I–V) para lesão renal traumática." },
  { slug: "aast-figado-trauma", title: "AAST trauma hepático", badge: "Trauma", desc: "Classificação AAST (I–VI) para lesão hepática traumática." },
  { slug: "aast-baco-trauma", title: "AAST trauma esplênico", badge: "Trauma", desc: "Classificação AAST (I–V) para lesão esplênica traumática." }
]

export default function CalculadorasPage() {
  return (
    <div className="space-y-8 text-gray-100">
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-100">Calculadoras Radiológicas</h1>
        <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto"></p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((c) => (
            <article
              key={c.slug}
              className="border border-[#222222] bg-[#111111] rounded-lg p-6 flex flex-col gap-3 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-gray-100">
                  <Calculator className="w-5 h-5" />
                  <span className="text-xl font-semibold">{c.title}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">{c.badge}</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>

              <div className="mt-2 flex justify-end">
                <Link
                  href={`/calculadoras/${c.slug}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors inline-flex items-center gap-1"
                >
                  Abrir <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
