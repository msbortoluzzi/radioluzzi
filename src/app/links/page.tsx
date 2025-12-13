import Link from "next/link";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type LinkRow = {
  id: string;
  href: string;
  titulo: string;
  descricao: string | null;
  icon: string | null;
  sort_order: number | null;
};

async function addLink(formData: FormData) {
  "use server";
  const supabase = createClient();
  const titulo = String(formData.get("titulo") || "").trim();
  const href = String(formData.get("href") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();

  if (!titulo || !href) return;

  await supabase.from("links").insert({
    titulo,
    href,
    descricao: descricao || null,
    icon: "external",
    is_active: true,
  });
  revalidatePath("/links");
}

async function deleteLink(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await supabase.from("links").delete().eq("id", id);
  revalidatePath("/links");
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
        <h1 className="text-3xl font-bold text-gray-100">Links uteis</h1>
        <p className="text-red-400">Erro ao carregar links: {error.message}</p>
      </main>
    );
  }

  const items = (data ?? []) as LinkRow[];

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <section>
        <h1 className="text-2xl font-semibold text-gray-100">Links uteis</h1>
      </section>

      <section id="add-link-form" className="space-y-2">
        <form action={addLink} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <div className="md:col-span-1">
            <input
              name="titulo"
              required
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0f0f0f] text-gray-100 px-3 py-2 text-sm"
              placeholder="Titulo"
            />
          </div>
          <div className="md:col-span-2">
            <input
              name="href"
              required
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0f0f0f] text-gray-100 px-3 py-2 text-sm"
              placeholder="https://link"
            />
          </div>
          <div className="md:col-span-1">
            <input
              name="descricao"
              className="w-full rounded-md border border-[#1f1f1f] bg-[#0f0f0f] text-gray-100 px-3 py-2 text-sm"
              placeholder="Descricao (opcional)"
            />
          </div>
          <button
            type="submit"
            accessKey="s"
            aria-keyshortcuts="Alt+Shift+S"
            title="Salvar (Alt+Shift+S)"
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="space-y-2">
        {items.length === 0 ? (
          <p className="text-center text-gray-400">Nenhum link cadastrado.</p>
        ) : (
          items.map((item) => {
            const isExternal = item.href.startsWith("http");

            const Card = (
              <div className="flex items-start justify-between gap-3 rounded-md border border-[#1f1f1f] bg-[#0d0d0d] p-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-gray-100 truncate">{item.titulo}</h2>
                  {item.descricao ? <p className="text-xs text-gray-400 truncate">{item.descricao}</p> : null}
                  <span className="text-xs text-gray-500 break-all">{item.href}</span>
                </div>
                <form action={deleteLink} className="shrink-0">
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    accessKey="x"
                    aria-keyshortcuts="Alt+Shift+X"
                    title="Excluir (Alt+Shift+X)"
                    className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-200 px-2 py-1 rounded-md border border-[#1f1f1f]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </form>
              </div>
            );

            return isExternal ? (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                {Card}
              </a>
            ) : (
              <Link key={item.id} href={item.href} className="block">
                {Card}
              </Link>
            );
          })
        )}
      </section>
    </main>
  );
}
