"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type MaskRow = {
  id: string;
  exam_name: string;
  modality: string;
  slug: string;
  active: boolean;
  show_indicacao?: boolean;
  show_impressao?: boolean;
  show_relatorio?: boolean;
  sections?: any;
};

type FormValues = {
  id?: string;
  exam_name: string;
  modality: string;
  slug: string;
  show_indicacao: boolean;
  show_impressao: boolean;
  show_relatorio: boolean;
  tecnica_base?: string;
  relatorio_base?: string;
  impressao_base?: string;
};

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function MaskManager() {
  const [masks, setMasks] = useState<MaskRow[]>([]);
  const [modalities, setModalities] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, startSaving] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [relatorioLines, setRelatorioLines] = useState<string[]>([""]);

  const [form, setForm] = useState<FormValues>({
    exam_name: "",
    modality: "",
    slug: "",
    show_indicacao: false,
    show_impressao: false,
    show_relatorio: true,
    tecnica_base: "",
    relatorio_base: "",
    impressao_base: "",
  });

  const loadModalities = useCallback(async () => {
    const { data, error } = await supabase.from("exam_types").select("modalidade, nome, ativo");
    if (error) {
      setFeedback(error.message);
      return;
    }
    if (Array.isArray(data)) {
      const list = Array.from(
        new Set(
          data
            .filter((row) => (row?.ativo ?? true) === true)
            .map((row) => row?.modalidade ?? row?.nome)
            .filter((m): m is string => !!m && m.trim().length > 0)
        )
      );
      setModalities(list);
      if (list.length && !form.modality) {
        setForm((prev) => ({ ...prev, modality: list[0] }));
      }
    }
  }, [form.modality]);

  const loadMasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("report_masks")
      .select("id, exam_name, modality, slug, active, show_indicacao, show_impressao, show_relatorio, sections")
      .order("modality", { ascending: true })
      .order("exam_name", { ascending: true });
    if (!error && Array.isArray(data)) {
      setMasks(
        data.map((row: any) => ({
          id: row.id,
          exam_name: row.exam_name ?? "",
          modality: row.modality,
          slug: row.slug ?? "",
          active: row.active ?? true,
          show_indicacao: row.show_indicacao ?? false,
          show_impressao: row.show_impressao ?? false,
          show_relatorio: row.show_relatorio ?? true,
          sections: row.sections,
        }))
      );
    }
  }, []);

  useEffect(() => {
    void loadModalities();
    void loadMasks();
  }, [loadModalities, loadMasks]);

  const sortedMasks = useMemo(
    () => [...masks].sort((a, b) => a.exam_name.localeCompare(b.exam_name, "pt-BR")),
    [masks]
  );

  const resetForm = () => {
    setForm({
      exam_name: "",
      modality: modalities[0] ?? "",
      slug: "",
      show_indicacao: false,
      show_impressao: false,
      show_relatorio: true,
      tecnica_base: "",
      relatorio_base: "",
      impressao_base: "",
    });
    setRelatorioLines([""]);
  };

  const handleSubmit = () => {
    setFeedback(null);

    const relatorioContent = relatorioLines.join("\n");

    const blocks = [
      { id: "tecnica", title: "Técnica", content: form.tecnica_base, enabled: true },
      { id: "relatorio", title: "Relatório", content: relatorioContent, enabled: form.show_relatorio },
      { id: "impressao", title: "Impressão", content: form.impressao_base, enabled: form.show_impressao },
      { id: "indicacao", title: "Indicação clínica", content: "", enabled: form.show_indicacao },
    ];
    const parsedSections = {
      sections: blocks
        .filter((b) => b.enabled)
        .map((b, idx) => ({
          id: b.id,
          title: b.title,
          order: idx + 1,
          required: false,
          content: b.content || "",
        })),
    };

    const payload = {
      name: form.exam_name,
      exam_name: form.exam_name,
      modality: form.modality,
      exam_type: form.modality,
      slug: (form.slug || slugify(form.exam_name)).trim(),
      show_indicacao: form.show_indicacao,
      show_impressao: form.show_impressao,
      show_relatorio: form.show_relatorio,
      sections: parsedSections,
      formatting_rules: {},
      active: true,
    };

    startSaving(() => {
      void (async () => {
        if (form.id) {
          const { error } = await supabase
            .from("report_masks")
            .update({
              name: payload.name,
              exam_name: payload.exam_name,
              modality: payload.modality,
              exam_type: payload.exam_type,
              slug: payload.slug,
              show_indicacao: payload.show_indicacao,
              show_impressao: payload.show_impressao,
              show_relatorio: payload.show_relatorio,
              sections: payload.sections,
            })
            .eq("id", form.id);
          if (error) {
            setFeedback(error.message);
            return;
          }
        } else {
          const { error } = await supabase.from("report_masks").insert(payload);
          if (error) {
            setFeedback(error.message);
            return;
          }
        }
        await loadMasks();
        resetForm();
        setDialogOpen(false);
      })();
    });
  };

  const handleEdit = (row: MaskRow) => {
    const sections = Array.isArray(row.sections?.sections) ? row.sections.sections : [];
    const findContent = (key: string) =>
      sections.find((s: any) => (s.id || "").toString().toLowerCase() === key)?.content || "";

    const relBase = findContent("relatorio");

    setForm({
      id: row.id,
      exam_name: row.exam_name,
      modality: row.modality,
      slug: row.slug,
      show_indicacao: !!row.show_indicacao,
      show_impressao: !!row.show_impressao,
      show_relatorio: row.show_relatorio ?? true,
      tecnica_base: findContent("tecnica"),
      relatorio_base: relBase,
      impressao_base: findContent("impressao"),
    });
    setRelatorioLines(
      (relBase || "")
        .split("\n")
        .map((line: string) => line)
        .filter((_: string, _idx: number) => true) || [""]
    );
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir esta máscara?")) return;
    setFeedback(null);
    setDeletingId(id);
    void (async () => {
      const { error } = await supabase.from("report_masks").delete().eq("id", id);
      if (error) {
        setFeedback(error.message);
      } else {
        await loadMasks();
      }
      setDeletingId(null);
    })();
  };

  return (
    <Card className="bg-[#0f0f0f] border-[#1f1f1f]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-gray-100">Máscaras</CardTitle>
          <p className="text-sm text-gray-400">
            Edite o corpo do laudo em linhas numeradas para trocar rápido no editor final.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          Nova máscara
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback ? <div className="text-sm text-red-400">{feedback}</div> : null}

        <div className="overflow-x-auto border border-[#1f1f1f] rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#161616]">
                <TableHead>Nome</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    Nenhuma máscara cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                sortedMasks.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-gray-100 font-medium">{row.exam_name}</TableCell>
                    <TableCell className="text-gray-300">{row.modality}</TableCell>
                    <TableCell className="text-gray-300">{row.slug}</TableCell>
                    <TableCell className="text-gray-300">{row.active ? "Ativa" : "Inativa"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-200"
                          onClick={() => handleDelete(row.id)}
                          disabled={deletingId === row.id}
                        >
                          {deletingId === row.id ? "Excluindo..." : "Excluir"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              {form.id ? "Editar máscara" : "Nova máscara"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label className="text-gray-200">Nome da máscara</Label>
              <Input
                value={form.exam_name}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    exam_name: value,
                    slug: slugify(value),
                  }));
                }}
                className="bg-[#111111] border-[#1f1f1f] text-gray-100"
                placeholder="Ex.: Ultrassonografia de Abdome"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-gray-200">Modalidade</Label>
                <select
                  value={form.modality}
                  onChange={(e) => setForm((prev) => ({ ...prev, modality: e.target.value }))}
                  className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                >
                  {modalities.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {modalities.length === 0 ? (
                  <p className="text-xs text-red-400">Nenhuma modalidade ativa. Cadastre em &quot;Tipos de exame&quot;.</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Slug</Label>
                <Input
                  value={form.slug || slugify(form.exam_name)}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="bg-[#111111] border-[#1f1f1f] text-gray-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Cabeçalho / Técnica</Label>
              <Textarea
                value={form.tecnica_base}
                onChange={(e) => setForm((prev) => ({ ...prev, tecnica_base: e.target.value }))}
                className="min-h-[140px]"
                placeholder={"Ex.: Aquisição, contraste, dado clínico informado..."}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.show_relatorio}
                  onChange={(e) => setForm((prev) => ({ ...prev, show_relatorio: e.target.checked }))}
                />
                Mostrar bloco Relatório
              </Label>
              {form.show_relatorio ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-200">Linhas do Relatório</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const next = [...relatorioLines, ""];
                        setRelatorioLines(next);
                        setForm((prev) => ({ ...prev, relatorio_base: next.join("\n") }));
                      }}
                    >
                      + Linha
                    </Button>
                  </div>
                  <div className="rounded-md border border-[#1f1f1f] bg-[#0f0f0f] p-3 space-y-2 min-h-[260px]">
                    {relatorioLines.map((line, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-[10px] text-gray-500 w-8 shrink-0 text-right">[{idx + 1}]</span>
                        <Input
                          value={line}
                          onChange={(e) => {
                            const next = [...relatorioLines];
                            next[idx] = e.target.value;
                            setRelatorioLines(next);
                            setForm((prev) => ({ ...prev, relatorio_base: next.join("\n") }));
                          }}
                          className="flex-1 bg-[#111111] border-[#1f1f1f] text-gray-100"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                      onClick={() => {
                        const next = relatorioLines.filter((_, i) => i !== idx);
                        const normalized = next.length ? next : [""];
                        setRelatorioLines(normalized);
                        setForm((prev) => ({ ...prev, relatorio_base: normalized.join("\n") }));
                          }}
                          className="shrink-0"
                        >
                          − Linha
                        </Button>
                      </div>
                    ))}
                    {relatorioLines.length === 0 ? (
                      <div className="text-xs text-gray-500">Nenhuma linha. Clique em &quot;+ Linha&quot;.</div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label className="text-gray-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.show_impressao}
                  onChange={(e) => setForm((prev) => ({ ...prev, show_impressao: e.target.checked }))}
                />
                Mostrar bloco Impressão
              </Label>
              {form.show_impressao ? (
                <div className="space-y-2">
                  <Textarea
                    value={form.impressao_base || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, impressao_base: e.target.value }))}
                    className="min-h-[160px]"
                    placeholder="Texto base opcional para Impressão (pode deixar em branco)."
                  />
                  <div className="mt-2 text-xs text-gray-400 space-y-1">
                    <div className="font-semibold text-gray-300">Linhas da Impressão</div>
                    <div className="rounded-md border border-[#1f1f1f] bg-[#0f0f0f] p-3 space-y-2">
                      {(form.impressao_base || "").split("\n").map((line, idx) => (
                        <div key={idx} className="flex gap-2 text-gray-200">
                          <span className="text-[10px] text-gray-500 w-8 shrink-0 text-right">[{idx + 1}]</span>
                          <span className="text-sm text-gray-100">{line || " "}</span>
                        </div>
                      ))}
                      {(form.impressao_base || "").trim() === "" ? (
                        <div className="flex gap-2 text-gray-200">
                          <span className="text-[10px] text-gray-500 w-8 shrink-0 text-right">[1]</span>
                          <span className="text-sm text-gray-600">linha vazia</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.show_indicacao}
                  onChange={(e) => setForm((prev) => ({ ...prev, show_indicacao: e.target.checked }))}
                />
                Mostrar Indicação clínica
              </Label>
              <p className="text-xs text-gray-500">Texto será preenchido no editor de laudos.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                className="text-gray-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={saving || modalities.length === 0 || !form.exam_name.trim()}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
