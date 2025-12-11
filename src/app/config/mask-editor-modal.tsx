"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type MaskEditorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  initialModality: string;
  initialSlug: string;
  initialSections: string[];
  onSave: (data: { name: string; slug: string; sections: string[] }) => Promise<void> | void;
};

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function MaskEditorModal({
  open,
  onOpenChange,
  initialName,
  initialModality,
  initialSlug,
  initialSections,
  onSave,
}: MaskEditorModalProps) {
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug || slugify(initialName));
  const [sectionsLines, setSectionsLines] = useState(initialSections.join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    const lines = sectionsLines
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setSaving(true);
    try {
      await onSave({ name, slug: slug || slugify(name), sections: lines });
      onOpenChange(false);
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-100">Editar máscara</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Nome</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug((prev) => (prev ? prev : slugify(e.target.value)));
              }}
              className="bg-[#111111] border-[#1f1f1f] text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-[#111111] border-[#1f1f1f] text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Seções (uma por linha)</Label>
            <textarea
              value={sectionsLines}
              onChange={(e) => setSectionsLines(e.target.value)}
              className="w-full min-h-[140px] rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">
              Modalidade: {initialModality}. Cada linha vira uma seção; ordem segue a listagem.
            </p>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-300 hover:text-white"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
