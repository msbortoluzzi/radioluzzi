"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

import {
  SupabaseService,
  type ExamType,
  type Category,
  type Option,
  type ReportTemplate,
} from "@/lib/supabase-dynamic";
import {
  AIService,
  type PatientData,
  type ReportGenerationData,
} from "@/lib/ai-service";

interface CategoryWithOptions extends Category { options: Option[] }
type Props = { params: { slug: string } };

export default function ExamDynamicPage({ params }: Props) {
  const { slug } = params; // ← “torax”, “abdome”, etc.

  // Estados principais
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [categories, setCategories] = useState<CategoryWithOptions[]>([]);
  const [template, setTemplate] = useState<ReportTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulário
  const [patientData, setPatientData] = useState<PatientData>({ name: "", age: "", gender: "" });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Laudo
  const [reportData, setReportData] = useState<{ rawText: string; aiProcessedText: string; finalReport: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);

  // Guard para unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false };
  }, []);

  // Carregar dados por slug
  const loadExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const exam = await SupabaseService.getExamBySlug(slug);
      if (!exam) throw new Error(`Exame "${slug}" não encontrado`);

      const structure = await SupabaseService.getExamStructure(exam.id);
      const examTemplate = await SupabaseService.getReportTemplate(exam.id);

      if (!mountedRef.current) return;
      setExamType(exam);
      setCategories(structure ?? []);
      setTemplate(examTemplate ?? null);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      if (!mountedRef.current) return;
      setError("Erro ao carregar dados do exame");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [slug]);

  const checkAIAvailability = useCallback(async () => {
    try {
      const available = await AIService.validateAI();
      if (mountedRef.current) setAiAvailable(!!available);
    } catch {
      if (mountedRef.current) setAiAvailable(false);
    }
  }, []);

  useEffect(() => {
    loadExamData();
    checkAIAvailability();
  }, [loadExamData, checkAIAvailability]);

  const toggleOption = useCallback((optionId: string) => {
    setSelectedOptions((prev) => prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]);
  }, []);

  const canGenerate = useMemo(() => !!examType && !!template && selectedOptions.length > 0 && !generating, [examType, template, selectedOptions.length, generating]);

  const generateReport = useCallback(async (useAI: boolean = true) => {
    if (!examType || !template) return;
    try {
      setGenerating(true);
      const selectedOptionObjects = await SupabaseService.getOptionsByIds(selectedOptions);
      const generationData: ReportGenerationData = {
        patientData,
        selectedOptions: selectedOptionObjects,
        categories,
        template,
        additionalNotes,
      };

      if (useAI && aiAvailable) {
        const result = await AIService.generateReport(generationData);
        if (!mountedRef.current) return;
        setReportData(result);
      } else {
        const simpleReport = AIService.generateSimpleReport(generationData);
        if (!mountedRef.current) return;
        setReportData({ rawText: simpleReport, aiProcessedText: simpleReport, finalReport: simpleReport });
      }
    } catch (err) {
      console.error("Erro ao gerar laudo:", err);
      if (mountedRef.current) alert("Erro ao gerar laudo. Tente novamente.");
    } finally {
      if (mountedRef.current) setGenerating(false);
    }
  }, [examType, template, aiAvailable, selectedOptions, patientData, categories, additionalNotes]);

  const saveReport = useCallback(async () => {
    if (!reportData || !examType) return;
    try {
      const reportToSave = {
        exam_type_id: examType.id,
        patient_name: patientData.name,
        patient_age: patientData.age,
        patient_gender: patientData.gender,
        selected_options: selectedOptions,
        raw_text: reportData.rawText,
        ai_processed_text: reportData.aiProcessedText,
        final_report: reportData.finalReport,
        additional_notes: additionalNotes,
      };
      await SupabaseService.saveReport(reportToSave);
      if (mountedRef.current) alert("Laudo salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar laudo:", err);
      if (mountedRef.current) alert("Erro ao salvar laudo. Tente novamente.");
    }
  }, [reportData, examType, patientData, selectedOptions, additionalNotes]);

  const copyReport = useCallback(() => {
    if (reportData?.finalReport && navigator.clipboard) {
      navigator.clipboard.writeText(reportData.finalReport);
      alert("Laudo copiado para a área de transferência!");
    }
  }, [reportData?.finalReport]);

  const clearForm = useCallback(() => {
    setPatientData({ name: "", age: "", gender: "" });
    setSelectedOptions([]);
    setAdditionalNotes("");
    setReportData(null);
  }, []);

  // UI
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Carregando dados do exame...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mb-4 text-red-600">{error}</p>
          <button onClick={loadExamData} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/laudos" className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar aos Laudos
            </Link>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{examType?.title}</h1>
                <p className="mt-2 text-gray-600">{examType?.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {aiAvailable ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    IA Ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    IA Indisponível
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Formulário */}
            <div className="space-y-6">
              {/* Dados do Paciente */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Dados do Paciente</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nome do Paciente</label>
                    <input
                      type="text"
                      value={patientData.name || ""}
                      onChange={(e) => setPatientData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o nome do paciente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Idade</label>
                      <input
                        type="text"
                        value={patientData.age || ""}
                        onChange={(e) => setPatientData((prev) => ({ ...prev, age: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 45 anos"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Sexo</label>
                      <select
                        value={patientData.gender || ""}
                        onChange={(e) => setPatientData((prev) => ({ ...prev, gender: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorias Dinâmicas */}
              {categories.map((category) => (
                <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">{category.name}</h2>
                  <div className="space-y-2">
                    {category.options.map((option) => {
                      const active = selectedOptions.includes(option.id);
                      return (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => toggleOption(option.id)}
                          className={`w-full rounded-md border p-3 text-left transition-colors ${
                            active
                              ? "border-blue-200 bg-blue-50 text-blue-800"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Observações */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Observações Adicionais</h2>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Digite observações adicionais..."
                />
              </div>
            </div>

            {/* Preview do Laudo */}
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => generateReport(true)}
                    disabled={!canGenerate}
                    className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {generating ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gerando...
                      </>
                    ) : (
                      <>{aiAvailable ? "🤖 Gerar com IA" : "📝 Gerar Laudo"}</>
                    )}
                  </button>

                  <button
                    onClick={() => generateReport(false)}
                    disabled={generating || selectedOptions.length === 0}
                    className="rounded-md bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    🧱 Fallback (sem IA)
                  </button>

                  <button
                    onClick={copyReport}
                    disabled={!reportData}
                    className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    📋 Copiar
                  </button>

                  <button
                    onClick={saveReport}
                    disabled={!reportData}
                    className="rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    💾 Salvar
                  </button>

                  <button
                    onClick={clearForm}
                    className="col-span-2 rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                  >
                    🗑️ Limpar
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Preview do Laudo</h2>
                <div className="min-h-96 rounded-md bg-gray-50 p-4">
                  {reportData ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                      {reportData.finalReport}
                    </pre>
                  ) : (
                    <p className="italic text-gray-500">
                      Selecione as opções e clique em &quot;Gerar&quot; para visualizar o laudo
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedOptions.length}</div>
                    <div className="text-sm text-gray-600">Opções Selecionadas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {reportData ? reportData.finalReport.length : 0}
                    </div>
                    <div className="text-sm text-gray-600">Caracteres no Laudo</div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Preview */}
          </div>
        </div>
      </div>
    </div>
  );
}
