// C:\Projetos\radioluzzi\src\app\links\page.tsx
import Link from "next/link";
import { Link2, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type LinkRow = {
  id: string;
  href: string;
  titulo: string;
  descricao: string | null;
  icon: string | null;
  sort_order: number | null;
};

function resolveIcon(name?: string | null) {
  if (!name) return <Link2 className="h-6 w-6 text-blue-700" />;
  const n = name.toLowerCase();
  if (n.includes("external")) return <ExternalLink className="h-6 w-6 text-blue-700" />;
  return <Link2 className="h-6 w-6 text-blue-700" />;
}

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Links Úteis</h1>
        <p className="text-red-600">Erro ao carregar links: {error.message}</p>
      </main>
    );
  }

  const items = (data ?? []) as LinkRow[];

  return (
    <main className="p-6 space-y-6">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 drop-shadow-sm">
          Links Úteis
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
        </p>
      </section>

      <section className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum link cadastrado.</p>
        ) : (
          items.map((item) => {
            const IconEl = resolveIcon(item.icon);
            const isExternal = item.href.startsWith("http");

            const Card = (
              <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-white/70 backdrop-blur p-4 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200">
                {IconEl}
                <div className="flex flex-col text-left">
                  <h2 className="text-base font-semibold text-blue-800">
                    {item.titulo}
                  </h2>
                  {item.descricao ? (
                    <p className="text-sm text-gray-700">{item.descricao}</p>
                  ) : null}
                </div>
              </div>
            );

            return isExternal ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {Card}
              </a>
            ) : (
              <Link key={item.id} href={item.href}>
                {Card}
              </Link>
            );
          })
        )}
      </section>
    </main>
  );
}
