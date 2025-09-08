// src/app/calculadoras/page.jsx
import Link from "next/link";
import { Calculator, ChevronRight } from "lucide-react";

const cards = [
  // As que você pediu
  { slug: "birads",           title: "BI-RADS",                     badge: "Mama",
    desc: "Classificação ACR para MG/US/RM — padroniza achados e recomenda seguimento." },
  { slug: "tirads",           title: "TI-RADS",                     badge: "Tireoide",
    desc: "Estratificação de risco ACR para nódulos tireoidianos (US)." },
  { slug: "linfonodos",       title: "Linfadenopatia",              badge: "Linfonodos",
    desc: "Critérios morfológicos/funcionais (US/TC/RM/PET) e suspeição." },
  { slug: "adrenal",          title: "Adrenal (incidentaloma)",     badge: "Incidental",
    desc: "Algoritmo ACR (HU, washout, tamanho, risco oncológico)." },

  // Extras mais usados no dia a dia
  { slug: "lirads",           title: "LI-RADS (HCC)",               badge: "Fígado",
    desc: "TC/RM em fígado com risco — LR-1 a LR-5, LR-M, LR-TIV." },
  { slug: "pirads",           title: "PI-RADS (Próstata)",          badge: "Próstata",
    desc: "RM multiparamétrica com escores por zona e categoria final." },
  { slug: "orads-us",         title: "O-RADS US (Ovário)",          badge: "Gineco",
    desc: "US adnexal com categorias de risco e manejo recomendado." },
  { slug: "orads-mri",        title: "O-RADS MRI (Ovário)",         badge: "Gineco",
    desc: "RM p/ massa anexial com score e conduta." },
  { slug: "lung-rads",        title: "Lung-RADS (LDCT)",            badge: "Tórax",
    desc: "Rastreamento de câncer de pulmão por LDCT — classificação e follow-up." },
  { slug: "fleischner",       title: "Fleischner (nódulo pulmonar)",badge: "Tórax",
    desc: "Seguimento de nódulos incidentais por tamanho/risco." },
  { slug: "bosniak-2019",     title: "Bosniak v2019 (cisto renal)", badge: "Urologia",
    desc: "TC/RM com classes I–IV e manejo correspondente." },
  { slug: "incidental-pancreas", title: "Cisto pancreático incidental", badge: "Abdome",
    desc: "Algoritmos de manejo (ACR/consensos) por tamanho/estigmas." },
  { slug: "incidental-renal", title: "Massa renal incidental",      badge: "Urologia",
    desc: "Algoritmo ACR para achados incidentais renais (CT/MR/US)." },
  { slug: "tirads-fna",       title: "TI-RADS — Cortes para PAAF",  badge: "Tireoide",
    desc: "Tabelas de tamanho e intervalos de seguimento por categoria." },
];

export default function CalculadorasPage() {
  return (
    <div className="space-y-8 text-slate-900">
      <section className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold">🧮 Calculadoras Radiológicas</h1>
        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
          Atalhos para padronizar laudos e recomendações. Selecione uma calculadora.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((c) => (
            <article key={c.slug} className="card p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-700">
                  <Calculator className="w-5 h-5" />
                  <span className="text-xl font-semibold">{c.title}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                  {c.badge}
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>

              <div className="mt-2 flex justify-end">
                <Link
                  href={`/calculadoras/${c.slug}`}
                  className="btn-secondary inline-flex items-center gap-1"
                >
                  Abrir <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
