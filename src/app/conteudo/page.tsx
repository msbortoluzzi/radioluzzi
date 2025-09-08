"use client";

import Link from "next/link";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const ITEMS = [
  {
    href: "/conteudo/aulas",
    titulo: "Aulas e Revisões",
    descricao: "Conteúdo teórico e revisões práticas.",
    icon: BookOpenIcon,
  },
];

export default function Page() {
  return (
    <main className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 drop-shadow-sm">
          Conteúdo Educativo
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Material para aprendizado e atualização em radiologia.
        </p>
      </section>

      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div className="h-44 flex flex-col items-center justify-center text-center rounded-2xl border border-blue-200 bg-white/70 backdrop-blur shadow-md transition-all duration-200 hover:shadow-xl hover:bg-blue-100 hover:border-blue-400 hover:scale-[1.02] cursor-pointer">
                <Icon className="h-12 w-12 text-blue-700 mb-3 drop-shadow" />
                <h2 className="text-lg font-semibold text-blue-800">
                  {item.titulo}
                </h2>
                <p className="text-gray-700 text-sm mt-2 px-3">
                  {item.descricao}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
