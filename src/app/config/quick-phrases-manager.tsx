"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { supabase } from "@/lib/supabase-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type PhraseRow = {
  id: string;
  category: string;
  label: string;
  text: string;
  keywords: string[];
  target_type?: "section" | "title" | "impression";
  insert_mode?: "replace" | "before" | "after";
  subsection?: string;
  modality?: string;
  exam_type?: string;
  mask_id?: string | null;
  section_id?: string | null;
  is_favorite?: boolean;
  usage_count?: number;
};

type MaskRow = {
  id: string;
  name: string;
  exam_name?: string;
  modality: string;
  exam_type: string;
  sections: any;
};

type SectionOption = { id: string; title: string; order: number };

type FormValues = {
  id?: string;
  category: string;
  label: string;
  text: string;
  keywords: string;
  target_type: "section" | "title" | "impression";
  insert_mode: "replace" | "before" | "after" | "inline";
  subsection: string;
  modality: string;
  exam_type: string;
  mask_id?: string;
  section_id?: string;
};

const defaultForm: FormValues = {
  category: "",
  label: "",
  text: "",
  keywords: "",
  target_type: "section",
  insert_mode: "replace",
  subsection: "",
  modality: "",
  exam_type: "",
  mask_id: "",
  section_id: "",
};

export function QuickPhrasesManager() {
  const [phrases, setPhrases] = useState<PhraseRow[]>([]);
  const [modalities, setModalities] = useState<string[]>([]);
  const [masks, setMasks] = useState<MaskRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, startSaving] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ modality: string; mask: string; section: string }>({
    modality: "",
    mask: "",
    section: "",
  });
  const [form, setForm] = useState<FormValues>(defaultForm);

  const loadModalities = async () => {
    const { data, error } = await supabase.from("exam_types").select("modalidade, ativo");
    if (error) {
      setFeedback(error.message);
      return;
    }
    if (Array.isArray(data)) {
      const list = Array.from(
        new Set(
          data
            .filter((row) => (row?.ativo ?? true) === true)
            .map((row) => row?.modalidade)
            .filter((m): m is string => !!m && m.trim().length > 0)
        )
      );
      setModalities(list);
    }
  };

  const loadMasks = async () => {
    const { data, error } = await supabase
      .from("report_masks")
      .select("id, name, exam_name, modality, exam_type, sections");
    if (!error && Array.isArray(data)) {
      setMasks(
        data.map((row: any) => ({
          id: row.id,
          name: row.name,
          exam_name: row.exam_name,
          modality: row.modality,
          exam_type: row.exam_type,
          sections: row.sections,
        }))
      );
    }
  };

  const loadPhrases = async () => {
    const { data, error } = await supabase
      .from("quick_phrases")
      .select("*")
      .order("category", { ascending: true })
      .order("label", { ascending: true });
    if (error) {
      setFeedback(error.message);
      return;
    }
    setPhrases((data as PhraseRow[]) || []);
  };

  useEffect(() => {
    void loadModalities();
    void loadMasks();
    void loadPhrases();
  }, []);

  const maskOptions = useMemo(() => {
    if (!filters.modality) return masks;
    return masks.filter((m) => m.modality === filters.modality);
  }, [masks, filters.modality]);

  const selectedMask = useMemo(
    () => masks.find((m) => m.id === (form.mask_id || filters.mask)),
    [masks, form.mask_id, filters.mask]
  );

  const subsectionOptions = useMemo(() => {
    const values = phrases
      .map((p) => p.subsection)
      .filter((s): s is string => !!s && s.trim().length > 0);
    return Array.from(new Set(values));
  }, [phrases]);

  const getSectionsFromMask = (mask?: MaskRow): SectionOption[] => {
    if (!mask) return [];
    const sectionsArray = Array.isArray(mask.sections)
      ? mask.sections
      : mask.sections?.sections || [];
    const mapped = sectionsArray
      .map((s: any) => ({
        id: s.id,
        title: s.title,
        order: s.order || 0,
      }))
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order);

    const extras: SectionOption[] = [
      { id: "titulo", title: "Título", order: 9996 },
      { id: "impressao", title: "Impressão", order: 9997 },
    ];

    extras.forEach((extra) => {
      if (!mapped.find((s: { id: string }) => s.id === extra.id)) {
        mapped.push(extra);
      }
    });

    return mapped;
  };

  const sectionOptions: SectionOption[] = useMemo(() => getSectionsFromMask(selectedMask), [selectedMask]);

  const filteredPhrases = useMemo(() => {
    return phrases.filter((p) => {
      if (filters.modality && p.modality !== filters.modality) return false;
      if (filters.mask && p.mask_id !== filters.mask) return false;
      if (filters.section && p.section_id !== filters.section) return false;
      return true;
    });
  }, [phrases, filters]);

  const resetForm = () => {
    setForm({
      ...defaultForm,
      modality: filters.modality || modalities[0] || "",
      exam_type: filters.modality || "",
      mask_id: filters.mask || "",
      section_id: filters.section || "",
    });
  };

  const handleSubmit = () => {
    setFeedback(null);
    const targetSectionId =
      form.target_type === "title"
        ? "titulo"
        : form.target_type === "impression"
        ? "impressao"
        : form.section_id || null;

    const payload = {
      category: form.category.trim(),
      label: form.label.trim(),
      text: form.text.trim(),
      keywords: form.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
      target_type: form.target_type || "section",
      insert_mode: form.insert_mode || "replace",
      subsection: form.subsection.trim() || null,
      modality: form.modality || null,
      exam_type: form.exam_type || form.modality || null,
      mask_id: form.mask_id || null,
      section_id: targetSectionId,
    };

    startSaving(() => {
      void (async () => {
        if (!payload.category || !payload.label || !payload.text) {
          setFeedback("Preencha categoria, rótulo e texto.");
          return;
        }

        if (form.id) {
          const { error } = await supabase.from("quick_phrases").update(payload).eq("id", form.id);
          if (error) {
            setFeedback(error.message);
            return;
          }
        } else {
          const { error } = await supabase.from("quick_phrases").insert(payload);
          if (error) {
            setFeedback(error.message);
            return;
          }
        }

        await loadPhrases();
        resetForm();
        setDialogOpen(false);
      })();
    });
  };

  const handleEdit = (row: PhraseRow) => {
    const derivedTarget =
      row.target_type ||
      (row.section_id === "titulo" ? "title" : row.section_id === "impressao" ? "impression" : "section");
    setForm({
      id: row.id,
      category: row.category || "",
      label: row.label || "",
      text: row.text || "",
      keywords: Array.isArray(row.keywords) ? row.keywords.join(", ") : "",
      target_type: derivedTarget,
      insert_mode: row.insert_mode || "replace",
      subsection: row.subsection || "",
      modality: row.modality || "",
      exam_type: row.exam_type || row.modality || "",
      mask_id: row.mask_id || "",
      section_id: derivedTarget === "section" ? row.section_id || "" : "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir esta frase pronta?")) return;
    setFeedback(null);
    setDeletingId(id);
    void (async () => {
      const { error } = await supabase.from("quick_phrases").delete().eq("id", id);
      if (error) {
        setFeedback(error.message);
      } else {
        await loadPhrases();
      }
      setDeletingId(null);
    })();
  };

  return (
    <Card className="bg-[#0f0f0f] border-[#1f1f1f]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-gray-100">Frases prontas</CardTitle>
          <p className="text-sm text-gray-400">
            Organize frases por modalidade/máscara/seção. Os blocos do editor carregam conforme a máscara selecionada.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          Nova frase
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback ? <div className="text-sm text-red-400">{feedback}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-gray-200">Modalidade</Label>
            <select
              value={filters.modality}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  modality: e.target.value,
                  mask: "",
                  section: "",
                }))
              }
              className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
            >
              <option value="">Todas</option>
              {modalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-200">Máscara</Label>
            <select
              value={filters.mask}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  mask: e.target.value,
                  section: "",
                }))
              }
              className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
            >
              <option value="">Todas</option>
              {maskOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.exam_name || m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-200">Seção</Label>
            <select
              value={filters.section}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  section: e.target.value,
                }))
              }
              className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
              disabled={!filters.mask}
            >
              <option value="">Todas</option>
              {filters.mask
                ? sectionOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#1f1f1f] rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#161616]">
                <TableHead>Rótulo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Máscara</TableHead>
                <TableHead>Seção</TableHead>
                <TableHead>Alvo</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPhrases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-400 py-6">
                    Nenhuma frase encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPhrases.map((row) => {
                  const maskFound = masks.find((m) => m.id === row.mask_id);
                  const maskName = maskFound?.exam_name || maskFound?.name || "";
                  const sectionName =
                    getSectionsFromMask(maskFound).find((s) => s.id === row.section_id)?.title ||
                    row.section_id ||
                    "";
                  const effectiveTarget =
                    row.target_type ||
                    (row.section_id === "titulo"
                      ? "title"
                      : row.section_id === "impressao"
                      ? "impression"
                      : "section");
                  const targetLabel =
                    effectiveTarget === "title"
                      ? "Título"
                      : effectiveTarget === "impression"
                      ? "Impressão"
                      : "Sessão";
                  const insertLabel =
                    row.insert_mode === "before"
                      ? "Acima"
                      : row.insert_mode === "after"
                      ? "Abaixo"
                      : "Substitui";
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-gray-100">{row.label}</TableCell>
                      <TableCell className="text-gray-300">{row.category}</TableCell>
                      <TableCell className="text-gray-300">{row.modality || "-"}</TableCell>
                      <TableCell className="text-gray-300">{maskName || "-"}</TableCell>
                      <TableCell className="text-gray-300">{sectionName || "-"}</TableCell>
                      <TableCell className="text-gray-300">
                        {targetLabel}
                        {row.subsection ? ` · ${row.subsection}` : ""}
                        {` · ${insertLabel}`}
                      </TableCell>
                      <TableCell className="text-gray-300">{row.usage_count ?? 0}</TableCell>
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              {form.id ? "Editar frase" : "Nova frase"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-gray-200">Categoria</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="bg-[#111111] border-[#1f1f1f] text-gray-100"
                  placeholder="Ex.: Pulmões, Mediastino..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-200">Rótulo</Label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                  className="bg-[#111111] border-[#1f1f1f] text-gray-100"
                  placeholder="Ex.: Sem alterações"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-gray-200">Texto da frase</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                className="min-h-[120px]"
                placeholder="Conteúdo que será inserido na seção"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-gray-200">Tipo de alvo</Label>
                <select
                  value={form.target_type}
                  onChange={(e) => {
                    const next = e.target.value as FormValues["target_type"];
                    setForm((prev) => ({
                      ...prev,
                      target_type: next,
                      section_id: next === "section" ? prev.section_id : "",
                    }));
                  }}
                  className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                >
                  <option value="section">Sessão / relatório</option>
                  <option value="title">Título</option>
                  <option value="impression">Impressão</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-200">Posição ao aplicar</Label>
                <select
                  value={form.insert_mode}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      insert_mode: e.target.value as FormValues["insert_mode"],
                    }))
                  }
                  className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                >
                  <option value="replace">Substituir linha</option>
                  <option value="before">Inserir acima da linha</option>
                  <option value="after">Inserir abaixo da linha</option>
                  <option value="inline">Mesma linha (anexa)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-200">Subseção (opcional)</Label>
                {subsectionOptions.length > 0 ? (
                  <select
                    value={form.subsection}
                    onChange={(e) => setForm((prev) => ({ ...prev, subsection: e.target.value }))}
                    className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                  >
                    <option value="">(digite ou escolha)</option>
                    {subsectionOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : null}
                <Input
                  value={form.subsection}
                  onChange={(e) => setForm((prev) => ({ ...prev, subsection: e.target.value }))}
                  className="bg-[#111111] border-[#1f1f1f] text-gray-100"
                  placeholder="Ex.: Dispositivos"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-gray-200">Modalidade</Label>
                <select
                  value={form.modality}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      modality: e.target.value,
                      exam_type: e.target.value,
                      mask_id: "",
                      section_id: "",
                    }))
                  }
                  className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                >
                  <option value="">Selecione</option>
                  {modalities.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-200">Máscara (opcional)</Label>
                <select
                  value={form.mask_id}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      mask_id: e.target.value,
                      section_id: "",
                    }))
                  }
                  className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                >
                  <option value="">Nenhuma</option>
                  {masks
                    .filter((m) => !form.modality || m.modality === form.modality)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.exam_name || m.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-200">Seção (opcional)</Label>
                <select
                  value={form.section_id}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      section_id: e.target.value,
                    }))
                  }
                  disabled={!form.mask_id || form.target_type !== "section"}
                  className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3 disabled:opacity-50"
                >
                  <option value="">Nenhuma</option>
                  {form.mask_id
                    ? getSectionsFromMask(masks.find((m) => m.id === form.mask_id)).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))
                    : null}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-gray-200">Palavras-chave (separadas por vírgula)</Label>
              <Input
                value={form.keywords}
                onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
                className="bg-[#111111] border-[#1f1f1f] text-gray-100"
                placeholder="Ex.: consolidacao, pneumatocele"
              />
              <p className="text-xs text-gray-500">Usado para busca rápida e sugestão.</p>
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
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
