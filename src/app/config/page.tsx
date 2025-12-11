import { createClient } from "@/lib/supabase/server";
import { ConfigClient } from "./config-client";
import { ExamTypeConfig } from "@/types/config";

function mapExam(row: any): ExamTypeConfig {
  const nome = row?.nome ?? row?.name ?? row?.title ?? "Exame sem nome";
  const modalidade = row?.modalidade ?? row?.modality ?? "US";
  const ativo = row?.ativo ?? row?.active ?? true;
  const slug = typeof row?.slug === "string" ? row.slug : "";

  return {
    id: row.id,
    slug,
    nome,
    modalidade,
    ativo,
  };
}

export default async function ConfigPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exam_types")
    .select("id, slug, nome, modalidade, ativo")
    .order("nome", { ascending: true })
    .order("slug", { ascending: true });

  const initialExams = Array.isArray(data) ? data.map(mapExam) : [];

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-100">Configurar Radioluzzi</h1>
        <p className="text-sm text-gray-400">
          Cadastre e edite tipos de exame diretamente do Supabase. As páginas de laudo passam a ler esses dados dinamicamente.
        </p>
        {error ? (
          <p className="text-sm text-red-400">Erro ao carregar exames: {error.message}</p>
        ) : null}
      </div>

      <ConfigClient initialExams={initialExams} />
    </div>
  );
}
