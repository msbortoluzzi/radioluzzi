"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase-dynamic";
import { ExamTypeConfig } from "@/types/config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const examSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, "Informe o nome do exame"),
  slug: z.string().min(2, "Informe o slug"),
  modalidade: z.string().min(1, "Informe a modalidade (US, TC, RM...)"),
  ativo: z.boolean().default(true),
});

type ExamFormValues = z.infer<typeof examSchema>;

const defaultValues: ExamFormValues = {
  nome: "",
  slug: "",
  modalidade: "",
  ativo: true,
};

export function ConfigClient({ initialExams }: { initialExams: ExamTypeConfig[] }) {
  const [exams, setExams] = useState<ExamTypeConfig[]>(initialExams);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, startSaving] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues,
  });

  const resetAndClose = () => {
    form.reset(defaultValues);
    setDialogOpen(false);
  };

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("exam_types")
      .select("id, slug, nome, modalidade, ativo")
      .order("nome", { ascending: true })
      .order("slug", { ascending: true });

    if (!error && Array.isArray(data)) {
      const mapped = data.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        nome: row.nome ?? "Exame sem nome",
        modalidade: row.modalidade ?? "US",
        ativo: row.ativo ?? true,
      })) as ExamTypeConfig[];
      setExams(mapped);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchExams().finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = (values: ExamFormValues) => {
    setFeedback(null);
    startSaving(() => {
      void (async () => {
        const payload = {
          id: values.id,
          slug: values.slug,
          nome: values.nome,
          modalidade: values.modalidade,
          ativo: values.ativo,
        };

        const { error } = values.id
          ? await supabase.from("exam_types").update(payload).eq("id", values.id)
          : await supabase.from("exam_types").insert(payload);

        if (error) {
          setFeedback(error.message);
          return;
        }

        await fetchExams();
        resetAndClose();
      })();
    });
  };

  const handleEdit = (exam: ExamTypeConfig) => {
    form.reset({
      id: exam.id,
      nome: exam.nome,
      slug: exam.slug,
      modalidade: exam.modalidade,
      ativo: exam.ativo,
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (exam: ExamTypeConfig) => {
    setFeedback(null);
    startSaving(() => {
      void (async () => {
        const { error } = await supabase
          .from("exam_types")
          .update({ ativo: !exam.ativo })
          .eq("id", exam.id);
        if (error) {
          setFeedback(error.message);
          return;
        }
        await fetchExams();
      })();
    });
  };

  const sortedExams = useMemo(
    () =>
      [...exams].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [exams]
  );

  return (
    <Card className="bg-[#0f0f0f] border-[#1f1f1f]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-gray-100">Tipos de exame</CardTitle>
          <p className="text-sm text-gray-400">
            Crie, edite e controle o status de cada exame sem precisar alterar o código.
          </p>
        </div>
        <Button
          onClick={() => {
            form.reset(defaultValues);
            setDialogOpen(true);
          }}
        >
          Novo exame
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback ? (
          <div className="text-sm text-red-400">{feedback}</div>
        ) : null}

        <div className="overflow-x-auto border border-[#1f1f1f] rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#161616]">
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    Carregando exames...
                  </TableCell>
                </TableRow>
              ) : sortedExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    Nenhum exame cadastrado ainda.
                  </TableCell>
                </TableRow>
              ) : (
                sortedExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium text-gray-100">
                      {exam.nome}
                    </TableCell>
                    <TableCell className="text-gray-300">{exam.slug}</TableCell>
                    <TableCell className="text-gray-300">{exam.modalidade}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Switch
                          aria-label="Ativar ou desativar exame"
                          checked={exam.ativo}
                          onCheckedChange={() => handleToggleActive(exam)}
                        />
                        <span className={exam.ativo ? "text-green-400" : "text-gray-500"}>
                          {exam.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(exam)}
                        >
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-gray-500">
          Este painel grava direto no Supabase. As páginas de laudo devem consumir estes registros para montar seções e campos de forma dinâmica.
        </p>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              {form.getValues("id") ? "Editar exame" : "Novo exame"}
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-200">Nome</Label>
              <Input
                id="nome"
                {...form.register("nome")}
                className="bg-[#111111] border-[#1f1f1f] text-gray-100"
              />
              {form.formState.errors.nome ? (
                <p className="text-xs text-red-400">{form.formState.errors.nome.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-gray-200">Slug</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                className="bg-[#111111] border-[#1f1f1f] text-gray-100"
              />
              {form.formState.errors.slug ? (
                <p className="text-xs text-red-400">{form.formState.errors.slug.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modalidade" className="text-gray-200">Modalidade</Label>
              <Input
                id="modalidade"
                placeholder="US, TC, RM..."
                {...form.register("modalidade")}
                className="bg-[#111111] border-[#1f1f1f] text-gray-100"
              />
              {form.formState.errors.modalidade ? (
                <p className="text-xs text-red-400">{form.formState.errors.modalidade.message}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                aria-label="Ativo"
                checked={form.watch("ativo")}
                onCheckedChange={(checked) => form.setValue("ativo", checked)}
              />
              <span className="text-sm text-gray-200">Ativo</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={resetAndClose}
                className="text-gray-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
